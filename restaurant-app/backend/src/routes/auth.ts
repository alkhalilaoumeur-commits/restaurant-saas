import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { q1, transaction } from '../models/db';
import { RestaurantModel } from '../models/Restaurant';
import { emailVerifizierungSenden, verifizierungsCodeEmailSenden, willkommensEmailSenden, passwortResetSenden } from '../services/email';
import { smsSenden } from '../services/sms';

const router = Router();

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

interface Mitarbeiter {
  id: string;
  restaurant_id: string;
  name: string;
  email: string;
  passwort_hash: string | null;
  rolle: 'admin' | 'kellner' | 'kueche';
  aktiv: boolean;
  email_verifiziert: boolean;
}

/** Token generieren: 32 zufällige Bytes → 64 Hex-Zeichen */
function genToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Email-Format prüfen */
function istGueltigeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Telefon-Format prüfen (DE/AT/CH): muss mit + oder 0 starten, 7-15 Ziffern */
function istGueltigeTelefon(telefon: string): boolean {
  const bereinigt = telefon.replace(/[\s\-()\/]/g, '');
  return /^(\+|0)[0-9]{7,15}$/.test(bereinigt);
}

/** Passwort-Anforderungen prüfen: min 8 Zeichen, 1 Großbuchstabe, 1 Zahl */
function passwortPruefen(passwort: string): string | null {
  if (passwort.length < 8) return 'Passwort muss mindestens 8 Zeichen lang sein';
  if (!/[A-Z]/.test(passwort)) return 'Passwort muss mindestens einen Großbuchstaben enthalten';
  if (!/[0-9]/.test(passwort)) return 'Passwort muss mindestens eine Zahl enthalten';
  return null; // Alles OK
}

/** JWT erstellen — wird von Login und Registrierung genutzt */
function jwtErstellen(mitarbeiter: { id: string; restaurant_id: string; rolle: string }): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as string & jwt.SignOptions['expiresIn'];
  return jwt.sign(
    { mitarbeiterId: mitarbeiter.id, restaurantId: mitarbeiter.restaurant_id, rolle: mitarbeiter.rolle },
    process.env.JWT_SECRET!,
    { expiresIn }
  );
}

// ─── In-Memory Verifizierungscodes ──────────────────────────────────────────
// Speichert 6-stellige Codes für Email/SMS-Verifizierung während der Registrierung.
// Key: "email:test@test.de" oder "sms:+49123456"
interface PendingCode { code: string; gueltigBis: Date }
interface VerifToken { empfaenger: string; gueltigBis: Date }

const pendingCodes = new Map<string, PendingCode>();
const verifiedTokens = new Map<string, VerifToken>();

/** 6-stelliger Zufallscode */
function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Abgelaufene Einträge aufräumen (bei jedem neuen Code) */
function cleanupCodes() {
  const jetzt = new Date();
  for (const [key, val] of pendingCodes) {
    if (val.gueltigBis < jetzt) pendingCodes.delete(key);
  }
  for (const [key, val] of verifiedTokens) {
    if (val.gueltigBis < jetzt) verifiedTokens.delete(key);
  }
}

