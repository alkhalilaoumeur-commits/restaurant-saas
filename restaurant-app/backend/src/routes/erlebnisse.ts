import { Router, Request, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ErlebnisModel } from '../models/ErlebnisModel';

const router = Router();

// ─── Admin: Erlebnisse CRUD ────────────────────────────────────────────────

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const erlebnisse = await ErlebnisModel.alleNachRestaurant(req.auth!.restaurantId);
    res.json(erlebnisse);
  }),
);

router.post(
  '/',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, beschreibung, preis_cent, max_personen, dauer_min, bild_url } = req.body as {
      name: string; beschreibung?: string; preis_cent: number;
      max_personen?: number; dauer_min?: number; bild_url?: string;
    };
    if (!name || preis_cent === undefined || preis_cent < 0) {
      res.status(400).json({ fehler: 'Name und Preis (≥ 0) sind Pflichtfelder' }); return;
    }
    const erlebnis = await ErlebnisModel.erstellen({
      restaurant_id: req.auth!.restaurantId, name, beschreibung,
      preis_cent, max_personen: max_personen ?? 10, dauer_min: dauer_min ?? 120, bild_url,
    });
    res.status(201).json(erlebnis);
  }),
);

router.put(
  '/:id',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const erlebnis = await ErlebnisModel.aktualisieren(req.params.id, req.auth!.restaurantId, req.body);
    if (!erlebnis) { res.status(404).json({ fehler: 'Erlebnis nicht gefunden' }); return; }
    res.json(erlebnis);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await ErlebnisModel.loeschen(req.params.id, req.auth!.restaurantId);
    res.json({ ok: true });
  }),
);

// ─── Admin: Buchungen ──────────────────────────────────────────────────────

router.get(
  '/buchungen',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const buchungen = await ErlebnisModel.buchungenNachRestaurant(req.auth!.restaurantId);
    res.json(buchungen);
  }),
);

router.put(
  '/buchungen/:id/status',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body as { status: string };
    const gueltig = ['ausstehend', 'bezahlt', 'storniert', 'abgeschlossen'];
    if (!gueltig.includes(status)) {
      res.status(400).json({ fehler: 'Ungültiger Status' }); return;
    }
    await ErlebnisModel.buchungStatusAendern(req.params.id, req.auth!.restaurantId, status);
    res.json({ ok: true });
  }),
);

// ─── Public: aktive Erlebnisse eines Restaurants ──────────────────────────

router.get(
  '/public/:restaurantId',
  asyncHandler(async (req: Request, res: Response) => {
    const erlebnisse = await ErlebnisModel.aktiveNachRestaurant(req.params.restaurantId);
    res.json(erlebnisse);
  }),
);

// ─── Public: Buchung per Token abrufen ────────────────────────────────────

router.get(
  '/buchung/:token',
  asyncHandler(async (req: Request, res: Response) => {
    const buchung = await ErlebnisModel.buchungNachToken(req.params.token);
    if (!buchung) { res.status(404).json({ fehler: 'Buchung nicht gefunden' }); return; }
    res.json(buchung);
  }),
);

// ─── Public: Buchen (Zahlung erfolgt vor Ort im Restaurant) ───────────────

router.post(
  '/:id/buchen',
  asyncHandler(async (req: Request, res: Response) => {
    const { gast_name, gast_email, gast_telefon, datum, uhrzeit, personen, anmerkungen } = req.body as {
      gast_name: string; gast_email: string; gast_telefon?: string;
      datum: string; uhrzeit: string; personen: number; anmerkungen?: string;
    };

    if (!gast_name?.trim() || !gast_email?.trim() || !datum || !uhrzeit || !personen) {
      res.status(400).json({ fehler: 'Alle Pflichtfelder ausfüllen' }); return;
    }

    const erlebnis = await ErlebnisModel.nachIdPublic(req.params.id);
    if (!erlebnis) { res.status(404).json({ fehler: 'Erlebnis nicht gefunden' }); return; }

    // Buchung erstellen — Status 'ausstehend' = Vor-Ort-Zahlung offen.
    // Restaurant-Admin setzt nach Bezahlung im Lokal manuell auf 'bezahlt'.
    const buchung = await ErlebnisModel.buchungErstellen({
      restaurant_id: erlebnis.restaurant_id, erlebnis_id: erlebnis.id,
      gast_name: gast_name.trim(), gast_email: gast_email.trim().toLowerCase(),
      gast_telefon, datum, uhrzeit, personen: Number(personen), anmerkungen,
    });
    if (!buchung) { res.status(500).json({ fehler: 'Buchung konnte nicht erstellt werden' }); return; }

    res.json({ buchung_token: buchung.token });
  }),
);

export default router;
