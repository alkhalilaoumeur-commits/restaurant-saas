import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { BereichModel } from '../models/Bereich';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/bereiche — Alle Bereiche des Restaurants
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(await BereichModel.alle(req.auth!.restaurantId));
}));

// POST /api/bereiche — Neuen Bereich erstellen (Admin)
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, reihenfolge } = req.body;
  if (!name?.trim()) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }
  const bereich = await BereichModel.erstellen({
    id: uuid(), restaurant_id: req.auth!.restaurantId, name: name.trim(), reihenfolge,
  });
  res.status(201).json(bereich);
}));

// PATCH /api/bereiche/:id — Bereich bearbeiten (Admin)
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, reihenfolge } = req.body;
  const bereich = await BereichModel.aktualisieren(req.params.id, req.auth!.restaurantId, { name, reihenfolge });
  if (!bereich) { res.status(404).json({ fehler: 'Bereich nicht gefunden' }); return; }
  res.json(bereich);
}));

// DELETE /api/bereiche/:id — Bereich löschen (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await BereichModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Bereich nicht gefunden' }); return; }
  res.status(204).send();
}));

export default router;
