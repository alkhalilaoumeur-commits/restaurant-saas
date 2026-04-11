import { Router, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { GastModel } from '../models/Gast';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Alle Routen: nur Admin
router.use(requireAuth, requireRolle('admin'));

// GET /api/gaeste – Alle Gäste mit Besuchsstatistik
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const gaeste = await GastModel.alle(req.auth!.restaurantId);
  res.json(gaeste);
}));

// GET /api/gaeste/export – CSV-Export aller Gäste (DSGVO Auskunftsrecht)
// Muss VOR /:id stehen, damit "export" nicht als ID interpretiert wird
router.get('/export', asyncHandler(async (req: AuthRequest, res: Response) => {
  const gaeste = await GastModel.alle(req.auth!.restaurantId);

  const csvZeilen: string[] = [
    // Kopfzeile
    ['Name', 'Email', 'Telefon', 'Besuche', 'Letzter Besuch', 'Tags', 'Notizen', 'Angelegt am'].join(';'),
  ];

  for (const g of gaeste) {
    const zeile = [
      `"${g.name.replace(/"/g, '""')}"`,
      g.email ? `"${g.email}"` : '',
      g.telefon ? `"${g.telefon}"` : '',
      String(g.besuche),
      g.letzter_besuch ? new Date(g.letzter_besuch).toLocaleDateString('de-DE') : '',
      `"${g.tags.join(', ')}"`,
      g.notizen ? `"${g.notizen.replace(/"/g, '""').replace(/\n/g, ' ')}"` : '',
      new Date(g.erstellt_am).toLocaleDateString('de-DE'),
    ].join(';');
    csvZeilen.push(zeile);
  }

  const csv = '\uFEFF' + csvZeilen.join('\r\n'); // BOM für Excel UTF-8

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="gaeste-export-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
}));

// GET /api/gaeste/:id – Einzelner Gast + Reservierungsliste
router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const gast = await GastModel.nachId(req.params.id, req.auth!.restaurantId);
  if (!gast) {
    res.status(404).json({ fehler: 'Gast nicht gefunden' });
    return;
  }
  const reservierungen = await GastModel.reservierungen(req.params.id, req.auth!.restaurantId);
  res.json({ ...gast, reservierungen });
}));

// POST /api/gaeste – Gast manuell anlegen
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, telefon, notizen, tags } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ fehler: 'Name ist erforderlich' });
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }
  if (tags && !Array.isArray(tags)) {
    res.status(400).json({ fehler: 'Tags müssen ein Array sein' });
    return;
  }

  const gast = await GastModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    name: name.trim(),
    email: email?.toLowerCase().trim() ?? null,
    telefon: telefon?.trim() ?? null,
    notizen: notizen?.trim() ?? null,
    tags: tags ?? [],
  });

  res.status(201).json(gast);
}));

// PATCH /api/gaeste/:id – Gast bearbeiten (Notizen, Tags, Kontakt)
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, telefon, notizen, tags } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    res.status(400).json({ fehler: 'Tags müssen ein Array sein' });
    return;
  }

  const gast = await GastModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
    name: name?.trim(),
    email: email !== undefined ? (email?.toLowerCase().trim() ?? null) : undefined,
    telefon: telefon !== undefined ? (telefon?.trim() ?? null) : undefined,
    notizen: notizen !== undefined ? (notizen?.trim() ?? null) : undefined,
    tags,
  });

  if (!gast) {
    res.status(404).json({ fehler: 'Gast nicht gefunden' });
    return;
  }
  res.json(gast);
}));

// DELETE /api/gaeste/:id – Gast löschen (DSGVO)
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await GastModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!result) {
    res.status(404).json({ fehler: 'Gast nicht gefunden' });
    return;
  }
  res.json({ nachricht: 'Gast gelöscht' });
}));

export default router;
