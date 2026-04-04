import { Router, Response } from 'express';
import { queryOne } from '../config/database';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/restaurants/mein – eigenes Restaurant
router.get('/mein', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const restaurant = await queryOne(
    'SELECT id, name, logo_url, oeffnungszeiten, waehrung, abo_status FROM restaurants WHERE id = $1',
    [req.auth!.restaurantId]
  );
  if (!restaurant) {
    res.status(404).json({ error: 'Restaurant nicht gefunden' });
    return;
  }
  res.json(restaurant);
});

// PATCH /api/restaurants/mein (nur Admin)
router.patch('/mein', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, logo_url, oeffnungszeiten, waehrung } = req.body;

  const restaurant = await queryOne(
    `UPDATE restaurants
     SET name = COALESCE($1, name),
         logo_url = COALESCE($2, logo_url),
         oeffnungszeiten = COALESCE($3, oeffnungszeiten),
         waehrung = COALESCE($4, waehrung)
     WHERE id = $5
     RETURNING id, name, logo_url, oeffnungszeiten, waehrung, abo_status`,
    [name, logo_url, oeffnungszeiten, waehrung, req.auth!.restaurantId]
  );
  res.json(restaurant);
});

export default router;
