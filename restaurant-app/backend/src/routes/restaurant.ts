import { Router, Request, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { RestaurantModel } from '../models/Restaurant';
import { asyncHandler } from '../middleware/errorHandler';
import { q, q1 } from '../models/db';
import { kontaktEmailSenden } from '../services/email';
import { RECHTSDOKUMENT_VERSION } from './auth';
import { widerspruchsTokenPruefen } from '../services/newsletter';

const router = Router();

// GET /api/restaurant – Eigenes Restaurant abrufen (inkl. Lizenz-Info)
router.get('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
  if (!restaurant) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  const aktiveMitarbeiter = await RestaurantModel.aktiveMitarbeiterAnzahl(req.auth!.restaurantId);

  res.json({
    ...restaurant,
    aktive_mitarbeiter: aktiveMitarbeiter,
  });
}));

// PUT /api/restaurant – Restaurant-Daten aktualisieren
router.put('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, oeffnungszeiten, primaerfarbe, layout_id, logo_url,
          buchungsintervall_min, tisch_dauer_min, max_gleichzeitige_reservierungen,
          google_bewertungs_link } = req.body;

  // Farbwert validieren (Hex-Format)
  if (primaerfarbe !== undefined && !/^#[0-9a-fA-F]{6}$/.test(primaerfarbe)) {
    res.status(400).json({ fehler: 'Ungültiges Farbformat. Bitte Hex-Wert angeben (z.B. #ea580c)' });
    return;
  }

  // Layout-ID validieren
  const erlaubteLayouts = ['modern', 'elegant-dunkel', 'osteria', 'editorial', 'showcase', 'qr-menu'];
  if (layout_id !== undefined && !erlaubteLayouts.includes(layout_id)) {
    res.status(400).json({ fehler: 'Ungültige Layout-ID' });
    return;
  }

  // Logo-URL validieren (muss /uploads/ Pfad oder null sein)
  if (logo_url !== undefined && logo_url !== null && !logo_url.startsWith('/uploads/')) {
    res.status(400).json({ fehler: 'Ungültige Logo-URL' });
    return;
  }

  // Buchungsintervall validieren (nur erlaubte Werte)
  const erlaubteIntervalle = [15, 30, 60];
  if (buchungsintervall_min !== undefined && !erlaubteIntervalle.includes(Number(buchungsintervall_min))) {
    res.status(400).json({ fehler: 'Buchungsintervall muss 15, 30 oder 60 Minuten sein' });
    return;
  }

  // Tischdauer validieren (mind. 30, max. 480 Min.)
  if (tisch_dauer_min !== undefined && (Number(tisch_dauer_min) < 30 || Number(tisch_dauer_min) > 480)) {
    res.status(400).json({ fehler: 'Tischdauer muss zwischen 30 und 480 Minuten liegen' });
    return;
  }

  const restaurant = await RestaurantModel.aktualisieren(req.auth!.restaurantId, {
    name,
    oeffnungszeiten,
    primaerfarbe,
    layout_id,
    logo_url,
    buchungsintervall_min: buchungsintervall_min !== undefined ? Number(buchungsintervall_min) : undefined,
    tisch_dauer_min: tisch_dauer_min !== undefined ? Number(tisch_dauer_min) : undefined,
    max_gleichzeitige_reservierungen: max_gleichzeitige_reservierungen !== undefined
      ? (max_gleichzeitige_reservierungen === null ? null : Number(max_gleichzeitige_reservierungen))
      : undefined,
    google_bewertungs_link: google_bewertungs_link !== undefined
      ? (google_bewertungs_link === '' ? null : google_bewertungs_link)
      : undefined,
  });

  if (!restaurant) {
    res.status(400).json({ fehler: 'Keine Änderungen angegeben' });
    return;
  }

  res.json(restaurant);
}));

// ─── Rechtsdokumente-Versionsprüfung ────────────────────────────────────────

