import { Router, Request, Response } from 'express';
import { q } from '../models/db';
import { ReservierungModel } from '../models/Reservierung';
import { VerfuegbarkeitModel, verweilzeitBerechnen } from '../models/Verfuegbarkeit';
import { asyncHandler } from '../middleware/errorHandler';
import {
  reservierungBestaetigungSenden,
  reservierungStornierungSenden,
  reservierungUmbuchungSenden,
} from '../services/email';
import { io } from '../server';

const router = Router();

// ────────────────────────────────────────────────
// GET /api/buchung/:restaurantId/info
// Öffentlich: Restaurant-Infos + Öffnungszeiten für die Buchungsseite
// ────────────────────────────────────────────────
router.get('/:restaurantId/info', asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  const restaurant = await q<{
    name: string;
    logo_url: string | null;
    primaerfarbe: string;
    strasse: string | null;
    plz: string | null;
    stadt: string | null;
    telefon: string | null;
    reservierung_vorlauf_tage: number;
  }>(
    `SELECT name, logo_url, primaerfarbe, strasse, plz, stadt, telefon, reservierung_vorlauf_tage
     FROM restaurants WHERE id = $1`,
    [restaurantId]
  );

  if (restaurant.length === 0) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  const r = restaurant[0];

  const oeffnungszeiten = await q<{
    wochentag: number;
    von: string;
    bis: string;
    geschlossen: boolean;
  }>(
    'SELECT wochentag, von, bis, geschlossen FROM oeffnungszeiten WHERE restaurant_id = $1 ORDER BY wochentag',
    [restaurantId]
  );

  res.json({
    name: r.name,
    logo_url: r.logo_url,
    primaerfarbe: r.primaerfarbe,
    adresse: [r.strasse, [r.plz, r.stadt].filter(Boolean).join(' ')].filter(Boolean).join(', '),
    telefon: r.telefon,
    vorlauf_tage: r.reservierung_vorlauf_tage,
    oeffnungszeiten,
  });
}));

// ────────────────────────────────────────────────
// GET /api/buchung/:restaurantId/slots?datum=YYYY-MM-DD&personen=N
// Öffentlich: Verfügbare Zeitslots für ein Datum
// ────────────────────────────────────────────────
router.get('/:restaurantId/slots', asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { datum, personen } = req.query;

  if (!datum || !personen) {
    res.status(400).json({ fehler: 'datum und personen sind erforderlich' });
    return;
  }

  // Datum validieren (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum as string)) {
    res.status(400).json({ fehler: 'Ungültiges Datum. Format: YYYY-MM-DD' });
    return;
  }

  const personenZahl = parseInt(personen as string);
  if (isNaN(personenZahl) || personenZahl < 1 || personenZahl > 20) {
    res.status(400).json({ fehler: 'Personenanzahl muss zwischen 1 und 20 liegen' });
    return;
  }

  const slots = await VerfuegbarkeitModel.verfuegbareSlots(restaurantId, datum as string, personenZahl);
  res.json(slots);
}));

// ────────────────────────────────────────────────
// POST /api/buchung/:restaurantId
// Öffentlich: Neue Online-Reservierung erstellen
// ────────────────────────────────────────────────
router.post('/:restaurantId', asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { gast_name, email, telefon, datum, personen, anmerkung, dsgvo_einwilligung } = req.body;

  // Pflichtfelder prüfen
  if (!gast_name || !email || !datum || !personen) {
    res.status(400).json({ fehler: 'Name, Email, Datum und Personenanzahl sind erforderlich' });
    return;
  }

  if (!dsgvo_einwilligung) {
    res.status(400).json({ fehler: 'DSGVO-Einwilligung ist erforderlich' });
    return;
  }

  // Email-Format validieren
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }

  // Restaurant prüfen
  const restaurant = await q<{ id: string; name: string; strasse: string | null; plz: string | null; stadt: string | null }>(
    'SELECT id, name, strasse, plz, stadt FROM restaurants WHERE id = $1',
    [restaurantId]
  );
  if (restaurant.length === 0) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  const personenZahl = parseInt(personen);
  const verweilzeit = verweilzeitBerechnen(personenZahl);

  // Datum + Zeit extrahieren (datum kommt als "2026-04-10T18:00")
  const datumObj = new Date(datum);
  const datumStr = datumObj.toISOString().split('T')[0];
  const zeitStr = datumObj.getHours().toString().padStart(2, '0') + ':' +
                  datumObj.getMinutes().toString().padStart(2, '0');

  // Verfügbarkeit prüfen
  const slots = await VerfuegbarkeitModel.verfuegbareSlots(restaurantId, datumStr, personenZahl);
  const gewaehlt = slots.find(s => s.zeit === zeitStr);

  if (!gewaehlt || !gewaehlt.verfuegbar) {
    res.status(409).json({ fehler: 'Dieser Zeitslot ist leider nicht mehr verfügbar' });
    return;
  }

  // Tisch automatisch zuweisen
  const tischId = await VerfuegbarkeitModel.tischZuweisen(
    restaurantId, datumStr, zeitStr, personenZahl, verweilzeit
  );

  // Reservierung anlegen
  const reservierung = await ReservierungModel.erstellenMitToken({
    restaurant_id: restaurantId,
    tisch_id: tischId,
    gast_name,
    email: email.toLowerCase(),
    telefon: telefon || null,
    datum,
    personen: personenZahl,
    anmerkung: anmerkung || null,
    verweilzeit_min: verweilzeit,
    dsgvo_einwilligung: true,
  });

  // Bestätigungs-Email mit QR-Code senden (fire-and-forget)
  if (reservierung) {
    const r = restaurant[0];
    const adresse = [r.strasse, [r.plz, r.stadt].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    reservierungBestaetigungSenden(
      email.toLowerCase(), gast_name, r.name, datum, personenZahl,
      reservierung.buchungs_token!, adresse
    ).catch(err => console.error('[Reservierung] Bestätigungs-Email Fehler:', err));

    // Live-Update an alle Mitarbeiter des Restaurants via Socket.io
    io.to(`restaurant:${restaurantId}`).emit('neue_reservierung', {
      id: reservierung.id,
      gast_name,
      datum,
      personen: personenZahl,
      quelle: 'online',
    });
  }

  res.status(201).json({
    erfolg: true,
    reservierung: {
      id: reservierung?.id,
      datum: reservierung?.datum,
      personen: reservierung?.personen,
      status: reservierung?.status,
    },
  });
}));

