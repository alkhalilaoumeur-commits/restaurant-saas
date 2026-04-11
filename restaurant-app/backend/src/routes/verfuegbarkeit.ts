import { Router, Response } from 'express';
import { MitarbeiterVerfuegbarkeitModel } from '../models/MitarbeiterVerfuegbarkeit';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/verfuegbarkeit
// Admin → alle Einträge des Restaurants
// Kellner/Küche → nur eigene Einträge
router.get('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId, mitarbeiterId, rolle } = req.auth!;
  if (rolle === 'admin') {
    const eintraege = await MitarbeiterVerfuegbarkeitModel.alleNachRestaurant(restaurantId);
    res.json(eintraege);
  } else {
    const eintraege = await MitarbeiterVerfuegbarkeitModel.nachMitarbeiter(restaurantId, mitarbeiterId);
    res.json(eintraege);
  }
}));

// POST /api/verfuegbarkeit
// Alle eingeloggten Mitarbeiter dürfen eigene Einträge anlegen/überschreiben
// Admin darf für jeden MA einen Eintrag anlegen (mitarbeiter_id aus Body)
router.post('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId, mitarbeiterId, rolle } = req.auth!;
  const { wochentag, typ, von, bis, notiz } = req.body;

  // Admin kann mitarbeiter_id aus Body übergeben, alle anderen immer eigene ID
  const zielMitarbeiterId = rolle === 'admin' && req.body.mitarbeiter_id
    ? req.body.mitarbeiter_id
    : mitarbeiterId;

  if (wochentag === undefined || wochentag === null || !typ) {
    res.status(400).json({ fehler: 'wochentag und typ sind erforderlich' });
    return;
  }
  if (!['nicht_verfuegbar', 'eingeschraenkt'].includes(typ)) {
    res.status(400).json({ fehler: 'typ muss nicht_verfuegbar oder eingeschraenkt sein' });
    return;
  }
  if (typ === 'eingeschraenkt' && (!von || !bis)) {
    res.status(400).json({ fehler: 'Bei typ eingeschraenkt sind von und bis erforderlich' });
    return;
  }

  const eintrag = await MitarbeiterVerfuegbarkeitModel.upsert({
    restaurant_id: restaurantId,
    mitarbeiter_id: zielMitarbeiterId,
    wochentag: Number(wochentag),
    typ,
    von: von ?? null,
    bis: bis ?? null,
    notiz: notiz ?? null,
  });
  res.status(201).json(eintrag);
}));

// DELETE /api/verfuegbarkeit/:id
// MA darf eigene löschen, Admin darf alle löschen
router.delete('/:id', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { restaurantId } = req.auth!;
  const geloescht = await MitarbeiterVerfuegbarkeitModel.loeschen(req.params.id, restaurantId);
  if (!geloescht) {
    res.status(404).json({ fehler: 'Eintrag nicht gefunden' });
    return;
  }
  res.json({ geloescht: true });
}));

export default router;
