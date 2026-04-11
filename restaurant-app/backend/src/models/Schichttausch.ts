import { q, q1 } from './db';

export type SchichttauschStatus = 'offen' | 'angeboten' | 'genehmigt' | 'abgelehnt';

export interface Schichttausch {
  id: string;
  restaurant_id: string;
  anbieter_id: string;
  anbieter_name?: string;
  anbieter_schicht_id: string;
  anbieter_datum?: string;
  anbieter_beginn?: string;
  anbieter_ende?: string;
  annehmer_id: string | null;
  annehmer_name?: string;
  annehmer_schicht_id: string | null;
  annehmer_datum?: string;
  annehmer_beginn?: string;
  annehmer_ende?: string;
  status: SchichttauschStatus;
  erstellt_am: string;
}

export const SchichttauschModel = {

  /** Alle aktiven Tausch-Anfragen des Restaurants (offen + angeboten) */
  liste(restaurantId: string) {
    return q<Schichttausch>(`
      SELECT
        st.*,
        ma.name  AS anbieter_name,
        sa.datum AS anbieter_datum,
        sa.beginn AS anbieter_beginn,
        sa.ende   AS anbieter_ende,
        mb.name  AS annehmer_name,
        sb.datum AS annehmer_datum,
        sb.beginn AS annehmer_beginn,
        sb.ende   AS annehmer_ende
      FROM schichttausch st
      JOIN mitarbeiter ma ON st.anbieter_id = ma.id
      JOIN schichten   sa ON st.anbieter_schicht_id = sa.id
      LEFT JOIN mitarbeiter mb ON st.annehmer_id = mb.id
      LEFT JOIN schichten   sb ON st.annehmer_schicht_id = sb.id
      WHERE st.restaurant_id = $1
        AND st.status IN ('offen', 'angeboten')
      ORDER BY st.erstellt_am DESC
    `, [restaurantId]);
  },

  /** Tap 1a: MA bietet seine Schicht offen zum Tausch an (Freigeben) */
  erstellen(restaurantId: string, anbieterId: string, anbieterSchichtId: string) {
    return q1<Schichttausch>(`
      INSERT INTO schichttausch (restaurant_id, anbieter_id, anbieter_schicht_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [restaurantId, anbieterId, anbieterSchichtId]);
  },

  /** Tap 1b: MA schlägt direkten 1:1-Tausch vor → direkt status=angeboten */
  erstellenDirekt(
    restaurantId: string,
    anbieterId: string,
    anbieterSchichtId: string,
    annehmerId: string,
    annehmerSchichtId: string
  ) {
    return q1<Schichttausch>(`
      INSERT INTO schichttausch
        (restaurant_id, anbieter_id, anbieter_schicht_id, annehmer_id, annehmer_schicht_id, status)
      VALUES ($1, $2, $3, $4, $5, 'angeboten')
      RETURNING *
    `, [restaurantId, anbieterId, anbieterSchichtId, annehmerId, annehmerSchichtId]);
  },

  /** Tap 2: MA B nimmt Tausch an und bietet seine eigene Schicht */
  annehmen(id: string, restaurantId: string, annehmerId: string, annehmerSchichtId: string) {
    return q1<Schichttausch>(`
      UPDATE schichttausch
      SET annehmer_id = $1, annehmer_schicht_id = $2, status = 'angeboten'
      WHERE id = $3 AND restaurant_id = $4 AND status = 'offen'
      RETURNING *
    `, [annehmerId, annehmerSchichtId, id, restaurantId]);
  },

  /** Tap 3: Admin genehmigt → mitarbeiter_ids der beiden Schichten tauschen.
   *  Gibt { fehler: string } zurück wenn eine Schicht nicht mehr dem ursprünglichen MA gehört. */
  async genehmigen(
    id: string,
    restaurantId: string
  ): Promise<Schichttausch | { fehler: string } | null> {
    const tausch = await q1<Schichttausch>(
      `SELECT * FROM schichttausch
       WHERE id = $1 AND restaurant_id = $2 AND status = 'angeboten'`,
      [id, restaurantId]
    );
    if (!tausch || !tausch.annehmer_id || !tausch.annehmer_schicht_id) return null;

    // ── Eigentumscheck: Schichten müssen noch den ursprünglichen MAs gehören ──
    const anbieterSchicht = await q1<{ mitarbeiter_id: string }>(
      `SELECT mitarbeiter_id FROM schichten WHERE id = $1 AND restaurant_id = $2`,
      [tausch.anbieter_schicht_id, restaurantId]
    );
    if (!anbieterSchicht || anbieterSchicht.mitarbeiter_id !== tausch.anbieter_id) {
      return { fehler: 'Die Schicht des Anbieters gehört nicht mehr dieser Person. Bitte Tausch ablehnen und neu anlegen.' };
    }

    const annehmerSchicht = await q1<{ mitarbeiter_id: string }>(
      `SELECT mitarbeiter_id FROM schichten WHERE id = $1 AND restaurant_id = $2`,
      [tausch.annehmer_schicht_id, restaurantId]
    );
    if (!annehmerSchicht || annehmerSchicht.mitarbeiter_id !== tausch.annehmer_id) {
      return { fehler: 'Die Schicht des Annehmers gehört nicht mehr dieser Person. Bitte Tausch ablehnen und neu anlegen.' };
    }

    // Beide Schichten gleichzeitig updaten — mitarbeiter_ids vertauschen
    await q(`
      UPDATE schichten SET mitarbeiter_id = CASE
        WHEN id = $1 THEN $2
        WHEN id = $3 THEN $4
      END
      WHERE id IN ($1, $3)
    `, [
      tausch.anbieter_schicht_id, tausch.annehmer_id,
      tausch.annehmer_schicht_id, tausch.anbieter_id,
    ]);

    return q1<Schichttausch>(
      `UPDATE schichttausch SET status = 'genehmigt' WHERE id = $1 RETURNING *`,
      [id]
    );
  },

  /** Admin oder Anbieter lehnt ab → Anfrage zurücksetzen auf offen oder ganz ablehnen */
  ablehnen(id: string, restaurantId: string) {
    return q1<Schichttausch>(`
      UPDATE schichttausch
      SET status = 'abgelehnt', annehmer_id = NULL, annehmer_schicht_id = NULL
      WHERE id = $1 AND restaurant_id = $2 AND status IN ('offen', 'angeboten')
      RETURNING *
    `, [id, restaurantId]);
  },

  /** Anbieter zieht Tausch-Anfrage zurück (nur eigene, nur wenn noch offen) */
  zurueckziehen(id: string, restaurantId: string, anbieterId: string) {
    return q1<Schichttausch>(`
      UPDATE schichttausch
      SET status = 'abgelehnt'
      WHERE id = $1 AND restaurant_id = $2 AND anbieter_id = $3 AND status = 'offen'
      RETURNING *
    `, [id, restaurantId, anbieterId]);
  },

  /** Prüfe ob eine Schicht bereits in einem offenen/angebotenen Tausch steckt */
  schichtIstImTausch(schichtId: string, restaurantId: string) {
    return q1<{ vorhanden: boolean }>(`
      SELECT EXISTS (
        SELECT 1 FROM schichttausch
        WHERE restaurant_id = $1
          AND (anbieter_schicht_id = $2 OR annehmer_schicht_id = $2)
          AND status IN ('offen', 'angeboten')
      ) AS vorhanden
    `, [restaurantId, schichtId]);
  },
};