/**
 * GET /api/restaurant/rechtsdokumente-status
 * Antwortet, ob das Restaurant die aktuelle AGB-/AVV-Version akzeptiert hat.
 * Wird vom Frontend bei jedem Login geprüft → Banner einblenden wenn `akzeptanz_noetig`.
 */
router.get('/rechtsdokumente-status', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const row = await q1<{ agb_version: string | null; avv_version: string | null }>(
    'SELECT agb_version, avv_version FROM restaurants WHERE id = $1',
    [req.auth!.restaurantId],
  );
  const agbAktuell = row?.agb_version === RECHTSDOKUMENT_VERSION;
  const avvAktuell = row?.avv_version === RECHTSDOKUMENT_VERSION;
  res.json({
    aktuelle_version: RECHTSDOKUMENT_VERSION,
    agb_version: row?.agb_version ?? null,
    avv_version: row?.avv_version ?? null,
    akzeptanz_noetig: !agbAktuell || !avvAktuell,
  });
}));

/**
 * POST /api/restaurant/rechtsdokumente-akzeptieren
 * Markiert die aktuelle AGB- und AVV-Version als akzeptiert. Nur Admin —
 * der Vertragsabschluss bindet das Unternehmen, das nur der Inhaber kann.
 */
router.post('/rechtsdokumente-akzeptieren', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await q(
    `UPDATE restaurants
     SET agb_akzeptiert_am = NOW(), agb_version = $1,
         avv_akzeptiert_am = NOW(), avv_version = $1
     WHERE id = $2`,
    [RECHTSDOKUMENT_VERSION, req.auth!.restaurantId],
  );
  res.json({ ok: true, version: RECHTSDOKUMENT_VERSION });
}));

// ─── DSGVO-Endpunkte (Art. 15 / 17 / 20 DSGVO) ──────────────────────────────

/**
 * GET /api/restaurant/datenexport
 * Auskunftsrecht (Art. 15) + Datenübertragbarkeit (Art. 20):
 * Liefert alle personenbezogenen Daten des Restaurants als strukturiertes JSON.
 * Nur Admin darf den Export anfordern.
 *
 * Tabellen die nach restaurant_id gefiltert werden — wenn neue Tabellen mit
 * restaurant_id-Bezug hinzukommen, MÜSSEN sie hier ergänzt werden, sonst
 * wird der Export unvollständig (DSGVO-Verstoß).
 */
const EXPORT_TABELLEN = [
  'bereiche', 'kategorien', 'unterkategorien', 'tische', 'gerichte',
  'extras_gruppen', 'extras', 'bestellungen', 'gaeste', 'reservierungen',
  'walk_ins', 'mitarbeiter', 'schichten', 'abwesenheiten', 'schichttausch',
  'schicht_templates', 'oeffnungszeiten', 'ausnahmetage', 'bewertungen',
  'inventur_artikel', 'lieferanten', 'erlebnisse', 'erlebnis_buchungen',
  'warteliste', 'zahlungen',
];

router.get('/datenexport', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const restaurantId = req.auth!.restaurantId;
  const restaurant = await RestaurantModel.nachId(restaurantId);
  if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

  const datensaetze: Record<string, unknown[]> = { restaurant: [restaurant] };

  // Pro Tabelle alle Zeilen mit der eigenen restaurant_id holen.
  // Tabellen die nicht existieren (alte Schemas) werden übersprungen.
  for (const tabelle of EXPORT_TABELLEN) {
    try {
      const zeilen = await q(`SELECT * FROM ${tabelle} WHERE restaurant_id = $1`, [restaurantId]);
      // Passwort-Hashes NIEMALS exportieren — auch nicht im eigenen Datenexport
      const bereinigt = zeilen.map((row: Record<string, unknown>) => {
        const { passwort_hash, ...rest } = row;
        void passwort_hash;
        return rest;
      });
      datensaetze[tabelle] = bereinigt;
    } catch {
      // Tabelle existiert nicht oder hat keine restaurant_id-Spalte → überspringen
    }
  }

  const dateiname = `serveflow-export-${restaurantId}-${new Date().toISOString().slice(0, 10)}.json`;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${dateiname}"`);
  res.json({
    exportiert_am: new Date().toISOString(),
    restaurant_id: restaurantId,
    hinweis: 'Dieser Export enthält alle personenbezogenen Daten gemäß Art. 15/20 DSGVO. Passwort-Hashes sind aus Sicherheitsgründen nicht enthalten.',
    daten: datensaetze,
  });
}));

