import crypto from 'crypto';
import { q, q1 } from './db';

export type ReservierungStatus = 'ausstehend' | 'bestaetigt' | 'storniert' | 'no_show' | 'abgeschlossen';
export type ReservierungQuelle = 'app' | 'whatsapp' | 'telefon' | 'online' | 'google';

export interface Reservierung {
  id: string;
  restaurant_id: string;
  tisch_id: string | null;
  tisch_kombiniert_id: string | null;
  gast_id: string | null;
  gast_name: string;
  telefon: string | null; // DSGVO: personenbezogen, 30 Tage Löschfrist
  email: string | null;   // DSGVO: personenbezogen, 30 Tage Löschfrist
  datum: string;
  personen: number;
  status: ReservierungStatus;
  anmerkung: string | null;
  anlass: string | null;
  sitzplatz_wunsch: string | null;
  quelle: ReservierungQuelle;
  buchungs_token: string | null;
  dsgvo_einwilligung: boolean;
  erinnerung_gesendet: Record<string, boolean>;
  verweilzeit_min: number;
  tags: string[];
  erstellt_am: string;
}

/** Reservierung + Restaurant-Name (für Self-Service-Seiten) */
export interface ReservierungMitRestaurant extends Reservierung {
  restaurant_name: string;
  restaurant_adresse: string | null;
}

/** Reservierung mit Gast-Stats aus dem CRM (für Tischplan-Liste) */
export interface ReservierungMitGast extends Reservierung {
  gast_besuche: number | null;        // Anzahl bisheriger Besuche (nur wenn gast_id gesetzt)
  gast_no_shows: number | null;       // Anzahl No-Shows (nur wenn gast_id gesetzt)
  gast_tags: string[] | null;         // Tags wie VIP, Stammgast, Vegan, Allergie...
}

