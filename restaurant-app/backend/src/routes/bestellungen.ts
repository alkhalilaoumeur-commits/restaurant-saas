import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { BestellungModel, BestellungStatus } from '../models/Bestellung';
import { pool, q } from '../models/db';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { io } from '../server';

const router = Router();

const ERLAUBTE_STATUS: BestellungStatus[] = ['offen', 'in_zubereitung', 'serviert', 'bezahlt'];

// GET /api/bestellungen  (Mitarbeiter)
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const bestellungen = await BestellungModel.alleAktiven(req.auth!.restaurantId);
  res.json(bestellungen);
});

// POST /api/bestellungen  (Gäste – kein Auth)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { restaurant_id, tisch_id, positionen, anmerkung } = req.body;
  if (!restaurant_id || !tisch_id || !positionen?.length) {
    res.status(400).json({ fehler: 'restaurant_id, tisch_id und positionen sind erforderlich' });
    return;
  }

  // Preise serverseitig aus DB holen – nie vom Client vertrauen
  const gerichtIds = positionen.map((p: { gericht_id: string }) => p.gericht_id);
  const gerichte = await q<{ id: string; preis: number; verfuegbar: boolean }>(
    'SELECT id, preis, verfuegbar FROM gerichte WHERE id = ANY($1) AND restaurant_id = $2 AND verfuegbar = true',
    [gerichtIds, restaurant_id]
  );

  if (gerichte.length !== gerichtIds.length) {
    res.status(400).json({ fehler: 'Ein oder mehrere Gerichte nicht verfügbar' });
    return;
  }

  const preisMap = new Map(gerichte.map((g) => [g.id, g.preis]));
  let gesamtpreis = 0;

  const bestellungId = uuid();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO bestellungen (id, restaurant_id, tisch_id, status, gesamtpreis, anmerkung, erstellt_am)
       VALUES ($1,$2,$3,'offen',$4,$5,NOW())`,
      [bestellungId, restaurant_id, tisch_id, 0, anmerkung || null]
    );

    for (const pos of positionen as { gericht_id: string; menge: number }[]) {
      const preis = preisMap.get(pos.gericht_id)!;
      gesamtpreis += preis * pos.menge;
      await client.query(
        'INSERT INTO bestellpositionen (id,bestellung_id,gericht_id,menge,einzelpreis) VALUES ($1,$2,$3,$4,$5)',
        [uuid(), bestellungId, pos.gericht_id, pos.menge, preis]
      );
    }

    await client.query('UPDATE bestellungen SET gesamtpreis = $1 WHERE id = $2', [gesamtpreis, bestellungId]);
    await client.query("UPDATE tische SET status = 'besetzt' WHERE id = $1", [tisch_id]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  io.to(`restaurant:${restaurant_id}`).emit('neue_bestellung', { bestellungId, tisch_id });

  res.status(201).json({ id: bestellungId, gesamtpreis });
});

// PATCH /api/bestellungen/:id/status  (Mitarbeiter)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner', 'kueche'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { status } = req.body;
    if (!ERLAUBTE_STATUS.includes(status)) {
      res.status(400).json({ fehler: `Ungültiger Status. Erlaubt: ${ERLAUBTE_STATUS.join(', ')}` });
      return;
    }
    const bestellung = await BestellungModel.statusAendern(req.params.id, req.auth!.restaurantId, status);
    if (!bestellung) { res.status(404).json({ fehler: 'Bestellung nicht gefunden' }); return; }

    io.to(`restaurant:${req.auth!.restaurantId}`).emit('bestellung_aktualisiert', bestellung);
    res.json(bestellung);
  }
);

export default router;
