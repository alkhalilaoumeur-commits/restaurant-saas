import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { io } from '../index';

const router = Router();

// GET /api/bestellungen – alle offenen Bestellungen (Admin/Küche/Kellner)
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.query;
  const params: unknown[] = [req.auth!.restaurantId];
  let sql = `
    SELECT b.*, t.nummer as tisch_nummer,
      json_agg(json_build_object(
        'id', bp.id,
        'gericht_id', bp.gericht_id,
        'gericht_name', g.name,
        'menge', bp.menge,
        'einzelpreis', bp.einzelpreis
      )) as positionen
    FROM bestellungen b
    JOIN tische t ON b.tisch_id = t.id
    LEFT JOIN bestellpositionen bp ON bp.bestellung_id = b.id
    LEFT JOIN gerichte g ON bp.gericht_id = g.id
    WHERE b.restaurant_id = $1
  `;
  if (status) {
    params.push(status);
    sql += ` AND b.status = $${params.length}`;
  }
  sql += ' GROUP BY b.id, t.nummer ORDER BY b.erstellt_am DESC';

  const bestellungen = await query(sql, params);
  res.json(bestellungen);
});

// POST /api/bestellungen – neue Bestellung (Gast, kein Auth nötig)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { restaurant_id, tisch_id, positionen, anmerkung } = req.body;

  if (!restaurant_id || !tisch_id || !positionen?.length) {
    res.status(400).json({ error: 'restaurant_id, tisch_id und positionen erforderlich' });
    return;
  }

  const bestellungId = uuidv4();
  let gesamtpreis = 0;

  // Preise aus DB holen (nicht vom Client vertrauen)
  const gerichtIds = positionen.map((p: { gericht_id: string }) => p.gericht_id);
  const gerichte = await query<{ id: string; preis: number; verfuegbar: boolean }>(
    'SELECT id, preis, verfuegbar FROM gerichte WHERE id = ANY($1) AND restaurant_id = $2',
    [gerichtIds, restaurant_id]
  );

  const preisMap = new Map(gerichte.map((g) => [g.id, g.preis]));

  const positionenMitPreis = positionen.map((p: { gericht_id: string; menge: number }) => {
    const preis = preisMap.get(p.gericht_id);
    if (!preis) throw new Error(`Gericht ${p.gericht_id} nicht gefunden`);
    gesamtpreis += preis * p.menge;
    return { ...p, einzelpreis: preis };
  });

  await queryOne(
    `INSERT INTO bestellungen (id, restaurant_id, tisch_id, status, gesamtpreis, anmerkung, erstellt_am)
     VALUES ($1, $2, $3, 'offen', $4, $5, NOW())`,
    [bestellungId, restaurant_id, tisch_id, gesamtpreis, anmerkung || null]
  );

  for (const pos of positionenMitPreis) {
    await queryOne(
      `INSERT INTO bestellpositionen (id, bestellung_id, gericht_id, menge, einzelpreis)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), bestellungId, pos.gericht_id, pos.menge, pos.einzelpreis]
    );
  }

  // Tisch als besetzt markieren
  await queryOne(
    "UPDATE tische SET status = 'besetzt' WHERE id = $1",
    [tisch_id]
  );

  // Live-Update an Admin/Küche senden
  io.to(`restaurant:${restaurant_id}`).emit('neue_bestellung', { bestellungId, tisch_id });

  res.status(201).json({ id: bestellungId, gesamtpreis });
});

// PATCH /api/bestellungen/:id/status (Küche + Admin + Kellner)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner', 'kueche'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const erlaubteStatus = ['offen', 'in_zubereitung', 'serviert', 'bezahlt'];

  if (!erlaubteStatus.includes(status)) {
    res.status(400).json({ error: `Status muss einer von: ${erlaubteStatus.join(', ')} sein` });
    return;
  }

  const bestellung = await queryOne(
    'UPDATE bestellungen SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
    [status, req.params.id, req.auth!.restaurantId]
  );
  if (!bestellung) {
    res.status(404).json({ error: 'Bestellung nicht gefunden' });
    return;
  }

  io.to(`restaurant:${req.auth!.restaurantId}`).emit('bestellung_aktualisiert', bestellung);
  res.json(bestellung);
});

export default router;
