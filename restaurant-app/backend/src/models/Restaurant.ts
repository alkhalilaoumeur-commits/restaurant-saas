import crypto from 'crypto';
import { PoolClient } from 'pg';
import { q1 } from './db';

export interface Restaurant {
  id: string;
  name: string;
  strasse: string | null;
  plz: string | null;
  stadt: string | null;
  telefon: string | null;
  email: string | null;
  logo_url: string | null;
  oeffnungszeiten: string | null;
  waehrung: string;
  primaerfarbe: string;
  layout_id: string;
  lizenz_code: string | null;
  restaurant_code: string;
  max_mitarbeiter: number;
  abo_status: 'trial' | 'active' | 'expired';
  buchungsintervall_min: number;
  tisch_dauer_min: number;
  max_gleichzeitige_reservierungen: number | null;
  erstellt_am: string;
}

export interface RestaurantDesign {
  name: string;
  logo_url: string | null;
  primaerfarbe: string;
  layout_id: string;
}

function genLizenzCode(): string {
  return 'REST-' + crypto.randomBytes(2).toString('hex').toUpperCase();
}

/** Restaurant-Code: 8 Zeichen, eindeutig pro Restaurant (z.B. REST-A7K39M2P) */
function genRestaurantCode(): string {
  return 'REST-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

export const RestaurantModel = {
  async nachId(restaurantId: string): Promise<Restaurant | null> {
    return q1<Restaurant>('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
  },

  async aktiveMitarbeiterAnzahl(restaurantId: string): Promise<number> {
    const result = await q1<{ anzahl: string }>(
      'SELECT COUNT(*) AS anzahl FROM mitarbeiter WHERE restaurant_id = $1 AND aktiv = true',
      [restaurantId],
    );
    return parseInt(result?.anzahl || '0', 10);
  },

  async designNachId(restaurantId: string): Promise<RestaurantDesign | null> {
    return q1<RestaurantDesign>(
      'SELECT name, logo_url, primaerfarbe, layout_id FROM restaurants WHERE id = $1',
      [restaurantId],
    );
  },

  async aktualisieren(
    restaurantId: string,
    felder: {
      name?: string;
      oeffnungszeiten?: string;
      primaerfarbe?: string;
      layout_id?: string;
      logo_url?: string | null;
      buchungsintervall_min?: number;
      tisch_dauer_min?: number;
      max_gleichzeitige_reservierungen?: number | null;
      google_bewertungs_link?: string | null;
    },
  ): Promise<Restaurant | null> {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(felder.name); }
    if (felder.oeffnungszeiten !== undefined) { sets.push(`oeffnungszeiten = $${idx++}`); vals.push(felder.oeffnungszeiten); }
    if (felder.primaerfarbe !== undefined) { sets.push(`primaerfarbe = $${idx++}`); vals.push(felder.primaerfarbe); }
    if (felder.layout_id !== undefined) { sets.push(`layout_id = $${idx++}`); vals.push(felder.layout_id); }
    if (felder.logo_url !== undefined) { sets.push(`logo_url = $${idx++}`); vals.push(felder.logo_url); }
    if (felder.buchungsintervall_min !== undefined) { sets.push(`buchungsintervall_min = $${idx++}`); vals.push(felder.buchungsintervall_min); }
    if (felder.tisch_dauer_min !== undefined) { sets.push(`tisch_dauer_min = $${idx++}`); vals.push(felder.tisch_dauer_min); }
    if (felder.max_gleichzeitige_reservierungen !== undefined) { sets.push(`max_gleichzeitige_reservierungen = $${idx++}`); vals.push(felder.max_gleichzeitige_reservierungen); }
    if (felder.google_bewertungs_link !== undefined) { sets.push(`google_bewertungs_link = $${idx++}`); vals.push(felder.google_bewertungs_link); }
    if (sets.length === 0) return null;
    vals.push(restaurantId);
    return q1<Restaurant>(
      `UPDATE restaurants SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      vals,
    );
  },

  async erstellen(
    client: PoolClient,
    data: {
      name: string;
      strasse: string;
      plz: string;
      stadt: string;
      telefon: string;
      email: string;
      waehrung?: string;
    },
  ): Promise<Restaurant> {
    const lizenzCode = genLizenzCode();
    const restaurantCode = genRestaurantCode();
    const res = await client.query(
      `INSERT INTO restaurants (name, strasse, plz, stadt, telefon, email, waehrung, lizenz_code, restaurant_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.name, data.strasse, data.plz, data.stadt, data.telefon, data.email, data.waehrung || 'EUR', lizenzCode, restaurantCode],
    );
    return res.rows[0] as Restaurant;
  },
};