// ─── Rate Limiting ──────────────────────────────────────────────────────────
// Max 5 Login-Versuche pro IP in 15 Minuten
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { fehler: 'Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Max 3 Registrierungen pro IP in 1 Stunde
const registrierungLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { fehler: 'Zu viele Registrierungsversuche. Bitte in einer Stunde erneut versuchen.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Max 10 Code-Anfragen pro IP in 15 Minuten (Email + SMS zusammen)
const codeSendenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { fehler: 'Zu viele Code-Anfragen. Bitte in 15 Minuten erneut versuchen.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Max 5 Passwort-Reset-Anfragen pro IP in 1 Stunde
const passwortResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { fehler: 'Zu viele Anfragen. Bitte in einer Stunde erneut versuchen.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── POST /api/auth/code-senden ─────────────────────────────────────────────
// Sendet 6-stelligen Verifizierungscode per Email oder SMS.
// Wird während der Registrierung aufgerufen, BEVOR der Account erstellt wird.
router.post('/code-senden', codeSendenLimiter, async (req: Request, res: Response): Promise<void> => {
  const { typ, empfaenger } = req.body;

  if (!typ || !empfaenger) {
    res.status(400).json({ fehler: 'Typ und Empfänger erforderlich' });
    return;
  }

  if (typ !== 'email' && typ !== 'sms') {
    res.status(400).json({ fehler: 'Typ muss "email" oder "sms" sein' });
    return;
  }

  if (typ === 'email' && !istGueltigeEmail(empfaenger)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }

  if (typ === 'sms' && !istGueltigeTelefon(empfaenger)) {
    res.status(400).json({ fehler: 'Ungültiges Telefonnummer-Format' });
    return;
  }

  // Bei Email: prüfen ob schon ein Account existiert
  if (typ === 'email') {
    const vorhanden = await q1('SELECT id FROM mitarbeiter WHERE email = $1', [empfaenger.toLowerCase()]);
    if (vorhanden) {
      res.status(409).json({ fehler: 'Ein Konto mit dieser E-Mail existiert bereits' });
      return;
    }
  }

  cleanupCodes();

  const code = genCode();
  const key = `${typ}:${empfaenger.toLowerCase()}`;
  pendingCodes.set(key, { code, gueltigBis: new Date(Date.now() + 10 * 60 * 1000) }); // 10 Min gültig

  if (typ === 'email') {
    verifizierungsCodeEmailSenden(empfaenger, code).catch((err) =>
      console.error('[Code-Email] Fehler:', err)
    );
  } else {
    smsSenden(empfaenger, `Dein Verifizierungscode: ${code}`).catch((err) =>
      console.error('[Code-SMS] Fehler:', err)
    );
  }

  res.json({ nachricht: 'Code gesendet' });
});

// ─── POST /api/auth/code-pruefen ────────────────────────────────────────────
// Prüft den 6-stelligen Code. Bei Erfolg → gibt Verifizierungstoken zurück.
// Das Token wird dann bei der Registrierung mitgeschickt als Beweis.
router.post('/code-pruefen', async (req: Request, res: Response): Promise<void> => {
  const { typ, empfaenger, code } = req.body;

  if (!typ || !empfaenger || !code) {
    res.status(400).json({ fehler: 'Typ, Empfänger und Code erforderlich' });
    return;
  }

  const key = `${typ}:${empfaenger.toLowerCase()}`;
  const pending = pendingCodes.get(key);

  if (!pending) {
    res.status(400).json({ fehler: 'Kein Code angefordert. Bitte zuerst einen Code senden.' });
    return;
  }

  if (pending.gueltigBis < new Date()) {
    pendingCodes.delete(key);
    res.status(400).json({ fehler: 'Code abgelaufen. Bitte einen neuen Code anfordern.' });
    return;
  }

  if (pending.code !== code) {
    res.status(400).json({ fehler: 'Falscher Code. Bitte erneut versuchen.' });
    return;
  }

  // Code war korrekt → Token generieren als Beweis
  pendingCodes.delete(key);
  const verifToken = genToken();
  verifiedTokens.set(verifToken, {
    empfaenger: empfaenger.toLowerCase(),
    gueltigBis: new Date(Date.now() + 30 * 60 * 1000), // 30 Min gültig
  });

  res.json({ verifizierungToken: verifToken });
});

// ─── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email, passwort } = req.body;
  if (!email || !passwort) {
    res.status(400).json({ fehler: 'Email und Passwort erforderlich' });
    return;
  }

  const mitarbeiter = await q1<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE email = $1 AND aktiv = true',
    [email.toLowerCase()]
  );

  // Identische Fehlermeldung für "User nicht gefunden" UND "Passwort falsch"
  // → verhindert User-Enumeration (Angreifer kann nicht testen ob Email existiert)
  if (!mitarbeiter || !mitarbeiter.passwort_hash || !(await bcrypt.compare(passwort, mitarbeiter.passwort_hash))) {
    res.status(401).json({ fehler: 'Ungültige Anmeldedaten' });
    return;
  }

  // Email-Verifizierung prüfen — nur Admins müssen verifizieren (eingeladene MA haben kein verifizierung_token)
  if (!mitarbeiter.email_verifiziert) {
    res.status(403).json({
      fehler: 'Bitte bestätige zuerst deine E-Mail-Adresse. Prüfe dein Postfach oder klicke auf "Erneut senden".',
      emailNichtVerifiziert: true,
      email: mitarbeiter.email,
    });
    return;
  }

  const token = jwtErstellen(mitarbeiter);

  res.json({
    token,
    mitarbeiter: {
      id: mitarbeiter.id,
      name: mitarbeiter.name,
      email: mitarbeiter.email,
      rolle: mitarbeiter.rolle,
      restaurantId: mitarbeiter.restaurant_id,
      emailVerifiziert: mitarbeiter.email_verifiziert,
    },
  });
});

// ─── POST /api/auth/registrieren ────────────────────────────────────────────
// Multi-Step-Wizard: Frontend schickt alle Daten in einem Request,
// aber das Frontend sammelt sie über 3 Schritte ein.
router.post('/registrieren', registrierungLimiter, async (req: Request, res: Response): Promise<void> => {
  const {
    // Schritt 1: Konto
    admin_name, admin_email, passwort, passwort_bestaetigung,
    // Schritt 2: Restaurant
    restaurant_name, strasse, plz, stadt, telefon, restaurant_email, waehrung,
    // Schritt 3: Details
    anzahl_tische, anzahl_mitarbeiter, oeffnungszeiten,
    // Verifizierungstokens (beweisen dass Email + Telefon verifiziert wurden)
    email_verifizierung_token, telefon_verifizierung_token,
  } = req.body;

  // ── Pflichtfelder prüfen ──
  if (!admin_name || !admin_email || !passwort || !passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Name, Email und Passwort sind erforderlich' });
    return;
  }
  if (!restaurant_name || !strasse || !plz || !stadt || !telefon || !restaurant_email) {
    res.status(400).json({ fehler: 'Alle Restaurant-Daten sind erforderlich' });
    return;
  }

  // ── Email-Format prüfen ──
  if (!istGueltigeEmail(admin_email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format' });
    return;
  }
  if (!istGueltigeEmail(restaurant_email)) {
    res.status(400).json({ fehler: 'Ungültiges E-Mail-Format für das Restaurant' });
    return;
  }

  // ── Telefon-Format prüfen ──
  if (!istGueltigeTelefon(telefon)) {
    res.status(400).json({ fehler: 'Ungültiges Telefonnummer-Format. Erlaubt: +49..., 030-..., etc.' });
    return;
  }

  // ── Passwort prüfen ──
  const passwortFehler = passwortPruefen(passwort);
  if (passwortFehler) {
    res.status(400).json({ fehler: passwortFehler });
    return;
  }
  if (passwort !== passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Passwörter stimmen nicht überein' });
    return;
  }

  // ── Verifizierungstokens prüfen ──
  // Email-Verifizierung: Token muss existieren und zur angegebenen Email passen
  const emailVerif = email_verifizierung_token ? verifiedTokens.get(email_verifizierung_token) : null;
  if (!emailVerif || emailVerif.empfaenger !== admin_email.toLowerCase() || emailVerif.gueltigBis < new Date()) {
    res.status(400).json({ fehler: 'E-Mail-Adresse nicht verifiziert. Bitte zuerst den Code bestätigen.' });
    return;
  }

  // Telefon-Verifizierung: Token muss existieren und zur angegebenen Telefonnummer passen
  const telefonVerif = telefon_verifizierung_token ? verifiedTokens.get(telefon_verifizierung_token) : null;
  if (!telefonVerif || telefonVerif.empfaenger !== telefon.toLowerCase() || telefonVerif.gueltigBis < new Date()) {
    res.status(400).json({ fehler: 'Telefonnummer nicht verifiziert. Bitte zuerst den Code bestätigen.' });
    return;
  }

  // ── Email-Duplikat prüfen ──
  const vorhanden = await q1('SELECT id FROM mitarbeiter WHERE email = $1', [admin_email.toLowerCase()]);
  if (vorhanden) {
    res.status(409).json({ fehler: 'Ein Konto mit dieser E-Mail existiert bereits' });
    return;
  }

  try {

    const result = await transaction(async (client) => {
      // 1. Restaurant anlegen (mit auto-generiertem restaurant_code)
      const restaurant = await RestaurantModel.erstellen(client, {
        name: restaurant_name,
        strasse,
        plz,
        stadt,
        telefon,
        email: restaurant_email,
        waehrung,
      });

      // 2. Admin-Mitarbeiter anlegen (email_verifiziert = true, weil schon inline verifiziert)
      const passwortHash = await bcrypt.hash(passwort, 12);
      const maResult = await client.query(
        `INSERT INTO mitarbeiter (restaurant_id, name, email, passwort_hash, rolle, email_verifiziert)
         VALUES ($1, $2, $3, $4, 'admin', true)
         RETURNING id, name, email, rolle, restaurant_id`,
        [restaurant.id, admin_name, admin_email.toLowerCase(), passwortHash],
      );
      const mitarbeiter = maResult.rows[0];

      // 3. Tische automatisch erstellen (falls angegeben)
      const tischAnzahl = Math.min(Math.max(parseInt(anzahl_tische) || 0, 0), 100);
      if (tischAnzahl > 0) {
        const tischValues = Array.from({ length: tischAnzahl }, (_, i) =>
          `('${restaurant.id}', ${i + 1}, 4)`
        ).join(', ');
        await client.query(
          `INSERT INTO tische (restaurant_id, nummer, kapazitaet) VALUES ${tischValues}`
        );
      }

      // 4. Öffnungszeiten speichern (falls angegeben)
      // Format: Array von { wochentag: 0-6, von: "09:00", bis: "22:00", geschlossen: false }
      if (Array.isArray(oeffnungszeiten) && oeffnungszeiten.length > 0) {
        for (const oz of oeffnungszeiten) {
          await client.query(
            `INSERT INTO oeffnungszeiten (restaurant_id, wochentag, von, bis, geschlossen)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (restaurant_id, wochentag) DO UPDATE SET von = $3, bis = $4, geschlossen = $5`,
            [restaurant.id, oz.wochentag, oz.von || '09:00', oz.bis || '22:00', oz.geschlossen || false],
          );
        }
      }

      return { restaurant, mitarbeiter };
    });

    // 5. Willkommens-Email mit Restaurant-Code senden (Email schon verifiziert)
    willkommensEmailSenden(
      admin_email, admin_name, restaurant_name,
      result.restaurant.restaurant_code
    ).catch((err) =>
      console.error('[Willkommens-Email] Fehler beim Senden:', err)
    );

    // 6. Verifizierungstokens aufräumen
    verifiedTokens.delete(email_verifizierung_token);
    verifiedTokens.delete(telefon_verifizierung_token);

    // 7. JWT generieren
    const token = jwtErstellen(result.mitarbeiter);

    res.status(201).json({
      token,
      mitarbeiter: {
        id: result.mitarbeiter.id,
        name: result.mitarbeiter.name,
        email: result.mitarbeiter.email,
        rolle: result.mitarbeiter.rolle,
        restaurantId: result.mitarbeiter.restaurant_id,
        emailVerifiziert: true,
      },
      restaurantCode: result.restaurant.restaurant_code,
    });
  } catch (err) {
    console.error('[Registrierung]', (err as Error).message);
    res.status(500).json({ fehler: 'Registrierung fehlgeschlagen – bitte erneut versuchen' });
  }
});

// ─── GET /api/auth/email-verifizieren/:token ────────────────────────────────
// User klickt den Link in der Email → Email wird als verifiziert markiert
router.get('/email-verifizieren/:token', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const mitarbeiter = await q1<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE verifizierung_token = $1',
    [token]
  );

  if (!mitarbeiter) {
    res.status(400).json({ fehler: 'Ungültiger oder abgelaufener Verifizierungslink' });
    return;
  }

  if (mitarbeiter.email_verifiziert) {
    res.json({ nachricht: 'E-Mail wurde bereits bestätigt' });
    return;
  }

  await q1(
    'UPDATE mitarbeiter SET email_verifiziert = true, verifizierung_token = NULL WHERE id = $1',
    [mitarbeiter.id]
  );

  res.json({ nachricht: 'E-Mail erfolgreich bestätigt' });
});

