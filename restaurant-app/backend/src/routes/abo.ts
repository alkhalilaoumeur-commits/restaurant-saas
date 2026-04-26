/**
 * /api/abo — Abo-Verwaltung + Stripe-Subscriptions + Rabattcodes
 *
 * Öffentliche Routen:
 *   POST /api/abo/webhook         — Stripe ruft das nach jeder Zahlung auf
 *
 * Authentifizierte Routen (Admin):
 *   GET  /api/abo/status          — Abo-Status + Zahlungshistorie
 *   POST /api/abo/checkout        — Stripe Checkout Session erstellen
 *   POST /api/abo/rabattcode/pruefen — Code prüfen via Stripe API
 *   POST /api/abo/kuendigen        — Abo zum Periodenende kündigen
 *   POST /api/abo/portal          — Stripe Customer Portal Session (Self-Service)
 */

import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { requireAuth, requireRolle, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AboModel } from '../models/Abo';
import { RestaurantModel } from '../models/Restaurant';
import { q } from '../models/db';
import { maxMitarbeiterFuerPlan } from '../services/plan-limits';

const router = Router();

function getStripe(): InstanceType<typeof Stripe> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_test_HIER')) {
    throw new Error('STRIPE_SECRET_KEY fehlt in .env — Zahlungen nicht konfiguriert');
  }
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' as never });
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Price IDs aus .env — werden im Stripe Dashboard verwaltet
const PLAN_PRICE_IDS: Record<string, string> = {
  basis:    process.env.STRIPE_PRICE_BASIS    ?? '',
  standard: process.env.STRIPE_PRICE_STANDARD ?? '',
  pro:      process.env.STRIPE_PRICE_PRO      ?? '',
};

const PLAN_PREISE: Record<string, { cent: number; label: string }> = {
  basis:    { cent: 1900, label: 'Basis' },
  standard: { cent: 3900, label: 'Standard' },
  pro:      { cent: 6900, label: 'Pro' },
};

// ─── Hilfsfunktion: Abo per Subscription-ID aktualisieren ────────────────────
async function aboPerSubscriptionAktualisieren(
  subscriptionId: string,
  status: 'active' | 'cancelled' | 'expired',
  plan?: string,
): Promise<void> {
  // Wenn Plan mit-uebergeben → max_mitarbeiter spiegeln
  const limit = plan ? maxMitarbeiterFuerPlan(plan) : null;
  await q(
    `UPDATE restaurants
     SET abo_status = $1,
         abo_plan   = COALESCE($2, abo_plan),
         max_mitarbeiter = COALESCE($4, max_mitarbeiter),
         abo_laeuft_bis = CASE
           WHEN $1 = 'active' THEN NOW() + INTERVAL '32 days'
           ELSE abo_laeuft_bis
         END
     WHERE stripe_subscription_id = $3`,
    [status, plan ?? null, subscriptionId, limit],
  );
}

