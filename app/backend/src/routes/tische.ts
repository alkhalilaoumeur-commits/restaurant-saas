import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireRolle } from '../middleware/auth';

const router = Router();

// GET /api/tische – alle Tische des eigenen Restaurants
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const tische = await query(
    'SELECT * FROM tische WHERE restaurant_id = $1 ORDER BY nummer',
    [req.auth!.restaurantId]
  );
  res.json(tische);
});

// GET /api/tische/:id
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const tisch = await queryOne(
    'SELECT * FROM tische WHERE id = $1 AND restaurant_id = $2',
    [req.params.id, req.auth!.restaurantId]
  );
  if (!tisch) {
    res.status(404).json({ error: 'Tisch nicht gefunden' });
    return;
  }
  res.json(tisch);
});

// POST /api/tische – neuen Tisch anlegen (nur Admin)
router.post('/', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { nummer, kapazitaet } = req.body;
  if (!nummer) {
    res.status(400).json({ error: 'Tischnummer erforderlich' });
    return;
  }

  const id = uuidv4();
  const qrUrl = `${process.env.FRONTEND_URL}/bestellen/${req.auth!.restaurantId}/${id}`;

  const tisch = await queryOne(
    `INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status, qr_url)
     VALUES ($1, $2, $3, $4, 'frei', $5)
     RETURNING *`,
    [id, req.auth!.restaurantId, nummer, kapazitaet || null, qrUrl]
  );
  res.status(201).json(tisch);
});

// PATCH /api/tische/:id/status – Status ändern (Kellner + Admin)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const erlaubteStatus = ['frei', 'besetzt', 'wartet_auf_zahlung'];

  if (!erlaubteStatus.includes(status)) {
    res.status(400).json({ error: `Status muss einer von: ${erlaubteStatus.join(', ')} sein` });
    return;
  }

  const tisch = await queryOne(
    'UPDATE tische SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
    [status, req.params.id, req.auth!.restaurantId]
  );
  if (!tisch) {
    res.status(404).json({ error: 'Tisch nicht gefunden' });
    return;
  }
  res.json(tisch);
});

// DELETE /api/tische/:id (nur Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await queryOne(
    'DELETE FROM tische WHERE id = $1 AND restaurant_id = $2 RETURNING id',
    [req.params.id, req.auth!.restaurantId]
  );
  if (!result) {
    res.status(404).json({ error: 'Tisch nicht gefunden' });
    return;
  }
  res.status(204).send();
});

export default router;
