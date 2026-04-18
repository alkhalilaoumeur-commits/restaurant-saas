import { Router, Response } from 'express';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { KssModel, KssAnbieter } from '../models/KssKonfiguration';
import { kssVerbindungTesten } from '../services/kss';

const router = Router();

const ERLAUBTE_ANBIETER: KssAnbieter[] = ['deaktiviert', 'generic_webhook', 'orderbird', 'ready2order', 'sumup'];

// ──────────────────────────────────────────────────────────
// GET /api/kss/konfiguration
// Aktuelle KSS-Konfiguration laden (ohne API-Key im Klartext)
// Nur Admins dürfen das sehen
// ──────────────────────────────────────────────────────────
router.get('/konfiguration',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const konfig = await KssModel.laden(req.auth!.restaurantId);

    if (!konfig) {
      // Noch keine Konfiguration → Standardwerte zurückgeben
      res.json({ anbieter: 'deaktiviert', webhook_url: null, aktiv: false, hat_api_key: false });
      return;
    }

    res.json(konfig);
  })
);

// ──────────────────────────────────────────────────────────
// POST /api/kss/konfiguration
// Konfiguration speichern (anlegen oder aktualisieren)
// Body: { anbieter, webhook_url?, api_key?, aktiv? }
// ──────────────────────────────────────────────────────────
router.post('/konfiguration',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { anbieter, webhook_url, api_key, aktiv } = req.body;

    if (!anbieter || !ERLAUBTE_ANBIETER.includes(anbieter)) {
      res.status(400).json({ fehler: `Ungültiger Anbieter. Erlaubt: ${ERLAUBTE_ANBIETER.join(', ')}` });
      return;
    }

    // Webhook-URL Pflichtfeld für generic_webhook
    if (anbieter === 'generic_webhook' && !webhook_url) {
      res.status(400).json({ fehler: 'Webhook-URL ist für generic_webhook erforderlich' });
      return;
    }

    // API-Key Pflichtfeld für orderbird und ready2order (wenn noch keiner gespeichert)
    if ((anbieter === 'orderbird' || anbieter === 'ready2order') && !api_key) {
      const bestehend = await KssModel.laden(req.auth!.restaurantId);
      if (!bestehend?.hat_api_key) {
        res.status(400).json({ fehler: `API-Key für ${anbieter} ist erforderlich` });
        return;
      }
    }

    const konfig = await KssModel.speichern(req.auth!.restaurantId, {
      anbieter,
      webhook_url: webhook_url || null,
      api_key: api_key || null,
      aktiv: aktiv !== undefined ? aktiv : true,
    });

    res.json(konfig);
  })
);

// ──────────────────────────────────────────────────────────
// POST /api/kss/test
// Sendet eine Test-Bestellung an den konfigurierten Endpunkt
// Gibt sofort Ergebnis zurück (Erfolg / Fehler)
// ──────────────────────────────────────────────────────────
router.post('/test',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const ergebnis = await kssVerbindungTesten(req.auth!.restaurantId);
    res.json(ergebnis);
  })
);

// ──────────────────────────────────────────────────────────
// GET /api/kss/log
// Letzte Push-Versuche einsehen (max. 50 Einträge)
// ──────────────────────────────────────────────────────────
router.get('/log',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string || '50', 10), 100);
    const logs = await KssModel.logLaden(req.auth!.restaurantId, limit);
    const fehlerInFolge = await KssModel.letzteFehlerAnzahl(req.auth!.restaurantId);

    res.json({ logs, fehler_in_folge: fehlerInFolge });
  })
);

export default router;