// ─── 1. Webhook (Stripe → Backend) ───────────────────────────────────────────
router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) { res.status(400).send('Fehlende Stripe-Signatur'); return; }

    const stripe = getStripe();
    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
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

    switch (event.type) {
      // Checkout erfolgreich abgeschlossen → Abo in DB aktivieren
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as { id: string; mode: string; subscription: string | { id: string } | null; customer: string | null; amount_total: number | null; metadata: Record<string, string> };
        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;
          const meta = session.metadata ?? {};
          const plan = meta.plan ?? 'basis';

          // subscription_id + customer_id am Restaurant speichern
          // max_mitarbeiter wird aus dem Plan abgeleitet (Single Source of Truth: plan-limits.ts)
          await q(
            `UPDATE restaurants
             SET stripe_subscription_id = $1,
                 stripe_customer_id     = $2,
                 abo_status             = 'active',
                 abo_plan               = $3,
                 max_mitarbeiter        = $5,
                 abo_laeuft_bis         = NOW() + INTERVAL '32 days'
             WHERE id = $4`,
            [subscriptionId, session.customer, plan, meta.restaurant_id, maxMitarbeiterFuerPlan(plan)],
          );

          await AboModel.zahlungAnlegen({
            restaurant_id:     meta.restaurant_id,
            stripe_session_id: session.id,
            betrag_cent:       session.amount_total ?? PLAN_PREISE[plan]?.cent ?? 0,
            monate:            1,
            plan,
            rabattcode:        meta.rabattcode || null,
          });
          await AboModel.zahlungAbschliessen(session.id);
        }
        break;
      }

      // Monatliche Zahlung erfolgreich → Laufzeit verlängern
      case 'invoice.paid': {
        const invoice = event.data.object as unknown as { subscription: string | { id: string } | null };
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id: string } | null)?.id;
        if (subId) {
          await q(
            `UPDATE restaurants
             SET abo_status      = 'active',
                 abo_laeuft_bis  = NOW() + INTERVAL '32 days'
             WHERE stripe_subscription_id = $1`,
            [subId],
          );
        }
        break;
      }

      // Zahlung fehlgeschlagen → Status auf 'payment_failed' setzen
      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as { subscription: string | { id: string } | null };
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : (invoice.subscription as { id: string } | null)?.id;
        if (subId) {
          await q(
            `UPDATE restaurants SET abo_status = 'payment_failed'
             WHERE stripe_subscription_id = $1`,
            [subId],
          );
        }
        break;
      }

      // Abo gekündigt (sofort oder zum Periodenende abgelaufen)
      case 'customer.subscription.deleted': {
        const sub = event.data.object as unknown as { id: string };
        await aboPerSubscriptionAktualisieren(sub.id, 'cancelled');
        break;
      }

      // Plan-Wechsel (Upgrade/Downgrade) — Mitarbeiter-Limit gleich mitziehen
      case 'customer.subscription.updated': {
        const sub = event.data.object as unknown as { id: string; items?: { data?: Array<{ price?: { id?: string } }> } };
        const priceId = sub.items?.data?.[0]?.price?.id;
        const neuerPlan = Object.entries(PLAN_PRICE_IDS).find(([, id]) => id === priceId)?.[0];
        if (neuerPlan) {
          await q(
            `UPDATE restaurants SET abo_plan = $1, max_mitarbeiter = $2 WHERE stripe_subscription_id = $3`,
            [neuerPlan, maxMitarbeiterFuerPlan(neuerPlan), sub.id],
          );
        }
        break;
      }
    }

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

// ─── 3. Rabattcode prüfen ────────────────────────────────────────────────────
router.post(
  '/rabattcode/pruefen',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code, plan: planInput } = req.body as { code: string; plan?: string };
    if (!code) { res.status(400).json({ fehler: 'Code fehlt' }); return; }

    const plan = (planInput && PLAN_PREISE[planInput]) ? planInput : 'basis';
    const planPreis = PLAN_PREISE[plan].cent;

    const stripe = getStripe();
    // Stripe v2026: Coupon liegt unter promotion.coupon, muss explizit expandiert werden
    const promoCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.promotion.coupon'],
    });

    type PromoEntry = {
      id: string;
      code: string;
      promotion: {
        coupon: {
          valid: boolean;
          percent_off: number | null;
          amount_off: number | null;
          duration: 'forever' | 'once' | 'repeating';
          duration_in_months: number | null;
        };
      };
    };
    const promoEntry = promoCodes.data[0] as unknown as PromoEntry | undefined;

    if (!promoEntry || !promoEntry.promotion?.coupon?.valid) {
      res.status(404).json({ fehler: 'Ungültiger oder abgelaufener Code' });
      return;
    }

    const coupon = promoEntry.promotion.coupon;
    const rabattProzent = coupon.percent_off ?? 0;

    // Monate-Anzahl direkt aus Stripe ableiten (statt Custom-Metadata):
    //   once      → einmalig (1 Monat)
    //   repeating → so viele Monate wie im Coupon hinterlegt
    //   forever   → unbegrenzt (zeigen wir als 0 = "dauerhaft")
    const monate =
      coupon.duration === 'once'      ? 1 :
      coupon.duration === 'repeating' ? (coupon.duration_in_months ?? 1) :
      0;

    const rabattBetrag = Math.floor(planPreis * (rabattProzent / 100));

    res.json({
      gueltig:        true,
      code:           promoEntry.code,
      rabatt_prozent: rabattProzent,
      monate,
      dauer:          coupon.duration,
      original_cent:  planPreis,
      rabatt_cent:    rabattBetrag,
      endpreis_cent:  planPreis - rabattBetrag,
    });
  }),
);

