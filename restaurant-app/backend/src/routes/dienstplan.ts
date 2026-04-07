import { Router, Response } from 'express';
import { SchichtModel } from '../models/Schicht';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/dienstplan?start=2026-04-07&ende=2026-04-13
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { start, ende } = req.query;
  if (!start || !ende) {
    res.status(400).json({ fehler: 'start und ende sind erforderlich (YYYY-MM-DD)' });
    return;
  }
  const schichten = await SchichtModel.nachZeitraum(req.auth!.restaurantId, start as string, ende as string);
  res.json(schichten);
}));

// POST /api/dienstplan
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { mitarbeiter_id, datum, beginn, ende, notiz } = req.body;
  if (!mitarbeiter_id || !datum || !beginn || !ende) {
    res.status(400).json({ fehler: 'mitarbeiter_id, datum, beginn und ende sind erforderlich' });
    return;
  }
  if (beginn >= ende) {
    res.status(400).json({ fehler: 'Ende muss nach Beginn liegen' });
    return;
  }
  const schicht = await SchichtModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    mitarbeiter_id, datum, beginn, ende, notiz,
  });
  res.status(201).json(schicht);
}));

// PATCH /api/dienstplan/:id
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { mitarbeiter_id, datum, beginn, ende, notiz } = req.body;
  if (beginn && ende && beginn >= ende) {
    res.status(400).json({ fehler: 'Ende muss nach Beginn liegen' });
    return;
  }
  const schicht = await SchichtModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
    mitarbeiter_id, datum, beginn, ende, notiz,
  });
  if (!schicht) { res.status(404).json({ fehler: 'Schicht nicht gefunden' }); return; }
  res.json(schicht);
}));

// DELETE /api/dienstplan/:id
router.delete('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const schicht = await SchichtModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!schicht) { res.status(404).json({ fehler: 'Schicht nicht gefunden' }); return; }
  res.json({ geloescht: true });
}));

export default router;
