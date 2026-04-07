import { q, q1 } from './db';

export interface Schicht {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  mitarbeiter_name?: string;
  mitarbeiter_rolle?: string;
  datum: string;
  beginn: string;
  ende: string;
  notiz: string | null;
  erstellt_am: string;
}

export const SchichtModel = {
  /** Alle Schichten in einem Datumsbereich */
  nachZeitraum(restaurantId: string, start: string, ende: string) {
    return q<Schicht>(`
      SELECT s.*, m.name AS mitarbeiter_name, m.rolle AS mitarbeiter_rolle
      FROM schichten s
      JOIN mitarbeiter m ON s.mitarbeiter_id = m.id
      WHERE s.restaurant_id = $1
        AND s.datum >= $2
        AND s.datum <= $3
      ORDER BY s.datum, s.beginn
    `, [restaurantId, start, ende]);
  },

  erstellen(data: {
    restaurant_id: string;
    mitarbeiter_id: string;
    datum: string;
    beginn: string;
    ende: string;
    notiz?: string;
  }) {
    return q1<Schicht>(`
      INSERT INTO schichten (restaurant_id, mitarbeiter_id, datum, beginn, ende, notiz)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [data.restaurant_id, data.mitarbeiter_id, data.datum, data.beginn, data.ende, data.notiz || null]);
  },

  aktualisieren(id: string, restaurantId: string, felder: {
    mitarbeiter_id?: string;
    datum?: string;
    beginn?: string;
    ende?: string;
    notiz?: string | null;
  }) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.mitarbeiter_id !== undefined) { sets.push(`mitarbeiter_id = $${idx++}`); vals.push(felder.mitarbeiter_id); }
    if (felder.datum !== undefined) { sets.push(`datum = $${idx++}`); vals.push(felder.datum); }
    if (felder.beginn !== undefined) { sets.push(`beginn = $${idx++}`); vals.push(felder.beginn); }
    if (felder.ende !== undefined) { sets.push(`ende = $${idx++}`); vals.push(felder.ende); }
    if (felder.notiz !== undefined) { sets.push(`notiz = $${idx++}`); vals.push(felder.notiz); }
    if (sets.length === 0) return null;
    vals.push(id, restaurantId);
    return q1<Schicht>(
      `UPDATE schichten SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
      vals
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1<Schicht>(
      'DELETE FROM schichten WHERE id = $1 AND restaurant_id = $2 RETURNING *',
      [id, restaurantId]
    );
  },
};
