import { KssModel, KssAnbieter } from '../models/KssKonfiguration';
import { kssAlertEmailSenden } from './email';

// ──────────────────────────────────────────────────────────
// KSS-Service: Herzstück der Kassensystem-Integration
//
// Ablauf bei jeder neuen Bestellung:
// 1. KSS-Konfiguration für das Restaurant laden
// 2. Wenn deaktiviert → nichts tun
// 3. Richtigen Adapter aufrufen (Generic Webhook / orderbird / ...)
// 4. Bei Fehler: bis zu 3 Mal mit Wartezeit erneut versuchen
// 5. Jeden Versuch in kss_log speichern
// 6. Nach 3 aufeinanderfolgenden Fehlern → Email-Alert an Admin
// ──────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────
// Payload-Format das ServeFlow an jedes Kassensystem sendet
// ──────────────────────────────────────────────────────────
export interface KssBestellungPayload {
  event: 'neue_bestellung';
  serveflow_version: '1.0';
  timestamp: string;
  bestellung: {
    id: string;
    tisch_nummer: number;
    anmerkung: string | null;
    gesamtpreis: number;
    positionen: Array<{
      name: string;
      menge: number;
      einzelpreis: number;
      extras: Array<{
        name: string;
        aufpreis: number;
      }>;
    }>;
  };
}

// Bestellung-Daten die bestellungen.ts an uns übergibt
export interface KssBestellungDaten {
  id: string;
  restaurant_id: string;
  tisch_nummer: number;
  anmerkung: string | null;
  gesamtpreis: number;
  positionen: Array<{
    name: string;
    menge: number;
    einzelpreis: number;
    extras: Array<{ name: string; aufpreis: number }>;
  }>;
}

// ──────────────────────────────────────────────────────────
// Hilfsfunktion: Warten (für Retry-Delays)
// ──────────────────────────────────────────────────────────
function warten(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry-Delays: 1. Versuch sofort, 2. nach 1s, 3. nach 5s
const RETRY_DELAYS = [0, 1000, 5000];

// ──────────────────────────────────────────────────────────
// ADAPTER: Generic Webhook
// Sendet Bestellung als JSON-POST an eine beliebige URL.
// Das Kassensystem muss diese URL bereitstellen und JSON empfangen können.
// ──────────────────────────────────────────────────────────
async function genericWebhookAdapter(
  payload: KssBestellungPayload,
  webhookUrl: string,
  apiKey: string | null
): Promise<{ ok: boolean; httpStatus: number; fehler?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-ServeFlow-Event': 'neue_bestellung',
    'X-ServeFlow-Version': '1.0',
  };

  // Wenn ein API-Key konfiguriert ist → als Bearer-Token senden
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000), // 10 Sekunden Timeout
    });

    if (response.ok) {
      return { ok: true, httpStatus: response.status };
    } else {
      const body = await response.text().catch(() => '');
      return {
        ok: false,
        httpStatus: response.status,
        fehler: `HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      fehler: err instanceof Error ? err.message : 'Unbekannter Fehler',
    };
  }
}

// ──────────────────────────────────────────────────────────
// ADAPTER: orderbird
//
// orderbird ist ein iPad-basiertes Kassensystem mit REST API.
// API-Docs: https://developer.orderbird.com
//
// WICHTIG: orderbird erlaubt das Erstellen von Bestellungen über ihre API.
// Dazu brauchst du:
// 1. Ein orderbird-Entwicklerkonto (developer.orderbird.com)
// 2. Einen API-Key deines Restaurants
// 3. Die Outlet-ID (welcher Standort?)
//
// Das Format hier basiert auf der orderbird API v1.
// Bei Problemen: API-Docs prüfen oder orderbird-Support kontaktieren.
// ──────────────────────────────────────────────────────────
async function orderbirdAdapter(
  payload: KssBestellungPayload,
  apiKey: string
): Promise<{ ok: boolean; httpStatus: number; fehler?: string }> {
  // orderbird-Format: Positionen müssen als "items" mit "product_name" und "quantity" übergeben werden
  const orderbirdBody = {
    table_label: `Tisch ${payload.bestellung.tisch_nummer}`,
    note: payload.bestellung.anmerkung || undefined,
    items: payload.bestellung.positionen.map((pos) => ({
      product_name: pos.name,
      quantity: pos.menge,
      unit_price: pos.einzelpreis * 100, // orderbird erwartet Cent, nicht Euro
      modifiers: pos.extras.map((e) => ({
        name: e.name,
        price: e.aufpreis * 100, // ebenfalls Cent
      })),
    })),
    external_reference: payload.bestellung.id, // ServeFlow-Bestellung-ID als Referenz
  };

  try {
    const response = await fetch('https://api.orderbird.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-ServeFlow-Source': 'serveflow-integration',
      },
      body: JSON.stringify(orderbirdBody),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      return { ok: true, httpStatus: response.status };
    } else {
      const body = await response.text().catch(() => '');
      return {
        ok: false,
        httpStatus: response.status,
        fehler: `orderbird HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      fehler: err instanceof Error ? err.message : 'Unbekannter Fehler',
    };
  }
}