// ─── POST /api/auth/verifizierung-erneut ────────────────────────────────────
// Verifizierungs-Email erneut senden
router.post('/verifizierung-erneut', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ fehler: 'Email erforderlich' });
    return;
  }

  const mitarbeiter = await q1<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE email = $1',
    [email.toLowerCase()]
  );

  // Immer Erfolg melden (verhindert User-Enumeration)
  if (!mitarbeiter || mitarbeiter.email_verifiziert) {
    res.json({ nachricht: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine neue Verifizierungs-E-Mail gesendet.' });
    return;
  }

  const neuerToken = genToken();
  await q1('UPDATE mitarbeiter SET verifizierung_token = $1 WHERE id = $2', [neuerToken, mitarbeiter.id]);

  emailVerifizierungSenden(mitarbeiter.email, neuerToken, mitarbeiter.name).catch((err) =>
    console.error('[Verifizierung-erneut] Fehler:', err)
  );

  res.json({ nachricht: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine neue Verifizierungs-E-Mail gesendet.' });
});

// ─── POST /api/auth/passwort-vergessen ──────────────────────────────────────
// User gibt Email ein → bekommt Reset-Link per Email
router.post('/passwort-vergessen', passwortResetLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ fehler: 'Email erforderlich' });
    return;
  }

  // Immer gleiche Antwort — egal ob Email existiert oder nicht (Anti-Enumeration)
  const antwort = { nachricht: 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen gesendet.' };

  const mitarbeiter = await q1<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE email = $1 AND aktiv = true',
    [email.toLowerCase()]
  );

  if (!mitarbeiter) {
    res.json(antwort);
    return;
  }

  // Reset-Token erstellen (1 Stunde gültig)
  const resetToken = genToken();
  await q1(
    `INSERT INTO passwort_resets (mitarbeiter_id, token, gueltig_bis)
     VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
    [mitarbeiter.id, resetToken]
  );

  passwortResetSenden(mitarbeiter.email, resetToken, mitarbeiter.name).catch((err) =>
    console.error('[Passwort-Reset] Fehler:', err)
  );

  res.json(antwort);
});

// ─── POST /api/auth/passwort-zuruecksetzen ──────────────────────────────────
// User klickt Reset-Link, setzt neues Passwort
router.post('/passwort-zuruecksetzen', async (req: Request, res: Response): Promise<void> => {
  const { token, passwort, passwort_bestaetigung } = req.body;

  if (!token || !passwort || !passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Token und neues Passwort erforderlich' });
    return;
  }

  const passwortFehler = passwortPruefen(passwort);
  if (passwortFehler) {
    res.status(400).json({ fehler: passwortFehler });
    return;
  }
  if (passwort !== passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Passwörter stimmen nicht überein' });
    return;
  }

  // Token prüfen
  const reset = await q1<{ id: string; mitarbeiter_id: string; benutzt: boolean; gueltig_bis: string }>(
    'SELECT * FROM passwort_resets WHERE token = $1',
    [token]
  );

  if (!reset) {
    res.status(400).json({ fehler: 'Ungültiger Link zum Zurücksetzen' });
    return;
  }
  if (reset.benutzt) {
    res.status(400).json({ fehler: 'Dieser Link wurde bereits verwendet' });
    return;
  }
  if (new Date(reset.gueltig_bis) < new Date()) {
    res.status(400).json({ fehler: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen an.' });
    return;
  }

  // Passwort aktualisieren + Token als benutzt markieren
  const passwortHash = await bcrypt.hash(passwort, 12);
  await transaction(async (client) => {
    await client.query('UPDATE mitarbeiter SET passwort_hash = $1 WHERE id = $2', [passwortHash, reset.mitarbeiter_id]);
    await client.query('UPDATE passwort_resets SET benutzt = true WHERE id = $1', [reset.id]);
    // Alle anderen offenen Reset-Tokens dieses Users invalidieren
    await client.query(
      'UPDATE passwort_resets SET benutzt = true WHERE mitarbeiter_id = $1 AND benutzt = false',
      [reset.mitarbeiter_id]
    );
  });

  res.json({ nachricht: 'Passwort erfolgreich geändert. Du kannst dich jetzt anmelden.' });
});

// ─── POST /api/auth/einladung-annehmen ──────────────────────────────────────
// Mitarbeiter klickt Einladungslink und setzt eigenes Passwort
router.post('/einladung-annehmen', async (req: Request, res: Response): Promise<void> => {
  const { token, passwort, passwort_bestaetigung } = req.body;

  if (!token || !passwort || !passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Token und Passwort erforderlich' });
    return;
  }

  const passwortFehler = passwortPruefen(passwort);
  if (passwortFehler) {
    res.status(400).json({ fehler: passwortFehler });
    return;
  }
  if (passwort !== passwort_bestaetigung) {
    res.status(400).json({ fehler: 'Passwörter stimmen nicht überein' });
    return;
  }

  // Einladung prüfen
  const mitarbeiter = await q1<Mitarbeiter>(
    'SELECT * FROM mitarbeiter WHERE einladung_token = $1',
    [token]
  );

  if (!mitarbeiter) {
    res.status(400).json({ fehler: 'Ungültiger Einladungslink' });
    return;
  }

  // Prüfen ob noch gültig (einladung_gueltig_bis muss in der Zukunft liegen)
  const gueltigBis = await q1<{ einladung_gueltig_bis: string }>(
    'SELECT einladung_gueltig_bis FROM mitarbeiter WHERE id = $1',
    [mitarbeiter.id]
  );
  if (gueltigBis?.einladung_gueltig_bis && new Date(gueltigBis.einladung_gueltig_bis) < new Date()) {
    res.status(400).json({ fehler: 'Dieser Einladungslink ist abgelaufen. Bitte den Admin kontaktieren.' });
    return;
  }

  if (mitarbeiter.passwort_hash) {
    res.status(400).json({ fehler: 'Diese Einladung wurde bereits angenommen' });
    return;
  }

  // Passwort setzen + Einladung als angenommen markieren
  const passwortHash = await bcrypt.hash(passwort, 12);
  await q1(
    `UPDATE mitarbeiter SET passwort_hash = $1, einladung_token = NULL, einladung_gueltig_bis = NULL, email_verifiziert = true
     WHERE id = $2`,
    [passwortHash, mitarbeiter.id]
  );

  // JWT erstellen, damit der MA direkt eingeloggt ist
  const jwtToken = jwtErstellen(mitarbeiter);

  res.json({
    token: jwtToken,
    mitarbeiter: {
      id: mitarbeiter.id,
      name: mitarbeiter.name,
      email: mitarbeiter.email,
      rolle: mitarbeiter.rolle,
      restaurantId: mitarbeiter.restaurant_id,
      emailVerifiziert: true,
    },
    nachricht: 'Passwort gesetzt. Willkommen!',
  });
});

// ─── GET /api/auth/einladung/:token ─────────────────────────────────────────
// Einladungslink prüfen — gibt Name und Restaurant zurück (für die Frontend-Seite)
router.get('/einladung/:token', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const mitarbeiter = await q1<{ name: string; email: string; rolle: string; restaurant_id: string; passwort_hash: string | null; einladung_gueltig_bis: string | null }>(
    'SELECT name, email, rolle, restaurant_id, passwort_hash, einladung_gueltig_bis FROM mitarbeiter WHERE einladung_token = $1',
    [token]
  );

  if (!mitarbeiter) {
    res.status(400).json({ fehler: 'Ungültiger Einladungslink' });
    return;
  }

  if (mitarbeiter.passwort_hash) {
    res.status(400).json({ fehler: 'Diese Einladung wurde bereits angenommen' });
    return;
  }

  if (mitarbeiter.einladung_gueltig_bis && new Date(mitarbeiter.einladung_gueltig_bis) < new Date()) {
    res.status(400).json({ fehler: 'Dieser Einladungslink ist abgelaufen' });
    return;
  }

  // Restaurant-Name holen für die Begrüßung
  const restaurant = await q1<{ name: string }>('SELECT name FROM restaurants WHERE id = $1', [mitarbeiter.restaurant_id]);

  res.json({
    name: mitarbeiter.name,
    email: mitarbeiter.email,
    rolle: mitarbeiter.rolle,
    restaurantName: restaurant?.name || 'Unbekannt',
  });
});

export default router;
