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
  const { name, oeffnungszeiten, primaerfarbe, layout_id, logo_url,
          buchungsintervall_min, tisch_dauer_min, max_gleichzeitige_reservierungen,
          google_bewertungs_link } = req.body;

  // Farbwert validieren (Hex-Format)
  if (primaerfarbe !== undefined && !/^#[0-9a-fA-F]{6}$/.test(primaerfarbe)) {
    res.status(400).json({ fehler: 'Ungültiges Farbformat. Bitte Hex-Wert angeben (z.B. #ea580c)' });
    return;
  }

  // Layout-ID validieren
  const erlaubteLayouts = ['modern', 'elegant-dunkel', 'osteria', 'editorial', 'showcase', 'qr-menu'];
  if (layout_id !== undefined && !erlaubteLayouts.includes(layout_id)) {
    res.status(400).json({ fehler: 'Ungültige Layout-ID' });
    return;
  }

  // Logo-URL validieren (muss /uploads/ Pfad oder null sein)
  if (logo_url !== undefined && logo_url !== null && !logo_url.startsWith('/uploads/')) {
    res.status(400).json({ fehler: 'Ungültige Logo-URL' });
    return;
  }

  // Buchungsintervall validieren (nur erlaubte Werte)
  const erlaubteIntervalle = [15, 30, 60];
  if (buchungsintervall_min !== undefined && !erlaubteIntervalle.includes(Number(buchungsintervall_min))) {
    res.status(400).json({ fehler: 'Buchungsintervall muss 15, 30 oder 60 Minuten sein' });
    return;
  }

  // Tischdauer validieren (mind. 30, max. 480 Min.)
  if (tisch_dauer_min !== undefined && (Number(tisch_dauer_min) < 30 || Number(tisch_dauer_min) > 480)) {
    res.status(400).json({ fehler: 'Tischdauer muss zwischen 30 und 480 Minuten liegen' });
    return;
  }

  const restaurant = await RestaurantModel.aktualisieren(req.auth!.restaurantId, {
    name,
    oeffnungszeiten,
    primaerfarbe,
    layout_id,
    logo_url,
    buchungsintervall_min: buchungsintervall_min !== undefined ? Number(buchungsintervall_min) : undefined,
    tisch_dauer_min: tisch_dauer_min !== undefined ? Number(tisch_dauer_min) : undefined,
    max_gleichzeitige_reservierungen: max_gleichzeitige_reservierungen !== undefined
      ? (max_gleichzeitige_reservierungen === null ? null : Number(max_gleichzeitige_reservierungen))
      : undefined,
    google_bewertungs_link: google_bewertungs_link !== undefined
      ? (google_bewertungs_link === '' ? null : google_bewertungs_link)
      : undefined,
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