/**
 * POST /api/restaurant/loeschungs-anfrage
 * Recht auf Löschung (Art. 17):
 * Da die automatische Löschung Rechnungsdaten betrifft (§ 147 AO — 10 Jahre Aufbewahrung),
 * läuft die Löschung über einen manuellen Prozess: Anfrage per Email an den Anbieter.
 * Der Anbieter erledigt die Löschung dann mit korrekter Anonymisierung von Rechnungsdaten.
 */
router.post('/loeschungs-anfrage', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { begruendung } = req.body;
  const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
  if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

  // Email des Anforderers aus der DB holen — AuthPayload enthält nur die ID
  const [anforderer] = await q<{ email: string; name: string }>(
    'SELECT email, name FROM mitarbeiter WHERE id = $1',
    [req.auth!.mitarbeiterId],
  );

  const text = [
    `Löschungsanfrage nach Art. 17 DSGVO`,
    ``,
    `Restaurant-ID: ${restaurant.id}`,
    `Restaurant: ${restaurant.name}`,
    `Anschrift: ${restaurant.strasse}, ${restaurant.plz} ${restaurant.stadt}`,
    `Email: ${restaurant.email ?? '(keine)'}`,
    `Mitarbeiter (Anforderer): ${anforderer?.name ?? '?'} <${anforderer?.email ?? '?'}> (${req.auth!.mitarbeiterId})`,
    ``,
    `Begründung: ${begruendung || '(keine angegeben)'}`,
    ``,
    `→ Bitte Konto innerhalb von 30 Tagen löschen. Rechnungsdaten gemäß § 147 AO anonymisiert für 10 Jahre aufbewahren.`,
  ].join('\n');

  await kontaktEmailSenden({
    betreff: `[DSGVO] Löschungsanfrage Restaurant ${restaurant.id}`,
    text,
  });

  res.json({ ok: true, hinweis: 'Anfrage erhalten. Wir bestätigen die Löschung innerhalb von 30 Tagen per Email.' });
}));

// POST /api/restaurant/newsletter-widerspruch/:token – Werbe-Mails abbestellen (oeffentlich, signierter Token)
// EuGH C-654/23 + § 7 Abs. 3 UWG: Widerspruch muss in jeder Werbe-Mail einfach moeglich sein
router.post('/newsletter-widerspruch/:token', asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = widerspruchsTokenPruefen(req.params.token);
  if (!restaurantId) {
    res.status(400).json({ fehler: 'Ungültiger oder abgelaufener Widerspruchs-Link' });
    return;
  }
  await q(
    `UPDATE restaurants
     SET newsletter_aktiv = FALSE,
         newsletter_widerspruch_am = COALESCE(newsletter_widerspruch_am, NOW())
     WHERE id = $1`,
    [restaurantId],
  );
  res.json({ ok: true, hinweis: 'Sie erhalten ab sofort keine Werbe-E-Mails mehr von ServeFlow.' });
}));

// GET /api/restaurant/:id/design – Öffentlich: Name, Logo, Farbe (für Gäste-Seite)
router.get('/:id/design', asyncHandler(async (req: Request, res: Response) => {
  const design = await RestaurantModel.designNachId(req.params.id);
  if (!design) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }
  res.json(design);
}));

export default router;
