import { Router, Response } from 'express';
import { WalkInModel } from '../models/WalkIn';
import { VerfuegbarkeitModel, verweilzeitBerechnen } from '../models/Verfuegbarkeit';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { q1 } from '../models/db';

const router = Router();

// GET /api/walk-ins  — alle aktiven Walk-ins + berechnete Wartezeit
router.get('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const walkIns = await WalkInModel.aktive(req.auth!.restaurantId);

    // Wartezeit für jeden wartenden Walk-in berechnen
    const mitWartezeit = await Promise.all(
      walkIns.map(async (w) => {
        const wartezeit_min = w.status === 'wartend'
          ? await WalkInModel.wartezeitBerechnen(req.auth!.restaurantId, w.personen, w.id)
          : 0;
        return { ...w, wartezeit_min };
      })
    );

    res.json(mitWartezeit);
  })
);

// POST /api/walk-ins  — neuen Walk-in erfassen
router.post('/', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { gast_name, personen, anmerkung } = req.body;

    if (!gast_name || !personen) {
      res.status(400).json({ fehler: 'gast_name und personen sind erforderlich' });
      return;
    }
    if (parseInt(personen) < 1 || parseInt(personen) > 50) {
      res.status(400).json({ fehler: 'Personenzahl muss zwischen 1 und 50 liegen' });
      return;
    }

    const walkIn = await WalkInModel.erstellen({
      restaurant_id: req.auth!.restaurantId,
      gast_name: gast_name.trim(),
      personen: parseInt(personen),
      anmerkung: anmerkung?.trim() || null,
    });

    // Wartezeit berechnen
    const wartezeit_min = await WalkInModel.wartezeitBerechnen(
      req.auth!.restaurantId, walkIn!.personen, walkIn!.id
    );

    // Socket.io: Alle Mitarbeiter informieren
    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('walk_in_neu', { ...walkIn, wartezeit_min });

    res.status(201).json({ ...walkIn, wartezeit_min });
  })
);

// POST /api/walk-ins/:id/platzieren  — Gast an Tisch platzieren
// Optional: tisch_id im Body → manuell; ohne → Auto-Zuweisung
router.post('/:id/platzieren', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const walkIn = await WalkInModel.nachId(req.params.id, req.auth!.restaurantId);
    if (!walkIn) { res.status(404).json({ fehler: 'Walk-in nicht gefunden' }); return; }
    if (walkIn.status !== 'wartend') {
      res.status(400).json({ fehler: 'Walk-in ist nicht mehr in der Warteschlange' }); return;
    }

    let tischId: string;

    if (req.body.tisch_id) {
      // Manuell: Prüfen ob Tisch frei + zum Restaurant gehört
      const tisch = await q1<{ id: string; status: string; kapazitaet: number | null }>(
        `SELECT id, status, kapazitaet FROM tische WHERE id = $1 AND restaurant_id = $2`,
        [req.body.tisch_id, req.auth!.restaurantId]
      );
      if (!tisch) { res.status(404).json({ fehler: 'Tisch nicht gefunden' }); return; }
      if (tisch.status !== 'frei') { res.status(409).json({ fehler: 'Tisch ist nicht frei' }); return; }
      tischId = tisch.id;
    } else {
      // Auto: Besten freien Tisch suchen
      const jetzt = new Date();
      const datumStr = jetzt.toISOString().split('T')[0];
      const zeitStr = jetzt.getHours().toString().padStart(2, '0') + ':' +
                      jetzt.getMinutes().toString().padStart(2, '0');
      const verweilzeit = verweilzeitBerechnen(walkIn.personen);
      const zuweisung = await VerfuegbarkeitModel.tischZuweisen(
        req.auth!.restaurantId, datumStr, zeitStr, walkIn.personen, verweilzeit, null
      );
      if (!zuweisung) {
        res.status(409).json({ fehler: 'Kein freier Tisch für diese Gruppengröße verfügbar' }); return;
      }
      tischId = zuweisung.hauptId;
    }

    // Tisch auf 'besetzt' setzen
    await q1('UPDATE tische SET status = $1 WHERE id = $2', ['besetzt', tischId]);

    const aktualisiert = await WalkInModel.platzieren(req.params.id, req.auth!.restaurantId, tischId);

    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant:${req.auth!.restaurantId}`).emit('walk_in_aktualisiert', aktualisiert);
      io.to(`restaurant:${req.auth!.restaurantId}`).emit('tisch_aktualisiert', { id: tischId, status: 'besetzt' });
    }

    res.json(aktualisiert);
  })
);

// PATCH /api/walk-ins/:id/abgegangen  — Gast ist ohne Platzierung gegangen
router.patch('/:id/abgegangen', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const aktualisiert = await WalkInModel.abgegangen(req.params.id, req.auth!.restaurantId);
    if (!aktualisiert) {
      res.status(404).json({ fehler: 'Walk-in nicht gefunden' });
      return;
    }

    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('walk_in_aktualisiert', aktualisiert);

    res.json(aktualisiert);
  })
);

// PATCH /api/walk-ins/:id/reaktivieren  — "Abgegangen" rückgängig → zurück auf "wartend"
router.patch('/:id/reaktivieren', requireAuth, requireRolle('admin', 'kellner'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const aktualisiert = await q1<{ id: string }>(
      `UPDATE walk_ins SET status = 'wartend', platziert_am = NULL
       WHERE id = $1 AND restaurant_id = $2 AND status = 'abgegangen' RETURNING *`,
      [req.params.id, req.auth!.restaurantId]
    );
    if (!aktualisiert) {
      res.status(404).json({ fehler: 'Walk-in nicht gefunden oder nicht abgegangen' }); return;
    }
    const io = req.app.get('io');
    if (io) io.to(`restaurant:${req.auth!.restaurantId}`).emit('walk_in_aktualisiert', aktualisiert);
    res.json(aktualisiert);
  })
);

// DELETE /api/walk-ins/:id  — Walk-in löschen (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await WalkInModel.loeschen(req.params.id, req.auth!.restaurantId);
    if (!result) {
      res.status(404).json({ fehler: 'Walk-in nicht gefunden' });
      return;
    }
    res.status(204).send();
  })
);

export default router;
