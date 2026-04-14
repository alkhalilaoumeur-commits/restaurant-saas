import { Router, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { q, q1 } from '../models/db';

const router = Router();

// ─── Öffnungszeiten (Wochentage) ─────────────────────────────────────────────

// GET /api/oeffnungszeiten — alle 7 Wochentage des Restaurants
router.get('/', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const zeiten = await q<{
      id: string; wochentag: number; von: string; bis: string; geschlossen: boolean;
    }>(
      'SELECT id, wochentag, von, bis, geschlossen FROM oeffnungszeiten WHERE restaurant_id = $1 ORDER BY wochentag',
      [req.auth!.restaurantId]
    );
    res.json(zeiten);
  })
);

// PUT /api/oeffnungszeiten/:wochentag — Wochentag anlegen oder aktualisieren (0=Mo…6=So)
router.put('/:wochentag', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const wochentag = parseInt(req.params.wochentag);
    if (isNaN(wochentag) || wochentag < 0 || wochentag > 6) {
      res.status(400).json({ fehler: 'Wochentag muss zwischen 0 (Montag) und 6 (Sonntag) liegen' });
      return;
    }

    const { von, bis, geschlossen } = req.body;

    if (!geschlossen && (!von || !bis)) {
      res.status(400).json({ fehler: 'von und bis sind erforderlich wenn das Restaurant geöffnet ist' });
      return;
    }

    // Upsert: Anlegen oder Aktualisieren
    const eintrag = await q1<{ id: string; wochentag: number; von: string; bis: string; geschlossen: boolean }>(
      `INSERT INTO oeffnungszeiten (restaurant_id, wochentag, von, bis, geschlossen)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (restaurant_id, wochentag)
       DO UPDATE SET von = EXCLUDED.von, bis = EXCLUDED.bis, geschlossen = EXCLUDED.geschlossen
       RETURNING id, wochentag, von, bis, geschlossen`,
      [req.auth!.restaurantId, wochentag, von || '09:00', bis || '22:00', geschlossen ?? false]
    );

    res.json(eintrag);
  })
);

// ─── Ausnahmetage ─────────────────────────────────────────────────────────────

// GET /api/oeffnungszeiten/ausnahmetage — alle Ausnahmetage
router.get('/ausnahmetage', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tage = await q<{ id: string; datum: string; grund: string | null }>(
      `SELECT id, datum::text, grund FROM ausnahmetage
       WHERE restaurant_id = $1 ORDER BY datum ASC`,
      [req.auth!.restaurantId]
    );
    res.json(tage);
  })
);

// POST /api/oeffnungszeiten/ausnahmetage — neuen Ausnahmetag hinzufügen
router.post('/ausnahmetage', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { datum, grund } = req.body;

    if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      res.status(400).json({ fehler: 'datum muss im Format YYYY-MM-DD angegeben werden' });
      return;
    }

    const eintrag = await q1<{ id: string; datum: string; grund: string | null }>(
      `INSERT INTO ausnahmetage (restaurant_id, datum, grund)
       VALUES ($1, $2, $3)
       ON CONFLICT (restaurant_id, datum) DO UPDATE SET grund = EXCLUDED.grund
       RETURNING id, datum::text, grund`,
      [req.auth!.restaurantId, datum, grund?.trim() || null]
    );

    res.status(201).json(eintrag);
  })
);

// DELETE /api/oeffnungszeiten/ausnahmetage/:id — Ausnahmetag entfernen
router.delete('/ausnahmetage/:id', requireAuth, requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await q1<{ id: string }>(
      'DELETE FROM ausnahmetage WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [req.params.id, req.auth!.restaurantId]
    );
    if (!result) {
      res.status(404).json({ fehler: 'Ausnahmetag nicht gefunden' });
      return;
    }
    res.status(204).send();
  })
);

export default router;
