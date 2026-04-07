import { useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

export default function PasswortZuruecksetzen() {
  const { token } = useParams<{ token: string }>();
  const [passwort, setPasswort] = useState('');
  const [passwortBestaetigung, setPasswortBestaetigung] = useState('');
  const [passwortSichtbar, setPasswortSichtbar] = useState(false);
  const [erfolg, setErfolg] = useState(false);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');

    if (passwort.length < 8) { setFehler('Passwort muss mindestens 8 Zeichen lang sein'); return; }
    if (!/[A-Z]/.test(passwort)) { setFehler('Passwort muss mindestens einen Großbuchstaben enthalten'); return; }
    if (!/[0-9]/.test(passwort)) { setFehler('Passwort muss mindestens eine Zahl enthalten'); return; }
    if (passwort !== passwortBestaetigung) { setFehler('Passwörter stimmen nicht überein'); return; }

    setLaden(true);
    try {
      await api.post('/auth/passwort-zuruecksetzen', {
        token,
        passwort,
        passwort_bestaetigung: passwortBestaetigung,
      });
      setErfolg(true);
    } catch (err) {
      setFehler((err as Error).message);
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
            {erfolg ? 'Passwort geändert!' : 'Neues Passwort setzen'}
          </h1>
        </div>

        <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 dark:border-white/[0.07] p-6">

          {erfolg ? (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300">
                Dein Passwort wurde erfolgreich geändert.
              </p>
              <Link to="/login" className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Zum Login
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="passwort" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Neues Passwort</label>
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

              <div>
                <label htmlFor="passwortBestaetigung" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Passwort bestätigen</label>
                <input id="passwortBestaetigung" type={passwortSichtbar ? 'text' : 'password'} autoComplete="new-password" required value={passwortBestaetigung} onChange={(e) => setPasswortBestaetigung(e.target.value)} placeholder="Passwort wiederholen" className={inputClass} />
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
                {laden ? 'Wird gespeichert…' : 'Passwort ändern'}
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
