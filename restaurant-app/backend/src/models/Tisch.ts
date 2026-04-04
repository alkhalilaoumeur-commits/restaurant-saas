import { q, q1 } from './db';

export type TischStatus = 'frei' | 'besetzt' | 'wartet_auf_zahlung';

export interface Tisch {
  id: string;
  restaurant_id: string;
  nummer: number;
  kapazitaet: number | null;
  status: TischStatus;
  qr_url: string | null;
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

  erstellen(data: Tisch) {
    return q1<Tisch>(`
      INSERT INTO tische (id, restaurant_id, nummer, kapazitaet, status, qr_url)
      VALUES ($1,$2,$3,$4,'frei',$5) RETURNING *
    `, [data.id, data.restaurant_id, data.nummer, data.kapazitaet, data.qr_url]);
  },

  statusAendern(id: string, restaurantId: string, status: TischStatus) {
    return q1<Tisch>(
      'UPDATE tische SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM tische WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },
};
