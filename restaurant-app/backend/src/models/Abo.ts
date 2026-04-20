import { q, q1 } from './db';

// ─── Typen ───────────────────────────────────────────────────────────────────

export interface Zahlung {
  id: string;
  restaurant_id: string;
  stripe_session_id: string;
  betrag_cent: number;
  status: 'open' | 'paid' | 'failed' | 'cancelled' | 'expired';
  monate: number;
  plan: 'basis' | 'standard' | 'pro' | null;
  rabattcode: string | null;
  erstellt_am: string;
  bezahlt_am: string | null;
}

// ─── AboModel ────────────────────────────────────────────────────────────────

export const AboModel = {
  // ── Zahlungen ────────────────────────────────────────────────────────────────

  /** Neue offene Zahlung anlegen (bevor Kunde zahlt) */
  async zahlungAnlegen(data: {
    restaurant_id: string;
    stripe_session_id: string;
    betrag_cent: number;
    monate: number;
    plan: string;
    rabattcode: string | null;
  }): Promise<Zahlung> {
    const row = await q1<Zahlung>(
      `INSERT INTO zahlungen (restaurant_id, stripe_session_id, betrag_cent, monate, plan, rabattcode)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.restaurant_id, data.stripe_session_id, data.betrag_cent, data.monate, data.plan, data.rabattcode],
    );
    return row!;
  },

  /** Zahlung auf 'paid' setzen + Restaurant-Abo aktivieren */
  async zahlungAbschliessen(stripe_session_id: string): Promise<void> {
    // 1. Zahlung als bezahlt markieren und Daten holen
    const zahlung = await q1<Zahlung>(
      `UPDATE zahlungen SET status = 'paid', bezahlt_am = NOW()
       WHERE stripe_session_id = $1 AND status = 'open'
       RETURNING *`,
      [stripe_session_id],
    );
    if (!zahlung) return; // Bereits verarbeitet (Stripe schickt Webhooks manchmal doppelt)

    // 2. Restaurant-Abo verlängern + Plan setzen
    //    Wenn bereits aktiv und noch nicht abgelaufen → vom aktuellen Datum weiterzählen
    //    Wenn abgelaufen/neu → ab jetzt zählen
    await q(
      `UPDATE restaurants
       SET abo_status = 'active',
           abo_plan = COALESCE($3, abo_plan),
           abo_laeuft_bis = GREATEST(NOW(), COALESCE(abo_laeuft_bis, NOW())) + ($1 * INTERVAL '30 days')
       WHERE id = $2`,
      [zahlung.monate, zahlung.restaurant_id, zahlung.plan],
    );
  },

  /** Zahlung auf einen Fehlerstatus setzen */
  async zahlungFehlschlag(stripe_session_id: string, status: 'failed' | 'cancelled' | 'expired'): Promise<void> {
    await q(
      `UPDATE zahlungen SET status = $1 WHERE stripe_session_id = $2`,
      [status, stripe_session_id],
    );
  },

  /** Zahlungshistorie eines Restaurants */
  async zahlungenNachRestaurant(restaurant_id: string): Promise<Zahlung[]> {
    return q<Zahlung>(
      `SELECT * FROM zahlungen WHERE restaurant_id = $1 ORDER BY erstellt_am DESC`,
      [restaurant_id],
    );
  },

  /** Abgelaufene Abos auf 'expired' setzen (für Cron-Job) */
  async abgelaufeneAbosDeaktivieren(): Promise<number> {
    const result = await q<{ id: string }>(
      `UPDATE restaurants
       SET abo_status = 'expired'
       WHERE abo_status = 'active'
         AND abo_laeuft_bis IS NOT NULL
         AND abo_laeuft_bis < NOW()
       RETURNING id`,
      [],
    );
    return result.length;
  },
};
