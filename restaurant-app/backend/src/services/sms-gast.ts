/**
 * Gast-SMS-Service — seven.io
 *
 * Für alle externen SMS an Restaurantgäste (Bestätigung, Erinnerung, Storno, Umbuchung).
 * Absender: "ServeFlow" (alphanumerisch) → wirkt professionell, deutsche Empfänger vertrauen dem.
 *
 * Entwicklung: console.log (kein Account nötig)
 * Produktion:  seven.io API-Key in .env setzen:
 *   SEVENIO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * Account anlegen: app.seven.io → ca. 0,055 €/SMS, deutsches Unternehmen, DSGVO-nativ
 */

const SEVENIO_API_KEY = process.env.SEVENIO_API_KEY;
const SEVENIO_FROM    = process.env.SEVENIO_FROM ?? 'ServeFlow'; // Alphanumerischer Absender

/**
 * Sendet eine SMS an einen Restaurantgast.
 * - Produktion: seven.io REST-API wenn SEVENIO_API_KEY gesetzt
 * - Entwicklung: Konsolen-Ausgabe
 *
 * @param telefon   Ziel-Telefonnummer im internationalen Format (+49...)
 * @param nachricht Nachrichtentext (max. 160 Zeichen für 1 SMS)
 */
export async function gastSmsSenden(telefon: string, nachricht: string): Promise<void> {
  if (!SEVENIO_API_KEY) {
    // Dev-Modus
    console.log('\n📱 [Gast-SMS — Dev-Modus / seven.io] ──────────────');
    console.log(`  Von:       ${SEVENIO_FROM}`);
    console.log(`  An:        ${telefon}`);
    console.log(`  Nachricht: ${nachricht}`);
    console.log('────────────────────────────────────────────────────\n');
    return;
  }

  // seven.io REST-API: kein npm-Paket nötig, simpler POST-Request
  const response = await fetch('https://gateway.seven.io/api/sms', {
    method: 'POST',
    headers: {
      'X-Api-Key': SEVENIO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SEVENIO_FROM,
      to: telefon,
      text: nachricht,
    }),
  });

  if (!response.ok) {
    const fehler = await response.text();
    throw new Error(`seven.io SMS-Fehler (${response.status}): ${fehler}`);
  }

  // DSGVO Art. 5(1)(e): Telefonnummer nicht in Production-Logs
  console.log(`[Gast-SMS] Gesendet via seven.io (Empfaenger ${telefon.slice(0, 4)}***)`);
}

// ─── Vorgefertigte Nachrichten ────────────────────────────────────────────────

/** Buchungsbestätigung */
export function gastSmsBestaetigung(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Bestätigt: ${gastName}, Ihr Tisch bei ${restaurantName} am ${datumFormatiert} um ${uhrzeit} Uhr (${personen} Pers.) ist reserviert. Guten Appetit!`;
}

/** Stornierungsbestätigung */
export function gastSmsStornierung(gastName: string, restaurantName: string, datum: string): string {
  const d = new Date(datum);
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Hallo ${gastName}, Ihre Reservierung bei ${restaurantName} am ${datumFormatiert} wurde storniert. Wir hoffen, Sie bald wiederzusehen.`;
}

/** Umbuchungsbestätigung */
export function gastSmsUmbuchung(gastName: string, restaurantName: string, neuesDatum: string, personen: number): string {
  const d = new Date(neuesDatum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Umbuchung bestätigt: ${gastName}, neuer Termin bei ${restaurantName}: ${datumFormatiert} um ${uhrzeit} Uhr (${personen} Pers.).`;
}

/** 24h-Erinnerung */
export function gastSms24h(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const datumFormatiert = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `Erinnerung: ${gastName}, Ihr Tisch bei ${restaurantName} ist morgen (${datumFormatiert}) um ${uhrzeit} Uhr reserviert (${personen} Pers.). Bis bald!`;
}

/** 3h-Erinnerung */
export function gastSms3h(gastName: string, restaurantName: string, datum: string, personen: number): string {
  const d = new Date(datum);
  const uhrzeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `Heute in ca. 3 Stunden: ${gastName}, Ihr Tisch bei ${restaurantName} um ${uhrzeit} Uhr (${personen} Pers.) wartet auf Sie!`;
}
