import { q, q1 } from './db';

// ─── Typen ───────────────────────────────────────────────────────────────────

export interface Zahlung {
  id: string;
  restaurant_id: string;
  stripe_session_id: string;
  betrag_cent: number;
  status: 'open' | 'paid' | 'failed' | 'cancelled' | 'expired';
  monate: number;
  rabattcode: string | null;
  erstellt_am: string;
  bezahlt_am: string | null;
}

export interface Rabattcode {
  id: string;
  code: string;
  rabatt_prozent: number;
  monate: number;
  max_nutzungen: number | null;
  nutzungen: number;
  gueltig_bis: string | null;
  aktiv: boolean;
  erstellt_am: string;
}

// ─── AboModel ────────────────────────────────────────────────────────────────

export const AboModel = {
  // ── Rabattcodes ─────────────────────────────────────────────────────────────

  /** Gibt einen gültigen Rabattcode zurück oder null */
  async rabattcodePruefen(code: string): Promise<Rabattcode | null> {
    const row = await q1<Rabattcode>(
      `SELECT * FROM rabattcodes
       WHERE code = $1
         AND aktiv = true
         AND (gueltig_bis IS NULL OR gueltig_bis > NOW())
         AND (max_nutzungen IS NULL OR nutzungen < max_nutzungen)`,
      [code.trim().toUpperCase()],
    );
    return row;
  },

  /** Erhöht den Nutzungszähler eines Codes */
  async rabattcodeNutzen(code: string): Promise<void> {
    await q(
      `UPDATE rabattcodes SET nutzungen = nutzungen + 1 WHERE code = $1`,
      [code.trim().toUpperCase()],
    );
  },

  /** Alle Rabattcodes (Admin) */
  async alleRabattcodes(): Promise<Rabattcode[]> {
    return q<Rabattcode>('SELECT * FROM rabattcodes ORDER BY erstellt_am DESC', []);
  },

  /** Neuen Rabattcode erstellen */
  async rabattcodeErstellen(data: {
    code: string;
    rabatt_prozent: number;
    monate: number;
    max_nutzungen: number | null;
    gueltig_bis: string | null;
  }): Promise<Rabattcode> {
    const row = await q1<Rabattcode>(
      `INSERT INTO rabattcodes (code, rabatt_prozent, monate, max_nutzungen, gueltig_bis)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.code.trim().toUpperCase(), data.rabatt_prozent, data.monate, data.max_nutzungen, data.gueltig_bis],
    );
    return row!;
  },

  /** Rabattcode aktivieren/deaktivieren */
  async rabattcodeToggle(id: string, aktiv: boolean): Promise<void> {
    await q(`UPDATE rabattcodes SET aktiv = $1 WHERE id = $2`, [aktiv, id]);
  },

  /** Rabattcode löschen */
  async rabattcodeLoeschen(id: string): Promise<void> {
    await q(`DELETE FROM rabattcodes WHERE id = $1`, [id]);
  },

  // ── Zahlungen ────────────────────────────────────────────────────────────────

  /** Neue offene Zahlung anlegen (bevor Kunde zahlt) */
  async zahlungAnlegen(data: {
    restaurant_id: string;
    stripe_session_id: string;
    betrag_cent: number;
    monate: number;
    rabattcode: string | null;
  }): Promise<Zahlung> {
    const row = await q1<Zahlung>(
      `INSERT INTO zahlungen (restaurant_id, stripe_session_id, betrag_cent, monate, rabattcode)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.restaurant_id, data.stripe_session_id, data.betrag_cent, data.monate, data.rabattcode],
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

    // 2. Restaurant-Abo verlängern
    //    Wenn bereits aktiv und noch nicht abgelaufen → vom aktuellen Datum weiterzählen
    //    Wenn abgelaufen/neu → ab jetzt zählen
    await q(
      `UPDATE restaurants
       SET abo_status = 'active',
           abo_laeuft_bis = GREATEST(NOW(), COALESCE(abo_laeuft_bis, NOW())) + ($1 * INTERVAL '1 month')
       WHERE id = $2`,
      [zahlung.monate, zahlung.restaurant_id],
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
