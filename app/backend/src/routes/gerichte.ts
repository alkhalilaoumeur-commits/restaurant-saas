import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/gerichte – alle Gerichte des Restaurants (auch für Gäste via restaurantId Query)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  // Gäste übergeben restaurantId als Query-Parameter
  const restaurantId = req.auth?.restaurantId || req.query.restaurantId as string;
  if (!restaurantId) {
    res.status(400).json({ error: 'restaurantId erforderlich' });
    return;
  }

  const gerichte = await query(
    `SELECT g.*, k.name as kategorie_name
     FROM gerichte g
     JOIN kategorien k ON g.kategorie_id = k.id
     WHERE g.restaurant_id = $1
     ORDER BY k.reihenfolge, g.name`,
    [restaurantId]
  );
  res.json(gerichte);
});

// POST /api/gerichte (nur Admin)
router.post('/', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { kategorie_id, name, beschreibung, preis, bild_url, allergene } = req.body;
  if (!kategorie_id || !name || preis === undefined) {
    res.status(400).json({ error: 'kategorie_id, name und preis sind erforderlich' });
    return;
  }

  const gericht = await queryOne(
    `INSERT INTO gerichte (id, restaurant_id, kategorie_id, name, beschreibung, preis, bild_url, allergene, verfuegbar)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
     RETURNING *`,
    [uuidv4(), req.auth!.restaurantId, kategorie_id, name, beschreibung || null, preis, bild_url || null, allergene || null]
  );
  res.status(201).json(gericht);
});

// PATCH /api/gerichte/:id (Admin)
router.patch('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, beschreibung, preis, bild_url, allergene, verfuegbar, kategorie_id } = req.body;

  const gericht = await queryOne(
    `UPDATE gerichte
     SET name = COALESCE($1, name),
         beschreibung = COALESCE($2, beschreibung),
         preis = COALESCE($3, preis),
         bild_url = COALESCE($4, bild_url),
         allergene = COALESCE($5, allergene),
         verfuegbar = COALESCE($6, verfuegbar),
         kategorie_id = COALESCE($7, kategorie_id)
     WHERE id = $8 AND restaurant_id = $9
     RETURNING *`,
    [name, beschreibung, preis, bild_url, allergene, verfuegbar, kategorie_id, req.params.id, req.auth!.restaurantId]
  );
  if (!gericht) {
    res.status(404).json({ error: 'Gericht nicht gefunden' });
    return;
  }
  res.json(gericht);
});

// DELETE /api/gerichte/:id (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await queryOne(
    'DELETE FROM gerichte WHERE id = $1 AND restaurant_id = $2 RETURNING id',
    [req.params.id, req.auth!.restaurantId]
  );
  if (!result) {
    res.status(404).json({ error: 'Gericht nicht gefunden' });
    return;
  }
  res.status(204).send();
});

export default router;
