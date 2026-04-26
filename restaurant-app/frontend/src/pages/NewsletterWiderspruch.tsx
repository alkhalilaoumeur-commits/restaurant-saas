import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

type Status = 'laden' | 'erfolg' | 'fehler';

export default function NewsletterWiderspruch() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('laden');
  const [meldung, setMeldung] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('fehler');
      setMeldung('Kein Widerspruchs-Token in der URL gefunden.');
      return;
    }
    api.post<{ ok: boolean; hinweis: string }>(`/restaurant/newsletter-widerspruch/${token}`, {})
      .then((res) => {
        setStatus('erfolg');
        setMeldung(res.hinweis);
      })
      .catch((err: Error & { fehler?: string }) => {
        setStatus('fehler');
        setMeldung(err.fehler || err.message || 'Der Widerspruchs-Link ist ungültig oder abgelaufen.');
      });
  }, [token]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 dark:from-[#070B14] dark:via-[#0A0F1A] dark:to-[#0F1724] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <ServeFlowLogo variante="text" groesse="md" />
        </div>

        <div className="glass-surface rounded-2xl shadow-premium p-8 text-center">
          {status === 'laden' && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
              <p className="text-sm text-gray-600 dark:text-slate-400">Widerspruch wird verarbeitet…</p>
            </>
          )}

          {status === 'erfolg' && (
            <>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-heading font-semibold text-gray-900 dark:text-slate-50 mb-2">
                Werbe-E-Mails abbestellt
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{meldung}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-4">
                Transaktionale E-Mails (Reservierungs-Bestätigungen, Verifikationscodes, Rechnungen) erhalten Sie weiterhin —
                diese sind durch Vertragspflicht gedeckt.
              </p>
            </>
          )}

          {status === 'fehler' && (
            <>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-heading font-semibold text-gray-900 dark:text-slate-50 mb-2">
                Widerspruch fehlgeschlagen
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4">{meldung}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">
                Bitte schreiben Sie uns direkt an{' '}
                <a href="mailto:kontakt@serve-flow.org" className="text-brand-primary hover:underline">
                  kontakt@serve-flow.org
                </a>{' '}
                — wir bearbeiten Ihren Widerspruch manuell.
              </p>
            </>
          )}

          <Link
            to="/login"
            className="inline-block mt-6 text-xs text-gray-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
          >
            ← Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  );
}
