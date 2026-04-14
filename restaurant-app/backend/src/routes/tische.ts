import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { TischModel } from '../models/Tisch';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { q } from '../models/db';
import { io } from '../server';

const router = Router();

// GET /api/tische
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(await TischModel.alle(req.auth!.restaurantId));
}));

// POST /api/tische  (Admin)
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { nummer, kapazitaet, form, pos_x, pos_y, breite, hoehe, bereich_id } = req.body;
  if (!nummer) { res.status(400).json({ fehler: 'Tischnummer erforderlich' }); return; }
  const id = uuid();
  const qrUrl = `${process.env.FRONTEND_URL}/bestellen-pro/${req.auth!.restaurantId}/${id}`;
  const tisch = await TischModel.erstellen({
    id, restaurant_id: req.auth!.restaurantId, nummer, kapazitaet: kapazitaet || null,
    qr_url: qrUrl, form, pos_x, pos_y, breite, hoehe, bereich_id,
  });
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

    // Wenn Tisch → 'frei': alle nicht-bezahlten Bestellungen dieses Tisches → bezahlt
    if (status === 'frei') {
      const offene = await q<{ id: string }>(
        `UPDATE bestellungen SET status = 'bezahlt'
         WHERE tisch_id = $1 AND restaurant_id = $2 AND status != 'bezahlt'
         RETURNING id`,
        [req.params.id, req.auth!.restaurantId]
      );
      if (offene.length > 0) {
        io.to(`restaurant:${req.auth!.restaurantId}`).emit('bestellungen_bezahlt', {
          tisch_id: req.params.id,
          ids: offene.map(b => b.id),
        });
      }
    }

    res.json(tisch);
  })
);

// PUT /api/tische/positionen  (Admin) – Batch-Update aller Tisch-Positionen (nach Drag & Drop)
router.put('/positionen', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { positionen } = req.body;
  if (!Array.isArray(positionen) || positionen.length === 0) {
    res.status(400).json({ fehler: 'Positionen-Array erforderlich' }); return;
  }
  const ergebnis = await TischModel.positionenSpeichern(req.auth!.restaurantId, positionen);
  res.json(ergebnis);
}));

// PATCH /api/tische/:id  (Admin) – Tisch bearbeiten (alle Felder)
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { nummer, kapazitaet, form, pos_x, pos_y, breite, hoehe, rotation, bereich_id } = req.body;
  const tisch = await TischModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
    nummer, kapazitaet, form, pos_x, pos_y, breite, hoehe, rotation, bereich_id,
  });
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
