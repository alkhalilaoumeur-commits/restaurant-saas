import { q, q1 } from './db';

export interface Abwesenheit {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  von_datum: string;   // "YYYY-MM-DD"
  bis_datum: string;   // "YYYY-MM-DD"
  typ: 'urlaub' | 'krank' | 'sonstiges';
  notiz: string | null;
  erstellt_am: string;
  mitarbeiter_name?: string;  // JOIN-Feld (nur bei Admin-Abfrage)
}

export interface AbwesenheitKonflikt {
  schicht_id: string;
  schicht_datum: string;
  beginn: string;
  ende: string;
}

export const AbwesenheitModel = {

  // Alle Abwesenheiten eines Restaurants (Admin-Sicht)
  alleNachRestaurant(restaurantId: string): Promise<Abwesenheit[]> {
    return q<Abwesenheit>(`
      SELECT a.*, m.name AS mitarbeiter_name
      FROM abwesenheiten a
      JOIN mitarbeiter m ON m.id = a.mitarbeiter_id
      WHERE a.restaurant_id = $1
      ORDER BY a.von_datum DESC
    `, [restaurantId]);
  },

  // Nur eigene Abwesenheiten (Mitarbeiter-Sicht)
  nachMitarbeiter(restaurantId: string, mitarbeiterId: string): Promise<Abwesenheit[]> {
    return q<Abwesenheit>(`
      SELECT * FROM abwesenheiten
      WHERE restaurant_id = $1 AND mitarbeiter_id = $2
      ORDER BY von_datum DESC
    `, [restaurantId, mitarbeiterId]);
  },

  // Abwesenheiten die einen bestimmten Datumsbereich überschneiden (für Admin-Wochenansicht)
  nachZeitraum(restaurantId: string, von: string, bis: string): Promise<Abwesenheit[]> {
    return q<Abwesenheit>(`
      SELECT a.*, m.name AS mitarbeiter_name
      FROM abwesenheiten a
      JOIN mitarbeiter m ON m.id = a.mitarbeiter_id
      WHERE a.restaurant_id = $1
        AND a.von_datum <= $3
        AND a.bis_datum >= $2
      ORDER BY a.von_datum
    `, [restaurantId, von, bis]);
  },

  // Neue Abwesenheit anlegen — gibt Eintrag inkl. mitarbeiter_name zurück
  async erstellen(data: {
    restaurant_id: string;
    mitarbeiter_id: string;
    von_datum: string;
    bis_datum: string;
    typ: 'urlaub' | 'krank' | 'sonstiges';
    notiz?: string | null;
  }): Promise<Abwesenheit> {
    const row = await q1<Abwesenheit>(`
      WITH neu AS (
        INSERT INTO abwesenheiten
          (restaurant_id, mitarbeiter_id, von_datum, bis_datum, typ, notiz)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      )
      SELECT n.*, m.name AS mitarbeiter_name
      FROM neu n
      JOIN mitarbeiter m ON m.id = n.mitarbeiter_id
    `, [
      data.restaurant_id,
      data.mitarbeiter_id,
      data.von_datum,
      data.bis_datum,
      data.typ,
      data.notiz ?? null,
    ]);
    return row!;
  },

  // Prüft ob der MA im Zeitraum bereits Schichten hat (Konflikt-Check)
  // Gibt die betroffenen Schichten zurück
  async konfliktePruefen(
    mitarbeiterId: string,
    vonDatum: string,
    bisDatum: string,
  ): Promise<AbwesenheitKonflikt[]> {
    return q<AbwesenheitKonflikt>(`
      SELECT id AS schicht_id, datum AS schicht_datum, beginn, ende
      FROM schichten
      WHERE mitarbeiter_id = $1
        AND datum >= $2
        AND datum <= $3
      ORDER BY datum
    `, [mitarbeiterId, vonDatum, bisDatum]);
  },

  // Abwesenheit löschen (MA löscht eigene, Admin kann alle löschen)
  async loeschen(id: string, restaurantId: string): Promise<boolean> {
    const rows = await q(
      'DELETE FROM abwesenheiten WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [id, restaurantId]
    );
    return rows.length > 0;
  },
};