export const ReservierungModel = {
  /**
   * Alle Reservierungen mit optionalen Gast-Stats (Besuche, No-Shows, Tags).
   * LEFT JOIN auf `gaeste` + Sub-Query für No-Show-Count.
   * Wenn keine gast_id verknüpft ist → alle Stats sind null.
   */
  alle(restaurantId: string, datum?: string) {
    const sql = `
      SELECT
        r.*,
        g.besuche AS gast_besuche,
        g.tags    AS gast_tags,
        (
          SELECT COUNT(*)::int FROM reservierungen rn
          WHERE rn.gast_id = g.id AND rn.status = 'no_show'
        ) AS gast_no_shows
      FROM reservierungen r
      LEFT JOIN gaeste g ON g.id = r.gast_id
      WHERE r.restaurant_id = $1
      ${datum ? 'AND DATE(r.datum) = $2' : ''}
      ORDER BY r.datum
    `;
    return q<ReservierungMitGast>(sql, datum ? [restaurantId, datum] : [restaurantId]);
  },

  erstellen(data: {
    id: string; restaurant_id: string; tisch_id: string | null;
    gast_name: string; telefon: string | null; datum: string;
    personen: number; status: ReservierungStatus;
    anmerkung: string | null; quelle: ReservierungQuelle;
  }) {
    return q1<Reservierung>(`
      INSERT INTO reservierungen (id, restaurant_id, tisch_id, gast_name, telefon, datum, personen, status, anmerkung, quelle)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
    `, [data.id, data.restaurant_id, data.tisch_id, data.gast_name, data.telefon,
        data.datum, data.personen, data.status, data.anmerkung, data.quelle]);
  },

  statusAendern(id: string, restaurantId: string, status: ReservierungStatus) {
    return q1<Reservierung>(
      'UPDATE reservierungen SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, restaurantId]
    );
  },

  loeschen(id: string, restaurantId: string) {
    return q1('DELETE FROM reservierungen WHERE id = $1 AND restaurant_id = $2 RETURNING id', [id, restaurantId]);
  },

  /** Tags an einer Reservierung setzen (z.B. Vegan, Geburtstag, Allergie) */
  tagsAendern(id: string, restaurantId: string, tags: string[]) {
    // Tags säubern: trim, leere raus, duplikate raus, max 50 Zeichen pro Tag
    const sauber = Array.from(new Set(
      tags.map(t => t.trim()).filter(t => t.length > 0 && t.length <= 50)
    )).slice(0, 10); // max 10 Tags pro Reservierung
    return q1<Reservierung>(
      'UPDATE reservierungen SET tags = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [sauber, id, restaurantId]
    );
  },

  /** Reservierung per Buchungs-Token finden (für Self-Service-Seiten) */
  nachToken(buchungsToken: string) {
    return q1<ReservierungMitRestaurant>(`
      SELECT r.*, rest.name as restaurant_name,
        CONCAT_WS(', ', rest.strasse, CONCAT(rest.plz, ' ', rest.stadt)) as restaurant_adresse
      FROM reservierungen r
      JOIN restaurants rest ON rest.id = r.restaurant_id
      WHERE r.buchungs_token = $1
    `, [buchungsToken]);
  },

  /** Neue Reservierung mit Token + Email (für Online-Buchungen) */
  erstellenMitToken(data: {
    restaurant_id: string;
    tisch_id: string | null;
    gast_name: string;
    /** DSGVO: Bei Google-Reserve-Webhook kann Email fehlen — dann null speichern */
    email: string | null;
    telefon: string | null;
    datum: string;
    personen: number;
    anmerkung: string | null;
    anlass: string | null;
    sitzplatz_wunsch: string | null;
    verweilzeit_min: number;
    dsgvo_einwilligung: boolean;
    /** Buchungsquelle — Standard 'online', 'google' wenn via Google Maps */
    quelle?: ReservierungQuelle;
  }) {
    const buchungsToken = crypto.randomBytes(32).toString('hex');
    const quelle = data.quelle ?? 'online';
    return q1<Reservierung>(`
      INSERT INTO reservierungen
        (restaurant_id, tisch_id, gast_name, email, telefon, datum, personen,
         status, anmerkung, anlass, sitzplatz_wunsch, quelle, buchungs_token,
         dsgvo_einwilligung, verweilzeit_min)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'bestaetigt',$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      data.restaurant_id, data.tisch_id, data.gast_name, data.email,
      data.telefon, data.datum, data.personen, data.anmerkung,
      data.anlass, data.sitzplatz_wunsch,
      quelle, buchungsToken, data.dsgvo_einwilligung, data.verweilzeit_min,
    ]);
  },

  /** Per Token stornieren (Gast-Self-Service) */
  stornieren(buchungsToken: string) {
    return q1<Reservierung>(
      `UPDATE reservierungen SET status = 'storniert'
       WHERE buchungs_token = $1 AND status != 'storniert'
       RETURNING *`,
      [buchungsToken]
    );
  },

  /** Per Token umbuchen — neues Datum + optionaler neuer Tisch */
  umbuchen(buchungsToken: string, neuesDatum: string, neuerTischId: string | null, neueVerweilzeit: number) {
    return q1<Reservierung>(
      `UPDATE reservierungen
       SET datum = $1, tisch_id = $2, verweilzeit_min = $3, erinnerung_gesendet = '{}'
       WHERE buchungs_token = $4 AND status != 'storniert'
       RETURNING *`,
      [neuesDatum, neuerTischId, neueVerweilzeit, buchungsToken]
    );
  },

  /** Erinnerung als gesendet markieren (z.B. typ = "24h" oder "3h") */
  erinnerungAktualisieren(id: string, typ: string) {
    return q1(
      `UPDATE reservierungen
       SET erinnerung_gesendet = erinnerung_gesendet || $1::jsonb
       WHERE id = $2`,
      [JSON.stringify({ [typ]: true }), id]
    );
  },

  /** Fällige Erinnerungen finden: bestätigte Reservierungen in X Stunden */
  faelligeErinnerungen(typ: '24h' | '3h') {
    const stunden = typ === '24h' ? 24 : 3;
    const fenster = typ === '24h' ? 1 : 1; // ±1 Stunde Fenster
    return q<Reservierung & { restaurant_name: string }>(`
      SELECT r.*, rest.name as restaurant_name
      FROM reservierungen r
      JOIN restaurants rest ON rest.id = r.restaurant_id
      WHERE r.status = 'bestaetigt'
        AND r.email IS NOT NULL
        AND r.datum BETWEEN NOW() + INTERVAL '${stunden - fenster} hours'
                        AND NOW() + INTERVAL '${stunden + fenster} hours'
        AND NOT (r.erinnerung_gesendet ? $1)
    `, [typ]);
  },

  /** Einzelne Reservierung per ID laden */
  nachId(id: string, restaurantId: string) {
    return q1<Reservierung>(
      'SELECT * FROM reservierungen WHERE id = $1 AND restaurant_id = $2',
      [id, restaurantId]
    );
  },

  /** Tisch manuell zuweisen (Admin/Kellner im Tischplan) */
  tischZuweisen(id: string, restaurantId: string, tischId: string | null) {
    return q1<Reservierung>(
      `UPDATE reservierungen SET tisch_id = $1
       WHERE id = $2 AND restaurant_id = $3 RETURNING *`,
      [tischId, id, restaurantId]
    );
  },

  /** Automatische Zuweisung: Haupt- + optionalen Kombinations-Tisch speichern */
  kombiniertZuweisen(id: string, restaurantId: string, hauptId: string, kombinierterTischId: string | null) {
    return q1<Reservierung>(
      `UPDATE reservierungen SET tisch_id = $1, tisch_kombiniert_id = $2
       WHERE id = $3 AND restaurant_id = $4 RETURNING *`,
      [hauptId, kombinierterTischId, id, restaurantId]
    );
  },

  /** DSGVO: Personenbezogene Daten 30 Tage nach Reservierungsdatum löschen */
  /**
   * DSGVO-Cleanup (Art. 5 Abs. 1 lit. e — Speicherbegrenzung).
   * Zwei Fristen, in einer Operation gebündelt:
   *  1) ALLE Reservierungen → 30 Tage nach Reservierungsdatum anonymisieren
   *  2) STORNIERTE Reservierungen → 7 Tage nach Stornierung anonymisieren
   *
   * Anonymisierung statt DELETE, damit Statistik-Aggregate (Anzahl Reservierungen,
   * No-Show-Rate, Storno-Quote) erhalten bleiben — ohne Personenbezug.
   */
  dsgvoAufraeumen() {
    return q(
      `UPDATE reservierungen
       SET gast_name = 'gelöscht', email = NULL, telefon = NULL, anmerkung = NULL
       WHERE gast_name != 'gelöscht'
         AND (
           datum < NOW() - INTERVAL '30 days'
           OR (status = 'storniert' AND storniert_am < NOW() - INTERVAL '7 days')
         )`
    );
  },
};
