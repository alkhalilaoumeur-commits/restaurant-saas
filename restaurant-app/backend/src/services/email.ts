import nodemailer from 'nodemailer';

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
