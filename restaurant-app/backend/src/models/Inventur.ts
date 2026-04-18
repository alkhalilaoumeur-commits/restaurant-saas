import { q, q1 } from './db';

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface Lieferant {
  id: string;
  restaurant_id: string;
  name: string;
  kontakt_email: string | null;
  kontakt_telefon: string | null;
  liefertage: string[];
  notiz: string | null;
  aktiv: boolean;
  erstellt_am: string;
}

export interface InventarArtikel {
  id: string;
  restaurant_id: string;
  lieferant_id: string | null;
  lieferant_name?: string | null;
  name: string;
  kategorie: string;
  einheit: string;
  aktueller_bestand: number;
  mindestbestand: number;
  einkaufspreis: number | null;
  aktiv: boolean;
  erstellt_am: string;
  // Abgeleitetes Feld: true wenn Bestand unter Mindestbestand
  unter_mindestbestand?: boolean;
}

export interface LagerBewegung {
  id: string;
  restaurant_id: string;
  artikel_id: string;
  artikel_name?: string;
  einheit?: string;
  typ: 'eingang' | 'abgang' | 'korrektur' | 'bestellung';
  delta: number;
  notiz: string | null;
  erstellt_am: string;
}

export interface Rezeptur {
  id: string;
  restaurant_id: string;
  gericht_id: string;
  gericht_name?: string;
  artikel_id: string;
  artikel_name?: string;
  einheit?: string;
  menge: number;
}

export interface InventurAuswertung {
  artikel_id: string;
  artikel_name: string;
  einheit: string;
  eingang_gesamt: number;
  abgang_gesamt: number;
  kosten_gesamt: number;
}

// ─── Lieferanten ─────────────────────────────────────────────────────────────

