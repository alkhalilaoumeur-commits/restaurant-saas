/**
 * /api/abo — Abo-Verwaltung + Stripe-Zahlungen + Rabattcodes
 *
 * Öffentliche Routen:
 *   POST /api/abo/webhook         — Stripe ruft das nach jeder Zahlung auf
 *
 * Authentifizierte Routen (Admin):
 *   GET  /api/abo/status          — Abo-Status + Zahlungshistorie
 *   POST /api/abo/checkout        — Stripe Checkout Session erstellen
 *   POST /api/abo/rabattcode/pruefen — Code prüfen (gibt Preis zurück)
 *
 * Admin-only (Rabattcode-Verwaltung):
 *   GET    /api/abo/rabattcodes        — alle Codes
 *   POST   /api/abo/rabattcodes        — neuen Code erstellen
 *   PATCH  /api/abo/rabattcodes/:id    — aktivieren/deaktivieren
 *   DELETE /api/abo/rabattcodes/:id    — löschen
 */

import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AboModel } from '../models/Abo';
import { RestaurantModel } from '../models/Restaurant';

const router = Router();

// Stripe wird erst beim ersten echten API-Call initialisiert (lazy).
// So startet der Backend auch ohne STRIPE_SECRET_KEY in der .env.
function getStripe(): InstanceType<typeof Stripe> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_test_HIER')) {
    throw new Error('STRIPE_SECRET_KEY fehlt in .env — Zahlungen nicht konfiguriert');
  }
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' as never });
}

const FRONTEND_URL   = process.env.FRONTEND_URL   || 'http://localhost:5173';
const ABO_PREIS_CENT = parseInt(process.env.ABO_PREIS_CENT || '4900', 10); // €49,00

// ─── 1. Webhook (Stripe → Backend) ───────────────────────────────────────────
// Stripe schickt POST mit JSON-Body + Header "stripe-signature".
// Der Body kommt als raw Buffer an (weil in server.ts express.raw() davor steht).
// Wir verifizieren die Signatur — ohne das könnte jeder fake Webhooks schicken.
router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      res.status(400).send('Fehlende Stripe-Signatur');
      return;
    }

    const stripe = getStripe();
    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
      // constructEvent prüft: Inhalt + Signatur + Timestamp (verhindert Replay-Angriffe)
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error('[Abo Webhook] Signatur-Fehler:', err);
      res.status(400).send('Webhook-Signatur ungültig');
      return;
    }

    // Nur checkout.session.completed interessiert uns — das bedeutet: Zahlung erfolgreich
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { id: string; payment_status: string };

      if (session.payment_status === 'paid') {
        await AboModel.zahlungAbschliessen(session.id);
      }
    }

    // Stripe erwartet immer 200 — sonst versucht Stripe es stundenlang erneut
    res.json({ received: true });
  }),
);

// ─── 2. Abo-Status abrufen ───────────────────────────────────────────────────
router.get(
  '/status',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
    if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

    const zahlungen = await AboModel.zahlungenNachRestaurant(req.auth!.restaurantId);

    res.json({
      abo_status:     restaurant.abo_status,
      abo_laeuft_bis: (restaurant as unknown as Record<string, unknown>).abo_laeuft_bis ?? null,
      preis_cent:     ABO_PREIS_CENT,
      zahlungen,
    });
  }),
);

// ─── 3. Rabattcode prüfen ────────────────────────────────────────────────────
router.post(
  '/rabattcode/pruefen',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code } = req.body as { code: string };
    if (!code) { res.status(400).json({ fehler: 'Code fehlt' }); return; }

    const rabattcode = await AboModel.rabattcodePruefen(code);
    if (!rabattcode) {
      res.status(404).json({ fehler: 'Ungültiger oder abgelaufener Code' });
      return;
    }

    const rabattBetrag = Math.floor(ABO_PREIS_CENT * (rabattcode.rabatt_prozent / 100));
    const endpreisCent = ABO_PREIS_CENT - rabattBetrag;

    res.json({
      gueltig:        true,
      code:           rabattcode.code,
      rabatt_prozent: rabattcode.rabatt_prozent,
      monate:         rabattcode.monate,
      original_cent:  ABO_PREIS_CENT,
      rabatt_cent:    rabattBetrag,
      endpreis_cent:  endpreisCent,
    });
  }),
);

