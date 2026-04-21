import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

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

const ABSENDER = process.env.EMAIL_FROM || 'ServeFlow <noreply@serveflow.de>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

interface EmailOptionen {
  an: string;
  betreff: string;
  html: string;
}

/** Optionale Restaurant-Branding-Infos — werden im Email-Header angezeigt */
export interface RestaurantBranding {
  name: string;
  logoUrl?: string;
}

// ────────────────────────────────────────────────
// Basis-Template
// ────────────────────────────────────────────────

function emailTemplate(inhalt: string, restaurant?: RestaurantBranding, footer?: string): string {
  // Initiale als Fallback wenn kein Logo
  const initiale = restaurant?.name
    ? restaurant.name.trim().charAt(0).toUpperCase()
    : '';

  // Restaurant-Header-Block (nur wenn restaurant übergeben)
  const restaurantHeader = restaurant
    ? `
      <!-- Restaurant-Branding -->
      <tr>
        <td style="background:#FFFFFF;padding:28px 40px 0;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align:middle;">
                ${restaurant.logoUrl
                  ? `<img src="${restaurant.logoUrl}" alt="${restaurant.name} Logo"
                       style="width:56px;height:56px;border-radius:12px;object-fit:cover;display:block;" />`
                  : `<div style="width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#3B82F6,#06B6D4);display:flex;align-items:center;justify-content:center;text-align:center;line-height:56px;">
                       <span style="font-size:22px;font-weight:900;color:#FFFFFF;display:block;">${initiale}</span>
                     </div>`
                }
              </td>
              <td style="vertical-align:middle;padding-left:14px;">
                <p style="margin:0;font-size:18px;font-weight:800;color:#0F172A;letter-spacing:-0.3px;">${restaurant.name}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.8px;">Powered by ServeFlow</p>
              </td>
            </tr>
          </table>
          <div style="height:1px;background:#E2E8F0;margin-top:20px;"></div>
        </td>
      </tr>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${restaurant ? restaurant.name + ' – ' : ''}ServeFlow</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- ServeFlow-Header -->
          <tr>
            <td style="background:#0A0F1A;border-radius:16px 16px 0 0;padding:24px 40px 22px;">
              <div style="height:3px;background:linear-gradient(90deg,#3B82F6,#06B6D4);border-radius:2px;margin-bottom:20px;"></div>
              <span style="font-size:20px;font-weight:800;letter-spacing:2px;color:#FFFFFF;">SERVE</span><span style="font-size:20px;font-weight:800;letter-spacing:2px;color:#3B82F6;">FLOW</span>
            </td>
          </tr>

          ${restaurantHeader}

          <!-- Inhalt -->
          <tr>
            <td style="background:#FFFFFF;padding:32px 40px 32px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
              ${inhalt}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A0F1A;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid #1E293B;">
              ${footer || `
              <p style="margin:0 0 6px;font-size:13px;color:#64748B;text-align:center;">
                ${restaurant ? `<strong style="color:#94A3B8;">${restaurant.name}</strong> nutzt ServeFlow` : 'ServeFlow — Digitale Lösungen für Restaurants'}
              </p>
              <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                Fragen? <a href="mailto:support@serveflow.de" style="color:#3B82F6;text-decoration:none;">support@serveflow.de</a>
              </p>
              `}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ────────────────────────────────────────────────
// Hilfs-Bausteine
// ────────────────────────────────────────────────

function infoBox(zeilen: string[]): string {
  return `
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 24px;margin:24px 0;">
      ${zeilen.map(z => `<p style="margin:0 0 8px;font-size:15px;color:#1E293B;line-height:1.5;">${z}</p>`).join('')}
    </div>
  `;
}

function primaryButton(text: string, link: string): string {
  return `
    <p style="text-align:center;margin:32px 0 0;">
      <a href="${link}"
        style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#06B6D4);color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
        ${text}
      </a>
    </p>
  `;
}

function secondaryLink(text: string, link: string): string {
  return `<p style="text-align:center;margin:16px 0 0;"><a href="${link}" style="color:#64748B;font-size:13px;text-decoration:underline;">${text}</a></p>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0F172A;line-height:1.3;">${text}</h1>`;
}