export const LieferantModel = {
  alle(restaurantId: string) {
    return q<Lieferant>(
      `SELECT * FROM lieferanten WHERE restaurant_id = $1 ORDER BY name`,
      [restaurantId]
    );
  },

  nachId(id: string, restaurantId: string) {
    return q1<Lieferant>(
      `SELECT * FROM lieferanten WHERE id = $1 AND restaurant_id = $2`,
      [id, restaurantId]
    );
  },

  erstellen(daten: Omit<Lieferant, 'id' | 'erstellt_am'>) {
    return q1<Lieferant>(
      `INSERT INTO lieferanten (restaurant_id, name, kontakt_email, kontakt_telefon, liefertage, notiz)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [daten.restaurant_id, daten.name, daten.kontakt_email ?? null,
       daten.kontakt_telefon ?? null, daten.liefertage ?? [], daten.notiz ?? null]
    );
  },

  aktualisieren(id: string, restaurantId: string, daten: Partial<Lieferant>) {
    return q1<Lieferant>(
      `UPDATE lieferanten SET
        name             = COALESCE($1, name),
        kontakt_email    = COALESCE($2, kontakt_email),
        kontakt_telefon  = COALESCE($3, kontakt_telefon),
        liefertage       = COALESCE($4, liefertage),
        notiz            = COALESCE($5, notiz),
        aktiv            = COALESCE($6, aktiv)
       WHERE id = $7 AND restaurant_id = $8 RETURNING *`,
      [daten.name ?? null, daten.kontakt_email ?? null, daten.kontakt_telefon ?? null,
       daten.liefertage ?? null, daten.notiz ?? null, daten.aktiv ?? null, id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1(
      `DELETE FROM lieferanten WHERE id = $1 AND restaurant_id = $2 RETURNING id`,
      [id, restaurantId]
    );
  },
};

// ─── Inventar-Artikel ─────────────────────────────────────────────────────────

export const ArtikelModel = {
  alle(restaurantId: string) {
    return q<InventarArtikel>(
      `SELECT a.*, l.name AS lieferant_name,
              a.aktueller_bestand < a.mindestbestand AS unter_mindestbestand
       FROM inventar_artikel a
       LEFT JOIN lieferanten l ON l.id = a.lieferant_id
       WHERE a.restaurant_id = $1 AND a.aktiv = true
       ORDER BY a.kategorie, a.name`,
      [restaurantId]
    );
  },

  nachId(id: string, restaurantId: string) {
    return q1<InventarArtikel>(
      `SELECT a.*, l.name AS lieferant_name,
              a.aktueller_bestand < a.mindestbestand AS unter_mindestbestand
       FROM inventar_artikel a
       LEFT JOIN lieferanten l ON l.id = a.lieferant_id
       WHERE a.id = $1 AND a.restaurant_id = $2`,
      [id, restaurantId]
    );
  },

  erstellen(daten: {
    restaurant_id: string;
    lieferant_id?: string | null;
    name: string;
    kategorie: string;
    einheit: string;
    aktueller_bestand?: number;
    mindestbestand?: number;
    einkaufspreis?: number | null;
  }) {
    return q1<InventarArtikel>(
      `INSERT INTO inventar_artikel
         (restaurant_id, lieferant_id, name, kategorie, einheit, aktueller_bestand, mindestbestand, einkaufspreis)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [daten.restaurant_id, daten.lieferant_id ?? null, daten.name, daten.kategorie,
       daten.einheit, daten.aktueller_bestand ?? 0, daten.mindestbestand ?? 0,
       daten.einkaufspreis ?? null]
    );
  },

  aktualisieren(id: string, restaurantId: string, daten: Partial<InventarArtikel>) {
    return q1<InventarArtikel>(
      `UPDATE inventar_artikel SET
        name              = COALESCE($1, name),
        kategorie         = COALESCE($2, kategorie),
        einheit           = COALESCE($3, einheit),
        mindestbestand    = COALESCE($4, mindestbestand),
        einkaufspreis     = COALESCE($5, einkaufspreis),
        lieferant_id      = COALESCE($6, lieferant_id),
        aktiv             = COALESCE($7, aktiv)
       WHERE id = $8 AND restaurant_id = $9 RETURNING *`,
      [daten.name ?? null, daten.kategorie ?? null, daten.einheit ?? null,
       daten.mindestbestand ?? null, daten.einkaufspreis ?? null,
       daten.lieferant_id ?? null, daten.aktiv ?? null, id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    // Soft-Delete: aktiv = false, damit Bewegungen erhalten bleiben
    return q1(
      `UPDATE inventar_artikel SET aktiv = false WHERE id = $1 AND restaurant_id = $2 RETURNING id`,
      [id, restaurantId]
    );
  },

  unterMindestbestand(restaurantId: string) {
    return q<InventarArtikel>(
      `SELECT a.*, l.name AS lieferant_name, true AS unter_mindestbestand
       FROM inventar_artikel a
       LEFT JOIN lieferanten l ON l.id = a.lieferant_id
       WHERE a.restaurant_id = $1 AND a.aktiv = true
         AND a.aktueller_bestand < a.mindestbestand
       ORDER BY a.kategorie, a.name`,
      [restaurantId]
    );
  },
};

// ─── Lagerbewegungen ──────────────────────────────────────────────────────────

export const BewegungModel = {
  alleNachRestaurant(restaurantId: string, limit = 100) {
    return q<LagerBewegung>(
      `SELECT m.*, a.name AS artikel_name, a.einheit
       FROM lager_bewegungen m
       JOIN inventar_artikel a ON a.id = m.artikel_id
       WHERE m.restaurant_id = $1
       ORDER BY m.erstellt_am DESC
       LIMIT $2`,
      [restaurantId, limit]
    );
  },

  alleNachArtikel(artikelId: string, restaurantId: string) {
    return q<LagerBewegung>(
      `SELECT * FROM lager_bewegungen
       WHERE artikel_id = $1 AND restaurant_id = $2
       ORDER BY erstellt_am DESC`,
      [artikelId, restaurantId]
    );
  },

  /**
   * Bewegung erfassen + aktueller_bestand in inventar_artikel aktualisieren.
   * Gibt den aktualisierten Artikel zurück (für Mindestbestand-Check).
   */
  async erfassen(daten: {
    restaurant_id: string;
    artikel_id: string;
    typ: LagerBewegung['typ'];
    delta: number;
    notiz?: string | null;
  }): Promise<{ bewegung: LagerBewegung; artikel: InventarArtikel }> {
    const bewegung = await q1<LagerBewegung>(
      `INSERT INTO lager_bewegungen (restaurant_id, artikel_id, typ, delta, notiz)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [daten.restaurant_id, daten.artikel_id, daten.typ, daten.delta, daten.notiz ?? null]
    );

    // Bestand aktualisieren (nicht unter 0 fallen lassen)
    const artikel = await q1<InventarArtikel>(
      `UPDATE inventar_artikel
       SET aktueller_bestand = GREATEST(0, aktueller_bestand + $1)
       WHERE id = $2 AND restaurant_id = $3
       RETURNING *`,
      [daten.delta, daten.artikel_id, daten.restaurant_id]
    );

    return { bewegung: bewegung!, artikel: artikel! };
  },
};

// ─── Rezepturen ───────────────────────────────────────────────────────────────

export const RezepturModel = {
  nachGericht(gerichtId: string, restaurantId: string) {
    return q<Rezeptur>(
      `SELECT r.*, a.name AS artikel_name, a.einheit
       FROM rezepturen r
       JOIN inventar_artikel a ON a.id = r.artikel_id
       WHERE r.gericht_id = $1 AND r.restaurant_id = $2`,
      [gerichtId, restaurantId]
    );
  },

  erstellen(daten: { restaurant_id: string; gericht_id: string; artikel_id: string; menge: number }) {
    return q1<Rezeptur>(
      `INSERT INTO rezepturen (restaurant_id, gericht_id, artikel_id, menge)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (gericht_id, artikel_id) DO UPDATE SET menge = $4
       RETURNING *`,
      [daten.restaurant_id, daten.gericht_id, daten.artikel_id, daten.menge]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1(
      `DELETE FROM rezepturen WHERE id = $1 AND restaurant_id = $2 RETURNING id`,
      [id, restaurantId]
    );
  },

  /**
   * Automatischer Abzug bei Bestellung bezahlt.
   * Lädt alle Positionen der Bestellung, sucht Rezepturen, bucht Abgänge.
   * Gibt Artikel zurück die unter Mindestbestand gefallen sind (für Email-Alarm).
   */
  async bestandAbziehen(bestellungId: string, restaurantId: string): Promise<InventarArtikel[]> {
    // Alle Positionen der Bestellung laden (gericht_id + menge)
    const positionen = await q<{ gericht_id: string; menge: number }>(
      `SELECT gericht_id, menge FROM bestellpositionen
       WHERE bestellung_id = $1`,
      [bestellungId]
    );
    if (positionen.length === 0) return [];

    const unterMindestbestand: InventarArtikel[] = [];

    for (const pos of positionen) {
      const rezepturen = await q<{ artikel_id: string; menge: number }>(
        `SELECT artikel_id, menge FROM rezepturen
         WHERE gericht_id = $1 AND restaurant_id = $2`,
        [pos.gericht_id, restaurantId]
      );

      for (const rez of rezepturen) {
        const abzug = -(rez.menge * pos.menge); // negativ = Abgang
        const { artikel } = await BewegungModel.erfassen({
          restaurant_id: restaurantId,
          artikel_id: rez.artikel_id,
          typ: 'bestellung',
          delta: abzug,
          notiz: `Bestellung ${bestellungId}`,
        });

        // War der Artikel vor der Abbuchung über Mindestbestand und ist jetzt drunter?
        if (artikel.aktueller_bestand < artikel.mindestbestand) {
          unterMindestbestand.push(artikel);
        }
      }
    }

    return unterMindestbestand;
  },
};

// ─── Auswertung ───────────────────────────────────────────────────────────────

export const InventurAuswertungModel = {
  verbrauch(restaurantId: string, tage: number): Promise<InventurAuswertung[]> {
    return q<InventurAuswertung>(
      `SELECT
         a.id AS artikel_id,
         a.name AS artikel_name,
         a.einheit,
         COALESCE(SUM(CASE WHEN m.delta > 0 THEN m.delta ELSE 0 END), 0)::float  AS eingang_gesamt,
         COALESCE(SUM(CASE WHEN m.delta < 0 THEN ABS(m.delta) ELSE 0 END), 0)::float AS abgang_gesamt,
         COALESCE(SUM(CASE WHEN m.delta < 0 THEN ABS(m.delta) * COALESCE(a.einkaufspreis, 0) ELSE 0 END), 0)::float AS kosten_gesamt
       FROM inventar_artikel a
       LEFT JOIN lager_bewegungen m
         ON m.artikel_id = a.id
         AND m.erstellt_am >= NOW() - INTERVAL '1 day' * $2
       WHERE a.restaurant_id = $1 AND a.aktiv = true
       GROUP BY a.id, a.name, a.einheit
       ORDER BY kosten_gesamt DESC`,
      [restaurantId, tage]
    );
  },
};
