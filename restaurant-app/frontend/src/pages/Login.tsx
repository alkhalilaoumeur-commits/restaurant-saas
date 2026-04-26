import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { api, ApiError } from '../lib/api';
import { Mitarbeiter } from '../types';
import { DEMO_MITARBEITER } from '../lib/demo-daten';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';
import LegalLinks from '../components/LegalLinks';

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
  const login = useAuthStore((s) => s.login);
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 dark:from-[#070B14] dark:via-[#0A0F1A] dark:to-[#0F1724] flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Animierte Aurora-Blur-Kreise im Hintergrund */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[560px] h-[560px] rounded-full bg-gradient-to-br from-blue-300/30 via-cyan-200/20 to-transparent dark:from-blue-600/20 dark:via-cyan-500/10 dark:to-transparent blur-3xl pointer-events-none animate-aurora"
        aria-hidden
      />
      <div
        className="absolute bottom-[-20%] left-[-15%] w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-cyan-300/25 via-blue-200/15 to-transparent dark:from-cyan-600/15 dark:via-blue-500/10 dark:to-transparent blur-3xl pointer-events-none animate-aurora"
        style={{ animationDelay: '-9s' }}
        aria-hidden
      />
      <div
        className="absolute top-[40%] left-[55%] w-[360px] h-[360px] rounded-full bg-blue-200/15 dark:bg-blue-900/15 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* Subtile Grid-Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-2xl animate-float" aria-hidden />
            <div className="relative">
              <ServeFlowLogo variante="icon" groesse="lg" />
            </div>
          </div>
          <h1 className="text-[28px] font-heading font-semibold text-gray-900 dark:text-slate-50 tracking-[-0.02em]">
            Willkommen zurück
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-slate-400 mt-2">
            Melde dich in deinem ServeFlow-Konto an
          </p>
        </div>

        {/* Premium Glass-Card */}
        <div className="glass-surface rounded-2xl shadow-premium p-6">
          <form onSubmit={submit} className="space-y-4" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@restaurant.de"
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500
                  hover:border-gray-400 dark:hover:border-white/20
                  focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                  transition-colors"
              />
            </div>

            {/* Passwort */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="passwort" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Passwort
                </label>
                <Link to="/passwort-vergessen" className="text-xs text-brand-primary hover:underline">
                  Passwort vergessen?
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
                  placeholder="Passwort eingeben"
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 pr-11 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500
                    hover:border-gray-400 dark:hover:border-white/20
                    focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
                    transition-colors"
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
            </div>

            {/* Fehler */}
            {fehler && !emailNichtVerifiziert && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg" role="alert">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM8 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4zm0 8a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{fehler}</p>
              </div>
            )}

            {/* Email nicht verifiziert */}
            {emailNichtVerifiziert && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg" role="alert">
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM8 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4zm0 8a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Bitte bestätige zuerst deine E-Mail-Adresse. Prüfe dein Postfach.
                    </p>
                    {verifizierungGesendet ? (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                        Verifizierungs-Email wurde erneut gesendet!
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={verifizierungErneutSenden}
                        disabled={laden}
                        className="text-sm text-amber-700 dark:text-amber-400 underline hover:no-underline mt-2 cursor-pointer disabled:opacity-50"
                      >
                        Verifizierungs-Email erneut senden
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit — Premium Gradient Button */}
            <button
              type="submit"
              disabled={laden}
              className="btn-premium w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0A0F1A]"
            >
              {laden ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Wird angemeldet…
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>
        </div>

        {/* Demo */}
        <div className="mt-6">
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 dark:text-slate-500">oder</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>
          <button
            type="button"
            onClick={demoStarten}
            className="w-full h-11 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer
              hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/20
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2
              transition-colors
              inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Demo ansehen
          </button>
        </div>

        {/* Registrierung */}
        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          Noch kein Konto?{' '}
          <Link to="/registrieren" className="text-brand-gradient font-semibold hover:opacity-80 transition-opacity">
            Jetzt registrieren
          </Link>
        </p>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 mt-5">
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-slate-500">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Sicher verschlüsselt · ServeFlow</span>
          </div>
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