function hallo(name: string): string {
  return `<p style="margin:0 0 20px;font-size:15px;color:#475569;">Hallo <strong style="color:#0F172A;">${name}</strong>,</p>`;
}

function text(inhalt: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">${inhalt}</p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0;" />`;
}

function hinweis(inhalt: string): string {
  return `<p style="margin:16px 0 0;font-size:13px;color:#94A3B8;line-height:1.5;">${inhalt}</p>`;
}

// ────────────────────────────────────────────────
// Senden
// ────────────────────────────────────────────────

async function senden(optionen: EmailOptionen): Promise<void> {
  if (!transporter) {
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
  console.log(`[Email] Gesendet an ${optionen.an} — ${optionen.betreff}`);
}

// ────────────────────────────────────────────────
// Datum-Formatter
// ────────────────────────────────────────────────

function datumFormatiert(datum: string): string {
  const d = new Date(datum);
  const tag = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const zeit = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${tag} um ${zeit} Uhr`;
}

// ════════════════════════════════════════════════
// AUTH-EMAILS
// ════════════════════════════════════════════════

/** 1. Email-Verifizierung nach Registrierung */
export async function emailVerifizierungSenden(
  email: string, token: string, name: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const link = `${FRONTEND_URL}/email-verifizieren/${token}`;
  await senden({
    an: email,
    betreff: '✉️ Bitte bestätige deine E-Mail-Adresse – ServeFlow',
    html: emailTemplate(`
      ${heading('E-Mail bestätigen')}
      ${hallo(name)}
      ${text('Du hast dich erfolgreich bei ServeFlow registriert. Bitte bestätige jetzt deine E-Mail-Adresse, um dein Konto zu aktivieren.')}
      ${primaryButton('E-Mail-Adresse bestätigen', link)}
      ${divider()}
      ${hinweis('Der Link ist <strong>24 Stunden</strong> gültig. Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.')}
    `, restaurant),
  });
}

/** 2. 6-stelliger Verifizierungscode */
export async function verifizierungsCodeEmailSenden(
  email: string, code: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  await senden({
    an: email,
    betreff: `🔐 Dein ServeFlow-Code: ${code}`,
    html: emailTemplate(`
      ${heading('Dein Verifizierungscode')}
      ${text('Gib diesen Code im Registrierungsformular ein, um deine E-Mail-Adresse zu bestätigen:')}
      <div style="background:linear-gradient(135deg,#EFF6FF,#E0F2FE);border:2px solid #BFDBFE;border-radius:14px;padding:28px;text-align:center;margin:24px 0;">
        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:12px;color:#1D4ED8;font-variant-numeric:tabular-nums;">${code}</p>
      </div>
      ${hinweis('Der Code ist <strong>10 Minuten</strong> gültig. Falls du diesen Code nicht angefordert hast, ignoriere diese E-Mail.')}
    `, restaurant),
  });
}

/** 3. Willkommens-Email mit Restaurant-Code */
export async function willkommensEmailSenden(
  email: string, name: string, restaurantName: string, restaurantCode: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  await senden({
    an: email,
    betreff: `🎉 Willkommen bei ServeFlow – ${restaurantName} ist bereit!`,
    html: emailTemplate(`
      ${heading(`Willkommen bei ServeFlow, ${name}!`)}
      ${text(`Dein Restaurant <strong>${restaurantName}</strong> wurde erfolgreich eingerichtet. Du kannst dich jetzt einloggen und loslegen.`)}
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#64748B;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Dein Restaurant-Code</p>
        <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:3px;color:#0F172A;">${restaurantCode}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#94A3B8;">Teile diesen Code mit deinen Mitarbeitern, damit sie sich zuordnen können.</p>
      </div>
      ${text('Nächste Schritte:')}
      <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
        <li>Speisekarte anlegen und Kategorien erstellen</li>
        <li>Tische einrichten und QR-Codes drucken</li>
        <li>Mitarbeiter einladen</li>
        <li>Öffnungszeiten prüfen</li>
      </ul>
      ${primaryButton('Zum Dashboard', `${FRONTEND_URL}/dashboard`)}
    `, restaurant),
  });
}