// ─── 4. Checkout — Stripe Checkout Session erstellen ─────────────────────────
// Stripe Checkout: Wir erstellen eine Session, bekommen eine URL zurück,
// und leiten den User dorthin weiter. Stripe hostet die Zahlungsseite.
// Nach Zahlung redirectet Stripe zurück zu success_url.
router.post(
  '/checkout',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
    if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

    const { rabattcode: codeInput } = req.body as { rabattcode?: string };

    let endpreisCent = ABO_PREIS_CENT;
    let monate = 1;
    let verwendeterCode: string | null = null;

    // Rabattcode anwenden
    if (codeInput) {
      const rabattcode = await AboModel.rabattcodePruefen(codeInput);
      if (!rabattcode) {
        res.status(400).json({ fehler: 'Ungültiger oder abgelaufener Rabattcode' });
        return;
      }
      const rabattBetrag = Math.floor(ABO_PREIS_CENT * (rabattcode.rabatt_prozent / 100));
      endpreisCent    = ABO_PREIS_CENT - rabattBetrag;
      monate          = rabattcode.monate;
      verwendeterCode = rabattcode.code;
    }

    // 100% Rabatt → kein Stripe nötig, direkt aktivieren
    if (endpreisCent === 0) {
      if (verwendeterCode) await AboModel.rabattcodeNutzen(verwendeterCode);

      const fakeId = `gratis_${Date.now()}`;
      await AboModel.zahlungAnlegen({
        restaurant_id:     req.auth!.restaurantId,
        stripe_session_id: fakeId,
        betrag_cent:       0,
        monate,
        rabattcode:        verwendeterCode,
      });
      await AboModel.zahlungAbschliessen(fakeId);

      res.json({ gratis: true, redirect_url: `${FRONTEND_URL}/einstellungen?abo=success` });
      return;
    }

    // Stripe Checkout Session erstellen
    // metadata wird im Webhook zurückgegeben → wir wissen welches Restaurant bezahlt hat
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: endpreisCent, // Stripe erwartet Cent (z.B. 4900 = €49,00)
            product_data: {
              name: `ServeFlow Abo – ${restaurant.name}`,
              description: `${monate} Monat${monate > 1 ? 'e' : ''} Zugang zu ServeFlow`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/einstellungen?abo=success`,
      cancel_url:  `${FRONTEND_URL}/einstellungen?abo=cancelled`,
      metadata: {
        restaurant_id:  req.auth!.restaurantId,
        monate:         String(monate),
        rabattcode:     verwendeterCode ?? '',
      },
      // Stripe zeigt E-Mail-Feld an — optional, aber gut für den Kunden
      customer_email: undefined,
    });

    // Zahlung in DB vormerken (Status: open) — wird nach Webhook auf paid gesetzt
    await AboModel.zahlungAnlegen({
      restaurant_id:     req.auth!.restaurantId,
      stripe_session_id: session.id,
      betrag_cent:       endpreisCent,
      monate,
      rabattcode:        verwendeterCode,
    });

    // Rabattcode-Nutzungszähler erhöhen
    if (verwendeterCode) await AboModel.rabattcodeNutzen(verwendeterCode);

    res.json({ redirect_url: session.url });
  }),
);

// ─── 5. Rabattcode-Verwaltung (Admin) ────────────────────────────────────────

router.get(
  '/rabattcodes',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const codes = await AboModel.alleRabattcodes();
    res.json(codes);
  }),
);

router.post(
  '/rabattcodes',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code, rabatt_prozent, monate, max_nutzungen, gueltig_bis } = req.body as {
      code: string;
      rabatt_prozent: number;
      monate: number;
      max_nutzungen?: number | null;
      gueltig_bis?: string | null;
    };

    if (!code || typeof rabatt_prozent !== 'number' || rabatt_prozent < 0 || rabatt_prozent > 100) {
      res.status(400).json({ fehler: 'Ungültige Eingabe: Code + Rabatt 0–100 erforderlich' });
      return;
    }
    if (!monate || monate < 1) {
      res.status(400).json({ fehler: 'Monate muss mindestens 1 sein' });
      return;
    }

    const neuerCode = await AboModel.rabattcodeErstellen({
      code,
      rabatt_prozent,
      monate,
      max_nutzungen: max_nutzungen ?? null,
      gueltig_bis:   gueltig_bis ?? null,
    });

    res.status(201).json(neuerCode);
  }),
);

router.patch(
  '/rabattcodes/:id',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { aktiv } = req.body as { aktiv: boolean };
    await AboModel.rabattcodeToggle(req.params.id, aktiv);
    res.json({ ok: true });
  }),
);

router.delete(
  '/rabattcodes/:id',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await AboModel.rabattcodeLoeschen(req.params.id);
    res.json({ ok: true });
  }),
);

export default router;
