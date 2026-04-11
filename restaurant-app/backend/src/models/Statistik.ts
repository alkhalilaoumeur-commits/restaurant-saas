import { q, q1 } from './db';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CrmMetriken {
  stammgaeste: number;       // Gäste mit ≥ 2 Reservierungen
  alleGaesteCrm: number;     // Gesamtzahl CRM-Profile
  wiederkehrquote: number;   // % Gäste die wiedergekommen sind
  noShowRate: number;        // % No-Shows (letzte N Tage)
  neueGaeste: number;        // Neue CRM-Profile im Zeitraum
}

export interface Zusammenfassung {
  umsatz: number;
  bestellungen: number;
  durchschnitt: number;
  reservierungen: number;
}

export interface UmsatzProTag {
  datum: string;
  umsatz: number;
  anzahl: number;
}

export interface BeliebtesGericht {
  name: string;
  kategorie: string;
  menge: number;
  umsatz: number;
}

export interface Stosszeit {
  stunde: number;
  anzahl: number;
  umsatz: number;
}

export interface KategorieUmsatz {
  name: string;
  umsatz: number;
  anzahl: number;
}

// ─── Model ───────────────────────────────────────────────────────────────────

export const StatistikModel = {
  /** Zusammenfassung: Umsatz, Bestellungen, Durchschnitt, Reservierungen */
  async zusammenfassung(restaurantId: string, tage: number): Promise<Zusammenfassung> {
    const bestell = await q1<{ umsatz: string; anzahl: string }>(`
      SELECT
        COALESCE(SUM(gesamtpreis), 0) AS umsatz,
        COUNT(*)::text AS anzahl
      FROM bestellungen
      WHERE restaurant_id = $1
        AND status IN ('serviert', 'bezahlt')
        AND erstellt_am >= NOW() - INTERVAL '1 day' * $2
    `, [restaurantId, tage]);

    const umsatz = parseFloat(bestell?.umsatz || '0');
    const bestellungen = parseInt(bestell?.anzahl || '0', 10);

    const reserv = await q1<{ anzahl: string }>(`
      SELECT COUNT(*)::text AS anzahl
      FROM reservierungen
      WHERE restaurant_id = $1
        AND datum >= NOW() - INTERVAL '1 day' * $2
        AND status != 'storniert'
    `, [restaurantId, tage]);

    return {
      umsatz,
      bestellungen,
      durchschnitt: bestellungen > 0 ? umsatz / bestellungen : 0,
      reservierungen: parseInt(reserv?.anzahl || '0', 10),
    };
  },

  /** Umsatz & Bestellungen pro Tag */
  async umsatzProTag(restaurantId: string, tage: number): Promise<UmsatzProTag[]> {
    return q<UmsatzProTag>(`
      SELECT
        TO_CHAR(erstellt_am::date, 'YYYY-MM-DD') AS datum,
        COALESCE(SUM(gesamtpreis), 0)::float AS umsatz,
        COUNT(*)::int AS anzahl
      FROM bestellungen
      WHERE restaurant_id = $1
        AND status IN ('serviert', 'bezahlt')
        AND erstellt_am >= NOW() - INTERVAL '1 day' * $2
      GROUP BY erstellt_am::date
      ORDER BY erstellt_am::date
    `, [restaurantId, tage]);
  },

  /** Top 10 beliebteste Gerichte nach Menge */
  async beliebteGerichte(restaurantId: string, tage: number): Promise<BeliebtesGericht[]> {
    return q<BeliebtesGericht>(`
      SELECT
        g.name,
        COALESCE(k.name, 'Ohne Kategorie') AS kategorie,
        SUM(bp.menge)::int AS menge,
        SUM(bp.einzelpreis * bp.menge)::float AS umsatz
      FROM bestellpositionen bp
      JOIN bestellungen b ON bp.bestellung_id = b.id
      JOIN gerichte g ON bp.gericht_id = g.id
      LEFT JOIN kategorien k ON g.kategorie_id = k.id
      WHERE b.restaurant_id = $1
        AND b.status IN ('serviert', 'bezahlt')
        AND b.erstellt_am >= NOW() - INTERVAL '1 day' * $2
      GROUP BY g.name, k.name
      ORDER BY menge DESC
      LIMIT 10
    `, [restaurantId, tage]);
  },

  /** Bestellungen pro Stunde (Stosszeiten) */
  async stosszeiten(restaurantId: string, tage: number): Promise<Stosszeit[]> {
    return q<Stosszeit>(`
      SELECT
        EXTRACT(HOUR FROM erstellt_am)::int AS stunde,
        COUNT(*)::int AS anzahl,
        COALESCE(SUM(gesamtpreis), 0)::float AS umsatz
      FROM bestellungen
      WHERE restaurant_id = $1
        AND status IN ('serviert', 'bezahlt')
        AND erstellt_am >= NOW() - INTERVAL '1 day' * $2
      GROUP BY EXTRACT(HOUR FROM erstellt_am)
      ORDER BY stunde
    `, [restaurantId, tage]);
  },

  /** CRM-Metriken: Stammgäste, Wiederkehrquote, No-Show-Rate, neue Gäste */
  async crmMetriken(restaurantId: string, tage: number): Promise<CrmMetriken> {
    // Stammgäste: Gäste mit ≥ 2 Reservierungen (gesamt, nicht nur im Zeitraum)
    const stammRow = await q1<{ stammgaeste: string; alle: string }>(`
      SELECT
        COUNT(CASE WHEN anzahl >= 2 THEN 1 END)::text AS stammgaeste,
        COUNT(*)::text                                 AS alle
      FROM (
        SELECT gast_id, COUNT(*) AS anzahl
        FROM reservierungen
        WHERE restaurant_id = $1
          AND gast_id IS NOT NULL
          AND status NOT IN ('storniert')
        GROUP BY gast_id
      ) sub
    `, [restaurantId]);

    // No-Show-Rate im gewählten Zeitraum
    const noShowRow = await q1<{ gesamt: string; no_show: string }>(`
      SELECT
        COUNT(CASE WHEN status IN ('bestaetigt', 'abgeschlossen', 'no_show') THEN 1 END)::text AS gesamt,
        COUNT(CASE WHEN status = 'no_show' THEN 1 END)::text                                   AS no_show
      FROM reservierungen
      WHERE restaurant_id = $1
        AND datum >= NOW() - INTERVAL '1 day' * $2
    `, [restaurantId, tage]);

    // Neue Gäste im CRM im gewählten Zeitraum
    const neueRow = await q1<{ neue: string }>(`
      SELECT COUNT(*)::text AS neue
      FROM gaeste
      WHERE restaurant_id = $1
        AND erstellt_am >= NOW() - INTERVAL '1 day' * $2
    `, [restaurantId, tage]);

    // Gesamtzahl CRM-Profile
    const alleRow = await q1<{ alle: string }>(`
      SELECT COUNT(*)::text AS alle
      FROM gaeste
      WHERE restaurant_id = $1
    `, [restaurantId]);

    const stammgaeste = parseInt(stammRow?.stammgaeste || '0', 10);
    const alleVerknuepft = parseInt(stammRow?.alle || '0', 10);
    const gesamt = parseInt(noShowRow?.gesamt || '0', 10);
    const noShow = parseInt(noShowRow?.no_show || '0', 10);

    return {
      stammgaeste,
      alleGaesteCrm: parseInt(alleRow?.alle || '0', 10),
      wiederkehrquote: alleVerknuepft > 0 ? Math.round((stammgaeste / alleVerknuepft) * 100) : 0,
      noShowRate: gesamt > 0 ? Math.round((noShow / gesamt) * 100) : 0,
      neueGaeste: parseInt(neueRow?.neue || '0', 10),
    };
  },

  /** Umsatz nach Kategorie */
  async kategorieUmsatz(restaurantId: string, tage: number): Promise<KategorieUmsatz[]> {
    return q<KategorieUmsatz>(`
      SELECT
        COALESCE(k.name, 'Ohne Kategorie') AS name,
        SUM(bp.einzelpreis * bp.menge)::float AS umsatz,
        SUM(bp.menge)::int AS anzahl
      FROM bestellpositionen bp
      JOIN bestellungen b ON bp.bestellung_id = b.id
      JOIN gerichte g ON bp.gericht_id = g.id
      LEFT JOIN kategorien k ON g.kategorie_id = k.id
      WHERE b.restaurant_id = $1
        AND b.status IN ('serviert', 'bezahlt')
        AND b.erstellt_am >= NOW() - INTERVAL '1 day' * $2
      GROUP BY k.name
      ORDER BY umsatz DESC
    `, [restaurantId, tage]);
  },
};