/** 4. Mitarbeiter-Einladung */
export async function einladungSenden(
  email: string, token: string, name: string, restaurantName: string, rolle: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const link = `${FRONTEND_URL}/einladung/${token}`;
  const rolleLabel = rolle === 'admin' ? 'Administrator' : rolle === 'kellner' ? 'Kellner/Service' : 'Küche';
  await senden({
    an: email,
    betreff: `👋 Du wurdest zu ${restaurantName} eingeladen – ServeFlow`,
    html: emailTemplate(`
      ${heading('Du wurdest eingeladen!')}
      ${hallo(name)}
      ${text(`<strong>${restaurantName}</strong> hat dich als <strong>${rolleLabel}</strong> auf der ServeFlow-Plattform eingeladen. Klicke unten, um dein Passwort festzulegen und direkt loszulegen.`)}
      ${infoBox([
        `🏠 Restaurant: <strong>${restaurantName}</strong>`,
        `👤 Deine Rolle: <strong>${rolleLabel}</strong>`,
      ])}
      ${primaryButton('Einladung annehmen & Passwort setzen', link)}
      ${divider()}
      ${hinweis('Der Einladungslink ist <strong>48 Stunden</strong> gültig. Falls du keine Einladung erwartet hast, ignoriere diese E-Mail.')}
    `, restaurant),
  });
}

/** 5. Passwort zurücksetzen */
export async function passwortResetSenden(
  email: string, token: string, name: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const link = `${FRONTEND_URL}/passwort-zuruecksetzen/${token}`;
  await senden({
    an: email,
    betreff: '🔑 Passwort zurücksetzen – ServeFlow',
    html: emailTemplate(`
      ${heading('Passwort zurücksetzen')}
      ${hallo(name)}
      ${text('Wir haben eine Anfrage erhalten, dein Passwort zurückzusetzen. Klicke auf den Button, um ein neues Passwort festzulegen:')}
      ${primaryButton('Neues Passwort festlegen', link)}
      ${divider()}
      ${hinweis('Der Link ist <strong>1 Stunde</strong> gültig. Falls du diese Anfrage nicht gestellt hast, ist nichts passiert — dein Passwort bleibt unverändert.')}
    `, restaurant),
  });
}

// ════════════════════════════════════════════════
// RESERVIERUNGS-EMAILS
// ════════════════════════════════════════════════

