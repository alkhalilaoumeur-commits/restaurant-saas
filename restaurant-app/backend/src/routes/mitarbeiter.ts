import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { MitarbeiterModel } from '../models/Mitarbeiter';
import { RestaurantModel } from '../models/Restaurant';
import { einladungSenden } from '../services/email';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const GUELTIGE_ROLLEN = ['admin', 'kellner', 'kueche'];

// GET /api/mitarbeiter – Alle Mitarbeiter des Restaurants (nur Admin)
router.get('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const mitarbeiter = await MitarbeiterModel.alle(req.auth!.restaurantId);
  res.json(mitarbeiter);
}));

// GET /api/mitarbeiter/ich – Eigene Daten inkl. Stundenlohn (alle Rollen)
// Muss VOR /:id stehen damit Express nicht "ich" als UUID interpretiert
router.get('/ich', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const ma = await MitarbeiterModel.nachId(req.auth!.mitarbeiterId, req.auth!.restaurantId);
  if (!ma) {
    res.status(404).json({ fehler: 'Mitarbeiter nicht gefunden' });
    return;
  }
  res.json(ma);
}));

// POST /api/mitarbeiter – Mitarbeiter einladen (NICHT mehr anlegen mit Passwort!)
// Admin gibt Name + Email + Rolle ein → System schickt Einladungslink → MA setzt eigenes Passwort
router.post('/', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, rolle } = req.body;

  if (!name || !email || !rolle) {
    res.status(400).json({ fehler: 'Name, Email und Rolle sind erforderlich' });
    return;
  }

  if (!GUELTIGE_ROLLEN.includes(rolle)) {
    res.status(400).json({ fehler: 'Ungültige Rolle. Erlaubt: admin, kellner, kueche' });
    return;
  }

  // Email-Format prüfen
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }

  // Mitarbeiter-Limit prüfen
  const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
  if (restaurant) {
    const aktive = await RestaurantModel.aktiveMitarbeiterAnzahl(req.auth!.restaurantId);
    if (aktive >= restaurant.max_mitarbeiter) {
      res.status(403).json({
        fehler: `Mitarbeiter-Limit erreicht (${restaurant.max_mitarbeiter}). Bitte Lizenz upgraden.`,
        limit: restaurant.max_mitarbeiter,
        aktuell: aktive,
      });
      return;
    }
  }

  // Prüfen ob Email schon existiert
  const existiert = await MitarbeiterModel.nachEmail(email.toLowerCase());
  if (existiert) {
    res.status(409).json({ fehler: 'Ein Mitarbeiter mit dieser Email existiert bereits' });
    return;
  }

  // Einladungs-Token generieren (48h gültig)
  const einladungToken = crypto.randomBytes(32).toString('hex');
  const gueltigBis = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 Stunden

  // Mitarbeiter anlegen OHNE Passwort (passwort_hash bleibt NULL bis MA die Einladung annimmt)
  const mitarbeiter = await MitarbeiterModel.einladen({
    restaurant_id: req.auth!.restaurantId,
    name,
    email: email.toLowerCase(),
    rolle,
    einladung_token: einladungToken,
    einladung_gueltig_bis: gueltigBis,
  });

  // Einladungs-Email senden
  const restaurantName = restaurant?.name || 'Restaurant';
  einladungSenden(email, einladungToken, name, restaurantName, rolle).catch((err) =>
    console.error('[Einladung] Email-Fehler:', err)
  );

  res.status(201).json(mitarbeiter);
}));

// POST /api/mitarbeiter/:id/erneut-einladen – Einladung erneut senden
router.post('/:id/erneut-einladen', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const mitarbeiter = await MitarbeiterModel.nachId(req.params.id, req.auth!.restaurantId);
  if (!mitarbeiter) {
    res.status(404).json({ fehler: 'Mitarbeiter nicht gefunden' });
    return;
  }

  // Nur für MA ohne Passwort (= Einladung noch nicht angenommen)
  const vollstaendig = await MitarbeiterModel.nachEmail(mitarbeiter.email);
  if (vollstaendig?.passwort_hash) {
    res.status(400).json({ fehler: 'Dieser Mitarbeiter hat seine Einladung bereits angenommen' });
    return;
  }

  // Neuen Token generieren
  const einladungToken = crypto.randomBytes(32).toString('hex');
  const gueltigBis = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await MitarbeiterModel.einladungErneuern(req.params.id, req.auth!.restaurantId, einladungToken, gueltigBis);

  const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
  einladungSenden(mitarbeiter.email, einladungToken, mitarbeiter.name, restaurant?.name || 'Restaurant', mitarbeiter.rolle).catch((err) =>
    console.error('[Einladung erneut] Email-Fehler:', err)
  );

  res.json({ nachricht: 'Einladung erneut gesendet' });
}));

