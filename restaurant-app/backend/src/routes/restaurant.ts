import { Router, Request, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { RestaurantModel } from '../models/Restaurant';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/restaurant – Eigenes Restaurant abrufen (inkl. Lizenz-Info)
router.get('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
  if (!restaurant) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }

  const aktiveMitarbeiter = await RestaurantModel.aktiveMitarbeiterAnzahl(req.auth!.restaurantId);

  res.json({
    ...restaurant,
    aktive_mitarbeiter: aktiveMitarbeiter,
  });
}));

// PUT /api/restaurant – Restaurant-Daten aktualisieren
router.put('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, oeffnungszeiten, primaerfarbe } = req.body;

  // Farbwert validieren (Hex-Format)
  if (primaerfarbe !== undefined && !/^#[0-9a-fA-F]{6}$/.test(primaerfarbe)) {
    res.status(400).json({ fehler: 'Ungültiges Farbformat. Bitte Hex-Wert angeben (z.B. #ea580c)' });
    return;
  }

  const restaurant = await RestaurantModel.aktualisieren(req.auth!.restaurantId, {
    name,
    oeffnungszeiten,
    primaerfarbe,
  });

  if (!restaurant) {
    res.status(400).json({ fehler: 'Keine Änderungen angegeben' });
    return;
  }

  res.json(restaurant);
}));

// GET /api/restaurant/:id/design – Öffentlich: Name, Logo, Farbe (für Gäste-Seite)
router.get('/:id/design', asyncHandler(async (req: Request, res: Response) => {
  const design = await RestaurantModel.designNachId(req.params.id);
  if (!design) {
    res.status(404).json({ fehler: 'Restaurant nicht gefunden' });
    return;
  }
  res.json(design);
}));

export default router;