/** 6. Reservierungs-Bestätigung mit QR-Code */
export async function reservierungBestaetigungSenden(
  email: string, gastName: string, restaurantName: string,
  datum: string, personen: number, buchungsToken: string, adresse: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  const umbuchLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/aendern`;
  const reservierungLink = `${FRONTEND_URL}/reservierung/${buchungsToken}`;

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(reservierungLink, {
      width: 200, margin: 2,
      color: { dark: '#0F172A', light: '#ffffff' },
    });
  } catch (err) {
    console.error('[QR-Code] Fehler:', err);
  }

  await senden({
    an: email,
    betreff: `✅ Reservierung bestätigt – ${restaurantName}`,
    html: emailTemplate(`
      ${heading('Ihre Reservierung ist bestätigt!')}
      ${hallo(gastName)}
      ${text(`Wir freuen uns auf Ihren Besuch bei <strong>${restaurantName}</strong>. Hier sind Ihre Reservierungsdetails:`)}
      ${infoBox([
        `📅 ${datumFormatiert(datum)}`,
        `👥 ${personen} ${personen === 1 ? 'Person' : 'Personen'}`,
        ...(adresse ? [`📍 ${adresse}`] : []),
      ])}
      ${qrCodeDataUrl ? `
        <div style="text-align:center;margin:28px 0;padding:24px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;">
          <p style="margin:0 0 16px;font-size:13px;color:#64748B;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Ihr Reservierungs-QR-Code</p>
          <img src="${qrCodeDataUrl}" alt="QR-Code" style="width:160px;height:160px;display:block;margin:0 auto;" />
          <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">Zeigen Sie diesen Code bei Ihrer Ankunft vor — für eine schnelle Abwicklung.</p>
        </div>
      ` : ''}
      ${primaryButton('Reservierung ändern', umbuchLink)}
      ${secondaryLink('Reservierung stornieren', stornoLink)}
      ${divider()}
      ${hinweis('Wir freuen uns auf Sie!')}
    `, restaurant),
  });
}

/** 7. Reservierungs-Erinnerung (24h oder 3h vorher) */
export async function reservierungErinnerungSenden(
  email: string, gastName: string, restaurantName: string,
  datum: string, personen: number, buchungsToken: string, typ: '24h' | '3h',
  restaurant?: RestaurantBranding
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  const zeitText = typ === '24h' ? 'morgen' : 'heute in Kürze';
  const emoji = typ === '24h' ? '📅' : '⏰';

  await senden({
    an: email,
    betreff: `${emoji} Erinnerung: Ihre Reservierung ${zeitText} – ${restaurantName}`,
    html: emailTemplate(`
      ${heading(`Ihre Reservierung ist ${zeitText}!`)}
      ${hallo(gastName)}
      ${text(`Kurze Erinnerung: Sie haben ${zeitText} einen Tisch bei <strong>${restaurantName}</strong> reserviert.`)}
      ${infoBox([
        `📅 ${datumFormatiert(datum)}`,
        `👥 ${personen} ${personen === 1 ? 'Person' : 'Personen'}`,
      ])}
      ${text('Wir freuen uns auf Ihren Besuch und haben alles für Sie vorbereitet!')}
      ${divider()}
      ${hinweis(`Können Sie nicht kommen? <a href="${stornoLink}" style="color:#3B82F6;text-decoration:none;">Hier stornieren</a> — je früher, desto besser. Vielen Dank!`)}
    `, restaurant),
  });
}

/** 8. Stornierungsbestätigung */
export async function reservierungStornierungSenden(
  email: string, gastName: string, restaurantName: string, datum: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  await senden({
    an: email,
    betreff: `❌ Reservierung storniert – ${restaurantName}`,
    html: emailTemplate(`
      ${heading('Reservierung storniert')}
      ${hallo(gastName)}
      ${text(`Ihre Reservierung bei <strong>${restaurantName}</strong> wurde erfolgreich storniert.`)}
      ${infoBox([
        `📅 Stornierter Termin: ${datumFormatiert(datum)}`,
      ])}
      ${text('Wir würden uns sehr freuen, Sie ein anderes Mal begrüßen zu dürfen.')}
      ${primaryButton('Neu reservieren', `${FRONTEND_URL}/buchen`)}
      ${divider()}
      ${hinweis('Falls die Stornierung irrtümlich war, können Sie über den Button oben jederzeit neu buchen.')}
    `, restaurant),
  });
}

/** 9. Umbuchungsbestätigung */
export async function reservierungUmbuchungSenden(
  email: string, gastName: string, restaurantName: string,
  neuesDatum: string, personen: number, buchungsToken: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const stornoLink = `${FRONTEND_URL}/reservierung/${buchungsToken}/stornieren`;
  await senden({
    an: email,
    betreff: `📋 Reservierung geändert – ${restaurantName}`,
    html: emailTemplate(`
      ${heading('Ihre Reservierung wurde geändert')}
      ${hallo(gastName)}
      ${text(`Ihre Reservierung bei <strong>${restaurantName}</strong> wurde auf den folgenden Termin umgebucht:`)}
      ${infoBox([
        `📅 Neuer Termin: <strong>${datumFormatiert(neuesDatum)}</strong>`,
        `👥 ${personen} ${personen === 1 ? 'Person' : 'Personen'}`,
      ])}
      ${text('Wir freuen uns weiterhin auf Ihren Besuch!')}
      ${secondaryLink('Reservierung stornieren', stornoLink)}
      ${divider()}
      ${hinweis('Stimmen die Daten nicht? Buchen Sie einfach erneut oder kontaktieren Sie uns direkt.')}
    `, restaurant),
  });
}

// ════════════════════════════════════════════════
// INTERNE ADMIN-EMAILS
// ════════════════════════════════════════════════

/** 10. Abwesenheits-Konflikt — Admin wird über betroffene Schichten informiert */
export async function abwesenheitKonfliktEmailSenden(
  adminEmail: string,
  adminName: string,
  mitarbeiterName: string,
  von: string,
  bis: string,
  typ: string,
  betroffeneSchichten: number,
  restaurant?: RestaurantBranding
): Promise<void> {
  const vonFormatiert = new Date(von + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const bisFormatiert = new Date(bis + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const typLabel = typ === 'urlaub' ? 'Urlaub' : typ === 'krank' ? 'Krankmeldung' : 'Abwesenheit';

  await senden({
    an: adminEmail,
    betreff: `⚠️ Schichtkollision: ${mitarbeiterName} hat ${betroffeneSchichten} betroffene Schicht${betroffeneSchichten !== 1 ? 'en' : ''}`,
    html: emailTemplate(`
      ${heading('Abwesenheits-Konflikt')}
      ${hallo(adminName)}
      ${text(`<strong>${mitarbeiterName}</strong> hat eine ${typLabel} eingetragen, die mit bestehenden Schichten kollidiert.`)}
      ${infoBox([
        `👤 Mitarbeiter: <strong>${mitarbeiterName}</strong>`,
        `📋 Typ: <strong>${typLabel}</strong>`,
        `📅 Zeitraum: <strong>${vonFormatiert}</strong> bis <strong>${bisFormatiert}</strong>`,
        `⚠️ Betroffene Schichten: <strong>${betroffeneSchichten}</strong>`,
      ])}
      ${text('Bitte prüfe den Dienstplan und passe ggf. die Schichten an oder sorge für Vertretung.')}
      ${primaryButton('Zum Dienstplan', `${FRONTEND_URL}/dienstplan`)}
      ${divider()}
      ${hinweis('Diese Benachrichtigung wird automatisch gesendet, sobald eine Abwesenheit eine bestehende Schicht überschneidet.')}
    `, restaurant),
  });
}

// ════════════════════════════════════════════════
// BEWERTUNGS-EMAILS
// ════════════════════════════════════════════════

/** 10. Bewertungs-Anfrage nach dem Besuch */
export async function bewertungsAnfrageSenden(
  email: string, gastName: string, token: string,
  restaurant?: RestaurantBranding
): Promise<void> {
  const link = `${FRONTEND_URL}/bewertung/${token}`;
  await senden({
    an: email,
    betreff: '⭐ Wie war Ihr Besuch? Wir freuen uns über Ihr Feedback',
    html: emailTemplate(`
      ${heading('Wie war Ihr Besuch?')}
      ${hallo(gastName)}
      ${text('Wir hoffen, es hat Ihnen bei uns gefallen! Ihr Feedback hilft uns, uns stetig zu verbessern und anderen Gästen die richtige Entscheidung zu erleichtern.')}
      <div style="background:linear-gradient(135deg,#FFF7ED,#FEF3C7);border:1px solid #FDE68A;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 4px;font-size:28px;">⭐⭐⭐⭐⭐</p>
        <p style="margin:0;font-size:14px;color:#92400E;font-weight:600;">Ihre Bewertung dauert nur 1 Minute</p>
      </div>
      ${primaryButton('Jetzt bewerten', link)}
      ${divider()}
      ${hinweis('Der Bewertungslink ist <strong>14 Tage</strong> gültig und kann nur einmal verwendet werden.')}
    `, restaurant),
  });
}

// ════════════════════════════════════════════════
// INVENTUR-EMAILS
// ════════════════════════════════════════════════

/** 11. Mindestbestand-Alarm — wird gesendet wenn Artikel unter Mindestbestand fällt */
export async function mindestbestandAlarmSenden(
  adminEmail: string,
  restaurantName: string,
  artikel: { name: string; einheit: string; aktueller_bestand: number; mindestbestand: number }[]
): Promise<void> {
  const zeilen = artikel.map(a =>
    `<tr>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;">${a.name}</td>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;color:#EF4444;font-weight:600;">${a.aktueller_bestand} ${a.einheit}</td>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">${a.mindestbestand} ${a.einheit}</td>
     </tr>`
  ).join('');

  await senden({
    an: adminEmail,
    betreff: `⚠️ Mindestbestand unterschritten — ${artikel.length} Artikel`,
    html: emailTemplate(`
      ${heading('Mindestbestand unterschritten')}
      ${text(`Bei <strong>${restaurantName}</strong> haben folgende Artikel den Mindestbestand unterschritten:`)}
      <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;margin:16px 0;">
        <thead>
          <tr style="background:#F8FAFC;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Artikel</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Aktuell</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Minimum</th>
          </tr>
        </thead>
        <tbody>${zeilen}</tbody>
      </table>
      ${primaryButton('Zum Inventar', `${FRONTEND_URL}/inventur`)}
      ${divider()}
      ${hinweis('Diese Benachrichtigung wird automatisch gesendet, sobald ein Artikel nach einer Bestellung unter den Mindestbestand fällt.')}
    `),
  });
}

/** 13. Warteliste — Benachrichtigung wenn Platz frei wird */
export async function wartelisteBenachrichtigungSenden(
  email: string,
  gastName: string,
  restaurantName: string,
  datum: string,
  personen: number
): Promise<void> {
  await senden({
    an: email,
    betreff: `🎉 Ein Tisch ist frei – ${restaurantName}`,
    html: emailTemplate(`
      ${heading('Ein Tisch ist frei geworden!')}
      ${hallo(gastName)}
      ${text(`Gute Neuigkeit! Bei <strong>${restaurantName}</strong> ist ein Tisch frei geworden. Sie stehen als Nächstes auf der Warteliste.`)}
      ${infoBox([
        `📅 ${datumFormatiert(datum)}`,
        `👥 ${personen} ${personen === 1 ? 'Person' : 'Personen'}`,
        `⏰ Bitte melden Sie sich innerhalb von <strong>30 Minuten</strong>`,
      ])}
      ${text('Bitte kontaktieren Sie das Restaurant direkt, um Ihre Reservierung zu bestätigen.')}
      ${divider()}
      ${hinweis('Diese Benachrichtigung wird automatisch gesendet, wenn eine Stornierung eingeht und Sie als Nächstes auf der Warteliste stehen. Wenn Sie kein Interesse mehr haben, können Sie diese E-Mail ignorieren.')}
    `),
  });
}

/** 12. Lieferanten-Bestellanfrage — Admin schickt Bestellung direkt an Lieferanten */
export async function lieferantenBestellungSenden(daten: {
  lieferantEmail: string;
  lieferantName: string;
  restaurantName: string;
  restaurantEmail: string | null;
  restaurantTelefon: string | null;
  artikel: { name: string; einheit: string; bestellmenge: number; aktueller_bestand: number }[];
  notiz: string | null;
}): Promise<void> {
  const zeilen = daten.artikel.map(a =>
    `<tr>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;">${a.name}</td>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-weight:600;color:#1E40AF;">${a.bestellmenge} ${a.einheit}</td>
       <td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;">${a.aktueller_bestand} ${a.einheit}</td>
     </tr>`
  ).join('');

  await senden({
    an: daten.lieferantEmail,
    betreff: `Bestellanfrage von ${daten.restaurantName}`,
    html: emailTemplate(`
      ${heading('Bestellanfrage')}
      <p style="font-size:15px;color:#334155;margin:0 0 16px;">
        Sehr geehrte Damen und Herren,<br><br>
        wir möchten folgende Artikel bei Ihnen bestellen:
      </p>
      <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;margin:16px 0;">
        <thead>
          <tr style="background:#F8FAFC;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Artikel</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Bestellmenge</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748B;text-transform:uppercase;letter-spacing:.05em;">Aktueller Bestand</th>
          </tr>
        </thead>
        <tbody>${zeilen}</tbody>
      </table>
      ${daten.notiz ? `<div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:12px 16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#92400E;"><strong>Hinweis:</strong> ${daten.notiz}</p></div>` : ''}
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1E293B;">Absender</p>
        <p style="margin:0;font-size:14px;color:#475569;">${daten.restaurantName}</p>
        ${daten.restaurantEmail ? `<p style="margin:4px 0 0;font-size:13px;color:#64748B;">✉ ${daten.restaurantEmail}</p>` : ''}
        ${daten.restaurantTelefon ? `<p style="margin:4px 0 0;font-size:13px;color:#64748B;">📞 ${daten.restaurantTelefon}</p>` : ''}
      </div>
      ${divider()}
      ${hinweis('Diese Bestellanfrage wurde über ServeFlow ausgelöst und vom Restaurant manuell bestätigt.')}
    `),
  });
}
