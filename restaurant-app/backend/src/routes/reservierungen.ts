import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ReservierungModel } from '../models/Reservierung';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reservierungen  (Admin/Kellner)
router.get('/', requireAuth, requireRolle('admin', 'kellner'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const datum = req.query.datum as string | undefined;
    const reservierungen = await ReservierungModel.alle(req.auth!.restaurantId, datum);
    res.json(reservierungen);
  }
);

// POST /api/reservierungen  (Gast oder Mitarbeiter)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { restaurant_id, tisch_id, gast_name, telefon, datum, personen, anmerkung, quelle } = req.body;
  if (!restaurant_id || !gast_name || !datum || !personen) {
    res.status(400).json({ fehler: 'restaurant_id, gast_name, datum und personen sind erforderlich' });
    return;
  }
  const reservierung = await ReservierungModel.erstellen({
    id: uuid(), restaurant_id, tisch_id: tisch_id || null,
    gast_name, telefon: telefon || null, datum, personen,
    status: 'ausstehend', anmerkung: anmerkung || null, quelle: quelle || 'app',
  });
  res.status(201).json(reservierung);
});

// PATCH /api/reservierungen/:id/status  (Admin/Kellner)
router.patch('/:id/status', requireAuth, requireRolle('admin', 'kellner'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { status } = req.body;
    if (!['ausstehend', 'bestaetigt', 'storniert'].includes(status)) {
      res.status(400).json({ fehler: 'Ungültiger Status' }); return;
    }
    const r = await ReservierungModel.statusAendern(req.params.id, req.auth!.restaurantId, status);
    if (!r) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }
    res.json(r);
  }
);

// DELETE /api/reservierungen/:id  (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await ReservierungModel.loeschen(req.params.id, req.auth!.restaurantId);
    if (!result) { res.status(404).json({ fehler: 'Reservierung nicht gefunden' }); return; }
    res.status(204).send();
  }
);

export default router;
