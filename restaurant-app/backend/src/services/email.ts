import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// Transporter wird einmal erstellt und wiederverwendet.
// In der Entwicklung: Falls keine SMTP-Daten konfiguriert → Emails werden nur in die Konsole geloggt.
// In Produktion: Echte SMTP-Daten aus .env (z.B. Resend, Mailgun, etc.)
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const ABSENDER = process.env.EMAIL_FROM || 'noreply@serveflow.de';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

interface EmailOptionen {
  an: string;
  betreff: string;
  html: string;
}

/**
 * Sendet eine Email. In der Entwicklung ohne SMTP → loggt in die Konsole.
 * In Produktion → sendet über den konfigurierten SMTP-Server.
 */
async function senden(optionen: EmailOptionen): Promise<void> {
  if (!transporter) {
    // Entwicklungsmodus: Email in Konsole ausgeben
    console.log('\n📧 [Email] ─────────────────────────────');
    console.log(`  An:      ${optionen.an}`);
    console.log(`  Betreff: ${optionen.betreff}`);
    console.log(`  Link:    ${optionen.html.match(/href="([^"]+)"/)?.[1] || '(kein Link)'}`);
    console.log('─────────────────────────────────────────\n');
    return;
  }

  await transporter.sendMail({
    from: ABSENDER,
    to: optionen.an,
    subject: optionen.betreff,
    html: optionen.html,
  });
}

/** Email-Verifizierung nach Registrierung */
export async function emailVerifizierungSenden(email: string, token: string, name: string): Promise<void> {
  const link = `${FRONTEND_URL}/email-verifizieren/${token}`;
  await senden({
    an: email,
    betreff: 'Bitte bestätige deine E-Mail-Adresse',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${name},</h2>
        <p>Willkommen! Bitte bestätige deine E-Mail-Adresse, indem du auf den Button klickst:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            E-Mail bestätigen
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Der Link ist 24 Stunden gültig.</p>
        <p style="color: #666; font-size: 14px;">Falls du dich nicht registriert hast, ignoriere diese E-Mail einfach.</p>
      </div>
    `,
  });
}

/** Mitarbeiter-Einladung — MA setzt eigenes Passwort */
export async function einladungSenden(email: string, token: string, name: string, restaurantName: string, rolle: string): Promise<void> {
  const link = `${FRONTEND_URL}/einladung/${token}`;
  const rolleLabel = rolle === 'admin' ? 'Administrator' : rolle === 'kellner' ? 'Kellner' : 'Küche';
  await senden({
    an: email,
    betreff: `Du wurdest zu ${restaurantName} eingeladen`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${name},</h2>
        <p>Du wurdest als <strong>${rolleLabel}</strong> zum Restaurant <strong>${restaurantName}</strong> eingeladen.</p>
        <p>Klicke auf den Button, um dein Passwort festzulegen und loszulegen:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Einladung annehmen
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Der Link ist 48 Stunden gültig.</p>
      </div>
    `,
  });
}

/** 6-stelliger Verifizierungscode per Email */
export async function verifizierungsCodeEmailSenden(email: string, code: string): Promise<void> {
  await senden({
    an: email,
    betreff: `Dein Verifizierungscode: ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Verifizierungscode</h2>
        <p>Dein Code zur Bestätigung deiner E-Mail-Adresse:</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #3B82F6;">${code}</p>
        </div>
        <p style="color: #666; font-size: 14px;">Der Code ist 10 Minuten gültig.</p>
        <p style="color: #666; font-size: 14px;">Falls du diesen Code nicht angefordert hast, ignoriere diese E-Mail.</p>
      </div>
    `,
  });
}

/** Willkommens-Email mit Restaurant-Code (Email bereits verifiziert) */
export async function willkommensEmailSenden(email: string, name: string, restaurantName: string, restaurantCode: string): Promise<void> {
  await senden({
    an: email,
    betreff: `Willkommen bei ServeFlow – Dein Restaurant-Code`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Willkommen, ${name}!</h2>
        <p>Dein Restaurant <strong>${restaurantName}</strong> wurde erfolgreich registriert.</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Dein Restaurant-Code:</p>
          <p style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #3B82F6;">${restaurantCode}</p>
        </div>
        <p style="color: #666; font-size: 14px;">Diesen Code brauchst du, falls Mitarbeiter sich deinem Restaurant zuordnen möchten. Bewahre ihn sicher auf.</p>
      </div>
    `,
  });
}

/** Passwort-vergessen — Reset-Link */
export async function passwortResetSenden(email: string, token: string, name: string): Promise<void> {
  const link = `${FRONTEND_URL}/passwort-zuruecksetzen/${token}`;
  await senden({
    an: email,
    betreff: 'Passwort zurücksetzen',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${name},</h2>
        <p>Du hast angefordert, dein Passwort zurückzusetzen. Klicke auf den Button:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Neues Passwort setzen
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Der Link ist 1 Stunde gültig.</p>
        <p style="color: #666; font-size: 14px;">Falls du das nicht warst, ignoriere diese E-Mail. Dein Passwort bleibt unverändert.</p>
      </div>
    `,
  });
}

