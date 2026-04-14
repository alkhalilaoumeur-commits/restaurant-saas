import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ReservierungModel } from '../models/Reservierung';
import { VerfuegbarkeitModel, verweilzeitBerechnen } from '../models/Verfuegbarkeit';
import { GastModel } from '../models/Gast';
import { q, q1 } from '../models/db';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/reservierungen/personalbedarf  (Admin)
// Gibt pro Tag die erwarteten Gäste + Personalempfehlung zurück.
// Berücksichtigt: Tischanzahl (Basis-Minimum), Öffnungszeiten (Geschlossen-Flag),
// Reservierungen (Gäste-abhängige Erhöhung).
router.get('/personalbedarf', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { start, ende } = req.query;
    if (!start || !ende) {
      res.status(400).json({ fehler: 'start und ende sind erforderlich (YYYY-MM-DD)' });
      return;
    }
    const restaurantId = req.auth!.restaurantId;

    // ── 1. Tischanzahl ────────────────────────────────────────────────────────
    // Basis-Minimum: Restaurant braucht immer Mindestpersonal um alle Tische zu bedienen
    const tischRow = await q1<{ tisch_anzahl: number }>(
      'SELECT COUNT(*)::int AS tisch_anzahl FROM tische WHERE restaurant_id = $1',
      [restaurantId]
    );
    const tischAnzahl = tischRow?.tisch_anzahl ?? 0;

    // Gastronomie-Faustregel für Tisch-Basis:
    // 1 Kellner deckt 4 Tische ab, 1 Küchenkraft kommt auf 6 Tische
    const kellnerBasis = Math.max(1, Math.ceil(tischAnzahl / 4));
    const kuecheBasis  = Math.max(1, Math.ceil(tischAnzahl / 6));

    // ── 2. Öffnungszeiten ────────────────────────────────────────────────────
    // wochentag: 0=Mo … 6=So (wie in der DB gespeichert)
    const oeffnungszeiten = await q<{
      wochentag: number;
      geschlossen: boolean;
    }>('SELECT wochentag, geschlossen FROM oeffnungszeiten WHERE restaurant_id = $1', [restaurantId]);

    // Map für schnellen Lookup: wochentag → geschlossen?
    const geschlossenMap = new Map<number, boolean>();
    for (const oz of oeffnungszeiten) {
      geschlossenMap.set(oz.wochentag, oz.geschlossen);
    }

    // Alle Tage im Zeitraum erzeugen (start … ende)
    const alleTage: string[] = [];
    const cur = new Date(start as string);
    const endDate = new Date(ende as string);
    while (cur <= endDate) {
      alleTage.push(cur.toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }

    // ── 3. Reservierungen nach Datum gruppieren ───────────────────────────────
    const rows = await q<{
      datum: string;
      reservierungen_count: number;
      gaeste_gesamt: number;
    }>(`
      SELECT
        datum::date AS datum,
        COUNT(*)::int AS reservierungen_count,
        COALESCE(SUM(personen), 0)::int AS gaeste_gesamt
      FROM reservierungen
      WHERE restaurant_id = $1
        AND datum::date >= $2::date
        AND datum::date <= $3::date
        AND status != 'storniert'
      GROUP BY datum::date
      ORDER BY datum::date
    `, [restaurantId, start, ende]);

    const reservMap = new Map(rows.map((r) => [r.datum, r]));

    // ── 4. Ergebnis pro Tag berechnen ────────────────────────────────────────
    const result = alleTage.map((datum) => {
      // Wochentag: JS Date.getDay() → 0=So…6=Sa → umrechnen auf 0=Mo…6=So
      const jsTag = new Date(datum + 'T12:00:00').getDay(); // Mittag = Timezone-safe
      const wochentag = (jsTag + 6) % 7; // 0=Mo … 6=So

      // Ist das Restaurant an diesem Tag geöffnet?
      // Kein Eintrag = keine Öffnungszeiten hinterlegt → als offen behandeln
      const geschlossen = geschlossenMap.get(wochentag) === true;

      if (geschlossen) {
        return {
          datum,
          reservierungen_count: 0,
          gaeste_gesamt: 0,
          empfohlen_kellner: 0,
          empfohlen_kueche: 0,
          geoeffnet: false,
        };
      }

      const res = reservMap.get(datum);
      const gaeste = res?.gaeste_gesamt ?? 0;

      // Reservierungsbasierter Bedarf:
      // 1 Kellner / 15 Gäste, 1 Küche / 25 Gäste
      const kellnerRes = gaeste > 0 ? Math.ceil(gaeste / 15) : 0;
      const kuecheRes  = gaeste > 0 ? Math.ceil(gaeste / 25) : 0;

      // Endempfehlung: Maximum aus Tisch-Basis und Reservierungsbedarf
      const empfohlen_kellner = Math.max(kellnerBasis, kellnerRes);
      const empfohlen_kueche  = Math.max(kuecheBasis, kuecheRes);

      return {
        datum,
        reservierungen_count: res?.reservierungen_count ?? 0,
        gaeste_gesamt: gaeste,
        empfohlen_kellner,
        empfohlen_kueche,
        geoeffnet: true,
      };
    });

    res.json(result);
  })
);

