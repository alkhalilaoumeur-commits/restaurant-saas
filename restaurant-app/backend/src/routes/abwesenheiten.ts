import { Router, Response } from 'express';
import { AbwesenheitModel } from '../models/Abwesenheit';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { io } from '../server';
import { q, q1 } from '../models/db';

const router = Router();

// ── Hilfsfunktion: Arbeitstage (Mo–Fr) in einem Datumsbereich zählen ──────────
// §3 BUrlG: Urlaub wird in Arbeitstagen berechnet, Samstag + Sonntag zählen nicht.
function arbeitstageZaehlen(vonDatum: string, bisDatum: string): number {
  const start = new Date(vonDatum + 'T12:00:00');
  const end   = new Date(bisDatum + 'T12:00:00');
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const tag = cur.getDay(); // 0=So, 6=Sa
    if (tag !== 0 && tag !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// GET /api/abwesenheiten/urlaubskonto?jahr=YYYY
// Gibt dem Mitarbeiter seinen Urlaubsstand zurück:
//   { anspruch, verbraucht, verbleibend, jahr }
// Rechtsgrundlage: Art. 6(1)(c) DSGVO i.V.m. §3 BUrlG
router.get('/urlaubskonto', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId, mitarbeiterId } = req.auth!;
  const jahr = parseInt(req.query.jahr as string) || new Date().getFullYear();

  // Urlaubsanspruch des Mitarbeiters aus der DB holen
  const ma = await q1<{ urlaubsanspruch_tage: number }>(
    'SELECT urlaubsanspruch_tage FROM mitarbeiter WHERE id = $1 AND restaurant_id = $2',
    [mitarbeiterId, restaurantId]
  );
  const anspruch = ma?.urlaubsanspruch_tage ?? 20;

  // Alle Urlaubs-Abwesenheiten des Jahres laden (nur typ='urlaub')
  // Wir nehmen Einträge deren von_datum im gesuchten Jahr liegt
  const eintraege = await q<{ von_datum: string; bis_datum: string }>(
    `SELECT von_datum::text, bis_datum::text
     FROM abwesenheiten
     WHERE restaurant_id = $1
       AND mitarbeiter_id = $2
       AND typ = 'urlaub'
       AND EXTRACT(YEAR FROM von_datum) = $3`,
    [restaurantId, mitarbeiterId, jahr]
  );

  // Arbeitstage (Mo–Fr) aller Urlaubs-Einträge summieren
  const verbraucht = eintraege.reduce(
    (sum, e) => sum + arbeitstageZaehlen(e.von_datum, e.bis_datum),
    0
  );

  res.json({
    anspruch,
    verbraucht,
    verbleibend: Math.max(0, anspruch - verbraucht),
    jahr,
  });
}));

// GET /api/abwesenheiten?von=YYYY-MM-DD&bis=YYYY-MM-DD
// Admin → alle Abwesenheiten des Restaurants (optional: Zeitraum-Filter)
// Kellner/Küche → nur eigene
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId, mitarbeiterId, rolle } = req.auth!;
  const { von, bis } = req.query as { von?: string; bis?: string };

  if (rolle === 'admin') {
    if (von && bis) {
      const eintraege = await AbwesenheitModel.nachZeitraum(restaurantId, von, bis);
      res.json(eintraege);
    } else {
      const eintraege = await AbwesenheitModel.alleNachRestaurant(restaurantId);
      res.json(eintraege);
    }
  } else {
    const eintraege = await AbwesenheitModel.nachMitarbeiter(restaurantId, mitarbeiterId);
    res.json(eintraege);
  }
}));

// POST /api/abwesenheiten
// Mitarbeiter trägt eigene Abwesenheit ein.
// Admin kann für beliebigen MA eintragen (mitarbeiter_id im Body).
// Wenn Abwesenheit im laufenden Monat liegt UND Schichten betroffen → Socket-Benachrichtigung an Admin.
router.post('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId, mitarbeiterId, rolle } = req.auth!;
  const { von_datum, bis_datum, typ, notiz } = req.body;

  // Wer ist betroffen?
  const zielMitarbeiterId = rolle === 'admin' && req.body.mitarbeiter_id
    ? req.body.mitarbeiter_id
    : mitarbeiterId;

  // Pflichtfelder prüfen
  if (!von_datum || !bis_datum || !typ) {
    res.status(400).json({ fehler: 'von_datum, bis_datum und typ sind erforderlich' });
    return;
  }
  if (!['urlaub', 'krank', 'sonstiges'].includes(typ)) {
    res.status(400).json({ fehler: 'typ muss urlaub, krank oder sonstiges sein' });
    return;
  }
  if (bis_datum < von_datum) {
    res.status(400).json({ fehler: 'bis_datum darf nicht vor von_datum liegen' });
    return;
  }

  // Abwesenheit anlegen
  const abwesenheit = await AbwesenheitModel.erstellen({
    restaurant_id: restaurantId,
    mitarbeiter_id: zielMitarbeiterId,
    von_datum,
    bis_datum,
    typ,
    notiz: notiz ?? null,
  });

  // ── Konflikt-Check ──────────────────────────────────────────────────────────
  // Liegt der Zeitraum im laufenden Monat? (mindestens ein Tag Überschneidung)
  const jetzt = new Date();
  const monatsStart = new Date(jetzt.getFullYear(), jetzt.getMonth(), 1)
    .toISOString().slice(0, 10);
  const monatsEnde = new Date(jetzt.getFullYear(), jetzt.getMonth() + 1, 0)
    .toISOString().slice(0, 10);

  const laufenderMonat = bis_datum >= monatsStart && von_datum <= monatsEnde;

  if (laufenderMonat) {
    const konflikte = await AbwesenheitModel.konfliktePruefen(
      zielMitarbeiterId,
      von_datum,
      bis_datum,
    );

    if (konflikte.length > 0) {
      // Socket.io: Admin-Raum des Restaurants benachrichtigen
      io.to(`restaurant:${restaurantId}`).emit('abwesenheit_konflikt', {
        mitarbeiter_id: zielMitarbeiterId,
        mitarbeiter_name: abwesenheit.mitarbeiter_name ?? 'Mitarbeiter',
        von_datum,
        bis_datum,
        typ,
        betroffene_schichten: konflikte.length,
      });

      // TODO: Email-Benachrichtigung an Admin senden (wird später implementiert)
    }
  }

  res.status(201).json(abwesenheit);
}));

// DELETE /api/abwesenheiten/:id
// MA löscht eigene, Admin kann alle löschen
router.delete('/:id', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId } = req.auth!;
  const geloescht = await AbwesenheitModel.loeschen(req.params.id, restaurantId);
  if (!geloescht) {
    res.status(404).json({ fehler: 'Abwesenheit nicht gefunden' });
    return;
  }
  res.json({ geloescht: true });
}));

export default router;
