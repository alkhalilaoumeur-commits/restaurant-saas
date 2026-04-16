import { q, q1 } from './db';

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface Bewertung {
  id: string;
  restaurant_id: string;
  buchungs_id: string | null;
  token: string;
  stern: number | null;
  kommentar: string | null;
  gast_name: string;
  gast_email: string;
  dsgvo_einwilligung: boolean;
  antwort_text: string | null;
  antwort_datum: string | null;
  status: 'offen' | 'abgeschlossen';
  erstellt_am: string;
}

export interface BewertungMitRestaurant extends Bewertung {
  restaurant_name: string;
  google_bewertungs_link: string | null;
}

export interface BewertungStats {
  gesamt: number;
  abgeschlossen: number;
  durchschnitt: number | null;
  verteilung: Record<1 | 2 | 3 | 4 | 5, number>;
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const BewertungModel = {
  /**
   * Legt einen neuen Bewertungs-Link an (noch kein Rating, status = 'offen').
   * Wird aufgerufen wenn die E-Mail an den Gast geschickt wird.
   */
  async erstellen(daten: {
    restaurant_id: string;
    buchungs_id?: string | null;
    gast_name: string;
    gast_email: string;
  }): Promise<Bewertung> {
    const result = await q1<Bewertung>(
      `INSERT INTO bewertungen (restaurant_id, buchungs_id, gast_name, gast_email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [daten.restaurant_id, daten.buchungs_id || null, daten.gast_name, daten.gast_email]
    );
    return result!;
  },

  /**
   * Öffentlich: Bewertung per Token laden.
   * Gibt Restaurant-Name und Google-Link mit zurück → für die öffentliche Seite.
   */
  async nachToken(token: string): Promise<BewertungMitRestaurant | null> {
    const result = await q1<BewertungMitRestaurant>(
      `SELECT b.*, r.name AS restaurant_name, r.google_bewertungs_link
       FROM bewertungen b
       JOIN restaurants r ON r.id = b.restaurant_id
       WHERE b.token = $1`,
      [token]
    );
    return result || null;
  },

  /**
   * Öffentlich: Rating + Kommentar speichern → status auf 'abgeschlossen' setzen.
   */
  async bewertungAbgeben(token: string, daten: {
    stern: number;
    kommentar?: string | null;
    dsgvo_einwilligung: boolean;
  }): Promise<Bewertung | null> {
    // Nur abgebbar wenn status = 'offen' (Einmal-Bewertung)
    return await q1<Bewertung>(
      `UPDATE bewertungen
       SET stern = $1, kommentar = $2, dsgvo_einwilligung = $3, status = 'abgeschlossen'
       WHERE token = $4 AND status = 'offen'
       RETURNING *`,
      [daten.stern, daten.kommentar || null, daten.dsgvo_einwilligung, token]
    ) || null;
  },

  /**
   * Admin: Alle Bewertungen eines Restaurants laden (neueste zuerst).
   */
  async alleNachRestaurant(restaurant_id: string): Promise<Bewertung[]> {
    return await q<Bewertung>(
      `SELECT * FROM bewertungen
       WHERE restaurant_id = $1
       ORDER BY erstellt_am DESC`,
      [restaurant_id]
    );
  },

  /**
   * Admin: Auf eine Bewertung antworten.
   */
  async antwortSpeichern(id: string, restaurant_id: string, antwort_text: string): Promise<Bewertung | null> {
    return await q1<Bewertung>(
      `UPDATE bewertungen
       SET antwort_text = $1, antwort_datum = NOW()
       WHERE id = $2 AND restaurant_id = $3
       RETURNING *`,
      [antwort_text, id, restaurant_id]
    ) || null;
  },

  /**
   * Admin: Statistiken — Durchschnitt, Anzahl, Stern-Verteilung.
   */
  async stats(restaurant_id: string): Promise<BewertungStats> {
    const [gesamt, abgeschlossen, avg, verteilungRoh] = await Promise.all([
      q1<{ count: string }>('SELECT COUNT(*) FROM bewertungen WHERE restaurant_id = $1', [restaurant_id]),
      q1<{ count: string }>('SELECT COUNT(*) FROM bewertungen WHERE restaurant_id = $1 AND status = $2', [restaurant_id, 'abgeschlossen']),
      q1<{ avg: string | null }>('SELECT AVG(stern)::NUMERIC(3,1) AS avg FROM bewertungen WHERE restaurant_id = $1 AND stern IS NOT NULL', [restaurant_id]),
      q<{ stern: number; count: string }>(
        `SELECT stern, COUNT(*) AS count
         FROM bewertungen
         WHERE restaurant_id = $1 AND stern IS NOT NULL
         GROUP BY stern`,
        [restaurant_id]
      ),
    ]);

    const verteilung: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of verteilungRoh) {
      verteilung[row.stern] = parseInt(row.count);
    }

    return {
      gesamt: parseInt(gesamt?.count || '0'),
      abgeschlossen: parseInt(abgeschlossen?.count || '0'),
      durchschnitt: avg?.avg ? parseFloat(avg.avg) : null,
      verteilung: verteilung as Record<1 | 2 | 3 | 4 | 5, number>,
    };
  },
};
