import { useState, FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { Mitarbeiter } from '../types';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

interface RegistrierungResponse {
  token: string;
  mitarbeiter: Mitarbeiter;
  restaurantCode: string;
}

interface Oeffnungszeit {
  wochentag: number;
  von: string;
  bis: string;
  geschlossen: boolean;
}

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const DEFAULT_OEFFNUNGSZEITEN: Oeffnungszeit[] = WOCHENTAGE.map((_, i) => ({
  wochentag: i,
  von: '09:00',
  bis: '22:00',
  geschlossen: false,
}));

// Schritte:
// 1 = Konto (Name, Email, Passwort)
// 2 = Email-Code verifizieren
// 3 = Restaurant-Daten (inkl. Telefon)
// 4 = Telefon-Code verifizieren
// 5 = Details (Tische, Öffnungszeiten)
// 6 = Erfolg

export default function Registrieren() {
  const [schritt, setSchritt] = useState(1);

  // Schritt 1: Konto
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [passwortBestaetigung, setPasswortBestaetigung] = useState('');
  const [passwortSichtbar, setPasswortSichtbar] = useState(false);

  // Schritt 2 & 4: Verifizierung
  const [verifCode, setVerifCode] = useState('');
  const [emailVerifToken, setEmailVerifToken] = useState('');
  const [telefonVerifToken, setTelefonVerifToken] = useState('');

  // Schritt 3: Restaurant
  const [restaurantName, setRestaurantName] = useState('');
  const [strasse, setStrasse] = useState('');
  const [plz, setPlz] = useState('');
  const [stadt, setStadt] = useState('');
  const [telefon, setTelefon] = useState('');
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const [waehrung, setWaehrung] = useState('EUR');

  // Schritt 5: Details
  const [anzahlTische, setAnzahlTische] = useState('10');
  const [anzahlMitarbeiter, setAnzahlMitarbeiter] = useState('5');
  const [oeffnungszeiten, setOeffnungszeiten] = useState<Oeffnungszeit[]>(DEFAULT_OEFFNUNGSZEITEN);

  // Status
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);
  const [restaurantCode, setRestaurantCode] = useState('');
  const [codeErneutGesendet, setCodeErneutGesendet] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null!);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  // ── Fortschrittsbalken: 3 Haupt-Segmente ──
  // Schritte 1-2 → Segment 1, Schritt 3 → Segment 2, Schritt 5 → Segment 3
  function hauptSchritt(): number {
    if (schritt <= 2) return 1;
    if (schritt === 3) return 2;
    return 3;
  }

  // ── Validierung ──

  function schritt1Validieren(): boolean {
    if (!adminName.trim()) { setFehler('Bitte gib deinen Namen ein'); return false; }
    if (!adminEmail.trim()) { setFehler('Bitte gib deine E-Mail ein'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) { setFehler('Ungültiges E-Mail-Format'); return false; }
    if (passwort.length < 8) { setFehler('Passwort muss mindestens 8 Zeichen lang sein'); return false; }
    if (!/[A-Z]/.test(passwort)) { setFehler('Passwort muss mindestens einen Großbuchstaben enthalten'); return false; }
    if (!/[0-9]/.test(passwort)) { setFehler('Passwort muss mindestens eine Zahl enthalten'); return false; }
    if (passwort !== passwortBestaetigung) { setFehler('Passwörter stimmen nicht überein'); return false; }
    return true;
  }

  function schritt3Validieren(): boolean {
    if (!restaurantName.trim()) { setFehler('Bitte gib den Restaurantnamen ein'); return false; }
    if (!strasse.trim()) { setFehler('Bitte gib die Straße ein'); return false; }
    if (!plz.trim()) { setFehler('Bitte gib die PLZ ein'); return false; }
    if (!stadt.trim()) { setFehler('Bitte gib die Stadt ein'); return false; }
    if (!telefon.trim()) { setFehler('Bitte gib die Telefonnummer ein'); return false; }
    const bereinigt = telefon.replace(/[\s\-()\/]/g, '');
    if (!/^(\+|0)[0-9]{7,15}$/.test(bereinigt)) { setFehler('Ungültiges Telefonnummer-Format. Erlaubt: +49..., 030-..., etc.'); return false; }
    if (restaurantEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(restaurantEmail)) {
      setFehler('Ungültiges E-Mail-Format für das Restaurant'); return false;
    }
    return true;
  }

  // ── Code senden ──

  async function emailCodeSenden() {
    setFehler('');
    setLaden(true);
    try {
      await api.post('/auth/code-senden', { typ: 'email', empfaenger: adminEmail });
      setVerifCode('');
      setSchritt(2);
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }

  // ── Code prüfen ──

  async function codePruefen(typ: 'email' | 'sms') {
    setFehler('');
    setLaden(true);
    try {
      const empfaenger = typ === 'email' ? adminEmail : telefon;
      const res = await api.post<{ verifizierungToken: string }>('/auth/code-pruefen', {
        typ,
        empfaenger,
        code: verifCode,
      });

      if (typ === 'email') {
        setEmailVerifToken(res.verifizierungToken);
        setSchritt(3);
      } else {
        setTelefonVerifToken(res.verifizierungToken);
        setSchritt(5);
      }
      setVerifCode('');
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }

  // ── Code erneut senden ──

  async function codeErneutSenden(typ: 'email' | 'sms') {
    setFehler('');
    setCodeErneutGesendet(false);
    setLaden(true);
    try {
      const empfaenger = typ === 'email' ? adminEmail : telefon;
      await api.post('/auth/code-senden', { typ, empfaenger });
      setCodeErneutGesendet(true);
      setVerifCode('');
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }

  // ── Schritt weiter ──

  async function weiter() {
    setFehler('');
    if (schritt === 1 && schritt1Validieren()) {
      await emailCodeSenden();
    } else if (schritt === 3 && schritt3Validieren()) {
      setSchritt(5);
    }
  }

  // ── Zurück ──

  function zurueck() {
    setFehler('');
    setCodeErneutGesendet(false);
    setVerifCode('');
    if (schritt === 2) { setSchritt(1); setEmailVerifToken(''); }
    else if (schritt === 3) setSchritt(1);
    else if (schritt === 5) setSchritt(3);
  }

  function oeffnungszeitAendern(index: number, feld: keyof Oeffnungszeit, wert: string | boolean) {
    setOeffnungszeiten((prev) => prev.map((oz, i) => (i === index ? { ...oz, [feld]: wert } : oz)));
  }

  // ── Registrierung abschicken ──

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      const res = await api.post<RegistrierungResponse>('/auth/registrieren', {
        admin_name: adminName,
        admin_email: adminEmail,
        passwort,
        passwort_bestaetigung: passwortBestaetigung,
        restaurant_name: restaurantName,
        strasse,
        plz,
        stadt,
        telefon,
        restaurant_email: restaurantEmail,
        waehrung,
        anzahl_tische: parseInt(anzahlTische) || 0,
        anzahl_mitarbeiter: parseInt(anzahlMitarbeiter) || 5,
        oeffnungszeiten: oeffnungszeiten.filter((oz) => !oz.geschlossen),
        email_verifizierung_token: emailVerifToken,
        telefon_verifizierung_token: telefonVerifToken,
      });

      setRestaurantCode(res.restaurantCode);
      login(res.token, res.mitarbeiter);
      setSchritt(6);
    } catch (err) {
      setFehler((err as Error).message || 'Registrierung fehlgeschlagen');
    } finally {
      setLaden(false);
    }
  }

  const inputClass =
    'w-full h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 hover:border-gray-400 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors';

  const hs = hauptSchritt();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 dark:from-[#0A0F1A] dark:via-[#0A0F1A] dark:to-[#0F1724] flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Dekorative Blur-Kreise */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/15 dark:bg-cyan-900/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <ServeFlowLogo variante="icon" groesse="lg" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 tracking-tight">
            {schritt === 6 ? 'Registrierung erfolgreich!' : schritt === 2 ? 'E-Mail bestätigen' : 'Restaurant registrieren'}
          </h1>
          {schritt < 6 && schritt !== 2 && schritt !== 4 && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1.5">
              Schritt {hs} von 3
            </p>
          )}
        </div>

        {/* Fortschrittsbalken */}
        {schritt < 6 && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= hs ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-white/10'}`} />
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 dark:border-white/[0.07] p-6">

          {/* ── Schritt 6: Erfolg ── */}
          {schritt === 6 && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 dark:text-slate-300 mb-2">Dein Restaurant-Code:</p>
                <p className="text-2xl font-mono font-bold text-brand-primary tracking-widest">{restaurantCode}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Diesen Code bitte notieren — er identifiziert dein Restaurant eindeutig.</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Registrierung erfolgreich! E-Mail wurde verifiziert.
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg text-left">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Nächster Schritt: Plan auswählen</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Wähle einen Plan um alle Funktionen freizuschalten. Du startest kostenlos mit dem Basis-Plan.
                </p>
              </div>
              <button
                onClick={() => navigate('/einstellungen?tab=abo')}
                className="w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Plan auswählen
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-slate-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors inline-flex items-center justify-center"
              >
                Später — Zum Dashboard
              </button>
            </div>
          )}

          {/* ── Schritt 1: Konto ── */}
          {schritt === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); weiter(); }} className="space-y-4" noValidate>
              <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">Dein Konto</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Erstelle dein Admin-Konto</p>

              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Vollständiger Name</label>
                <input id="adminName" type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Max Mustermann" className={inputClass} />
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">E-Mail-Adresse</label>
                <input id="adminEmail" type="email" autoComplete="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="name@restaurant.de" className={inputClass} />
              </div>

              <div>
                <label htmlFor="passwort" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Passwort</label>
                <div className="relative">
                  <input
                    id="passwort"
                    type={passwortSichtbar ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    placeholder="Mind. 8 Zeichen, 1 Großbuchstabe, 1 Zahl"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswortSichtbar(!passwortSichtbar)}
                    className="absolute right-0 top-0 h-11 w-11 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer transition-colors"
                    aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  >
                    {passwortSichtbar ? (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clipRule="evenodd" />
                        <path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17a10.004 10.004 0 01-9.335-6.41 1.651 1.651 0 010-1.185A10.004 10.004 0 014.508 5.57l1.392 1.392A4 4 0 0010.748 13.93z" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Passwort-Stärke */}
                <div className="mt-2 space-y-1">
                  {[
                    { ok: passwort.length >= 8, text: 'Mindestens 8 Zeichen' },
                    { ok: /[A-Z]/.test(passwort), text: '1 Großbuchstabe' },
                    { ok: /[0-9]/.test(passwort), text: '1 Zahl' },
                  ].map((regel) => (
                    <div key={regel.text} className="flex items-center gap-1.5">
                      <svg className={`w-3.5 h-3.5 ${regel.ok ? 'text-green-500' : 'text-gray-300 dark:text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        {regel.ok
                          ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          : <circle cx="10" cy="10" r="3" />
                        }
                      </svg>
                      <span className={`text-xs ${regel.ok ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'}`}>{regel.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="passwortBestaetigung" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Passwort bestätigen</label>
                <input
                  id="passwortBestaetigung"
                  type={passwortSichtbar ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={passwortBestaetigung}
                  onChange={(e) => setPasswortBestaetigung(e.target.value)}
                  placeholder="Passwort wiederholen"
                  className={inputClass}
                />
              </div>

              {fehler && <FehlerAnzeige text={fehler} />}

              <button
                type="submit"
                disabled={laden}
                className="w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center"
              >
                {laden ? <Spinner text="Code wird gesendet..." /> : 'Weiter'}
              </button>
            </form>
          )}

          {/* ── Schritt 2: Email-Code ── */}
          {schritt === 2 && (
            <CodeVerifizierung
              typ="email"
              empfaenger={adminEmail}
              code={verifCode}
              setCode={setVerifCode}
              codeInputRef={codeInputRef}
              fehler={fehler}
              laden={laden}
              codeErneutGesendet={codeErneutGesendet}
              onPruefen={() => codePruefen('email')}
              onErneutSenden={() => codeErneutSenden('email')}
              onZurueck={zurueck}
            />
          )}

          {/* ── Schritt 3: Restaurant ── */}
          {schritt === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); weiter(); }} className="space-y-4" noValidate>
              <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">Restaurant-Daten</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Informationen zu deinem Restaurant</p>

              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Restaurantname</label>
                <input id="restaurantName" type="text" required value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="z.B. Trattoria Mario" className={inputClass} />
              </div>

              <div>
                <label htmlFor="strasse" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Straße</label>
                <input id="strasse" type="text" required value={strasse} onChange={(e) => setStrasse(e.target.value)} placeholder="Hauptstr. 1" className={inputClass} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="plz" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">PLZ</label>
                  <input id="plz" type="text" required value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="10115" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="stadt" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Stadt</label>
                  <input id="stadt" type="text" required value={stadt} onChange={(e) => setStadt(e.target.value)} placeholder="Berlin" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Telefon</label>
                <input id="telefon" type="tel" required value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+49 30 12345678" className={inputClass} />
              </div>

              <div>
                <label htmlFor="restaurantEmail" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Restaurant E-Mail <span className="text-gray-400 dark:text-slate-500 font-normal text-xs">(optional)</span>
                </label>
                <input id="restaurantEmail" type="email" value={restaurantEmail} onChange={(e) => setRestaurantEmail(e.target.value)} placeholder="info@restaurant.de" className={inputClass} />
                {restaurantEmail.trim() && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Du erhältst eine Bestätigungs-E-Mail an diese Adresse.</p>
                )}
              </div>

              <div>
                <label htmlFor="waehrung" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Währung</label>
                <select id="waehrung" value={waehrung} onChange={(e) => setWaehrung(e.target.value)} className={inputClass}>
                  <option value="EUR">EUR – Euro</option>
                  <option value="CHF">CHF – Schweizer Franken</option>
                  <option value="GBP">GBP – Britisches Pfund</option>
                </select>
              </div>

              {fehler && <FehlerAnzeige text={fehler} />}

              <div className="flex gap-3">
                <button type="button" onClick={zurueck} className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors inline-flex items-center justify-center">
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={laden}
                  className="flex-1 h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center"
                >
                  {laden ? <Spinner text="Code wird gesendet..." /> : 'Weiter'}
                </button>
              </div>
            </form>
          )}

          {/* ── Schritt 5: Details ── */}
          {schritt === 5 && (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-1">Details einrichten</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Tische und Öffnungszeiten (kannst du später ändern)</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="anzahlTische" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Anzahl Tische</label>
                  <input id="anzahlTische" type="number" min="1" max="100" value={anzahlTische} onChange={(e) => setAnzahlTische(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="anzahlMitarbeiter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Anzahl Mitarbeiter</label>
                  <input id="anzahlMitarbeiter" type="number" min="1" max="100" value={anzahlMitarbeiter} onChange={(e) => setAnzahlMitarbeiter(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Öffnungszeiten */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Öffnungszeiten</label>
                <div className="space-y-2">
                  {oeffnungszeiten.map((oz, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-slate-400 w-20 shrink-0">{WOCHENTAGE[i]}</span>
                      {oz.geschlossen ? (
                        <span className="text-sm text-gray-400 dark:text-slate-500 flex-1">Geschlossen</span>
                      ) : (
                        <>
                          <input type="time" value={oz.von} onChange={(e) => oeffnungszeitAendern(i, 'von', e.target.value)} className="h-9 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                          <span className="text-gray-400 text-sm">–</span>
                          <input type="time" value={oz.bis} onChange={(e) => oeffnungszeitAendern(i, 'bis', e.target.value)} className="h-9 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => oeffnungszeitAendern(i, 'geschlossen', !oz.geschlossen)}
                        className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${oz.geschlossen ? 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                      >
                        {oz.geschlossen ? 'Öffnen' : 'Zu'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {fehler && <FehlerAnzeige text={fehler} />}

              <div className="flex gap-3">
                <button type="button" onClick={zurueck} className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors inline-flex items-center justify-center">
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={laden}
                  className="flex-1 h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center"
                >
                  {laden ? <Spinner text="Wird registriert..." /> : 'Kostenlos registrieren'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Link zum Login */}
        {schritt < 6 && (
          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
            Bereits registriert?{' '}
            <Link to="/login" className="text-brand-primary font-medium hover:underline">
              Hier anmelden
            </Link>
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
          Sicher verschlüsselt · ServeFlow
        </p>
      </div>
    </div>
  );
}

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

/** Code-Verifizierungs-Schritt (wiederverwendbar für Email + SMS) */
function CodeVerifizierung({
  typ,
  empfaenger,
  code,
  setCode,
  codeInputRef,
  fehler,
  laden,
  codeErneutGesendet,
  onPruefen,
  onErneutSenden,
  onZurueck,
}: {
  typ: 'email' | 'sms';
  empfaenger: string;
  code: string;
  setCode: (v: string) => void;
  codeInputRef: React.RefObject<HTMLInputElement>;
  fehler: string;
  laden: boolean;
  codeErneutGesendet: boolean;
  onPruefen: () => void;
  onErneutSenden: () => void;
  onZurueck: () => void;
}) {
  const istEmail = typ === 'email';

  return (
    <form onSubmit={(e) => { e.preventDefault(); onPruefen(); }} className="space-y-5 text-center" noValidate>
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20">
        {istEmail ? (
          <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Wir haben einen 6-stelligen Code an
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mt-1">
          {empfaenger}
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
          gesendet. Gib ihn unten ein.
        </p>
      </div>

      {/* Code-Eingabe */}
      <div className="flex justify-center">
        <input
          ref={codeInputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          autoFocus
          className="w-48 h-14 text-center text-2xl font-mono font-bold tracking-[0.5em] rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
        />
      </div>

      {fehler && <FehlerAnzeige text={fehler} />}

      {/* Erneut senden */}
      {codeErneutGesendet ? (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          Neuer Code gesendet!
        </p>
      ) : (
        <button
          type="button"
          onClick={onErneutSenden}
          disabled={laden}
          className="text-sm text-gray-500 dark:text-slate-400 underline hover:no-underline cursor-pointer disabled:opacity-50"
        >
          Code erneut senden
        </button>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onZurueck} className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors inline-flex items-center justify-center">
          Zurück
        </button>
        <button
          type="submit"
          disabled={laden || code.length !== 6}
          className="flex-1 h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center"
        >
          {laden ? <Spinner text="Wird geprüft..." /> : 'Bestätigen'}
        </button>
      </div>
    </form>
  );
}

/** Fehler-Anzeige */
function FehlerAnzeige({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg text-left" role="alert">
      <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM8 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4zm0 8a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-red-600 dark:text-red-400">{text}</p>
    </div>
  );
}

/** Lade-Spinner */
function Spinner({ text }: { text: string }) {
  return (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {text}
    </>
  );
}
