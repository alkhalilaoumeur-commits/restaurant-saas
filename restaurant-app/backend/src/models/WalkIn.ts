import { q, q1 } from './db';

export type WalkInStatus = 'wartend' | 'platziert' | 'abgegangen';

export interface WalkIn {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  gast_name: string;
  personen: number;
  status: WalkInStatus;
  anmerkung: string | null;
  erstellt_am: string;
  platziert_am: string | null;
  /** Berechnetes Feld — kommt aus der Route, nicht direkt aus der DB */
  wartezeit_min?: number;
}

export const WalkInModel = {

  /** Alle aktiven Walk-ins des Tages (wartend + platziert) */
  aktive(restaurantId: string) {
    return q<WalkIn>(
      `SELECT * FROM walk_ins
       WHERE restaurant_id = $1
         AND (status = 'wartend' OR (status = 'platziert' AND platziert_am > NOW() - INTERVAL '2 hours'))
       ORDER BY erstellt_am ASC`,
      [restaurantId]
    );
  },

  erstellen(data: { restaurant_id: string; gast_name: string; personen: number; anmerkung: string | null }) {
    return q1<WalkIn>(
      `INSERT INTO walk_ins (restaurant_id, gast_name, personen, anmerkung)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.restaurant_id, data.gast_name, data.personen, data.anmerkung]
    );
  },

  /** Status auf 'platziert' setzen + Tisch zuweisen */
  platzieren(id: string, restaurantId: string, tischId: string) {
    return q1<WalkIn>(
      `UPDATE walk_ins SET status = 'platziert', tisch_id = $1, platziert_am = NOW()
       WHERE id = $2 AND restaurant_id = $3 RETURNING *`,
      [tischId, id, restaurantId]
    );
  },

  /** Status auf 'abgegangen' setzen (Gast hat gewartet und ist gegangen) */
  abgegangen(id: string, restaurantId: string) {
    return q1<WalkIn>(
      `UPDATE walk_ins SET status = 'abgegangen'
       WHERE id = $1 AND restaurant_id = $2 RETURNING *`,
      [id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1(
      'DELETE FROM walk_ins WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [id, restaurantId]
    );
  },

  nachId(id: string, restaurantId: string) {
    return q1<WalkIn>(
      'SELECT * FROM walk_ins WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  /**
   * Wartezeit schätzen:
   * - Freie Tische mit Kapazität >= personen vorhanden? → 0 Minuten (sofort)
   * - Sonst: Position in der Warteschlange × 20 Minuten
   */
  async wartezeitBerechnen(restaurantId: string, personen: number, walkInId: string): Promise<number> {
    // Freie Tische mit ausreichender Kapazität
    const freieTische = await q1<{ anzahl: string }>(
      `SELECT COUNT(*) as anzahl FROM tische
       WHERE restaurant_id = $1 AND kapazitaet >= $2 AND status = 'frei'`,
      [restaurantId, personen]
    );
    if (parseInt(freieTische?.anzahl || '0') > 0) return 0;

    // Position in der Warteschlange (wieviele wartende Walk-ins sind schon vor diesem da?)
    const voranstehende = await q1<{ anzahl: string }>(
      `SELECT COUNT(*) as anzahl FROM walk_ins
       WHERE restaurant_id = $1 AND status = 'wartend'
         AND erstellt_am < (SELECT erstellt_am FROM walk_ins WHERE id = $2)`,
      [restaurantId, walkInId]
    );
    const position = parseInt(voranstehende?.anzahl || '0') + 1;

    // Passende Tische gesamt (auch besetzte — die werden bald frei)
    const passendeTische = await q1<{ anzahl: string }>(
      `SELECT COUNT(*) as anzahl FROM tische WHERE restaurant_id = $1 AND kapazitaet >= $2`,
      [restaurantId, personen]
    );
    const tischAnzahl = Math.max(1, parseInt(passendeTische?.anzahl || '1'));

    // Schätzformel: (Position / Tischanzahl) × 20 Minuten, aufgerundet
    return Math.ceil((position / tischAnzahl) * 20);
  },
};