// ──────────────────────────────────────────────────────────
// ADAPTER: Ready2order
// Ähnlich wie orderbird, aber mit eigenem API-Format.
// Docs: https://ready2order.com/api/doc
// ──────────────────────────────────────────────────────────
async function ready2orderAdapter(
  payload: KssBestellungPayload,
  apiKey: string
): Promise<{ ok: boolean; httpStatus: number; fehler?: string }> {
  const r2oBody = {
    order: {
      table: `${payload.bestellung.tisch_nummer}`,
      note: payload.bestellung.anmerkung || undefined,
      orderitems: payload.bestellung.positionen.map((pos) => ({
        name: pos.name,
        quantity: pos.menge,
        price: pos.einzelpreis,
        extras: pos.extras.map((e) => `${e.name} (+${e.aufpreis}€)`).join(', ') || undefined,
      })),
      external_id: payload.bestellung.id,
    },
  };

  try {
    const response = await fetch('https://api.ready2order.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(r2oBody),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      return { ok: true, httpStatus: response.status };
    } else {
      const body = await response.text().catch(() => '');
      return {
        ok: false,
        httpStatus: response.status,
        fehler: `ready2order HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      fehler: err instanceof Error ? err.message : 'Unbekannter Fehler',
    };
  }
}

// ──────────────────────────────────────────────────────────
// Payload zusammenbauen
// ──────────────────────────────────────────────────────────
function payloadBauen(bestellung: KssBestellungDaten): KssBestellungPayload {
  return {
    event: 'neue_bestellung',
    serveflow_version: '1.0',
    timestamp: new Date().toISOString(),
    bestellung: {
      id: bestellung.id,
      tisch_nummer: bestellung.tisch_nummer,
      anmerkung: bestellung.anmerkung,
      gesamtpreis: bestellung.gesamtpreis,
      positionen: bestellung.positionen,
    },
  };
}

// ──────────────────────────────────────────────────────────
// Richtigen Adapter aufrufen
// ──────────────────────────────────────────────────────────
async function adapterAufrufen(
  anbieter: KssAnbieter,
  payload: KssBestellungPayload,
  webhookUrl: string | null,
  apiKey: string | null
): Promise<{ ok: boolean; httpStatus: number; fehler?: string }> {
  switch (anbieter) {
    case 'generic_webhook':
      if (!webhookUrl) return { ok: false, httpStatus: 0, fehler: 'Keine Webhook-URL konfiguriert' };
      return genericWebhookAdapter(payload, webhookUrl, apiKey);

    case 'orderbird':
      if (!apiKey) return { ok: false, httpStatus: 0, fehler: 'Kein API-Key für orderbird konfiguriert' };
      return orderbirdAdapter(payload, apiKey);

    case 'ready2order':
      if (!apiKey) return { ok: false, httpStatus: 0, fehler: 'Kein API-Key für ready2order konfiguriert' };
      return ready2orderAdapter(payload, apiKey);

    default:
      return { ok: false, httpStatus: 0, fehler: `Unbekannter Anbieter: ${anbieter}` };
  }
}

// ──────────────────────────────────────────────────────────
// HAUPT-FUNKTION: wird von bestellungen.ts nach jedem INSERT aufgerufen
//
// Diese Funktion ist async aber wird NICHT awaited —
// d.h. sie läuft im Hintergrund und blockiert die API-Response nicht.
// Wenn die Kasse down ist, bekommt der Gast trotzdem seine Bestätigung.
// ──────────────────────────────────────────────────────────
export async function bestellungAnKssSenden(bestellung: KssBestellungDaten): Promise<void> {
  try {
    // 1. Konfiguration laden (mit entschlüsseltem API-Key)
    const konfig = await KssModel.ladenIntern(bestellung.restaurant_id);

    // 2. Wenn nicht konfiguriert oder deaktiviert → nichts tun
    if (!konfig || !konfig.aktiv || konfig.anbieter === 'deaktiviert') return;

    const payload = payloadBauen(bestellung);

    let letzterFehler: string | undefined;
    let letzterHttpStatus = 0;
    let erfolg = false;

    // 3. Bis zu 3 Versuche (mit Wartezeit dazwischen)
    for (let versuch = 0; versuch < RETRY_DELAYS.length; versuch++) {
      if (RETRY_DELAYS[versuch] > 0) {
        await warten(RETRY_DELAYS[versuch]);
      }

      const istLetzterVersuch = versuch === RETRY_DELAYS.length - 1;
      const status = versuch < RETRY_DELAYS.length - 1 ? 'retrying' : 'failed';

      const ergebnis = await adapterAufrufen(
        konfig.anbieter,
        payload,
        konfig.webhook_url,
        konfig.api_key
      );

      letzterHttpStatus = ergebnis.httpStatus;
      letzterFehler = ergebnis.fehler;

      if (ergebnis.ok) {
        // Erfolg loggen
        await KssModel.loggen({
          restaurant_id: bestellung.restaurant_id,
          bestellung_id: bestellung.id,
          anbieter: konfig.anbieter,
          status: 'success',
          http_status: ergebnis.httpStatus,
          versuche: versuch + 1,
        });
        erfolg = true;
        console.log(`[KSS] Bestellung ${bestellung.id} erfolgreich an ${konfig.anbieter} gesendet (Versuch ${versuch + 1})`);
        break;
      }

      // Fehler loggen (bei letztem Versuch als 'failed', sonst als 'retrying')
      await KssModel.loggen({
        restaurant_id: bestellung.restaurant_id,
        bestellung_id: bestellung.id,
        anbieter: konfig.anbieter,
        status: istLetzterVersuch ? 'failed' : status,
        http_status: letzterHttpStatus || null,
        fehler_meldung: letzterFehler,
        versuche: versuch + 1,
      });

      console.warn(`[KSS] Versuch ${versuch + 1} fehlgeschlagen: ${letzterFehler}`);
    }

    // 4. Wenn alle 3 Versuche scheitern: prüfen ob Email-Alert nötig
    if (!erfolg) {
      const fehlerInFolge = await KssModel.letzteFehlerAnzahl(bestellung.restaurant_id);
      if (fehlerInFolge >= 3) {
        // Admin-Email laden und Alert senden
        const { q1 } = await import('../models/db');
        const admin = await q1<{ email: string; restaurant_name: string }>(
          `SELECT m.email, r.name AS restaurant_name
           FROM mitarbeiter m
           JOIN restaurants r ON r.id = m.restaurant_id
           WHERE m.restaurant_id = $1 AND m.rolle = 'admin' AND m.aktiv = true
           LIMIT 1`,
          [bestellung.restaurant_id]
        );
        if (admin) {
          kssAlertEmailSenden(admin.email, admin.restaurant_name, konfig.anbieter, letzterFehler || 'Unbekannter Fehler')
            .catch(e => console.error('[KSS] Alert-Email Fehler:', e));
        }
      }
    }
  } catch (err) {
    // Fehler im KSS-Service dürfen niemals die Haupt-App abstürzen lassen
    console.error('[KSS] Unerwarteter Fehler im KSS-Service:', err);
  }
}

// ──────────────────────────────────────────────────────────
// TEST-FUNKTION: wird vom Test-Button in den Einstellungen aufgerufen
// Sendet eine Demo-Bestellung um die Verbindung zu prüfen
// ──────────────────────────────────────────────────────────
export async function kssVerbindungTesten(restaurantId: string): Promise<{
  erfolg: boolean;
  http_status?: number;
  fehler?: string;
}> {
  const konfig = await KssModel.ladenIntern(restaurantId);

  if (!konfig || konfig.anbieter === 'deaktiviert') {
    return { erfolg: false, fehler: 'Kein Kassensystem konfiguriert' };
  }

  const testPayload: KssBestellungPayload = {
    event: 'neue_bestellung',
    serveflow_version: '1.0',
    timestamp: new Date().toISOString(),
    bestellung: {
      id: 'test-00000000-0000-0000-0000-000000000000',
      tisch_nummer: 1,
      anmerkung: 'ServeFlow Verbindungstest — bitte ignorieren',
      gesamtpreis: 12.50,
      positionen: [
        {
          name: 'Testgericht',
          menge: 1,
          einzelpreis: 12.50,
          extras: [{ name: 'Testextra', aufpreis: 0.50 }],
        },
      ],
    },
  };

  const ergebnis = await adapterAufrufen(
    konfig.anbieter,
    testPayload,
    konfig.webhook_url,
    konfig.api_key
  );

  return {
    erfolg: ergebnis.ok,
    http_status: ergebnis.httpStatus || undefined,
    fehler: ergebnis.fehler,
  };
}
