import { q, q1 } from './db';

export interface Gericht {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  kategorie_name?: string;
  name: string;
  beschreibung: string | null;
  preis: number;
  bild_url: string | null;
  allergene: string | null;
  verfuegbar: boolean;
}

export interface Kategorie {
  id: string;
  restaurant_id: string;
  name: string;
  reihenfolge: number;
}

export const GerichtModel = {
  alle(restaurantId: string) {
    return q<Gericht>(`
      SELECT g.*, k.name AS kategorie_name
      FROM gerichte g
      JOIN kategorien k ON g.kategorie_id = k.id
      WHERE g.restaurant_id = $1
      ORDER BY k.reihenfolge, g.name
    `, [restaurantId]);
  },

  nachId(id: string, restaurantId: string) {
    return q1<Gericht>(
      'SELECT * FROM gerichte WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  erstellen(data: Omit<Gericht, 'kategorie_name'>) {
    return q1<Gericht>(`
      INSERT INTO gerichte (id, restaurant_id, kategorie_id, name, beschreibung, preis, bild_url, allergene, verfuegbar)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
    `, [data.id, data.restaurant_id, data.kategorie_id, data.name, data.beschreibung,
        data.preis, data.bild_url, data.allergene, data.verfuegbar]);
  },

  aktualisieren(id: string, restaurantId: string, felder: Partial<Gericht>) {
    return q1<Gericht>(`
      UPDATE gerichte SET
        name = COALESCE($1, name),
        beschreibung = COALESCE($2, beschreibung),
        preis = COALESCE($3, preis),
        bild_url = COALESCE($4, bild_url),
        allergene = COALESCE($5, allergene),
        verfuegbar = COALESCE($6, verfuegbar),
        kategorie_id = COALESCE($7, kategorie_id)
      WHERE id = $8 AND restaurant_id = $9 RETURNING *
    `, [felder.name, felder.beschreibung, felder.preis, felder.bild_url,
        felder.allergene, felder.verfuegbar, felder.kategorie_id, id, restaurantId]);
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM gerichte WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },

  alleKategorien(restaurantId: string) {
    return q<Kategorie>(
      'SELECT * FROM kategorien WHERE restaurant_id = $1 ORDER BY reihenfolge',
      [restaurantId]
    );
  },
};
