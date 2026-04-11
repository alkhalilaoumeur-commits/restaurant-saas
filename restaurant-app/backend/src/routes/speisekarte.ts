import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GerichtModel } from '../models/Gericht';
import { ExtrasModel } from '../models/Extras';
import { q1 } from '../models/db';
import { requireAuth, optionalAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/speisekarte  (öffentlich – Gäste + Mitarbeiter)
router.get('/', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = (req as AuthRequest).auth?.restaurantId || req.query.restaurantId as string;
  if (!restaurantId) { res.status(400).json({ fehler: 'restaurantId erforderlich' }); return; }
  const gerichte = await GerichtModel.alle(restaurantId);
  res.json(gerichte);
}));

// GET /api/speisekarte/kategorien  (öffentlich mit restaurantId ODER auth)
// Gäste: ?restaurantId=xxx → Kategorien mit Gerichteanzahl (nur Kategorien mit verfügbaren Gerichten)
// Mitarbeiter: Auth → alle Kategorien (auch leere)
router.get('/kategorien', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
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

// ═══════════════════════════════════════════════════════════════════════════
//  UNTERKATEGORIEN (optionale Gruppierung innerhalb einer Kategorie)
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/speisekarte/kategorien/:id/unterkategorien  (öffentlich)
router.get('/kategorien/:id/unterkategorien', asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = req.query.restaurantId as string;
  if (!restaurantId) { res.status(400).json({ fehler: 'restaurantId erforderlich' }); return; }
  const unterkategorien = await GerichtModel.alleUnterkategorien(req.params.id, restaurantId);
  res.json(unterkategorien);
}));

// POST /api/speisekarte/kategorien/:id/unterkategorien  (Admin)
router.post('/kategorien/:id/unterkategorien', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, reihenfolge } = req.body;
  if (!name) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }
  const uk = await GerichtModel.unterkategorieErstellen({
    id: uuid(), restaurant_id: req.auth!.restaurantId, kategorie_id: req.params.id,
    name, reihenfolge: reihenfolge ?? 0,
  });
  res.status(201).json(uk);
}));

// PATCH /api/speisekarte/unterkategorien/:id  (Admin)
router.patch('/unterkategorien/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const uk = await GerichtModel.unterkategorieAktualisieren(req.params.id, req.auth!.restaurantId, req.body);
  if (!uk) { res.status(404).json({ fehler: 'Unterkategorie nicht gefunden' }); return; }
  res.json(uk);
}));

// DELETE /api/speisekarte/unterkategorien/:id  (Admin)
router.delete('/unterkategorien/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await GerichtModel.unterkategorieLoeschen(req.params.id, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Unterkategorie nicht gefunden' }); return; }
  res.status(204).send();
}));

// POST /api/speisekarte  (Admin)
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { kategorie_id, unterkategorie_id, name, beschreibung, preis, bild_url, allergene } = req.body;
  if (!kategorie_id || !name || preis === undefined) {
    res.status(400).json({ fehler: 'kategorie_id, name und preis sind erforderlich' });
    return;
  }
  const gericht = await GerichtModel.erstellen({
    id: uuid(), restaurant_id: req.auth!.restaurantId, kategorie_id,
    unterkategorie_id: unterkategorie_id || null,
    name, beschreibung: beschreibung || null, preis,
    bild_url: bild_url || null, allergene: allergene || null, verfuegbar: true,
    modell_3d_url: null,
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

// ═══════════════════════════════════════════════════════════════════════════
//  EXTRAS / MODIFIER
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/speisekarte/:id/extras  (öffentlich – Gäste)
// Gibt alle Extras-Gruppen + verfügbare Extras eines Gerichts zurück
router.get('/:id/extras', asyncHandler(async (req: Request, res: Response) => {
  const gruppen = await ExtrasModel.nachGericht(req.params.id);
  res.json(gruppen);
}));

// GET /api/speisekarte/:id/extras/admin  (Admin – alle inkl. nicht-verfügbare)
router.get('/:id/extras/admin', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const gruppen = await ExtrasModel.alleGruppenAdmin(req.params.id, req.auth!.restaurantId);
  res.json(gruppen);
}));

// POST /api/speisekarte/:id/extras/gruppen  (Admin – Gruppe erstellen)
router.post('/:id/extras/gruppen', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, pflicht, max_auswahl, reihenfolge } = req.body;
  if (!name) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }

  // Prüfen: Gericht gehört zum Restaurant
  const gericht = await GerichtModel.nachId(req.params.id, req.auth!.restaurantId);
  if (!gericht) { res.status(404).json({ fehler: 'Gericht nicht gefunden' }); return; }

  const gruppe = await ExtrasModel.gruppeErstellen({
    id: uuid(), gericht_id: req.params.id, restaurant_id: req.auth!.restaurantId,
    name, pflicht, max_auswahl, reihenfolge,
  });
  res.status(201).json(gruppe);
}));

// PATCH /api/speisekarte/extras/gruppen/:gruppeId  (Admin – Gruppe bearbeiten)
router.patch('/extras/gruppen/:gruppeId', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const gruppe = await ExtrasModel.gruppeAktualisieren(req.params.gruppeId, req.auth!.restaurantId, req.body);
  if (!gruppe) { res.status(404).json({ fehler: 'Extras-Gruppe nicht gefunden' }); return; }
  res.json(gruppe);
}));

// DELETE /api/speisekarte/extras/gruppen/:gruppeId  (Admin – Gruppe löschen)
router.delete('/extras/gruppen/:gruppeId', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await ExtrasModel.gruppeLoeschen(req.params.gruppeId, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Extras-Gruppe nicht gefunden' }); return; }
  res.status(204).send();
}));

// POST /api/speisekarte/extras/gruppen/:gruppeId/extras  (Admin – Extra erstellen)
router.post('/extras/gruppen/:gruppeId/extras', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, aufpreis, reihenfolge } = req.body;
  if (!name) { res.status(400).json({ fehler: 'Name erforderlich' }); return; }

  const extra = await ExtrasModel.extraErstellen({
    id: uuid(), gruppe_id: req.params.gruppeId, restaurant_id: req.auth!.restaurantId,
    name, aufpreis, reihenfolge,
  });
  res.status(201).json(extra);
}));

// PATCH /api/speisekarte/extras/:extraId  (Admin – Extra bearbeiten)
router.patch('/extras/:extraId', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const extra = await ExtrasModel.extraAktualisieren(req.params.extraId, req.auth!.restaurantId, req.body);
  if (!extra) { res.status(404).json({ fehler: 'Extra nicht gefunden' }); return; }
  res.json(extra);
}));

// DELETE /api/speisekarte/extras/:extraId  (Admin – Extra löschen)
router.delete('/extras/:extraId', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await ExtrasModel.extraLoeschen(req.params.extraId, req.auth!.restaurantId);
  if (!result) { res.status(404).json({ fehler: 'Extra nicht gefunden' }); return; }
  res.status(204).send();
}));

export default router;
