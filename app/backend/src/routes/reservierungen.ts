import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reservierungen (Admin/Kellner)
router.get('/', requireAuth, requireRolle('admin', 'kellner'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { datum } = req.query;
  const params: unknown[] = [req.auth!.restaurantId];
  let sql = 'SELECT * FROM reservierungen WHERE restaurant_id = $1';

  if (datum) {
    params.push(datum);
    sql += ` AND DATE(datum) = $${params.length}`;
  }
  sql += ' ORDER BY datum ASC';

  const reservierungen = await query(sql, params);
  res.json(reservierungen);
});

// POST /api/reservierungen – neue Reservierung (Gast oder Admin)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { restaurant_id, tisch_id, name, telefon, datum, personen, anmerkung, quelle } = req.body;

  if (!restaurant_id || !name || !datum || !personen) {
    res.status(400).json({ error: 'restaurant_id, name, datum und personen erforderlich' });
    return;
  }

  // DSGVO: Telefon wird gespeichert, aber nur für die Reservierung genutzt
  const reservierung = await queryOne(
    `INSERT INTO reservierungen (id, restaurant_id, tisch_id, name, telefon, datum, personen, status, anmerkung, quelle)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'ausstehend', $8, $9)
     RETURNING *`,
    [
      uuidv4(), restaurant_id, tisch_id || null, name,
      telefon || null, datum, personen,
      anmerkung || null, quelle || 'App'
    ]
  );
  res.status(201).json(reservierung);
});

// PATCH /api/reservierungen/:id/status (Admin/Kellner)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const erlaubteStatus = ['ausstehend', 'bestaetigt', 'storniert'];

  if (!erlaubteStatus.includes(status)) {
    res.status(400).json({ error: `Status muss einer von: ${erlaubteStatus.join(', ')} sein` });
    return;
  }

  const reservierung = await queryOne(
    'UPDATE reservierungen SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
    [status, req.params.id, req.auth!.restaurantId]
  );
  if (!reservierung) {
    res.status(404).json({ error: 'Reservierung nicht gefunden' });
    return;
  }
  res.json(reservierung);
});

export default router;
