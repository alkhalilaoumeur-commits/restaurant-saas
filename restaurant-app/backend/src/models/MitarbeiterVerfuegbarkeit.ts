import { q, q1 } from './db';

export interface MitarbeiterVerfuegbarkeit {
  id: string;
  restaurant_id: string;
  mitarbeiter_id: string;
  wochentag: number;       // 0=Mo … 6=So
  typ: 'nicht_verfuegbar' | 'eingeschraenkt';
  von: string | null;      // "HH:MM" — nur bei typ='eingeschraenkt'
  bis: string | null;
  notiz: string | null;
  erstellt_am: string;
  // JOIN-Feld (nur bei Admin-Abfrage)
  mitarbeiter_name?: string;
}

export const MitarbeiterVerfuegbarkeitModel = {

  // Alle Einträge eines Restaurants (Admin-Sicht für Dienstplan-Overlay)
  alleNachRestaurant(restaurantId: string): Promise<MitarbeiterVerfuegbarkeit[]> {
    return q<MitarbeiterVerfuegbarkeit>(`
      SELECT v.*, m.name AS mitarbeiter_name
      FROM verfuegbarkeiten v
      JOIN mitarbeiter m ON m.id = v.mitarbeiter_id
      WHERE v.restaurant_id = $1
      ORDER BY v.wochentag, m.name
    `, [restaurantId]);
  },

  // Nur eigene Einträge (Mitarbeiter-Sicht)
  nachMitarbeiter(restaurantId: string, mitarbeiterId: string): Promise<MitarbeiterVerfuegbarkeit[]> {
    return q<MitarbeiterVerfuegbarkeit>(`
      SELECT * FROM verfuegbarkeiten
      WHERE restaurant_id = $1 AND mitarbeiter_id = $2
      ORDER BY wochentag
    `, [restaurantId, mitarbeiterId]);
  },

  // Upsert: einfügen oder bestehenden Eintrag für diesen Wochentag überschreiben
  // UNIQUE (mitarbeiter_id, wochentag) → ON CONFLICT aktualisiert einfach
  async upsert(data: {
    restaurant_id: string;
    mitarbeiter_id: string;
    wochentag: number;
    typ: 'nicht_verfuegbar' | 'eingeschraenkt';
    von?: string | null;
    bis?: string | null;
    notiz?: string | null;
  }): Promise<MitarbeiterVerfuegbarkeit> {
    const row = await q1<MitarbeiterVerfuegbarkeit>(`
      INSERT INTO verfuegbarkeiten
        (restaurant_id, mitarbeiter_id, wochentag, typ, von, bis, notiz)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (mitarbeiter_id, wochentag)
      DO UPDATE SET
        typ   = EXCLUDED.typ,
        von   = EXCLUDED.von,
        bis   = EXCLUDED.bis,
        notiz = EXCLUDED.notiz
      RETURNING *
    `, [
      data.restaurant_id,
      data.mitarbeiter_id,
      data.wochentag,
      data.typ,
      data.von ?? null,
      data.bis ?? null,
      data.notiz ?? null,
    ]);
    return row!;
  },

  // Eintrag löschen — MA löscht eigenen, Admin kann jeden löschen
  async loeschen(id: string, restaurantId: string): Promise<boolean> {
    const rows = await q(
      'DELETE FROM verfuegbarkeiten WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [id, restaurantId]
    );
    return rows.length > 0;
  },
};
