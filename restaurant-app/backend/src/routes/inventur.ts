import { Router, Response } from 'express';
import { ArtikelModel, BewegungModel, LieferantModel, RezepturModel, InventurAuswertungModel } from '../models/Inventur';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { lieferantenBestellungSenden } from '../services/email';
import { q1 } from '../models/db';

const router = Router();

// Alle Routen nur für Admin
router.use(requireAuth, requireRolle('admin'));

// ════════════════════════════════════════════════
// ARTIKEL
// ════════════════════════════════════════════════

// GET /api/inventur/artikel
router.get('/artikel', asyncHandler(async (req: AuthRequest, res: Response) => {
  const artikel = await ArtikelModel.alle(req.auth!.restaurantId);
  res.json(artikel);
}));

// POST /api/inventur/artikel
router.post('/artikel', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, kategorie, einheit, mindestbestand, einkaufspreis, lieferant_id, aktueller_bestand } = req.body;
  if (!name || !einheit) {
    res.status(400).json({ fehler: 'name und einheit sind Pflichtfelder' }); return;
  }
  const artikel = await ArtikelModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    name, kategorie: kategorie || 'Sonstiges', einheit,
    mindestbestand: mindestbestand ?? 0,
    einkaufspreis: einkaufspreis ?? null,
    lieferant_id: lieferant_id ?? null,
    aktueller_bestand: aktueller_bestand ?? 0,
  });
  res.status(201).json(artikel);
}));

// PUT /api/inventur/artikel/:id
router.put('/artikel/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const artikel = await ArtikelModel.aktualisieren(req.params.id, req.auth!.restaurantId, req.body);
  if (!artikel) { res.status(404).json({ fehler: 'Artikel nicht gefunden' }); return; }
  res.json(artikel);
}));

// DELETE /api/inventur/artikel/:id
router.delete('/artikel/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const ergebnis = await ArtikelModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!ergebnis) { res.status(404).json({ fehler: 'Artikel nicht gefunden' }); return; }
  res.json({ erfolg: true });
}));

// GET /api/inventur/vorschlaege — Artikel unter Mindestbestand
router.get('/vorschlaege', asyncHandler(async (req: AuthRequest, res: Response) => {
  const artikel = await ArtikelModel.unterMindestbestand(req.auth!.restaurantId);
  res.json(artikel);
}));

// ════════════════════════════════════════════════
// LAGERBEWEGUNGEN
// ════════════════════════════════════════════════

// GET /api/inventur/bewegungen
router.get('/bewegungen', asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const bewegungen = await BewegungModel.alleNachRestaurant(req.auth!.restaurantId, limit);
  res.json(bewegungen);
}));

// GET /api/inventur/bewegungen/:artikelId
router.get('/bewegungen/:artikelId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const bewegungen = await BewegungModel.alleNachArtikel(req.params.artikelId, req.auth!.restaurantId);
  res.json(bewegungen);
}));

// POST /api/inventur/bewegung — manuelle Buchung (Eingang / Abgang / Korrektur)
router.post('/bewegung', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { artikel_id, typ, menge, notiz } = req.body;

  if (!artikel_id || !typ || menge === undefined) {
    res.status(400).json({ fehler: 'artikel_id, typ und menge sind Pflichtfelder' }); return;
  }
  if (!['eingang', 'abgang', 'korrektur'].includes(typ)) {
    res.status(400).json({ fehler: 'typ muss eingang, abgang oder korrektur sein' }); return;
  }
  if (typeof menge !== 'number' || menge === 0) {
    res.status(400).json({ fehler: 'menge muss eine Zahl ungleich 0 sein' }); return;
  }

  // Eingang = positiv, Abgang = negativ (delta)
  const delta = typ === 'eingang' ? Math.abs(menge) : -Math.abs(menge);
  // Korrektur kann positiv oder negativ sein (Vorzeichen aus menge übernehmen)
  const finalDelta = typ === 'korrektur' ? menge : delta;

  const { bewegung, artikel } = await BewegungModel.erfassen({
    restaurant_id: req.auth!.restaurantId,
    artikel_id,
    typ,
    delta: finalDelta,
    notiz: notiz ?? null,
  });

  res.status(201).json({ bewegung, artikel });
}));

// ════════════════════════════════════════════════
// LIEFERANTEN
// ════════════════════════════════════════════════

// GET /api/inventur/lieferanten
router.get('/lieferanten', asyncHandler(async (req: AuthRequest, res: Response) => {
  const lieferanten = await LieferantModel.alle(req.auth!.restaurantId);
  res.json(lieferanten);
}));

// POST /api/inventur/lieferanten
router.post('/lieferanten', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, kontakt_email, kontakt_telefon, liefertage, notiz } = req.body;
  if (!name) { res.status(400).json({ fehler: 'name ist ein Pflichtfeld' }); return; }
  const lieferant = await LieferantModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    name, kontakt_email: kontakt_email ?? null,
    kontakt_telefon: kontakt_telefon ?? null,
    liefertage: liefertage ?? [],
    notiz: notiz ?? null,
    aktiv: true,
  });
  res.status(201).json(lieferant);
}));

// PUT /api/inventur/lieferanten/:id
router.put('/lieferanten/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const lieferant = await LieferantModel.aktualisieren(req.params.id, req.auth!.restaurantId, req.body);
  if (!lieferant) { res.status(404).json({ fehler: 'Lieferant nicht gefunden' }); return; }
  res.json(lieferant);
}));

