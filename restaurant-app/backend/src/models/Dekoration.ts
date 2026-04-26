import { q, q1 } from './db';

export type DekoTyp = 'pflanze' | 'theke' | 'eingang' | 'servicestation' | 'wand' | 'tuer';

export interface Dekoration {
  id: string;
  restaurant_id: string;
  bereich_id: string | null;
  typ: DekoTyp;
  pos_x: number;
  pos_y: number;
  breite: number;
  hoehe: number;
  rotation: number;
  label: string | null;
  erstellt_am: string;
}

export const DekorationModel = {
  alle(restaurantId: string): Promise<Dekoration[]> {
    return q<Dekoration>(
      'SELECT * FROM dekorationen WHERE restaurant_id = $1 ORDER BY erstellt_am',
      [restaurantId]
    );
  },

  erstellen(data: Omit<Dekoration, 'id' | 'erstellt_am'>): Promise<Dekoration | null> {
    return q1<Dekoration>(`
      INSERT INTO dekorationen (restaurant_id, bereich_id, typ, pos_x, pos_y, breite, hoehe, rotation, label)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.restaurant_id, data.bereich_id, data.typ,
      data.pos_x, data.pos_y, data.breite, data.hoehe, data.rotation, data.label,
    ]);
  },

  /** Position/Größe/Rotation/Label/Bereich aktualisieren (alle Felder optional) */
  aktualisieren(
    id: string,
    restaurantId: string,
    daten: Partial<Pick<Dekoration, 'pos_x' | 'pos_y' | 'breite' | 'hoehe' | 'rotation' | 'label' | 'bereich_id'>>
  ): Promise<Dekoration | null> {
    // Dynamisches SET — nur gesetzte Felder übernehmen
    const felder: string[] = [];
    const werte: unknown[] = [];
    for (const [key, value] of Object.entries(daten)) {
      if (value !== undefined) {
        felder.push(`${key} = $${felder.length + 1}`);
        werte.push(value);
      }
    }
    if (felder.length === 0) {
      return q1<Dekoration>('SELECT * FROM dekorationen WHERE id = $1 AND restaurant_id = $2', [id, restaurantId]);
    }
    werte.push(id, restaurantId);
    return q1<Dekoration>(
      `UPDATE dekorationen SET ${felder.join(', ')}
       WHERE id = $${werte.length - 1} AND restaurant_id = $${werte.length}
       RETURNING *`,
      werte
    );
  },

  loeschen(id: string, restaurantId: string): Promise<{ id: string } | null> {
    return q1(
      'DELETE FROM dekorationen WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [id, restaurantId]
    );
  },
};
