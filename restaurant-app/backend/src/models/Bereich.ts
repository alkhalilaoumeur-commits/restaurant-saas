import { q, q1 } from './db';

export interface Bereich {
  id: string;
  restaurant_id: string;
  name: string;
  reihenfolge: number;
  erstellt_am: string;
}

export const BereichModel = {
  /** Alle Bereiche eines Restaurants, sortiert nach Reihenfolge */
  alle(restaurantId: string) {
    return q<Bereich>(
      'SELECT * FROM bereiche WHERE restaurant_id = $1 ORDER BY reihenfolge, name',
      [restaurantId]
    );
  },

  erstellen(data: { id: string; restaurant_id: string; name: string; reihenfolge?: number }) {
    return q1<Bereich>(
      `INSERT INTO bereiche (id, restaurant_id, name, reihenfolge)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.id, data.restaurant_id, data.name, data.reihenfolge ?? 0]
    );
  },

  aktualisieren(id: string, restaurantId: string, felder: { name?: string; reihenfolge?: number }) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(felder.name); }
    if (felder.reihenfolge !== undefined) { sets.push(`reihenfolge = $${idx++}`); vals.push(felder.reihenfolge); }
    if (sets.length === 0) return null;
    vals.push(id, restaurantId);
    return q1<Bereich>(
      `UPDATE bereiche SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
      vals
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM bereiche WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },
};
