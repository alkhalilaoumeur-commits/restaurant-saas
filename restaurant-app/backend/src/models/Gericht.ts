import { q, q1 } from './db';

export interface Gericht {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  kategorie_name?: string;
  unterkategorie_id: string | null;
  unterkategorie_name?: string | null;
  name: string;
  beschreibung: string | null;
  preis: number;
  bild_url: string | null;
  allergene: string | null;
  verfuegbar: boolean;
  modell_3d_url: string | null;
}

export interface Unterkategorie {
  id: string;
  restaurant_id: string;
  kategorie_id: string;
  name: string;
  reihenfolge: number;
}

export interface Kategorie {
  id: string;
  restaurant_id: string;
  name: string;
  reihenfolge: number;
  bild_url: string | null;
}

/** Kategorie mit Anzahl verfügbarer Gerichte (für Gäste-Seite) */
export interface KategorieMitAnzahl extends Kategorie {
  anzahl_gerichte: number;
}

export const GerichtModel = {
  alle(restaurantId: string) {
    return q<Gericht>(`
      SELECT g.*, k.name AS kategorie_name, uk.name AS unterkategorie_name,
        EXISTS(
          SELECT 1 FROM extras_gruppen eg
          JOIN extras e ON e.gruppe_id = eg.id AND e.verfuegbar = true
          WHERE eg.gericht_id = g.id
        ) AS hat_extras
      FROM gerichte g
      JOIN kategorien k ON g.kategorie_id = k.id
      LEFT JOIN unterkategorien uk ON g.unterkategorie_id = uk.id
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

  erstellen(data: Omit<Gericht, 'kategorie_name' | 'unterkategorie_name'>) {
    return q1<Gericht>(`
      INSERT INTO gerichte (id, restaurant_id, kategorie_id, unterkategorie_id, name, beschreibung, preis, bild_url, allergene, verfuegbar, modell_3d_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *
    `, [data.id, data.restaurant_id, data.kategorie_id, data.unterkategorie_id ?? null,
        data.name, data.beschreibung, data.preis, data.bild_url, data.allergene,
        data.verfuegbar, data.modell_3d_url ?? null]);
  },

  aktualisieren(id: string, restaurantId: string, felder: Partial<Gericht>) {
    // Dynamisches SET — nur übergebene Felder werden aktualisiert
    const erlaubt = ['name', 'beschreibung', 'preis', 'bild_url', 'allergene', 'verfuegbar', 'kategorie_id', 'modell_3d_url', 'unterkategorie_id'] as const;
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    for (const feld of erlaubt) {
      if (feld in felder) {
        sets.push(`${feld} = $${idx++}`);
        vals.push(felder[feld as keyof Gericht] ?? null);
      }
    }
    if (sets.length === 0) return q1<Gericht>('SELECT * FROM gerichte WHERE id = $1 AND restaurant_id = $2', [id, restaurantId]);
    vals.push(id, restaurantId);
    return q1<Gericht>(
      `UPDATE gerichte SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx} RETURNING *`,
      vals
    );
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

  // ─── Unterkategorien ─────────────────────────────────────────────────────

  alleUnterkategorien(kategorieId: string, restaurantId: string) {
    return q<Unterkategorie>(
      'SELECT * FROM unterkategorien WHERE kategorie_id = $1 AND restaurant_id = $2 ORDER BY reihenfolge',
      [kategorieId, restaurantId]
    );
  },

  unterkategorieErstellen(data: Unterkategorie) {
    return q1<Unterkategorie>(`
      INSERT INTO unterkategorien (id, restaurant_id, kategorie_id, name, reihenfolge)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [data.id, data.restaurant_id, data.kategorie_id, data.name, data.reihenfolge]);
  },

  unterkategorieAktualisieren(id: string, restaurantId: string, felder: Partial<Unterkategorie>) {
    return q1<Unterkategorie>(`
      UPDATE unterkategorien SET
        name = COALESCE($1, name),
        reihenfolge = COALESCE($2, reihenfolge)
      WHERE id = $3 AND restaurant_id = $4 RETURNING *
    `, [felder.name, felder.reihenfolge, id, restaurantId]);
  },

  unterkategorieLoeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM unterkategorien WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },

  /** Kategorien mit Anzahl verfügbarer Gerichte — für die öffentliche Gäste-Seite */
  alleKategorienOeffentlich(restaurantId: string) {
    return q<KategorieMitAnzahl>(`
      SELECT k.*, COUNT(g.id)::int AS anzahl_gerichte
      FROM kategorien k
      LEFT JOIN gerichte g ON g.kategorie_id = k.id AND g.verfuegbar = true
      WHERE k.restaurant_id = $1
      GROUP BY k.id
      HAVING COUNT(g.id) > 0
      ORDER BY k.reihenfolge
    `, [restaurantId]);
  },
};
