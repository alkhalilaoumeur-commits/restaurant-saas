import { q, q1 } from './db';

export interface Wartelisteneintrag {
  id: string;
  restaurant_id: string;
  gast_name: string;
  telefon: string | null;
  email: string | null;
  personen: number;
  datum: string;
  anmerkung: string | null;
  quelle: 'walk_in' | 'online';
  status: 'wartend' | 'benachrichtigt' | 'bestaetigt' | 'abgelaufen' | 'storniert';
  position: number;
  benachrichtigt_am: string | null;
  eingetragen_am: string;
}

export const WartelisteModel = {

  // Alle Einträge für ein Datum (admin)
  async nachDatum(restaurantId: string, datum: string): Promise<Wartelisteneintrag[]> {
    return q<Wartelisteneintrag>(
      `SELECT * FROM warteliste
       WHERE restaurant_id = $1 AND datum = $2
       ORDER BY position ASC, eingetragen_am ASC`,
      [restaurantId, datum]
    );
  },

  // Nur wartende Einträge (für Nachrück-Logik)
  async wartende(restaurantId: string, datum: string): Promise<Wartelisteneintrag[]> {
    return q<Wartelisteneintrag>(
      `SELECT * FROM warteliste
       WHERE restaurant_id = $1 AND datum = $2 AND status = 'wartend'
       ORDER BY position ASC, eingetragen_am ASC`,
      [restaurantId, datum]
    );
  },

  // Eintrag erstellen
  async erstellen(daten: {
    restaurant_id: string;
    gast_name: string;
    telefon?: string | null;
    email?: string | null;
    personen: number;
    datum: string;
    anmerkung?: string | null;
    quelle: 'walk_in' | 'online';
  }): Promise<Wartelisteneintrag | null> {
    // Position = aktuelle Anzahl wartender Einträge + 1
    const zaehl = await q1<{ anzahl: number }>(
      `SELECT COUNT(*)::int AS anzahl FROM warteliste
       WHERE restaurant_id = $1 AND datum = $2 AND status = 'wartend'`,
      [daten.restaurant_id, daten.datum]
    );
    const position = (zaehl?.anzahl ?? 0) + 1;

    return q1<Wartelisteneintrag>(
      `INSERT INTO warteliste
         (restaurant_id, gast_name, telefon, email, personen, datum, anmerkung, quelle, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        daten.restaurant_id,
        daten.gast_name,
        daten.telefon ?? null,
        daten.email ?? null,
        daten.personen,
        daten.datum,
        daten.anmerkung ?? null,
        daten.quelle,
        position,
      ]
    );
  },

  // Status ändern
  async statusAendern(
    id: string,
    restaurantId: string,
    status: Wartelisteneintrag['status']
  ): Promise<Wartelisteneintrag | null> {
    return q1<Wartelisteneintrag>(
      `UPDATE warteliste
       SET status = $1, aktualisiert_am = now()
       WHERE id = $2 AND restaurant_id = $3
       RETURNING *`,
      [status, id, restaurantId]
    );
  },

  // Als benachrichtigt markieren
  async benachrichtigt(id: string, restaurantId: string): Promise<Wartelisteneintrag | null> {
    return q1<Wartelisteneintrag>(
      `UPDATE warteliste
       SET status = 'benachrichtigt', benachrichtigt_am = now(), aktualisiert_am = now()
       WHERE id = $1 AND restaurant_id = $2
       RETURNING *`,
      [id, restaurantId]
    );
  },

  // Ersten Wartenden für ein Datum holen (für automatisches Nachrücken)
  async naechsterWartender(restaurantId: string, datum: string): Promise<Wartelisteneintrag | null> {
    return q1<Wartelisteneintrag>(
      `SELECT * FROM warteliste
       WHERE restaurant_id = $1 AND datum = $2 AND status = 'wartend'
       ORDER BY position ASC, eingetragen_am ASC
       LIMIT 1`,
      [restaurantId, datum]
    );
  },

  // Positionen nach Stornierung neu nummerieren
  async positionenNeuordnen(restaurantId: string, datum: string): Promise<void> {
    await q(
      `WITH geordnet AS (
         SELECT id, ROW_NUMBER() OVER (ORDER BY position ASC, eingetragen_am ASC) AS neue_pos
         FROM warteliste
         WHERE restaurant_id = $1 AND datum = $2 AND status = 'wartend'
       )
       UPDATE warteliste w
       SET position = g.neue_pos
       FROM geordnet g
       WHERE w.id = g.id`,
      [restaurantId, datum]
    );
  },

  async nachId(id: string, restaurantId: string): Promise<Wartelisteneintrag | null> {
    return q1<Wartelisteneintrag>(
      `SELECT * FROM warteliste WHERE id = $1 AND restaurant_id = $2`,
      [id, restaurantId]
    );
  },

  async loeschen(id: string, restaurantId: string): Promise<boolean> {
    const r = await q1(
      `DELETE FROM warteliste WHERE id = $1 AND restaurant_id = $2 RETURNING id`,
      [id, restaurantId]
    );
    return r !== null;
  },
};