// ────────────────────────────────────────────────
// Reservierungs-Emails
// ────────────────────────────────────────────────

/** Datum "2026-04-10T18:00:00" → "Freitag, 10. April 2026 um 18:00 Uhr" */
function datumFormatiert(datum: string): string {
  const d = new Date(datum);
  const tag = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const zeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${tag} um ${zeit} Uhr`;
}

/** Reservierungs-Bestätigung — sofort nach Online-Buchung, mit QR-Code */
export async function reservierungBestaetigungSenden(
  email: string, gastName: string, restaurantName: string,
  datum: string, personen: number, buchungsToken: string, adresse: string
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  const umbuchLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/aendern`;
  const reservierungLink = `${FRONTEND_URL}/reservierung/${buchungsToken}`;

  // QR-Code als Base64 Data-URL generieren — Gast zeigt ihn im Restaurant vor
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(reservierungLink, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
  } catch (err) {
    console.error('[QR-Code] Fehler bei Generierung:', err);
  }

  await senden({
    an: email,
    betreff: `Reservierung bestätigt – ${restaurantName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${gastName},</h2>
        <p>Ihre Reservierung bei <strong>${restaurantName}</strong> ist bestätigt!</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px;">📅 <strong>${datumFormatiert(datum)}</strong></p>
          <p style="margin: 0 0 8px;">👥 <strong>${personen} ${personen === 1 ? 'Person' : 'Personen'}</strong></p>
          ${adresse ? `<p style="margin: 0;">📍 ${adresse}</p>` : ''}
        </div>
        ${qrCodeDataUrl ? `
        <div style="text-align: center; margin: 24px 0; padding: 20px; background: #f9fafb; border-radius: 12px;">
          <img src="${qrCodeDataUrl}" alt="QR-Code Reservierung" style="width: 180px; height: 180px;" />
          <p style="margin: 8px 0 0; font-size: 13px; color: #666;">Zeigen Sie diesen QR-Code bei Ihrer Ankunft im Restaurant vor.</p>
        </div>
        ` : ''}
        <p style="text-align: center; margin: 30px 0;">
          <a href="${umbuchLink}" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reservierung ändern
          </a>
        </p>
        <p style="text-align: center;">
          <a href="${stornoLink}" style="color: #666; font-size: 14px;">Reservierung stornieren</a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Wir freuen uns auf Ihren Besuch!</p>
      </div>
    `,
  });
}

/** Reservierungs-Erinnerung — 24h oder 3h vorher */
export async function reservierungErinnerungSenden(
  email: string, gastName: string, restaurantName: string,
  datum: string, personen: number, buchungsToken: string, typ: '24h' | '3h'
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  const zeitText = typ === '24h' ? 'morgen' : 'heute';
  await senden({
    an: email,
    betreff: `Erinnerung: Ihre Reservierung ${zeitText} – ${restaurantName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${gastName},</h2>
        <p>Kurze Erinnerung an Ihre Reservierung ${zeitText} bei <strong>${restaurantName}</strong>:</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px;">📅 <strong>${datumFormatiert(datum)}</strong></p>
          <p style="margin: 0;">👥 <strong>${personen} ${personen === 1 ? 'Person' : 'Personen'}</strong></p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Sie können nicht kommen? <a href="${stornoLink}" style="color: #3B82F6;">Hier stornieren</a>
        </p>
        <p style="color: #666; font-size: 14px;">Wir freuen uns auf Sie!</p>
      </div>
    `,
  });
}

/** Stornierungsbestätigung */
export async function reservierungStornierungSenden(
  email: string, gastName: string, restaurantName: string, datum: string
): Promise<void> {
  await senden({
    an: email,
    betreff: `Reservierung storniert – ${restaurantName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${gastName},</h2>
        <p>Ihre Reservierung bei <strong>${restaurantName}</strong> am <strong>${datumFormatiert(datum)}</strong> wurde storniert.</p>
        <p>Wir würden uns freuen, Sie ein anderes Mal begrüßen zu dürfen.</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Falls Sie erneut reservieren möchten, besuchen Sie gerne unsere Buchungsseite.</p>
      </div>
    `,
  });
}

/** Umbuchungsbestätigung — neues Datum */
export async function reservierungUmbuchungSenden(
  email: string, gastName: string, restaurantName: string,
  neuesDatum: string, personen: number, buchungsToken: string
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  await senden({
    an: email,
    betreff: `Reservierung geändert – ${restaurantName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hallo ${gastName},</h2>
        <p>Ihre Reservierung bei <strong>${restaurantName}</strong> wurde auf den neuen Termin geändert:</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px;">📅 <strong>${datumFormatiert(neuesDatum)}</strong></p>
          <p style="margin: 0;">👥 <strong>${personen} ${personen === 1 ? 'Person' : 'Personen'}</strong></p>
        </div>
        <p style="text-align: center;">
          <a href="${stornoLink}" style="color: #666; font-size: 14px;">Reservierung stornieren</a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">Wir freuen uns auf Ihren Besuch!</p>
      </div>
    `,
  });
}