// ─── 4. Checkout — Stripe Subscription erstellen ─────────────────────────────
router.post(
  '/checkout',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
    if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

    const { rabattcode: codeInput, plan: planInput } = req.body as { rabattcode?: string; plan?: string };
    const plan = (planInput && PLAN_PRICE_IDS[planInput]) ? planInput : 'basis';
    const priceId = PLAN_PRICE_IDS[plan];

    if (!priceId) {
      res.status(500).json({ fehler: `Kein Price ID für Plan "${plan}" konfiguriert` });
      return;
    }

    let promoCodeId: string | null = null;
    let verwendeterCode: string | null = null;

    if (codeInput) {
      const stripe = getStripe();
      const promoCodes = await stripe.promotionCodes.list({
        code: codeInput.trim().toUpperCase(),
        active: true,
        limit: 1,
        expand: ['data.promotion.coupon'],
      });

      type PromoEntry2 = {
        id: string;
        code: string;
        promotion: { coupon: { valid: boolean } };
      };
      const promoCode = promoCodes.data[0] as unknown as PromoEntry2 | undefined;

      if (!promoCode || !promoCode.promotion?.coupon?.valid) {
        res.status(400).json({ fehler: 'Ungültiger oder abgelaufener Rabattcode' });
        return;
      }

      promoCodeId     = promoCode.id;
      verwendeterCode = promoCode.code;
    }

    const stripe = getStripe();

    // Bestehenden Stripe Customer wiederverwenden — oder neu anlegen mit product-Tag
    const restaurantRaw = restaurant as unknown as Record<string, unknown>;
    let customerId = restaurantRaw.stripe_customer_id as string | undefined;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        name: restaurant.name,
        metadata: {
          product:       'serveflow',
          restaurant_id: req.auth!.restaurantId,
        },
      });
      customerId = newCustomer.id;
      await q(
        `UPDATE restaurants SET stripe_customer_id = $1 WHERE id = $2`,
        [customerId, req.auth!.restaurantId],
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/einstellungen?abo=success`,
      cancel_url:  `${FRONTEND_URL}/einstellungen?abo=cancelled`,
      metadata: {
        restaurant_id: req.auth!.restaurantId,
        plan,
        rabattcode:    verwendeterCode ?? '',
        product:       'serveflow',
      },
      subscription_data: {
        metadata: {
          product:       'serveflow',
          restaurant_id: req.auth!.restaurantId,
          plan,
        },
      },
      ...(promoCodeId
        ? { discounts: [{ promotion_code: promoCodeId }] }
        : { allow_promotion_codes: true }),
    } as Parameters<typeof stripe.checkout.sessions.create>[0]);

    res.json({ redirect_url: session.url });
  }),
);

// ─── 6. Customer Portal — Self-Service für Kunden ────────────────────────────
router.post(
  '/portal',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
    if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

    const restaurantRaw = restaurant as unknown as Record<string, unknown>;
    const customerId = restaurantRaw.stripe_customer_id as string | undefined;

    if (!customerId) {
      res.status(400).json({ fehler: 'Kein Stripe-Kunde — bitte erst Abo abschließen' });
      return;
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${FRONTEND_URL}/einstellungen?tab=abo`,
    });

    res.json({ redirect_url: session.url });
  }),
);

// ─── 5. Abo kündigen ─────────────────────────────────────────────────────────
router.post(
  '/kuendigen',
  requireAuth,
  requireRolle('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const restaurant = await RestaurantModel.nachId(req.auth!.restaurantId);
    if (!restaurant) { res.status(404).json({ fehler: 'Restaurant nicht gefunden' }); return; }

    const restaurantRaw = restaurant as unknown as Record<string, unknown>;
    const subscriptionId = restaurantRaw.stripe_subscription_id as string | undefined;

    if (!subscriptionId) {
      res.status(400).json({ fehler: 'Kein aktives Abo gefunden' });
      return;
    }

    const stripe = getStripe();
    // cancel_at_period_end: true = Abo läuft bis Periodenende, dann Kündigung
    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

    res.json({ erfolg: true, nachricht: 'Abo wird zum Ende der aktuellen Periode gekündigt.' });
  }),
);

export default router;
