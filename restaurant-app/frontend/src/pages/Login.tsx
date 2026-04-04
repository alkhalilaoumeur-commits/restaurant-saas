import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Mitarbeiter } from '../types';
import { api } from '../lib/api';

function RestaurantIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Plate */}
      <circle cx="32" cy="36" r="22" stroke="#DC2626" strokeWidth="2" />
      <circle cx="32" cy="36" r="16" stroke="#FECACA" strokeWidth="1.5" />
      {/* Fork */}
      <path d="M20 8v10c0 3 2 5 4 5v17" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 8v7M20 8v7M22 8v7" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" />
      {/* Knife */}
      <path d="M44 8c0 0-3 4-3 10s3 5 3 5v17" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);
  const [passwortSichtbar, setPasswortSichtbar] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      const data = await api.post<{ token: string; mitarbeiter: Mitarbeiter }>('/auth/login', { email, passwort });
      login(data.token, data.mitarbeiter);
      navigate('/dashboard');
    } catch (err) {
      setFehler((err as Error).message || 'Verbindungsfehler – bitte erneut versuchen');
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="min-h-dvh bg-brand-bg font-body flex items-center justify-center p-4">

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-brand-border p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-bg border border-brand-border mb-5">
              <RestaurantIcon />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-fg tracking-tight">
              Willkommen
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base font-body">
              Melde dich an, um dein Restaurant zu verwalten
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-fg mb-1.5">
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
                className="w-full h-12 border border-brand-border rounded-xl px-4 text-base text-brand-fg placeholder:text-gray-400
                  bg-white
                  focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary
                  transition-colors duration-150"
              />
            </div>

            {/* Passwort */}
            <div>
              <label htmlFor="passwort" className="block text-sm font-semibold text-brand-fg mb-1.5">
                Passwort
              </label>
              <div className="relative">
                <input
                  id="passwort"
                  type={passwortSichtbar ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  required
                  placeholder="Passwort eingeben"
                  className="w-full h-12 border border-brand-border rounded-xl px-4 pr-12 text-base text-brand-fg placeholder:text-gray-400
                    bg-white
                    focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary
                    transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setPasswortSichtbar(!passwortSichtbar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-brand-fg cursor-pointer
                    focus:outline-none focus:text-brand-primary transition-colors duration-150"
                  aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {passwortSichtbar ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Error */}
            {fehler && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl" role="alert">
                <svg className="w-5 h-5 text-brand-primary mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{fehler}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={laden}
              className="w-full h-12 bg-brand-primary text-white rounded-xl text-base font-semibold cursor-pointer
                hover:bg-red-700
                focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                transition-all duration-150
                flex items-center justify-center"
            >
              {laden ? (
                <>
                  <SpinnerIcon />
                  Wird angemeldet...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Restaurant Management &middot; Sicher verschlüsselt
        </p>
      </div>
    </div>
  );
}