// GET /api/reservierungen  (Admin/Kellner)
router.get('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const datum = req.query.datum as string | undefined;
    const reservierungen = await ReservierungModel.alle(req.auth!.restaurantId, datum);
    res.json(reservierungen);
  })
);

// POST /api/reservierungen  (Gast oder Mitarbeiter)
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { restaurant_id, tisch_id, gast_name, email, telefon, datum, personen, anmerkung, quelle } = req.body;
  if (!restaurant_id || !gast_name || !datum || !personen) {
    res.status(400).json({ fehler: 'restaurant_id, gast_name, datum und personen sind erforderlich' });
    return;
  }

  // Prüfen: Existiert dieses Restaurant?
  const restaurant = await q1('SELECT id FROM restaurants WHERE id = $1', [restaurant_id]);
  if (!restaurant) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  // Wenn kein Tisch angegeben → automatisch besten freien Tisch suchen
  let tischIdFinal: string | null = tisch_id || null;
  if (!tischIdFinal) {
    const datumObj = new Date(datum);
    const datumStr = datumObj.toISOString().split('T')[0];
    const zeitStr = datumObj.getHours().toString().padStart(2, '0') + ':' +
                    datumObj.getMinutes().toString().padStart(2, '0');
    const verweilzeit = verweilzeitBerechnen(parseInt(personen));
    const zuweisung = await VerfuegbarkeitModel.tischZuweisen(
      restaurant_id, datumStr, zeitStr, parseInt(personen), verweilzeit, null
    );
    tischIdFinal = zuweisung?.hauptId || null;
  }

  const reservierung = await ReservierungModel.erstellen({
    id: uuid(), restaurant_id, tisch_id: tischIdFinal,
    gast_name, telefon: telefon || null, datum, personen,
    status: 'ausstehend', anmerkung: anmerkung || null, quelle: quelle || 'app',
  });

  // Gäste-CRM: Nur verknüpfen wenn der Admin explizit eine gast_id mitschickt
  // (z.B. über das CRM-Profil-Modal in der Gaeste-Seite).
  // Automatisches Linking ohne Einwilligung des Gastes ist DSGVO-widrig.
  // Online-Buchungen (buchung.ts) haben eine explizite DSGVO-Einwilligung → dort wird gelinkt.
  if (reservierung && req.body.gast_id) {
    q1('UPDATE reservierungen SET gast_id = $1 WHERE id = $2', [req.body.gast_id, reservierung.id])
      .then(() => GastModel.stammgastAktualisieren(req.body.gast_id))
      .catch((e) => console.error('[Gäste-CRM] Manuelles Link Fehler:', e));
  }

  res.status(201).json(reservierung);
}));

