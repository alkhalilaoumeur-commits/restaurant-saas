/**
 * /api/dekorationen — Statische Floor-Plan Deko-Elemente
 *
 *   GET    /api/dekorationen                 — alle (Admin/Kellner)
 *   POST   /api/dekorationen                 — neue Deko anlegen (Admin)
 *   PATCH  /api/dekorationen/:id             — Position/Größe/Rotation/Label aktualisieren (Admin)
 *   DELETE /api/dekorationen/:id             — löschen (Admin)
 */

import { Router, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { DekorationModel, DekoTyp } from '../models/Dekoration';

const router = Router();

const ERLAUBTE_TYPEN: DekoTyp[] = ['pflanze', 'theke', 'eingang', 'servicestation', 'wand', 'tuer'];

router.get('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dekos = await DekorationModel.alle(req.auth!.restaurantId);
    res.json(dekos);
  })
);

router.post('/', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { typ, pos_x, pos_y, breite, hoehe, rotation, label, bereich_id } = req.body as {
      typ: string; pos_x?: number; pos_y?: number;
      breite?: number; hoehe?: number; rotation?: number;
      label?: string; bereich_id?: string;
    };

    if (!ERLAUBTE_TYPEN.includes(typ as DekoTyp)) {
      res.status(400).json({ fehler: `Ungültiger Deko-Typ. Erlaubt: ${ERLAUBTE_TYPEN.join(', ')}` });
      return;
    }

    const deko = await DekorationModel.erstellen({
      restaurant_id: req.auth!.restaurantId,
      bereich_id:    bereich_id || null,
      typ:           typ as DekoTyp,
      pos_x:         Number(pos_x ?? 100),
      pos_y:         Number(pos_y ?? 100),
      breite:        Number(breite ?? 60),
      hoehe:         Number(hoehe ?? 60),
      rotation:      Number(rotation ?? 0),
      label:         label?.trim() || null,
    });
    res.status(201).json(deko);
  })
);

router.patch('/:id', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { pos_x, pos_y, breite, hoehe, rotation, label, bereich_id } = req.body as {
      pos_x?: number; pos_y?: number; breite?: number; hoehe?: number;
      rotation?: number; label?: string | null; bereich_id?: string | null;
    };

    const deko = await DekorationModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
      pos_x, pos_y, breite, hoehe, rotation,
      ...(label !== undefined ? { label } : {}),
      ...(bereich_id !== undefined ? { bereich_id } : {}),
    });
    if (!deko) { res.status(404).json({ fehler: 'Dekoration nicht gefunden' }); return; }
    res.json(deko);
  })
);

router.delete('/:id', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await DekorationModel.loeschen(req.params.id, req.auth!.restaurantId);
    if (!result) { res.status(404).json({ fehler: 'Dekoration nicht gefunden' }); return; }
    res.json({ ok: true });
  })
);

export default router;
