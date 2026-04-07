import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GerichtModel } from '../models/Gericht';
import { q1 } from '../models/db';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/speisekarte  (öffentlich – Gäste + Mitarbeiter)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = (req as AuthRequest).auth?.restaurantId || req.query.restaurantId as string;
  if (!restaurantId) { res.status(400).json({ fehler: 'restaurantId erforderlich' }); return; }
  const gerichte = await GerichtModel.alle(restaurantId);
  res.json(gerichte);
}));

// GET /api/speisekarte/kategorien  (öffentlich mit restaurantId ODER auth)
// Gäste: ?restaurantId=xxx → Kategorien mit Gerichteanzahl (nur Kategorien mit verfügbaren Gerichten)
// Mitarbeiter: Auth → alle Kategorien (auch leere)
router.get('/kategorien', asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = (req as AuthRequest).auth?.restaurantId || req.query.restaurantId as string;
  if (!restaurantId) { res.status(400).json({ fehler: 'restaurantId erforderlich' }); return; }

  // Wenn restaurantId als Query-Param kommt → öffentlicher Zugriff (Gäste)
  if (req.query.restaurantId) {
    const kategorien = await GerichtModel.alleKategorienOeffentlich(restaurantId);
    res.json(kategorien);
  } else {
    const kategorien = await GerichtModel.alleKategorien(restaurantId);
    res.json(kategorien);
  }
}));

// POST /api/speisekarte/kategorien  (Admin)
router.post('/kategorien', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, reihenfolge, bild_url } = req.body;
  if (!name) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }
  const kategorie = await q1(
    'INSERT INTO kategorien (id, restaurant_id, name, reihenfolge, bild_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [uuid(), req.auth!.restaurantId, name, reihenfolge ?? 0, bild_url || null]
  );
  res.status(201).json(kategorie);
}));

// PATCH /api/speisekarte/kategorien/:id  (Admin)
router.patch('/kategorien/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, reihenfolge, bild_url } = req.body;
  if (!name && reihenfolge === undefined && bild_url === undefined) { res.status(400).json({ fehler: 'Nichts zu aktualisieren' }); return; }
  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;
  if (name) { sets.push(`name = $${idx++}`); vals.push(name); }
  if (reihenfolge !== undefined) { sets.push(`reihenfolge = $${idx++}`); vals.push(reihenfolge); }
  if (bild_url !== undefined) { sets.push(`bild_url = $${idx++}`); vals.push(bild_url || null); }
  vals.push(req.params.id, req.auth!.restaurantId);
  const kategorie = await q1(
    `UPDATE kategorien SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
    vals
  );
  if (!kategorie) { res.status(404).json({ fehler: 'Kategorie nicht gefunden' }); return; }
  res.json(kategorie);
}));

// DELETE /api/speisekarte/kategorien/:id  (Admin)
router.delete('/kategorien/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  // Prüfen ob noch Gerichte in der Kategorie sind
  const anzahl = await q1<{ count: string }>(
    'SELECT COUNT(*) AS count FROM gerichte WHERE kategorie_id = $1 AND restaurant_id = $2',
    [req.params.id, req.auth!.restaurantId]
  );
  if (anzahl && parseInt(anzahl.count) > 0) {
    res.status(400).json({ fehler: 'Kategorie enthält noch Gerichte. Bitte zuerst alle Gerichte löschen oder verschieben.' });
    return;
  }
  const result = await q1(
    'DELETE FROM kategorien WHERE id = $1 AND restaurant_id = $2 RETURNING id',
    [req.params.id, req.auth!.restaurantId]
  );
  if (!result) { res.status(404).json({ fehler: 'Kategorie nicht gefunden' }); return; }
  res.status(204).send();
}));

// POST /api/speisekarte  (Admin)
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
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
}));

// PATCH /api/speisekarte/:id  (Admin)
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const gericht = await GerichtModel.aktualisieren(req.params.id, req.auth!.restaurantId, req.body);
  if (!gericht) { res.status(404).json({ fehler: 'Gericht nicht gefunden' }); return; }
  res.json(gericht);
}));

// DELETE /api/speisekarte/:id  (Admin)
router.delete('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await GerichtModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Gericht nicht gefunden' }); return; }
  res.status(204).send();
}));

export default router;
