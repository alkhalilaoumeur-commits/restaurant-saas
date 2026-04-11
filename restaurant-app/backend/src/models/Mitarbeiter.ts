import { q, q1 } from './db';

export type Rolle = 'admin' | 'kellner' | 'kueche';

export interface Mitarbeiter {
  id: string;
  restaurant_id: string;
  name: string;
  email: string;
  passwort_hash: string;
  rolle: Rolle;
  aktiv: boolean;
  erstellt_am: string;
}

/** Öffentliche Felder (ohne passwort_hash) */
export type MitarbeiterOhnePasswort = Omit<Mitarbeiter, 'passwort_hash'> & {
  einladung_ausstehend?: boolean;
  stundenlohn?: number | null;
  urlaubsanspruch_tage?: number;
};

const OEFFENTLICHE_FELDER = 'id, restaurant_id, name, email, rolle, aktiv, erstellt_am, stundenlohn, urlaubsanspruch_tage';
const OEFFENTLICHE_FELDER_MIT_STATUS = `${OEFFENTLICHE_FELDER}, (passwort_hash IS NULL) AS einladung_ausstehend`;

export const MitarbeiterModel = {
  alle(restaurantId: string) {
    return q<MitarbeiterOhnePasswort>(
      `SELECT ${OEFFENTLICHE_FELDER_MIT_STATUS} FROM mitarbeiter WHERE restaurant_id = $1 ORDER BY name`,
      [restaurantId]
    );
  },

  nachId(id: string, restaurantId: string) {
    return q1<MitarbeiterOhnePasswort>(
      `SELECT ${OEFFENTLICHE_FELDER_MIT_STATUS} FROM mitarbeiter WHERE id = $1 AND restaurant_id = $2`,
      [id, restaurantId]
    );
  },

  nachEmail(email: string) {
    return q1<Mitarbeiter>(
      'SELECT * FROM mitarbeiter WHERE email = $1',
      [email]
    );
  },

  erstellen(data: { restaurant_id: string; name: string; email: string; passwort_hash: string; rolle: Rolle }) {
    return q1<MitarbeiterOhnePasswort>(
      `INSERT INTO mitarbeiter (restaurant_id, name, email, passwort_hash, rolle)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${OEFFENTLICHE_FELDER}`,
      [data.restaurant_id, data.name, data.email, data.passwort_hash, data.rolle]
    );
  },

  aktualisieren(id: string, restaurantId: string, felder: { name?: string; rolle?: Rolle; aktiv?: boolean; stundenlohn?: number | null; urlaubsanspruch_tage?: number }) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(felder.name); }
    if (felder.rolle !== undefined) { sets.push(`rolle = $${idx++}`); vals.push(felder.rolle); }
    if (felder.aktiv !== undefined) { sets.push(`aktiv = $${idx++}`); vals.push(felder.aktiv); }
    if (felder.stundenlohn !== undefined) { sets.push(`stundenlohn = $${idx++}`); vals.push(felder.stundenlohn); }
    if (felder.urlaubsanspruch_tage !== undefined) { sets.push(`urlaubsanspruch_tage = $${idx++}`); vals.push(felder.urlaubsanspruch_tage); }
    if (sets.length === 0) return null;
    vals.push(id, restaurantId);
    return q1<MitarbeiterOhnePasswort>(
      `UPDATE mitarbeiter SET ${sets.join(', ')} WHERE id = $${idx++} AND restaurant_id = $${idx}
       RETURNING ${OEFFENTLICHE_FELDER}`,
      vals
    );
  },

  passwortAendern(id: string, restaurantId: string, passwortHash: string) {
    return q1<MitarbeiterOhnePasswort>(
      `UPDATE mitarbeiter SET passwort_hash = $1 WHERE id = $2 AND restaurant_id = $3
       RETURNING ${OEFFENTLICHE_FELDER}`,
      [passwortHash, id, restaurantId]
    );
  },

  /** Mitarbeiter per Einladung anlegen (ohne Passwort — MA setzt es selbst) */
  einladen(data: {
    restaurant_id: string;
    name: string;
    email: string;
    rolle: Rolle;
    einladung_token: string;
    einladung_gueltig_bis: Date;
  }) {
    return q1<MitarbeiterOhnePasswort>(
      `INSERT INTO mitarbeiter (restaurant_id, name, email, rolle, einladung_token, einladung_gueltig_bis)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${OEFFENTLICHE_FELDER}`,
      [data.restaurant_id, data.name, data.email, data.rolle, data.einladung_token, data.einladung_gueltig_bis]
    );
  },

  /** Einladungs-Token erneuern (erneut einladen) */
  einladungErneuern(id: string, restaurantId: string, token: string, gueltigBis: Date) {
    return q1<MitarbeiterOhnePasswort>(
      `UPDATE mitarbeiter SET einladung_token = $1, einladung_gueltig_bis = $2
       WHERE id = $3 AND restaurant_id = $4
       RETURNING ${OEFFENTLICHE_FELDER}`,
      [token, gueltigBis, id, restaurantId]
    );
  },
};
