/**
 * Interner SMS-Service — Twilio
 *
 * Für alle internen SMS an Restaurantmitarbeiter:
 *   - Registrierungs-/Verifizierungscodes
 *   - Schichttausch genehmigt / abgelehnt
 *   - (Erweiterbar: neue Schicht, Schichtänderung, Erinnerungen)
 *
 * Entwicklung: console.log (kein Twilio-Account nötig)
 * Produktion:  folgende Env-Vars in .env setzen:
 *   TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_PHONE_NUMBER=+4915112345678  (oder +1... US-Nummer)
 */

const TWILIO_SID        = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM       = process.env.TWILIO_PHONE_NUMBER;

// Lazy-Initialisierung: Twilio-Client nur anlegen wenn Credentials vorhanden
function getTwilioClient() {
  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const twilio = require('twilio');
  return twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
}

/**
 * Sendet eine interne SMS via Twilio.
 * - Produktion: echte SMS wenn TWILIO_* Env-Vars gesetzt sind
 * - Entwicklung: Konsolen-Ausgabe (kein Account nötig)
 *
 * @param telefon    Ziel-Nummer im internationalen Format (+4915112345678)
 * @param nachricht  Nachrichtentext (max. 160 Zeichen = 1 SMS-Einheit)
 */
export async function smsSenden(telefon: string, nachricht: string): Promise<void> {
  const client = getTwilioClient();

  if (!client || !TWILIO_FROM) {
    console.log('\n📱 [Intern-SMS — Dev-Modus / Twilio] ────────────────');
    console.log(`  An:        ${telefon}`);
    console.log(`  Nachricht: ${nachricht}`);
    console.log('──────────────────────────────────────────────────────\n');
    return;
  }

  await client.messages.create({
    body: nachricht,
    from: TWILIO_FROM,
    to: telefon,
  });

  console.log(`[Intern-SMS] Gesendet an ${telefon} via Twilio`);
}

// ─── Interne Nachrichten-Templates ───────────────────────────────────────────

/** 6-stelliger Verifizierungscode (Registrierung, SMS-Verifizierung) */
export function smsTextVerifizierung(code: string, restaurantName?: string): string {
  const von = restaurantName ? ` für ${restaurantName}` : '';
  return `Dein ServeFlow-Code${von}: ${code}. Gültig 10 Minuten. Nicht weitergeben.`;
}

/** Schichttausch genehmigt — geht an BEIDE Mitarbeiter */
export function smsTextTauschGenehmigt(
  empfaengerName: string,
  partnerName: string,
  meineDatum: string,
  meineUhrzeit: string,
): string {
  const datum = new Date(meineDatum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `ServeFlow: Schichttausch genehmigt! Du tauschst mit ${partnerName}. Deine neue Schicht: ${datum} ${meineUhrzeit}. Gute Schicht, ${empfaengerName}!`;
}

/** Schichttausch abgelehnt — geht an den Anbieter */
export function smsTextTauschAbgelehnt(
  empfaengerName: string,
  datum: string,
  uhrzeit: string,
): string {
  const datumFormatiert = new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `ServeFlow: Dein Schichttausch für ${datumFormatiert} ${uhrzeit} wurde abgelehnt. Du behältst deine ursprüngliche Schicht, ${empfaengerName}.`;
}

/** Neue Schicht zugewiesen */
export function smsTextNeueSchicht(
  empfaengerName: string,
  restaurantName: string,
  datum: string,
  beginn: string,
  ende: string,
): string {
  const datumFormatiert = new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `ServeFlow: Neue Schicht für dich, ${empfaengerName}! ${datumFormatiert} von ${beginn} bis ${ende} Uhr bei ${restaurantName}.`;
}
