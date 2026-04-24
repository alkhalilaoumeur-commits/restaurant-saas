import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { api, ApiError } from '../lib/api';
import { Mitarbeiter } from '../types';
import { DEMO_MITARBEITER } from '../lib/demo-daten';

interface LoginResponse {
  token: string;
  mitarbeiter: Mitarbeiter;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);
  const [passwortSichtbar, setPasswortSichtbar] = useState(false);
  const [emailNichtVerifiziert, setEmailNichtVerifiziert] = useState(false);
  const [verifizierungGesendet, setVerifizierungGesendet] = useState(false);
  const [zeit, setZeit] = useState(new Date());
  const login = useAuthStore((s) => s.login);
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setZeit(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function demoStarten() {
    demoLogin(DEMO_MITARBEITER);
    navigate('/dashboard');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setEmailNichtVerifiziert(false);
    setVerifizierungGesendet(false);
    setLaden(true);
    try {
      const res = await api.post<LoginResponse>('/auth/login', { email, passwort });
      login(res.token, res.mitarbeiter);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError && err.data.emailNichtVerifiziert) {
        setEmailNichtVerifiziert(true);
        setFehler(err.message);
      } else {
        setFehler((err as Error).message || 'Verbindungsfehler – bitte erneut versuchen');
      }
    } finally {
      setLaden(false);
    }
  }

  async function verifizierungErneutSenden() {
    setLaden(true);
    try {
      await api.post('/auth/verifizierung-erneut', { email });
      setVerifizierungGesendet(true);
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }

  const zeitFormat = zeit.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const datumFormat = zeit.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-dvh bg-white dark:bg-[#0A0F1A] text-slate-900 dark:text-slate-100 flex">

      {/* ═══════════════ LINKE SEITE — FORM ═══════════════ */}
      <section className="relative w-full lg:w-[46%] xl:w-[42%] flex flex-col p-6 sm:p-10 lg:p-14 overflow-hidden">

        {/* Top-Header — Mono Branding + Live Clock */}
        <header className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span>Serveflow / v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{datumFormat}</span>
            <span className="nums tabular-nums">{zeitFormat}</span>
          </div>
        </header>

        {/* Editorial Section Number */}
        <div className="mt-12 sm:mt-16 lg:mt-20 flex-1 flex flex-col justify-center max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-cyan-400 mb-4 flex items-center gap-3">
            <span>§ 01</span>
            <span className="h-px flex-1 bg-blue-600/30 dark:bg-cyan-400/30" />
            <span>Sign in</span>
          </div>

          <h1 className="font-display font-light text-[56px] sm:text-[68px] lg:text-[76px] leading-[0.92] tracking-[-0.04em] text-slate-900 dark:text-white">
            Willkommen<br />
            <span className="italic font-extralight text-slate-400 dark:text-slate-500">zurück.</span>
          </h1>

          <p className="mt-6 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
            Melde dich in deinem ServeFlow-Konto an, um dein Restaurant zu betreiben.
          </p>

          {/* Form */}
          <form onSubmit={submit} className="mt-10 space-y-5" noValidate>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@restaurant.de"
                className="w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 px-0 text-[16px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                  hover:border-slate-400 dark:hover:border-white/30
                  focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 focus:ring-0 focus:shadow-none
                  transition-colors"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="passwort" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                  Passwort
                </label>
                <Link to="/passwort-vergessen" className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  Vergessen?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="passwort"
                  type={passwortSichtbar ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 px-0 pr-10 text-[16px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                    hover:border-slate-400 dark:hover:border-white/30
                    focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 focus:ring-0 focus:shadow-none
                    transition-colors"
                  style={{ borderRadius: 0 }}
                />
                <button
                  type="button"
                  onClick={() => setPasswortSichtbar(!passwortSichtbar)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {passwortSichtbar ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clipRule="evenodd" />
                      <path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17a10.004 10.004 0 01-9.335-6.41 1.651 1.651 0 010-1.185A10.004 10.004 0 014.508 5.57l1.392 1.392A4 4 0 0010.748 13.93z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {fehler && !emailNichtVerifiziert && (
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-red-600 dark:text-red-400 flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 leading-none mt-0.5">×</span>
                <span className="normal-case tracking-normal font-sans text-[13px]">{fehler}</span>
              </div>
            )}

            {emailNichtVerifiziert && (
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <p className="font-sans text-[13px] text-amber-700 dark:text-amber-400">
                  E-Mail nicht verifiziert. Prüfe dein Postfach.
                </p>
                {verifizierungGesendet ? (
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mt-1.5">→ Erneut gesendet</p>
                ) : (
                  <button
                    type="button"
                    onClick={verifizierungErneutSenden}
                    disabled={laden}
                    className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400 hover:underline mt-1.5"
                  >
                    → Erneut senden
                  </button>
                )}
              </div>
            )}

            {/* Submit — Editorial Button mit Pfeil */}
            <button
              type="submit"
              disabled={laden}
              className="group relative w-full h-14 mt-8 inline-flex items-center justify-between px-6 overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}
            >
              <span className="relative z-10 font-display text-[18px] tracking-tight">
                {laden ? 'Anmeldung läuft…' : 'Anmelden'}
              </span>
              <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                ↵ Enter
              </span>
              {/* Brand Gradient Sweep on Hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" aria-hidden />
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" aria-hidden />
            </button>
          </form>

          {/* Demo + Register */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={demoStarten}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              <span className="w-6 h-px bg-current" />
              Demo ansehen
            </button>
            <Link
              to="/registrieren"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              Registrieren
              <span className="w-6 h-px bg-current" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 flex items-center justify-between">
          <span>© Serveflow 2026</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            TLS / E2E
          </span>
        </footer>
      </section>

      {/* ═══════════════ RECHTE SEITE — HERO ═══════════════ */}
      <aside className="hidden lg:flex w-[54%] xl:w-[58%] relative overflow-hidden bg-[#0A0F1A] text-white">

        {/* Mesh-Gradient Background — animiert */}
        <div className="absolute inset-0 bg-[#0A0F1A]" aria-hidden>
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-blue-600/40 blur-[120px] animate-aurora" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[90%] h-[90%] rounded-full bg-cyan-500/30 blur-[140px] animate-aurora" style={{ animationDelay: '-9s' }} />
          <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]" />
        </div>

        {/* Subtile Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
          aria-hidden
        />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">

          {/* Top — Brand Mark */}
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot" />
              <span>Live</span>
            </div>
            <span>Restaurant Operating System</span>
          </div>

          {/* Mitte — Editorial Quote */}
          <div className="max-w-xl animate-fade-in-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400 mb-8 flex items-center gap-3">
              <span>§ 02</span>
              <span className="h-px flex-1 bg-cyan-400/30" />
              <span>Mission</span>
            </div>

            <p className="font-display font-light text-[44px] xl:text-[54px] leading-[1.05] tracking-[-0.03em] text-white">
              Dein Restaurant.<br />
              <span className="italic text-white/60">Eine Plattform.</span><br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Alles im Griff.</span>
            </p>

            <p className="mt-8 font-sans text-[15px] leading-relaxed text-white/60 max-w-md">
              Bestellungen, Reservierungen, Dienstplan, Inventur — eine
              einzige Plattform für den kompletten Restaurant-Betrieb.
              Live-synchron, DSGVO-konform, hosted in Deutschland.
            </p>
          </div>

          {/* Unten — Live Stats Grid */}
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {[
              { label: 'Restaurants', wert: '100+', sub: 'aktive Tenants' },
              { label: 'Uptime', wert: '99.9%', sub: 'letzte 30 Tage' },
              { label: 'Hosting', wert: 'DE', sub: 'Hetzner Nürnberg' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0A0F1A]/80 backdrop-blur-sm p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.label}</p>
                <p className="font-display font-light text-[36px] leading-none tracking-tight text-white mt-2">{s.wert}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mt-2">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
