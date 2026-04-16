import { Router, Request, Response } from 'express';
import { BewertungModel } from '../models/Bewertung';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { bewertungsAnfrageSenden } from '../services/email';

const router = Router();

// ────────────────────────────────────────────────
// GET /api/bewertungen/public/:token
// Öffentlich: Bewertungsseite laden (Restaurant-Name, ob schon bewertet)
// ────────────────────────────────────────────────
router.get('/public/:token', asyncHandler(async (req: Request, res: Response) => {
  const bewertung = await BewertungModel.nachToken(req.params.token);

  if (!bewertung) {
    res.status(404).json({ fehler: 'Bewertungslink nicht gefunden' });
    return;
  }

  // Nur sichere Felder zurückgeben — kein gast_email etc.
  res.json({
    gast_name: bewertung.gast_name,
    restaurant_name: bewertung.restaurant_name,
    status: bewertung.status,
    stern: bewertung.stern,
    kommentar: bewertung.kommentar,
    antwort_text: bewertung.antwort_text,
    google_bewertungs_link: bewertung.google_bewertungs_link,
  });
}));

// ────────────────────────────────────────────────
// POST /api/bewertungen/public/:token
// Öffentlich: Bewertung abgeben (einmalig, token wird danach als 'abgeschlossen' markiert)
// ────────────────────────────────────────────────
router.post('/public/:token', asyncHandler(async (req: Request, res: Response) => {
  const { stern, kommentar, dsgvo_einwilligung } = req.body;

  if (!stern || typeof stern !== 'number' || stern < 1 || stern > 5) {
    res.status(400).json({ fehler: 'Stern muss eine Zahl zwischen 1 und 5 sein' });
    return;
  }

  if (!dsgvo_einwilligung) {
    res.status(400).json({ fehler: 'DSGVO-Einwilligung ist erforderlich' });
    return;
  }

  const bewertung = await BewertungModel.bewertungAbgeben(req.params.token, {
    stern,
    kommentar: kommentar || null,
    dsgvo_einwilligung: true,
  });

  if (!bewertung) {
    // Null = Token existiert nicht ODER wurde schon bewertet
    res.status(409).json({ fehler: 'Dieser Bewertungslink wurde bereits verwendet oder ist ungültig' });
    return;
  }

  // Nachdem bewertet: Google-Link mitschicken falls vorhanden (für Weiterleitung bei 4-5★)
  const mitRestaurant = await BewertungModel.nachToken(req.params.token);
  res.json({
    erfolg: true,
    stern: bewertung.stern,
    google_bewertungs_link: stern >= 4 ? mitRestaurant?.google_bewertungs_link : null,
  });
}));

// ────────────────────────────────────────────────
// POST /api/bewertungen/anfrage
// Admin: Bewertungs-E-Mail manuell an einen Gast senden
// Beispiel: nach Reservierung manuell auslösen
// ────────────────────────────────────────────────
router.post('/anfrage', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { gast_name, gast_email, buchungs_id } = req.body;
  const restaurant_id = req.auth!.restaurantId;

  if (!gast_name || !gast_email) {
    res.status(400).json({ fehler: 'gast_name und gast_email sind erforderlich' });
    return;
  }

  // E-Mail-Format prüfen
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gast_email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }

  const bewertung = await BewertungModel.erstellen({
    restaurant_id,
    buchungs_id: buchungs_id || null,
    gast_name,
    gast_email,
  });

  // E-Mail feuern (fire-and-forget)
  bewertungsAnfrageSenden(gast_email, gast_name, bewertung.token)
    .catch(err => console.error('[Bewertung] E-Mail Fehler:', err));

  res.status(201).json({ erfolg: true, bewertung_id: bewertung.id });
}));

// ────────────────────────────────────────────────
// GET /api/bewertungen
// Admin: Alle Bewertungen des eigenen Restaurants
// ────────────────────────────────────────────────
router.get('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const bewertungen = await BewertungModel.alleNachRestaurant(req.auth!.restaurantId);
  res.json(bewertungen);
}));

// ────────────────────────────────────────────────
// GET /api/bewertungen/stats
// Admin: Statistiken (Durchschnitt, Verteilung, Anzahl)
// ────────────────────────────────────────────────
router.get('/stats', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await BewertungModel.stats(req.auth!.restaurantId);
  res.json(stats);
}));

// ────────────────────────────────────────────────
// POST /api/bewertungen/:id/antwort
// Admin: Auf eine Bewertung antworten
// ────────────────────────────────────────────────
router.post('/:id/antwort', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { antwort_text } = req.body;

  if (!antwort_text || typeof antwort_text !== 'string' || antwort_text.trim().length === 0) {
    res.status(400).json({ fehler: 'antwort_text darf nicht leer sein' });
    return;
  }

  const bewertung = await BewertungModel.antwortSpeichern(
    req.params.id,
    req.auth!.restaurantId,
    antwort_text.trim()
  );

  if (!bewertung) {
    res.status(404).json({ fehler: 'Bewertung nicht gefunden' });
    return;
  }

  res.json({ erfolg: true, bewertung });
}));

export default router;