// PATCH /api/mitarbeiter/:id – Mitarbeiter aktualisieren (Name, Rolle, Aktiv, Stundenlohn)
router.patch('/:id', requireAuth, requireRolle('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, rolle, aktiv, stundenlohn, urlaubsanspruch_tage } = req.body;

  if (rolle !== undefined && !GUELTIGE_ROLLEN.includes(rolle)) {
    res.status(400).json({ fehler: 'Ungültige Rolle. Erlaubt: admin, kellner, kueche' });
    return;
  }

  // Sich selbst nicht deaktivieren
  if (aktiv === false && req.params.id === req.auth!.mitarbeiterId) {
    res.status(400).json({ fehler: 'Du kannst dich nicht selbst deaktivieren' });
    return;
  }

  // Stundenlohn: muss positive Zahl oder null sein
  if (stundenlohn !== undefined && stundenlohn !== null && (isNaN(Number(stundenlohn)) || Number(stundenlohn) < 0)) {
    res.status(400).json({ fehler: 'Stundenlohn muss eine positive Zahl sein' });
    return;
  }

  // Urlaubsanspruch: ganze Zahl zwischen 1 und 365
  if (urlaubsanspruch_tage !== undefined) {
    const tage = Number(urlaubsanspruch_tage);
    if (!Number.isInteger(tage) || tage < 1 || tage > 365) {
      res.status(400).json({ fehler: 'urlaubsanspruch_tage muss eine ganze Zahl zwischen 1 und 365 sein' });
      return;
    }
  }

  const mitarbeiter = await MitarbeiterModel.aktualisieren(req.params.id, req.auth!.restaurantId, {
    name,
    rolle,
    aktiv,
    stundenlohn: stundenlohn !== undefined ? (stundenlohn === null ? null : Number(stundenlohn)) : undefined,
    urlaubsanspruch_tage: urlaubsanspruch_tage !== undefined ? Number(urlaubsanspruch_tage) : undefined,
  });

  if (!mitarbeiter) {
    res.status(404).json({ fehler: 'Mitarbeiter nicht gefunden' });
    return;
  }

  res.json(mitarbeiter);
}));

// PATCH /api/mitarbeiter/:id/passwort – Passwort ändern (nur eigenes oder Admin)
router.patch('/:id/passwort', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { passwort } = req.body;

  // Nur Admins dürfen fremde Passwörter ändern, andere nur ihr eigenes
  if (req.params.id !== req.auth!.mitarbeiterId && req.auth!.rolle !== 'admin') {
    res.status(403).json({ fehler: 'Du kannst nur dein eigenes Passwort ändern' });
    return;
  }

  if (!passwort || passwort.length < 8) {
    res.status(400).json({ fehler: 'Passwort muss mindestens 8 Zeichen lang sein' });
    return;
  }
  if (!/[A-Z]/.test(passwort)) {
    res.status(400).json({ fehler: 'Passwort muss mindestens einen Großbuchstaben enthalten' });
    return;
  }
  if (!/[0-9]/.test(passwort)) {
    res.status(400).json({ fehler: 'Passwort muss mindestens eine Zahl enthalten' });
    return;
  }

  const passwort_hash = await bcrypt.hash(passwort, 12);
  const mitarbeiter = await MitarbeiterModel.passwortAendern(req.params.id, req.auth!.restaurantId, passwort_hash);

  if (!mitarbeiter) {
    res.status(404).json({ fehler: 'Mitarbeiter nicht gefunden' });
    return;
  }

  res.json(mitarbeiter);
}));

export default router;
