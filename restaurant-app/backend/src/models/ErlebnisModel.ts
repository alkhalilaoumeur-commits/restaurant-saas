import crypto from 'crypto';
import { q, q1 } from './db';

export interface Erlebnis {
  id: string;
  restaurant_id: string;
  name: string;
  beschreibung: string | null;
  preis_cent: number;
  max_personen: number;
  dauer_min: number;
  aktiv: boolean;
  bild_url: string | null;
  erstellt_am: string;
}

export interface ErlebnisBuchung {
  id: string;
  restaurant_id: string;
  erlebnis_id: string;
  erlebnis_name: string;
  preis_cent: number;
  dauer_min: number;
  gast_name: string;
  gast_email: string;
  gast_telefon: string | null;
  datum: string;
  uhrzeit: string;
  personen: number;
  status: 'ausstehend' | 'bezahlt' | 'storniert' | 'abgeschlossen';
  stripe_session_id: string | null;
  zahlung_status: string | null;
  token: string;
  anmerkungen: string | null;
  erstellt_am: string;
}

export const ErlebnisModel = {

  alleNachRestaurant: (restaurantId: string) =>
    q<Erlebnis>(
      'SELECT * FROM erlebnisse WHERE restaurant_id = $1 ORDER BY erstellt_am DESC',
      [restaurantId]
    ),

  aktiveNachRestaurant: (restaurantId: string) =>
    q<Erlebnis>(
      'SELECT * FROM erlebnisse WHERE restaurant_id = $1 AND aktiv = true ORDER BY preis_cent ASC',
      [restaurantId]
    ),

  nachId: (id: string, restaurantId: string) =>
    q1<Erlebnis>(
      'SELECT * FROM erlebnisse WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    ),

  nachIdPublic: (id: string) =>
    q1<Erlebnis>(
      'SELECT * FROM erlebnisse WHERE id = $1 AND aktiv = true',
      [id]
    ),

  erstellen: (r: {
    restaurant_id: string; name: string; beschreibung?: string | null;
    preis_cent: number; max_personen: number; dauer_min: number; bild_url?: string | null;
  }) =>
    q1<Erlebnis>(
      `INSERT INTO erlebnisse (restaurant_id, name, beschreibung, preis_cent, max_personen, dauer_min, bild_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [r.restaurant_id, r.name, r.beschreibung ?? null, r.preis_cent, r.max_personen, r.dauer_min, r.bild_url ?? null]
    ),

  aktualisieren: (id: string, restaurantId: string, felder: {
    name?: string; beschreibung?: string | null; preis_cent?: number;
    max_personen?: number; dauer_min?: number; aktiv?: boolean; bild_url?: string | null;
  }) =>
    q1<Erlebnis>(
      `UPDATE erlebnisse SET
         name         = COALESCE($3, name),
         beschreibung = COALESCE($4, beschreibung),
         preis_cent   = COALESCE($5, preis_cent),
         max_personen = COALESCE($6, max_personen),
         dauer_min    = COALESCE($7, dauer_min),
         aktiv        = COALESCE($8, aktiv),
         bild_url     = $9
       WHERE id = $1 AND restaurant_id = $2 RETURNING *`,
      [id, restaurantId, felder.name, felder.beschreibung, felder.preis_cent,
       felder.max_personen, felder.dauer_min, felder.aktiv, felder.bild_url ?? null]
    ),

  loeschen: (id: string, restaurantId: string) =>
    q('DELETE FROM erlebnisse WHERE id = $1 AND restaurant_id = $2', [id, restaurantId]),

  // ── Buchungen ──────────────────────────────────────────────────────────────

  buchungenNachRestaurant: (restaurantId: string) =>
    q<ErlebnisBuchung>(
      `SELECT eb.*, e.name AS erlebnis_name, e.preis_cent, e.dauer_min
       FROM erlebnis_buchungen eb
       JOIN erlebnisse e ON e.id = eb.erlebnis_id
       WHERE eb.restaurant_id = $1
       ORDER BY eb.datum DESC, eb.uhrzeit DESC`,
      [restaurantId]
    ),

  buchungErstellen: (r: {
    restaurant_id: string; erlebnis_id: string; gast_name: string; gast_email: string;
    gast_telefon?: string | null; datum: string; uhrzeit: string; personen: number; anmerkungen?: string | null;
  }) => {
    const token = crypto.randomBytes(32).toString('hex');
    return q1<ErlebnisBuchung>(
      `INSERT INTO erlebnis_buchungen
         (restaurant_id, erlebnis_id, gast_name, gast_email, gast_telefon, datum, uhrzeit, personen, anmerkungen, token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [r.restaurant_id, r.erlebnis_id, r.gast_name, r.gast_email, r.gast_telefon ?? null,
       r.datum, r.uhrzeit, r.personen, r.anmerkungen ?? null, token]
    );
  },

  buchungStripeSessionSetzen: (id: string, stripeSessionId: string) =>
    q('UPDATE erlebnis_buchungen SET stripe_session_id = $2 WHERE id = $1', [id, stripeSessionId]),

  buchungBezahlen: (stripeSessionId: string) =>
    q(
      "UPDATE erlebnis_buchungen SET status = 'bezahlt', zahlung_status = 'paid' WHERE stripe_session_id = $1",
      [stripeSessionId]
    ),

  buchungNachToken: (token: string) =>
    q1<ErlebnisBuchung>(
      `SELECT eb.*, e.name AS erlebnis_name, e.preis_cent, e.dauer_min
       FROM erlebnis_buchungen eb
       JOIN erlebnisse e ON e.id = eb.erlebnis_id
       WHERE eb.token = $1`,
      [token]
    ),

  buchungStatusAendern: (id: string, restaurantId: string, status: string) =>
    q(
      'UPDATE erlebnis_buchungen SET status = $3 WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId, status]
    ),
};
