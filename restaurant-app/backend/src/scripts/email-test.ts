/**
 * Email-Test-Script — sendet alle Email-Templates mit Restaurant-Branding an eine Test-Adresse.
 *
 * Ausführen:
 *   cd restaurant-app/backend
 *   npx ts-node src/scripts/email-test.ts
 */

import 'dotenv/config';
import {
  emailVerifizierungSenden,
  verifizierungsCodeEmailSenden,
  willkommensEmailSenden,
  einladungSenden,
  passwortResetSenden,
  reservierungBestaetigungSenden,
  reservierungErinnerungSenden,
  reservierungStornierungSenden,
  reservierungUmbuchungSenden,
  bewertungsAnfrageSenden,
  type RestaurantBranding,
} from '../services/email';

const TEST_EMAIL   = 'ilaisilias99@gmail.com';
const FAKE_TOKEN   = 'test-token-abc123';
const FAKE_DATUM   = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const NAECHSTE_WOCHE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

// ── Restaurant-Branding für "Ilias Eatz" ─────────────────────────────────────
// logoUrl: öffentlich erreichbare Bild-URL (Email-Clients können keine lokalen Dateien laden).
// Hier ein initials-basierter Avatar-Dienst als Placeholder — kein echtes Bild nötig.
const RESTAURANT: RestaurantBranding = {
  name: 'Ilias Eatz',
  logoUrl: 'https://ui-avatars.com/api/?name=Ilias+Eatz&background=3B82F6&color=fff&size=128&bold=true&rounded=true&font-size=0.4',
};

async function alleEmailsSenden() {
  console.log(`\n📧 Sende alle Email-Templates mit Branding "Ilias Eatz" an ${TEST_EMAIL}...\n`);

  const emails: Array<{ name: string; fn: () => Promise<void> }> = [
    {
      name: '1. Email-Verifizierung',
      fn: () => emailVerifizierungSenden(TEST_EMAIL, FAKE_TOKEN, 'Ilias', RESTAURANT),
    },
    {
      name: '2. 6-stelliger Verifizierungscode',
      fn: () => verifizierungsCodeEmailSenden(TEST_EMAIL, '847291', RESTAURANT),
    },
    {
      name: '3. Willkommens-Email',
      fn: () => willkommensEmailSenden(TEST_EMAIL, 'Ilias', 'Ilias Eatz', 'REST-IE7K39M2P', RESTAURANT),
    },
    {
      name: '4. Mitarbeiter-Einladung (Kellner)',
      fn: () => einladungSenden(TEST_EMAIL, FAKE_TOKEN, 'Max Mustermann', 'Ilias Eatz', 'kellner', RESTAURANT),
    },
    {
      name: '5. Passwort zurücksetzen',
      fn: () => passwortResetSenden(TEST_EMAIL, FAKE_TOKEN, 'Ilias', RESTAURANT),
    },
    {
      name: '6. Reservierungs-Bestätigung',
      fn: () => reservierungBestaetigungSenden(
        TEST_EMAIL, 'Max Mustermann', 'Ilias Eatz',
        NAECHSTE_WOCHE, 4, FAKE_TOKEN, 'Königstraße 12, 70173 Stuttgart',
        RESTAURANT
      ),
    },
    {
      name: '7. Reservierungs-Erinnerung (24h)',
      fn: () => reservierungErinnerungSenden(
        TEST_EMAIL, 'Max Mustermann', 'Ilias Eatz',
        FAKE_DATUM, 4, FAKE_TOKEN, '24h', RESTAURANT
      ),
    },
    {
      name: '8. Reservierungs-Erinnerung (3h)',
      fn: () => reservierungErinnerungSenden(
        TEST_EMAIL, 'Max Mustermann', 'Ilias Eatz',
        FAKE_DATUM, 4, FAKE_TOKEN, '3h', RESTAURANT
      ),
    },
    {
      name: '9. Stornierungsbestätigung',
      fn: () => reservierungStornierungSenden(
        TEST_EMAIL, 'Max Mustermann', 'Ilias Eatz', NAECHSTE_WOCHE, RESTAURANT
      ),
    },
    {
      name: '10. Umbuchungsbestätigung',
      fn: () => reservierungUmbuchungSenden(
        TEST_EMAIL, 'Max Mustermann', 'Ilias Eatz',
        NAECHSTE_WOCHE, 3, FAKE_TOKEN, RESTAURANT
      ),
    },
    {
      name: '11. Bewertungs-Anfrage',
      fn: () => bewertungsAnfrageSenden(TEST_EMAIL, 'Max Mustermann', FAKE_TOKEN, RESTAURANT),
    },
  ];

  for (const email of emails) {
    try {
      process.stdout.write(`  → ${email.name} ... `);
      await email.fn();
      console.log('✅');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌  ${msg}`);
    }
    await new Promise(res => setTimeout(res, 500));
  }

  console.log('\n✅ Fertig! Alle 11 Emails wurden gesendet.\n');
}

alleEmailsSenden().catch(err => {
  console.error('❌ Kritischer Fehler:', err);
  process.exit(1);
});