// ────────────────────────────────────────────────
// GET /api/buchung/token/:token
// Öffentlich: Reservierung per Token abrufen (Self-Service)
// ────────────────────────────────────────────────
router.get('/token/:token', asyncHandler(async (req: Request, res: Response) => {
  const reservierung = await ReservierungModel.nachToken(req.params.token);
  if (!reservierung) {
    res.status(404).json({ fehler: 'Reservierung nicht gefunden' });
    return;
  }

  // Nur öffentliche Daten zurückgeben (kein Token, keine internen Felder)
  res.json({
    id: reservierung.id,
    gast_name: reservierung.gast_name,
    datum: reservierung.datum,
    personen: reservierung.personen,
    status: reservierung.status,
    anmerkung: reservierung.anmerkung,
    restaurant_name: reservierung.restaurant_name,
    restaurant_adresse: reservierung.restaurant_adresse,
    restaurant_id: reservierung.restaurant_id,
  });
}));

// ────────────────────────────────────────────────
// POST /api/buchung/token/:token/stornieren
// Öffentlich: Reservierung per Token stornieren
// ────────────────────────────────────────────────
router.post('/token/:token/stornieren', asyncHandler(async (req: Request, res: Response) => {
  // Zuerst laden für die Email
  const vorher = await ReservierungModel.nachToken(req.params.token);
  if (!vorher) {
    res.status(404).json({ fehler: 'Reservierung nicht gefunden' });
    return;
  }
  if (vorher.status === 'storniert') {
    res.status(400).json({ fehler: 'Diese Reservierung wurde bereits storniert' });
    return;
  }

  const reservierung = await ReservierungModel.stornieren(req.params.token);
  if (!reservierung) {
    res.status(400).json({ fehler: 'Stornierung nicht möglich' });
    return;
  }

  // Stornierungsbestätigung per Email
  if (vorher.email) {
    reservierungStornierungSenden(
      vorher.email, vorher.gast_name, vorher.restaurant_name, vorher.datum
    ).catch(err => console.error('[Reservierung] Storno-Email Fehler:', err));
  }

  // Live-Update an Mitarbeiter
  io.to(`restaurant:${vorher.restaurant_id}`).emit('reservierung_aktualisiert', {
    id: reservierung!.id,
    status: 'storniert',
  });

  res.json({ erfolg: true, nachricht: 'Reservierung wurde storniert' });
}));

// ────────────────────────────────────────────────
// POST /api/buchung/token/:token/umbuchen
// Öffentlich: Reservierung per Token auf neues Datum umbuchen
// ────────────────────────────────────────────────
router.post('/token/:token/umbuchen', asyncHandler(async (req: Request, res: Response) => {
  const { datum } = req.body;
  if (!datum) {
    res.status(400).json({ fehler: 'Neues Datum ist erforderlich' });
    return;
  }

  const vorher = await ReservierungModel.nachToken(req.params.token);
  if (!vorher) {
    res.status(404).json({ fehler: 'Reservierung nicht gefunden' });
    return;
  }
  if (vorher.status === 'storniert') {
    res.status(400).json({ fehler: 'Stornierte Reservierungen können nicht umgebucht werden' });
    return;
  }

  // Verfügbarkeit für neues Datum prüfen
  const datumObj = new Date(datum);
  const datumStr = datumObj.toISOString().split('T')[0];
  const zeitStr = datumObj.getHours().toString().padStart(2, '0') + ':' +
                  datumObj.getMinutes().toString().padStart(2, '0');
  const verweilzeit = verweilzeitBerechnen(vorher.personen);

  const slots = await VerfuegbarkeitModel.verfuegbareSlots(
    vorher.restaurant_id, datumStr, vorher.personen
  );
  const gewaehlt = slots.find(s => s.zeit === zeitStr);

  if (!gewaehlt || !gewaehlt.verfuegbar) {
    res.status(409).json({ fehler: 'Dieser Zeitslot ist leider nicht mehr verfügbar' });
    return;
  }

  // Neuen Tisch zuweisen
  const neuerTisch = await VerfuegbarkeitModel.tischZuweisen(
    vorher.restaurant_id, datumStr, zeitStr, vorher.personen, verweilzeit
  );

  const reservierung = await ReservierungModel.umbuchen(
    req.params.token, datum, neuerTisch, verweilzeit
  );

  // Umbuchungsbestätigung per Email
  if (vorher.email && reservierung) {
    reservierungUmbuchungSenden(
      vorher.email, vorher.gast_name, vorher.restaurant_name,
      datum, vorher.personen, req.params.token
    ).catch(err => console.error('[Reservierung] Umbuchungs-Email Fehler:', err));
  }

  // Live-Update an Mitarbeiter
  io.to(`restaurant:${vorher.restaurant_id}`).emit('reservierung_aktualisiert', {
    id: reservierung!.id,
    status: 'ausstehend',
    datum,
  });

  res.json({ erfolg: true, nachricht: 'Reservierung wurde umgebucht' });
}));

export default router;
