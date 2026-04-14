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
  erstellt_am: string;
}

/** Reservierung + Restaurant-Name (für Self-Service-Seiten) */
export interface ReservierungMitRestaurant extends Reservierung {
  restaurant_name: string;
  restaurant_adresse: string | null;
}

export const ReservierungModel = {
  alle(restaurantId: string, datum?: string) {
    if (datum) {
      return q<Reservierung>(
        'SELECT * FROM reservierungen WHERE restaurant_id = $1 AND DATE(datum) = $2 ORDER BY datum',
        [restaurantId, datum]
      );
    }
    return q<Reservierung>(
      'SELECT * FROM reservierungen WHERE restaurant_id = $1 ORDER BY datum',
      [restaurantId]
    );
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
  dsgvoAufraeumen() {
    return q(
      `UPDATE reservierungen
       SET gast_name = 'gelöscht', email = NULL, telefon = NULL, anmerkung = NULL
       WHERE datum < NOW() - INTERVAL '30 days'
         AND gast_name != 'gelöscht'`
    );
  },
};
