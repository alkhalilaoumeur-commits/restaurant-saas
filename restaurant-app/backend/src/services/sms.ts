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
  const von = restaurantName ? ` – ${restaurantName}` : '';
  return [
    `ServeFlow${von}`,
    ``,
    `Dein Verifizierungscode: ${code}`,
    ``,
    `Gueltig fuer 10 Minuten.`,
    `Bitte nicht weitergeben.`,
  ].join('\n');
}

/** Schichttausch genehmigt — geht an BEIDE Mitarbeiter */
export function smsTextTauschGenehmigt(
  empfaengerName: string,
  partnerName: string,
  meineDatum: string,
  meineUhrzeit: string,
): string {
  const datum = new Date(meineDatum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  return [
    `ServeFlow – Schichttausch genehmigt`,
    ``,
    `Hallo ${empfaengerName},`,
    `dein Tausch mit ${partnerName} wurde bestaetigt.`,
    ``,
    `Deine neue Schicht:`,
    `${datum}, ${meineUhrzeit} Uhr`,
  ].join('\n');
}

/** Schichttausch abgelehnt — geht an den Anbieter */
export function smsTextTauschAbgelehnt(
  empfaengerName: string,
  datum: string,
  uhrzeit: string,
): string {
  const datumFormatiert = new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  return [
    `ServeFlow – Schichttausch abgelehnt`,
    ``,
    `Hallo ${empfaengerName},`,
    `dein Tausch wurde leider nicht genehmigt.`,
    ``,
    `Deine urspruengliche Schicht bleibt:`,
    `${datumFormatiert}, ${uhrzeit} Uhr`,
  ].join('\n');
}

/** Neue Schicht zugewiesen */
export function smsTextNeueSchicht(
  empfaengerName: string,
  restaurantName: string,
  datum: string,
  beginn: string,
  ende: string,
): string {
  const datumFormatiert = new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  return [
    `ServeFlow – Neue Schicht`,
    ``,
    `Hallo ${empfaengerName},`,
    `du hast eine neue Schicht erhalten.`,
    ``,
    `${datumFormatiert}`,
    `${beginn} – ${ende} Uhr`,
    `${restaurantName}`,
  ].join('\n');
}
