/**
 * /api/abo — Abo-Verwaltung + Stripe-Zahlungen + Rabattcodes
 *
 * Öffentliche Routen:
 *   POST /api/abo/webhook         — Stripe ruft das nach jeder Zahlung auf
 *
 * Authentifizierte Routen (Admin):
 *   GET  /api/abo/status          — Abo-Status + Zahlungshistorie
 *   POST /api/abo/checkout        — Stripe Checkout Session erstellen
 *   POST /api/abo/rabattcode/pruefen — Code prüfen via Stripe API (gibt Preis zurück)
 *
 * Rabattcodes werden direkt im Stripe Dashboard erstellt (Produkte → Gutscheine).
 * Metadata-Feld "monate" am Coupon bestimmt die Abo-Laufzeit (Standard: 1).
 */

import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AboModel } from '../models/Abo';
import { RestaurantModel } from '../models/Restaurant';
import { ErlebnisModel } from '../models/ErlebnisModel';

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

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const PLAN_PREISE: Record<string, { cent: number; label: string }> = {
  basis:    { cent: 1900, label: 'Basis' },
  standard: { cent: 3900, label: 'Standard' },
  pro:      { cent: 6900, label: 'Pro' },
};

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
        const meta = (session as unknown as { metadata?: Record<string, string> }).metadata ?? {};
        if (meta.typ === 'erlebnis') {
          await ErlebnisModel.buchungBezahlen(session.id);
        } else {
          await AboModel.zahlungAbschliessen(session.id);
        }
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
      abo_plan:       restaurant.abo_plan,
      abo_laeuft_bis: (restaurant as unknown as Record<string, unknown>).abo_laeuft_bis ?? null,
      plan_preise:    PLAN_PREISE,
      zahlungen,
    });
  }),
);

// ─── 3. Rabattcode prüfen (via Stripe API) ───────────────────────────────────
// Stripe Promotion Code lookup: code → promotion_code → coupon → percent_off + metadata.monate
router.post(
  '/rabattcode/pruefen',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code, plan: planInput } = req.body as { code: string; plan?: string };
    if (!code) { res.status(400).json({ fehler: 'Code fehlt' }); return; }

    const plan = (planInput && PLAN_PREISE[planInput]) ? planInput : 'basis';
    const planPreis = PLAN_PREISE[plan].cent;

    const stripe = getStripe();
    const promoCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
    });

    type PromoEntry = { id: string; code: string; coupon: { valid: boolean; percent_off: number | null; metadata: Record<string, string> } };
    const promoEntry = promoCodes.data[0] as unknown as PromoEntry | undefined;

    if (!promoEntry || !promoEntry.coupon.valid) {
      res.status(404).json({ fehler: 'Ungültiger oder abgelaufener Code' });
      return;
    }

    const coupon = promoEntry.coupon;
    const rabattProzent = coupon.percent_off ?? 0;
    const monate = coupon.metadata?.monate ? parseInt(coupon.metadata.monate) : 1;
    const rabattBetrag = Math.floor(planPreis * (rabattProzent / 100));

    res.json({
      gueltig:        true,
      code:           promoEntry.code,
      rabatt_prozent: rabattProzent,
      monate,
      original_cent:  planPreis,
      rabatt_cent:    rabattBetrag,
      endpreis_cent:  planPreis - rabattBetrag,
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

    const { rabattcode: codeInput, plan: planInput } = req.body as { rabattcode?: string; plan?: string };
    const plan = (planInput && PLAN_PREISE[planInput]) ? planInput : 'basis';
    const planPreis = PLAN_PREISE[plan].cent;

    let endpreisCent = planPreis;
    let monate = 1;
    let verwendeterCode: string | null = null;
    let promoCodeId: string | null = null;

    // Rabattcode via Stripe API prüfen
    if (codeInput) {
      const stripe = getStripe();
      const promoCodes = await stripe.promotionCodes.list({
        code: codeInput.trim().toUpperCase(),
        active: true,
        limit: 1,
      });

      type PromoEntry2 = { id: string; code: string; coupon: { valid: boolean; percent_off: number | null; metadata: Record<string, string> } };
      const promoCode = promoCodes.data[0] as unknown as PromoEntry2 | undefined;

      if (!promoCode || !promoCode.coupon.valid) {
        res.status(400).json({ fehler: 'Ungültiger oder abgelaufener Rabattcode' });
        return;
      }

      const coupon = promoCode.coupon;
      const rabattProzent = coupon.percent_off ?? 0;
      monate          = coupon.metadata?.monate ? parseInt(coupon.metadata.monate) : 1;
      const rabattBetrag = Math.floor(planPreis * (rabattProzent / 100));
      endpreisCent    = planPreis - rabattBetrag;
      verwendeterCode = promoCode.code;
      promoCodeId     = promoCode.id;
    }

    // 100% Rabatt → kein Stripe nötig, direkt aktivieren
    if (endpreisCent === 0) {
      const fakeId = `gratis_${Date.now()}`;
      await AboModel.zahlungAnlegen({
        restaurant_id:     req.auth!.restaurantId,
        stripe_session_id: fakeId,
        betrag_cent:       0,
        monate,
        plan,
        rabattcode:        verwendeterCode,
      });
      await AboModel.zahlungAbschliessen(fakeId);
      res.json({ gratis: true, redirect_url: `${FRONTEND_URL}/einstellungen?abo=success` });
      return;
    }

    // Stripe Checkout Session erstellen
    // discounts übergibt Stripe die Promotion Code ID → Stripe wendet Rabatt nativ an
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: planPreis,
            product_data: {
              name: `ServeFlow ${PLAN_PREISE[plan].label} – ${restaurant.name}`,
              description: `${monate} Monat${monate > 1 ? 'e' : ''} ServeFlow ${PLAN_PREISE[plan].label}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/einstellungen?abo=success`,
      cancel_url:  `${FRONTEND_URL}/einstellungen?abo=cancelled`,
      metadata: {
        restaurant_id: req.auth!.restaurantId,
        monate:        String(monate),
        plan,
        rabattcode:    verwendeterCode ?? '',
      },
      ...(promoCodeId ? { discounts: [{ promotion_code: promoCodeId }] } : {}),
    } as Parameters<typeof stripe.checkout.sessions.create>[0]);

    await AboModel.zahlungAnlegen({
      restaurant_id:     req.auth!.restaurantId,
      stripe_session_id: session.id,
      betrag_cent:       endpreisCent,
      monate,
      plan,
      rabattcode:        verwendeterCode,
    });

    res.json({ redirect_url: session.url });
  }),
);

export default router;