// PATCH /api/reservierungen/:id/status  (Admin/Kellner)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    if (!['ausstehend', 'bestaetigt', 'storniert', 'no_show', 'abgeschlossen'].includes(status)) {
      res.status(400).json({ fehler: 'Ungültiger Status' }); return;
    }
    const r = await ReservierungModel.statusAendern(req.params.id, req.auth!.restaurantId, status);
    if (!r) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }

    // ── No-Show: "No-Show" Tag automatisch auf Gast-Profil setzen ────────────
    if (status === 'no_show' && r.gast_id) {
      q(`UPDATE gaeste
         SET tags = array_append(tags, 'No-Show'), aktualisiert_am = now()
         WHERE id = $1 AND restaurant_id = $2 AND NOT ('No-Show' = ANY(tags))`,
        [r.gast_id, req.auth!.restaurantId]
      ).catch((e) => console.error('[No-Show Tag]', e));
    }

    // ── Abgeschlossen: Tisch freigeben ────────────────────────────────────────
    if (status === 'abgeschlossen' && r.tisch_id) {
      await q(
        `UPDATE tische SET status = 'frei' WHERE id = $1 AND restaurant_id = $2`,
        [r.tisch_id, req.auth!.restaurantId]
      );
    }

    // ── Socket.io: Live-Update ────────────────────────────────────────────────
    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('reservierung_aktualisiert', r);

    res.json(r);
  })
);

// POST /api/reservierungen/:id/auto-zuweisung  (Admin/Kellner — besten freien Tisch automatisch zuweisen)
router.post('/:id/auto-zuweisung', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reservierung = await ReservierungModel.nachId(req.params.id, req.auth!.restaurantId);
    if (!reservierung) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }
    if (reservierung.status === 'storniert') {
      res.status(400).json({ fehler: 'Stornierte Reservierungen können nicht zugewiesen werden' }); return;
    }

    // Datum und Uhrzeit aus dem gespeicherten Timestamp extrahieren
    const datumObj = new Date(reservierung.datum);
    const datumStr = datumObj.toISOString().split('T')[0];
    const zeitStr = datumObj.getHours().toString().padStart(2, '0') + ':' +
                    datumObj.getMinutes().toString().padStart(2, '0');
    const verweilzeit = reservierung.verweilzeit_min || verweilzeitBerechnen(reservierung.personen);

    const zuweisung = await VerfuegbarkeitModel.tischZuweisen(
      req.auth!.restaurantId, datumStr, zeitStr, reservierung.personen,
      verweilzeit, reservierung.sitzplatz_wunsch
    );

    if (!zuweisung) {
      res.status(409).json({ fehler: 'Kein passender freier Tisch für diesen Zeitraum gefunden' }); return;
    }

    const r = await ReservierungModel.kombiniertZuweisen(
      req.params.id, req.auth!.restaurantId,
      zuweisung.hauptId, zuweisung.kombinierterTischId
    );

    // Socket.io: Live-Update an alle Mitarbeiter senden
    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('reservierung_aktualisiert', r);

    res.json(r);
  })
);

// PATCH /api/reservierungen/:id/tisch  (Admin/Kellner — Tisch manuell zuweisen)
router.patch('/:id/tisch', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { tisch_id } = req.body; // null = Tisch-Zuweisung entfernen
    const r = await ReservierungModel.tischZuweisen(req.params.id, req.auth!.restaurantId, tisch_id ?? null);
    if (!r) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }

    // Socket.io: Live-Update an alle Mitarbeiter senden
    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('reservierung_aktualisiert', r);

    res.json(r);
  })
);

// DELETE /api/reservierungen/:id  (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await ReservierungModel.loeschen(req.params.id, req.auth!.restaurantId);
    if (!result) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }
    res.status(204).send();
  })
);

export default router;
