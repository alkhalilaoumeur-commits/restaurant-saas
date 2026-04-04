import { q, q1 } from './db';

export type BestellungStatus = 'offen' | 'in_zubereitung' | 'serviert' | 'bezahlt';

export interface Bestellung {
  id: string;
  restaurant_id: string;
  tisch_id: string;
  tisch_nummer?: number;
  status: BestellungStatus;
  gesamtpreis: number;
  anmerkung: string | null;
  erstellt_am: string;
  positionen?: BestellPosition[];
}

export interface BestellPosition {
  id: string;
  gericht_id: string;
  gericht_name?: string;
  menge: number;
  einzelpreis: number;
}

export const BestellungModel = {
  alleAktiven(restaurantId: string) {
    return q<Bestellung>(`
      SELECT b.*, t.nummer AS tisch_nummer,
        COALESCE(
          json_agg(json_build_object(
            'id', bp.id, 'gericht_id', bp.gericht_id,
            'gericht_name', g.name, 'menge', bp.menge, 'einzelpreis', bp.einzelpreis
          )) FILTER (WHERE bp.id IS NOT NULL),
          '[]'::json
        ) AS positionen
      FROM bestellungen b
      JOIN tische t ON b.tisch_id = t.id
      LEFT JOIN bestellpositionen bp ON bp.bestellung_id = b.id
      LEFT JOIN gerichte g ON bp.gericht_id = g.id
      WHERE b.restaurant_id = $1 AND b.status != 'bezahlt'
      GROUP BY b.id, t.nummer
      ORDER BY b.erstellt_am DESC
    `, [restaurantId]);
  },

  nachId(id: string, restaurantId: string) {
    return q1<Bestellung>(
      'SELECT * FROM bestellungen WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  statusAendern(id: string, restaurantId: string, status: BestellungStatus) {
    return q1<Bestellung>(
      'UPDATE bestellungen SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, restaurantId]
    );
  },
};
