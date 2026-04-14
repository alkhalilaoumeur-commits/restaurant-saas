/**
 * SMS-Service — Twilio-Integration
 *
 * Entwicklung: console.log (kein Twilio-Account nötig)
 * Produktion:  Twilio-Credentials in .env setzen:
 *   TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_PHONE_NUMBER=+4915112345678
 */

const TWILIO_SID        = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM       = process.env.TWILIO_PHONE_NUMBER;

// Lazy-Initialisierung: Twilio-Client nur anlegen wenn Credentials vorhanden
function getTwilioClient() {
  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) return null;
  // Dynamic import vermieden — require funktioniert mit CommonJS-Twilio-SDK
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const twilio = require('twilio');
  return twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
}

/**
 * Sendet eine SMS.
 * - Produktion: echte Twilio-SMS wenn TWILIO_* Env-Vars gesetzt sind
 * - Entwicklung: gibt die SMS in der Konsole aus (kein Account nötig)
 *
 * @param telefon  Ziel-Telefonnummer im internationalen Format (+49...)
 * @param nachricht  Der Nachrichtentext (max. 160 Zeichen für 1 SMS)
 */
export async function smsSenden(telefon: string, nachricht: string): Promise<void> {
  const client = getTwilioClient();

  if (!client || !TWILIO_FROM) {
    // Dev-Modus: Konsolen-Ausgabe
    console.log('\n📱 [SMS — Dev-Modus] ─────────────────────────────');
    console.log(`  An:        ${telefon}`);
    console.log(`  Nachricht: ${nachricht}`);
    console.log('──────────────────────────────────────────────────\n');
    return;
  }

  // Produktion: echte Twilio-SMS
  await client.messages.create({
    body: nachricht,
    from: TWILIO_FROM,
    to: telefon,
  });

  console.log(`[SMS] Gesendet an ${telefon}`);
}

// ─── Vorgefertigte Nachrichten ────────────────────────────────────────────────

/** 24h-Erinnerung: "Ihr Tisch wartet morgen" */
export function smsText24h(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Hallo ${gastName}, Erinnerung: Ihr Tisch bei ${restaurantName} ist morgen um ${uhrzeit} Uhr reserviert (${personen} Pers., ${datumFormatiert}). Fragen? Ruf uns an.`;
}

/** 3h-Erinnerung: "Wir freuen uns auf Sie heute" */
export function smsText3h(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `Hallo ${gastName}, wir freuen uns auf Sie! Heute um ${uhrzeit} Uhr bei ${restaurantName} (${personen} Pers.). Bis gleich!`;
}

/** Buchungsbestätigung */
export function smsTextBestaetigung(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Bestätigung: ${gastName}, Ihr Tisch bei ${restaurantName} am ${datumFormatiert} um ${uhrzeit} Uhr (${personen} Pers.) ist gesichert. Guten Appetit!`;
}

/** Stornierungsbestätigung */
export function smsTextStornierung(gastName: string, restaurantName: string, datum: string): string {
  const d = new Date(datum);
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Hallo ${gastName}, Ihre Reservierung bei ${restaurantName} am ${datumFormatiert} wurde storniert. Wir hoffen, Sie bald wiederzusehen.`;
}

/** Umbuchungsbestätigung */
export function smsTextUmbuchung(gastName: string, restaurantName: string, neuesDatum: string, personen: number): string {
  const d = new Date(neuesDatum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Umbuchung bestätigt: ${gastName}, neuer Termin bei ${restaurantName}: ${datumFormatiert} um ${uhrzeit} Uhr (${personen} Pers.).`;
}
