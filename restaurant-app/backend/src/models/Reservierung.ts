import { q, q1 } from './db';

export type ReservierungStatus = 'ausstehend' | 'bestaetigt' | 'storniert';
export type ReservierungQuelle = 'app' | 'whatsapp' | 'telefon';

export interface Reservierung {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  gast_name: string;
  telefon: string | null; // DSGVO: personenbezogen
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  quelle: ReservierungQuelle;
  erstellt_am: string;
}

export const ReservierungModel = {
  alle(restaurantId: string, datum?: string) {
    if (datum) {
      return q<Reservierung>(
        'SELECT * FROM reservierungen WHERE restaurant_id = $1 AND DATE(datum) = $2 ORDER BY datum',
        [restaurantId, datum]
      );
    }
    return q<Reservierung>(
      'SELECT * FROM reservierungen WHERE restaurant_id = $1 ORDER BY datum',
      [restaurantId]
    );
  },

  erstellen(data: Omit<Reservierung, 'erstellt_am'>) {
    return q1<Reservierung>(`
      INSERT INTO reservierungen (id, restaurant_id, tisch_id, gast_name, telefon, datum, personen, status, anmerkung, quelle)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
    `, [data.id, data.restaurant_id, data.tisch_id, data.gast_name, data.telefon,
        data.datum, data.personen, data.status, data.anmerkung, data.quelle]);
  },

  statusAendern(id: string, restaurantId: string, status: ReservierungStatus) {
    return q1<Reservierung>(
      'UPDATE reservierungen SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM reservierungen WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },
};