// DELETE /api/inventur/lieferanten/:id
router.delete('/lieferanten/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const ergebnis = await LieferantModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!ergebnis) { res.status(404).json({ fehler: 'Lieferant nicht gefunden' }); return; }
  res.json({ erfolg: true });
}));

// ════════════════════════════════════════════════
// REZEPTUREN
// ════════════════════════════════════════════════

// GET /api/inventur/rezepturen/:gerichtId
router.get('/rezepturen/:gerichtId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const rezepturen = await RezepturModel.nachGericht(req.params.gerichtId, req.auth!.restaurantId);
  res.json(rezepturen);
}));

// POST /api/inventur/rezepturen
router.post('/rezepturen', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { gericht_id, artikel_id, menge } = req.body;
  if (!gericht_id || !artikel_id || !menge) {
    res.status(400).json({ fehler: 'gericht_id, artikel_id und menge sind Pflichtfelder' }); return;
  }
  if (typeof menge !== 'number' || menge <= 0) {
    res.status(400).json({ fehler: 'menge muss eine positive Zahl sein' }); return;
  }
  const rezeptur = await RezepturModel.erstellen({
    restaurant_id: req.auth!.restaurantId,
    gericht_id, artikel_id, menge,
  });
  res.status(201).json(rezeptur);
}));

// DELETE /api/inventur/rezepturen/:id
router.delete('/rezepturen/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const ergebnis = await RezepturModel.loeschen(req.params.id, req.auth!.restaurantId);
  if (!ergebnis) { res.status(404).json({ fehler: 'Rezeptur nicht gefunden' }); return; }
  res.json({ erfolg: true });
}));

// ════════════════════════════════════════════════
// AUSWERTUNG
// ════════════════════════════════════════════════

// GET /api/inventur/auswertung?tage=30
router.get('/auswertung', asyncHandler(async (req: AuthRequest, res: Response) => {
  const tage = parseInt(req.query.tage as string) || 30;
  const auswertung = await InventurAuswertungModel.verbrauch(req.auth!.restaurantId, tage);
  res.json(auswertung);
}));

// ════════════════════════════════════════════════
// LIEFERANTEN-BESTELLANFRAGE
// ════════════════════════════════════════════════

// POST /api/inventur/bestellanfrage
// Admin bestätigt → Email geht direkt an den Lieferanten
// Body: { artikel: [{ id, bestellmenge }], notiz? }
router.post('/bestellanfrage', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { artikel, notiz } = req.body as {
    artikel: { id: string; bestellmenge: number }[];
    notiz?: string;
  };

  if (!Array.isArray(artikel) || artikel.length === 0) {
    res.status(400).json({ fehler: 'artikel (Array) ist ein Pflichtfeld' }); return;
  }

  // Restaurant-Infos für den Absender-Block laden
  const restaurant = await q1<{ name: string; email: string | null; telefon: string | null }>(
    `SELECT name, email, telefon FROM restaurants WHERE id = $1`,
    [req.auth!.restaurantId]
  );
  if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

  // Alle Artikel + ihren Lieferanten laden
  const artikelMitDaten = await Promise.all(
    artikel.map(async ({ id, bestellmenge }) => {
      const a = await q1<{
        id: string; name: string; einheit: string; aktueller_bestand: number;
        lieferant_id: string | null;
      }>(
        `SELECT id, name, einheit, aktueller_bestand, lieferant_id
         FROM inventar_artikel WHERE id = $1 AND restaurant_id = $2`,
        [id, req.auth!.restaurantId]
      );
      if (!a) return null;
      return { ...a, bestellmenge };
    })
  );

  const gueltig = artikelMitDaten.filter(Boolean) as (typeof artikelMitDaten[0] & {})[];

  // Nach Lieferant gruppieren — jeder Lieferant bekommt eine separate Email
  const nachLieferant = new Map<string, { lieferantId: string; artikel: typeof gueltig }>();
  const ohneEmail: string[] = [];

  for (const a of gueltig) {
    if (!a!.lieferant_id) { ohneEmail.push(a!.name); continue; }
    const gruppe = nachLieferant.get(a!.lieferant_id) ?? { lieferantId: a!.lieferant_id, artikel: [] };
    gruppe.artikel.push(a);
    nachLieferant.set(a!.lieferant_id, gruppe);
  }

  const gesendetAn: string[] = [];

  for (const { lieferantId, artikel: liefArtikel } of nachLieferant.values()) {
    const lieferant = await q1<{ name: string; kontakt_email: string | null }>(
      `SELECT name, kontakt_email FROM lieferanten WHERE id = $1 AND restaurant_id = $2`,
      [lieferantId, req.auth!.restaurantId]
    );
    if (!lieferant?.kontakt_email) {
      ohneEmail.push(...liefArtikel.map(a => a!.name));
      continue;
    }

    await lieferantenBestellungSenden({
      lieferantEmail:    lieferant.kontakt_email,
      lieferantName:     lieferant.name,
      restaurantName:    restaurant.name,
      restaurantEmail:   restaurant.email,
      restaurantTelefon: restaurant.telefon,
      artikel: liefArtikel.map(a => ({
        name:              a!.name,
        einheit:           a!.einheit,
        bestellmenge:      a!.bestellmenge,
        aktueller_bestand: a!.aktueller_bestand,
      })),
      notiz: notiz ?? null,
    });

    gesendetAn.push(lieferant.kontakt_email);
  }

  res.json({
    erfolg: true,
    gesendet_an: gesendetAn,
    ohne_email: ohneEmail,  // Artikel ohne Lieferant oder ohne Email-Adresse
  });
}));

export default router;
