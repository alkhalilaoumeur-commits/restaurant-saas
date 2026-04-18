import { q, q1 } from './db';
import crypto from 'crypto';

// ──────────────────────────────────────────────────────────
// Verschlüsselung für API-Keys
// AES-256-GCM: symmetrische Verschlüsselung, sehr sicher.
// Der Schlüssel kommt aus der Umgebungsvariable KSS_ENCRYPTION_KEY.
// Ohne diesen Schlüssel können gespeicherte API-Keys nicht entschlüsselt werden.
// ──────────────────────────────────────────────────────────

const ALGO = 'aes-256-gcm';

function getEncKey(): Buffer {
  const key = process.env.KSS_ENCRYPTION_KEY;
  if (!key) throw new Error('KSS_ENCRYPTION_KEY nicht gesetzt');
  // SHA-256 des Schlüssels → immer 32 Bytes, egal wie lang der Schlüssel ist
  return crypto.createHash('sha256').update(key).digest();
}

/** API-Key verschlüsseln → gespeicherter String im Format: iv:authTag:verschlüsselt */
export function apiKeyVerschluesseln(klartext: string): string {
  const iv = crypto.randomBytes(12); // 12 Bytes IV für GCM
  const cipher = crypto.createCipheriv(ALGO, getEncKey(), iv);
  const encrypted = Buffer.concat([cipher.update(klartext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/** Gespeicherten String entschlüsseln → Klartext API-Key */
export function apiKeyEntschluesseln(gespeichert: string): string {
  const [ivHex, authTagHex, encHex] = gespeichert.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, getEncKey(), iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

// ──────────────────────────────────────────────────────────
// TypeScript-Typen
// ──────────────────────────────────────────────────────────

export type KssAnbieter = 'deaktiviert' | 'generic_webhook' | 'orderbird' | 'ready2order' | 'sumup';

export interface KssKonfig {
  id: string;
  restaurant_id: string;
  anbieter: KssAnbieter;
  webhook_url: string | null;
  aktiv: boolean;
  hat_api_key: boolean; // niemals den echten Key zurückgeben!
  erstellt_am: string;
  aktualisiert_am: string;
}

export interface KssLogEintrag {
  id: string;
  bestellung_id: string;
  anbieter: string;
  status: 'success' | 'failed' | 'retrying';
  http_status: number | null;
  fehler_meldung: string | null;
  versuche: number;
  erstellt_am: string;
}

// ──────────────────────────────────────────────────────────
// Datenbank-Queries
// ──────────────────────────────────────────────────────────

export const KssModel = {

  /** Aktuelle Konfiguration für ein Restaurant laden (ohne API-Key im Klartext) */
  async laden(restaurantId: string): Promise<KssKonfig | null> {
    return q1<KssKonfig>(
      `SELECT id, restaurant_id, anbieter, webhook_url, aktiv,
              (api_key_enc IS NOT NULL) AS hat_api_key,
              erstellt_am, aktualisiert_am
       FROM kss_konfiguration
       WHERE restaurant_id = $1`,
      [restaurantId]
    );
  },

  /** Konfiguration speichern (anlegen oder aktualisieren) */
  async speichern(restaurantId: string, daten: {
    anbieter: KssAnbieter;
    webhook_url?: string | null;
    api_key?: string | null; // Klartext → wird verschlüsselt
    aktiv?: boolean;
  }): Promise<KssKonfig> {
    const api_key_enc = daten.api_key
      ? apiKeyVerschluesseln(daten.api_key)
      : daten.api_key === null
        ? null  // explizit löschen
        : undefined; // undefined = nicht ändern

    // UPSERT: Wenn Konfiguration schon existiert → aktualisieren, sonst anlegen
    const row = await q1<KssKonfig>(
      `INSERT INTO kss_konfiguration (restaurant_id, anbieter, webhook_url, api_key_enc, aktiv)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (restaurant_id) DO UPDATE SET
         anbieter        = EXCLUDED.anbieter,
         webhook_url     = EXCLUDED.webhook_url,
         api_key_enc     = COALESCE(EXCLUDED.api_key_enc, kss_konfiguration.api_key_enc),
         aktiv           = EXCLUDED.aktiv,
         aktualisiert_am = now()
       RETURNING id, restaurant_id, anbieter, webhook_url, aktiv,
                 (api_key_enc IS NOT NULL) AS hat_api_key,
                 erstellt_am, aktualisiert_am`,
      [
        restaurantId,
        daten.anbieter,
        daten.webhook_url ?? null,
        api_key_enc ?? null,
        daten.aktiv ?? true,
      ]
    );
    return row!;
  },

  /** Vollständige Konfiguration mit entschlüsseltem API-Key (nur intern im Service verwenden!) */
  async ladenIntern(restaurantId: string): Promise<{
    anbieter: KssAnbieter;
    webhook_url: string | null;
    api_key: string | null; // entschlüsselt
    aktiv: boolean;
  } | null> {
    const row = await q1<{
      anbieter: KssAnbieter;
      webhook_url: string | null;
      api_key_enc: string | null;
      aktiv: boolean;
    }>(
      `SELECT anbieter, webhook_url, api_key_enc, aktiv
       FROM kss_konfiguration
       WHERE restaurant_id = $1`,
      [restaurantId]
    );
    if (!row) return null;
    return {
      anbieter: row.anbieter,
      webhook_url: row.webhook_url,
      api_key: row.api_key_enc ? apiKeyEntschluesseln(row.api_key_enc) : null,
      aktiv: row.aktiv,
    };
  },

  /** Push-Versuch loggen */
  async loggen(daten: {
    restaurant_id: string;
    bestellung_id: string;
    anbieter: string;
    status: 'success' | 'failed' | 'retrying';
    http_status?: number | null;
    fehler_meldung?: string | null;
    versuche: number;
  }): Promise<void> {
    await q(
      `INSERT INTO kss_log (restaurant_id, bestellung_id, anbieter, status, http_status, fehler_meldung, versuche)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        daten.restaurant_id,
        daten.bestellung_id,
        daten.anbieter,
        daten.status,
        daten.http_status ?? null,
        daten.fehler_meldung ?? null,
        daten.versuche,
      ]
    );
  },

  /** Letzte Log-Einträge für ein Restaurant */
  async logLaden(restaurantId: string, limit = 50): Promise<KssLogEintrag[]> {
    return q<KssLogEintrag>(
      `SELECT id, bestellung_id, anbieter, status, http_status, fehler_meldung, versuche, erstellt_am
       FROM kss_log
       WHERE restaurant_id = $1
       ORDER BY erstellt_am DESC
       LIMIT $2`,
      [restaurantId, limit]
    );
  },

  /** Anzahl aufeinanderfolgender Fehler (für Alert-Logik) */
  async letzteFehlerAnzahl(restaurantId: string): Promise<number> {
    // Letzte 10 Einträge prüfen — wie viele sind am Stück 'failed'?
    const rows = await q<{ status: string }>(
      `SELECT status FROM kss_log
       WHERE restaurant_id = $1
       ORDER BY erstellt_am DESC
       LIMIT 10`,
      [restaurantId]
    );
    let fehlerInFolge = 0;
    for (const row of rows) {
      if (row.status === 'failed') fehlerInFolge++;
      else break; // sobald ein Erfolg kommt, aufhören
    }
    return fehlerInFolge;
  },
};
