import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GerichtModel } from '../models/Gericht';
import { q1 } from '../models/db';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/speisekarte  (öffentlich – Gäste + Mitarbeiter)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const restaurantId = (req as AuthRequest).auth?.restaurantId || req.query.restaurantId as string;
  if (!restaurantId) { res.status(400).json({ fehler: 'restaurantId erforderlich' }); return; }
  const gerichte = await GerichtModel.alle(restaurantId);
  res.json(gerichte);
});

// GET /api/speisekarte/kategorien
router.get('/kategorien', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const kategorien = await GerichtModel.alleKategorien(req.auth!.restaurantId);
  res.json(kategorien);
});

// POST /api/speisekarte/kategorien  (Admin)
router.post('/kategorien', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, reihenfolge } = req.body;
  if (!name) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }
  const kategorie = await q1(
    'INSERT INTO kategorien (id, restaurant_id, name, reihenfolge) VALUES ($1,$2,$3,$4) RETURNING *',
    [uuid(), req.auth!.restaurantId, name, reihenfolge ?? 0]
  );
  res.status(201).json(kategorie);
});

// POST /api/speisekarte  (Admin)
router.post('/', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { kategorie_id, name, beschreibung, preis, bild_url, allergene } = req.body;
  if (!kategorie_id || !name || preis === undefined) {
    res.status(400).json({ fehler: 'kategorie_id, name und preis sind erforderlich' });
    return;
  }
  const gericht = await GerichtModel.erstellen({
    id: uuid(), restaurant_id: req.auth!.restaurantId, kategorie_id,
    name, beschreibung: beschreibung || null, preis,
    bild_url: bild_url || null, allergene: allergene || null, verfuegbar: true,
  });
  res.status(201).json(gericht);
});

// PATCH /api/speisekarte/:id  (Admin)
router.patch('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const gericht = await GerichtModel.aktualisieren(req.params.id, req.auth!.restaurantId, req.body);
  if (!gericht) { res.status(404).json({ fehler: 'Gericht nicht gefunden' }); return; }
  res.json(gericht);
});

// DELETE /api/speisekarte/:id  (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await GerichtModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Gericht nicht gefunden' }); return; }
  res.status(204).send();
});

export default router;
