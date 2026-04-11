import { q, q1 } from './db';

export type TischStatus = 'frei' | 'besetzt' | 'wartet_auf_zahlung';
export type TischForm = 'rechteck' | 'rund' | 'quadrat' | 'bar';

export interface Tisch {
  id: string;
  restaurant_id: string;
  nummer: number;
  kapazitaet: number | null;
  status: TischStatus;
  qr_url: string | null;
  form: TischForm;
  pos_x: number;
  pos_y: number;
  breite: number;
  hoehe: number;
  rotation: number;
  bereich_id: string | null;
}

export const TischModel = {
  alle(restaurantId: string) {
    return q<Tisch>(
      'SELECT * FROM tische WHERE restaurant_id = $1 ORDER BY nummer',
      [restaurantId]
    );
  },

  nachId(id: string, restaurantId: string) {
    return q1<Tisch>(
      'SELECT * FROM tische WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  erstellen(data: { id: string; restaurant_id: string; nummer: number; kapazitaet?: number | null; qr_url?: string | null; form?: TischForm; pos_x?: number; pos_y?: number; breite?: number; hoehe?: number; bereich_id?: string | null }) {
    return q1<Tisch>(`
      INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status, qr_url, form, pos_x, pos_y, breite, hoehe, bereich_id)
      VALUES ($1,$2,$3,$4,'frei',$5,$6,$7,$8,$9,$10,$11) RETURNING *
    `, [data.id, data.restaurant_id, data.nummer, data.kapazitaet ?? null, data.qr_url ?? null,
        data.form ?? 'rechteck', data.pos_x ?? 0, data.pos_y ?? 0, data.breite ?? 80, data.hoehe ?? 80, data.bereich_id ?? null]);
  },

  statusAendern(id: string, restaurantId: string, status: TischStatus) {
    return q1<Tisch>(
      'UPDATE tische SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, restaurantId]
    );
  },

  aktualisieren(id: string, restaurantId: string, felder: {
    nummer?: number; kapazitaet?: number | null; form?: TischForm;
    pos_x?: number; pos_y?: number; breite?: number; hoehe?: number;
    rotation?: number; bereich_id?: string | null;
  }) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.nummer !== undefined) { sets.push(`nummer = $${idx++}`); vals.push(felder.nummer); }
    if (felder.kapazitaet !== undefined) { sets.push(`kapazitaet = $${idx++}`); vals.push(felder.kapazitaet); }
    if (felder.form !== undefined) { sets.push(`form = $${idx++}`); vals.push(felder.form); }
    if (felder.pos_x !== undefined) { sets.push(`pos_x = $${idx++}`); vals.push(felder.pos_x); }
    if (felder.pos_y !== undefined) { sets.push(`pos_y = $${idx++}`); vals.push(felder.pos_y); }
    if (felder.breite !== undefined) { sets.push(`breite = $${idx++}`); vals.push(felder.breite); }
    if (felder.hoehe !== undefined) { sets.push(`hoehe = $${idx++}`); vals.push(felder.hoehe); }
    if (felder.rotation !== undefined) { sets.push(`rotation = $${idx++}`); vals.push(felder.rotation); }
    if (felder.bereich_id !== undefined) { sets.push(`bereich_id = $${idx++}`); vals.push(felder.bereich_id); }
    if (sets.length === 0) return null;
    vals.push(id, restaurantId);
    return q1<Tisch>(
      `UPDATE tische SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
      vals
    );
  },

  /** Batch-Update: Positionen mehrerer Tische auf einmal speichern (nach Drag & Drop) */
  positionenSpeichern(restaurantId: string, positionen: Array<{ id: string; pos_x: number; pos_y: number; breite?: number; hoehe?: number; rotation?: number }>) {
    return Promise.all(
      positionen.map(p =>
        q1<Tisch>(
          `UPDATE tische SET pos_x = $1, pos_y = $2, breite = COALESCE($3, breite), hoehe = COALESCE($4, hoehe), rotation = COALESCE($5, rotation)
           WHERE id = $6 AND restaurant_id = $7 RETURNING *`,
          [p.pos_x, p.pos_y, p.breite ?? null, p.hoehe ?? null, p.rotation ?? null, p.id, restaurantId]
        )
      )
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM tische WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },
};
