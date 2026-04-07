import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { TischModel } from '../models/Tisch';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/tische
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(await TischModel.alle(req.auth!.restaurantId));
}));

// POST /api/tische  (Admin)
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { nummer, kapazitaet } = req.body;
  if (!nummer) { res.status(400).json({ fehler: 'Tischnummer erforderlich' }); return; }
  const id = uuid();
  const qrUrl = `${process.env.FRONTEND_URL}/bestellen-pro/${req.auth!.restaurantId}/${id}`;
  const tisch = await TischModel.erstellen({ id, restaurant_id: req.auth!.restaurantId, nummer, kapazitaet: kapazitaet || null, status: 'frei', qr_url: qrUrl });
  res.status(201).json(tisch);
}));

// PATCH /api/tische/:id/status  (Admin/Kellner)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    if (!['frei', 'besetzt', 'wartet_auf_zahlung'].includes(status)) {
      res.status(400).json({ fehler: 'Ungültiger Status' }); return;
    }
    const tisch = await TischModel.statusAendern(req.params.id, req.auth!.restaurantId, status);
    if (!tisch) { res.status(404).json({ fehler: 'Tisch nicht gefunden' }); return; }
    res.json(tisch);
  })
);

// PATCH /api/tische/:id  (Admin) – Nummer/Kapazitaet bearbeiten
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { nummer, kapazitaet } = req.body;
  if (nummer === undefined && kapazitaet === undefined) {
    res.status(400).json({ fehler: 'Nichts zu aktualisieren' }); return;
  }
  const tisch = await TischModel.aktualisieren(req.params.id, req.auth!.restaurantId, { nummer, kapazitaet });
  if (!tisch) { res.status(404).json({ fehler: 'Tisch nicht gefunden' }); return; }
  res.json(tisch);
}));

// DELETE /api/tische/:id  (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await TischModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Tisch nicht gefunden' }); return; }
  res.status(204).send();
}));

export default router;
