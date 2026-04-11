import { q, q1 } from './db';

export interface Gast {
  id: string;
  restaurant_id: string;
  name: string;
  email: string | null;
  telefon: string | null;
  notizen: string | null;
  tags: string[];
  erstellt_am: string;
  aktualisiert_am: string;
  besuche: number;
  letzter_besuch: string | null;
}

export interface GastReservierung {
  id: string;
  datum: string;
  personen: number;
  status: string;
  anlass: string | null;
  tisch_nummer: number | null;
}

export interface GastMitReservierungen extends Gast {
  reservierungen: GastReservierung[];
}

const FELDER = `
  g.id, g.restaurant_id, g.name, g.email, g.telefon, g.notizen, g.tags,
  g.erstellt_am, g.aktualisiert_am,
  COUNT(r.id)::int          AS besuche,
  MAX(r.datum)::text        AS letzter_besuch
`;

export const GastModel = {
  /** Alle Gäste eines Restaurants mit Besuchsstatistik */
  alle(restaurantId: string): Promise<Gast[]> {
    return q<Gast>(
      `SELECT ${FELDER}
       FROM gaeste g
       LEFT JOIN reservierungen r ON r.gast_id = g.id
       WHERE g.restaurant_id = $1
       GROUP BY g.id
       ORDER BY g.name`,
      [restaurantId]
    );
  },

  /** Einzelner Gast mit Besuchsstatistik */
  nachId(id: string, restaurantId: string): Promise<Gast | null> {
    return q1<Gast>(
      `SELECT ${FELDER}
       FROM gaeste g
       LEFT JOIN reservierungen r ON r.gast_id = g.id
       WHERE g.id = $1 AND g.restaurant_id = $2
       GROUP BY g.id`,
      [id, restaurantId]
    );
  },

  /** Reservierungen eines Gastes (für das Profil-Modal) */
  async reservierungen(gastId: string, restaurantId: string): Promise<GastReservierung[]> {
    return q<GastReservierung>(
      `SELECT r.id, r.datum, r.personen, r.status, r.anlass,
              t.nummer AS tisch_nummer
       FROM reservierungen r
       LEFT JOIN tische t ON t.id = r.tisch_id
       WHERE r.gast_id = $1 AND r.restaurant_id = $2
       ORDER BY r.datum DESC`,
      [gastId, restaurantId]
    );
  },

  /** Manuell neuen Gast anlegen */
  erstellen(data: {
    restaurant_id: string;
    name: string;
    email?: string | null;
    telefon?: string | null;
    notizen?: string | null;
    tags?: string[];
  }): Promise<Gast | null> {
    return q1<Gast>(
      `WITH neu AS (
         INSERT INTO gaeste (restaurant_id, name, email, telefon, notizen, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *
       )
       SELECT n.*, 0::int AS besuche, NULL::text AS letzter_besuch
       FROM neu n`,
      [
        data.restaurant_id,
        data.name,
        data.email ?? null,
        data.telefon ?? null,
        data.notizen ?? null,
        data.tags ?? [],
      ]
    );
  },

  /** Gast aktualisieren (Name, Email, Telefon, Notizen, Tags) */
  aktualisieren(
    id: string,
    restaurantId: string,
    felder: {
      name?: string;
      email?: string | null;
      telefon?: string | null;
      notizen?: string | null;
      tags?: string[];
    }
  ): Promise<Gast | null> {
    const sets: string[] = ['aktualisiert_am = now()'];
    const vals: unknown[] = [];
    let idx = 1;
    if (felder.name !== undefined)    { sets.push(`name = $${idx++}`);    vals.push(felder.name); }
    if (felder.email !== undefined)   { sets.push(`email = $${idx++}`);   vals.push(felder.email); }
    if (felder.telefon !== undefined) { sets.push(`telefon = $${idx++}`); vals.push(felder.telefon); }
    if (felder.notizen !== undefined) { sets.push(`notizen = $${idx++}`); vals.push(felder.notizen); }
    if (felder.tags !== undefined)    { sets.push(`tags = $${idx++}`);    vals.push(felder.tags); }
    vals.push(id, restaurantId);
    return q1<Gast>(
      `WITH akt AS (
         UPDATE gaeste SET ${sets.join(', ')}
         WHERE id = $${idx++} AND restaurant_id = $${idx}
         RETURNING *
       )
       SELECT a.*, 0::int AS besuche, NULL::text AS letzter_besuch FROM akt a`,
      vals
    );
  },

  /** Gast löschen (DSGVO — gast_id auf Reservierungen wird auf NULL gesetzt via ON DELETE SET NULL) */
  loeschen(id: string, restaurantId: string): Promise<{ id: string } | null> {
    return q1<{ id: string }>(
      'DELETE FROM gaeste WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [id, restaurantId]
    );
  },

  /**
   * Intelligentes Auto-Linking: erkennt Wiederkehrerr über Email → Telefon → Name.
   *
   * Priorität:
   * 1. Email  — eindeutig, ON CONFLICT upsert
   * 2. Telefon — letzten 8 Ziffern vergleichen (toleriert +49/0-Varianten)
   * 3. Name   — case-insensitiv exakter Treffer im Restaurant
   * 4. Kein Treffer → neues Profil anlegen
   *
   * Gibt immer eine Gast-ID zurück.
   */
  async smartUpsert(data: {
    restaurant_id: string;
    name: string;
    email?: string | null;
    telefon?: string | null;
  }): Promise<string> {
    const { restaurant_id, name, telefon } = data;
    const email = data.email?.toLowerCase().trim() || null;
    const tel = telefon?.trim() || null;

    // ── 1. Email-Match (stärkste Identifikation) ─────────────────────────────
    if (email) {
      const row = await q1<{ id: string }>(
        `INSERT INTO gaeste (restaurant_id, name, email, telefon, loeschen_nach)
         VALUES ($1, $2, $3, $4, CURRENT_DATE + INTERVAL '2 years')
         ON CONFLICT (restaurant_id, email)
           DO UPDATE SET
             name          = EXCLUDED.name,
             telefon       = COALESCE(EXCLUDED.telefon, gaeste.telefon),
             aktualisiert_am = now(),
             loeschen_nach = CURRENT_DATE + INTERVAL '2 years'
         RETURNING id`,
        [restaurant_id, name, email, tel]
      );
      return row!.id;
    }

    // ── 2. Telefon-Match (letzte 8 Ziffern, toleriert Ländervorwahlen) ────────
    if (tel) {
      // Nur Ziffern behalten, dann letzte 8 vergleichen
      const vorhandener = await q1<{ id: string }>(
        `SELECT id FROM gaeste
         WHERE restaurant_id = $1
           AND telefon IS NOT NULL
           AND RIGHT(regexp_replace(telefon, '[^0-9]', '', 'g'), 8)
             = RIGHT(regexp_replace($2,      '[^0-9]', '', 'g'), 8)
           AND length(regexp_replace($2, '[^0-9]', '', 'g')) >= 6
         LIMIT 1`,
        [restaurant_id, tel]
      );
      if (vorhandener) {
        // Bekannten Gast aktualisieren (Name + Telefon ggf. ergänzen)
        await q1(
          `UPDATE gaeste SET name = $1, aktualisiert_am = now()
           WHERE id = $2`,
          [name, vorhandener.id]
        );
        return vorhandener.id;
      }
    }

    // Name-Matching wurde bewusst weggelassen (DSGVO):
    // Name ist kein eindeutiges Merkmal — zwei "Thomas Schmidt" würden fälschlich
    // zu einem Profil zusammengefasst. Nur Email + Telefon sind zuverlässige Identifikatoren.

    // ── 3. Neu anlegen ────────────────────────────────────────────────────────
    const neu = await q1<{ id: string }>(
      `INSERT INTO gaeste (restaurant_id, name, email, telefon, loeschen_nach)
       VALUES ($1, $2, $3, $4, CURRENT_DATE + INTERVAL '2 years')
       RETURNING id`,
      [restaurant_id, name, email, tel]
    );
    return neu!.id;
  },

  /**
   * Prüft die Besuchsanzahl des Gastes und setzt/entfernt den "Stammgast"-Tag
   * automatisch. Schwelle: ab STAMMGAST_SCHWELLE Besuche (Status: bestaetigt oder
   * abgeschlossen) wird der Tag hinzugefügt; darunter entfernt.
   *
   * Wird nach jeder Reservierungs-Verknüpfung aufgerufen (fire-and-forget).
   */
  async stammgastAktualisieren(gastId: string): Promise<void> {
    const STAMMGAST_SCHWELLE = 3;

    // Anzahl verknüpfter Reservierungen zählen
    const row = await q1<{ besuche: number; tags: string[] }>(
      `SELECT
         COUNT(r.id)::int AS besuche,
         g.tags
       FROM gaeste g
       LEFT JOIN reservierungen r ON r.gast_id = g.id
       WHERE g.id = $1
       GROUP BY g.id`,
      [gastId]
    );
    if (!row) return;

    const { besuche, tags } = row;
    const hatTag = tags.includes('Stammgast');

    if (besuche >= STAMMGAST_SCHWELLE && !hatTag) {
      // Stammgast-Tag hinzufügen
      await q1(
        `UPDATE gaeste
         SET tags = array_append(tags, 'Stammgast'), aktualisiert_am = now()
         WHERE id = $1`,
        [gastId]
      );
    } else if (besuche < STAMMGAST_SCHWELLE && hatTag) {
      // Tag entfernen (kann durch DSGVO-Löschung passieren)
      await q1(
        `UPDATE gaeste
         SET tags = array_remove(tags, 'Stammgast'), aktualisiert_am = now()
         WHERE id = $1`,
        [gastId]
      );
    }
  },
};
