/**
 * SMS-Service für Verifizierungscodes.
 * Entwicklung: Konsolen-Ausgabe (kein Twilio nötig)
 * Produktion: Twilio-Credentials in .env setzen
 */

export async function smsSenden(telefon: string, nachricht: string): Promise<void> {
  // Entwicklungsmodus: SMS in Konsole ausgeben
  // Für Produktion → Twilio-Integration (siehe .env: TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
  console.log('\n📱 [SMS] ─────────────────────────────────');
  console.log(`  An:        ${telefon}`);
  console.log(`  Nachricht: ${nachricht}`);
  console.log('─────────────────────────────────────────\n');
}
