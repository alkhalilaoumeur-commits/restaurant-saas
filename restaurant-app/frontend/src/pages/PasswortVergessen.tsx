import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

export default function PasswortVergessen() {
  const [email, setEmail] = useState('');
  const [gesendet, setGesendet] = useState(false);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    if (!email.trim()) { setFehler('Bitte gib deine E-Mail-Adresse ein'); return; }

    setLaden(true);
    try {
      await api.post('/auth/passwort-vergessen', { email });
      setGesendet(true);
    } catch (err) {
      setFehler((err as Error).message || 'Etwas ist schiefgelaufen');
    } finally {
      setLaden(false);
    }
  }

  const inputClass =
    'w-full h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 hover:border-gray-400 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors';

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 dark:from-[#0A0F1A] dark:via-[#0A0F1A] dark:to-[#0F1724] flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/15 dark:bg-cyan-900/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">

        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <ServeFlowLogo variante="icon" groesse="lg" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 tracking-tight">
            Passwort vergessen?
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1.5">
            Wir schicken dir einen Link zum Zurücksetzen
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 dark:border-white/[0.07] p-6">

          {gesendet ? (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                Falls ein Konto mit <strong>{email}</strong> existiert, haben wir dir einen Link zum Zurücksetzen geschickt.
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Prüfe auch deinen Spam-Ordner. Der Link ist 1 Stunde gültig.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">E-Mail-Adresse</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@restaurant.de" className={inputClass} />
              </div>

              {fehler && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg" role="alert">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM8 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4zm0 8a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{fehler}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={laden}
                className="w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center"
              >
                {laden ? 'Wird gesendet…' : 'Link senden'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          <Link to="/login" className="text-brand-primary font-medium hover:underline">
            Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
