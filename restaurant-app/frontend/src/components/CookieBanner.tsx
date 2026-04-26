import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'serveflow_cookie_acknowledged';

export default function CookieBanner() {
  const [sichtbar, setSichtbar] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    try {
      const ack = localStorage.getItem(STORAGE_KEY);
      if (ack !== 'true') setSichtbar(true);
    } catch {
      setSichtbar(true);
    }
  }, []);

  function bestaetigen() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Wenn localStorage blockiert ist, Banner trotzdem ausblenden
    }
    setSichtbar(false);
  }

  if (!sichtbar) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Hinweis zur Datenspeicherung"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="glass-surface rounded-2xl shadow-premium p-4 sm:p-5 border border-gray-200/60 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              <p>
                ServeFlow speichert ausschließlich <strong>technisch notwendige</strong> Daten in Ihrem Browser
                (Login-Token, Design-Einstellung). Wir nutzen <strong>keine</strong> Tracking- oder Marketing-Cookies.
                Eine Einwilligung ist nach § 25 Abs. 2 Nr. 2 TDDDG nicht erforderlich.
              </p>
              {details && (
                <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-slate-400 list-disc list-inside">
                  <li><code className="text-xs">serveflow_token</code> — Ihre Anmeldung (LocalStorage, bis Logout)</li>
                  <li><code className="text-xs">theme</code> — Hell-/Dunkelmodus (LocalStorage, dauerhaft)</li>
                  <li><code className="text-xs">serveflow_cookie_acknowledged</code> — Anzeige dieses Hinweises (LocalStorage, dauerhaft)</li>
                </ul>
              )}
              <button
                type="button"
                onClick={() => setDetails(!details)}
                className="mt-2 text-xs text-brand-primary hover:underline"
              >
                {details ? 'Weniger anzeigen' : 'Welche Daten genau?'}
              </button>
            </div>

            <div className="flex flex-col gap-2 shrink-0 sm:w-40">
              <button
                type="button"
                onClick={bestaetigen}
                className="btn-premium h-10 cursor-pointer text-sm"
              >
                Verstanden
              </button>
              <Link
                to="/datenschutz"
                className="text-center text-xs text-gray-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
              >
                Datenschutzerklärung
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
