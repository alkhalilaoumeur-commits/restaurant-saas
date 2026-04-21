import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function RestaurantEmailBestaetigen() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'laden' | 'erfolg' | 'fehler'>('laden');
  const [nachricht, setNachricht] = useState('');

  useEffect(() => {
    if (!token) { setStatus('fehler'); setNachricht('Kein Verifizierungstoken'); return; }
    api.get<{ nachricht: string }>(`/auth/restaurant-email-bestaetigen/${token}`)
      .then((res) => { setStatus('erfolg'); setNachricht(res.nachricht); })
      .catch((err) => { setStatus('fehler'); setNachricht((err as Error).message); });
  }, [token]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 dark:from-[#0A0F1A] dark:via-[#0A0F1A] dark:to-[#0F1724] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 dark:border-white/[0.07] p-6 text-center space-y-4">
          {status === 'laden' && (
            <>
              <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-slate-400">Restaurant-E-Mail wird bestätigt…</p>
            </>
          )}
          {status === 'erfolg' && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 dark:text-slate-100">Restaurant-E-Mail bestätigt</p>
              <p className="text-sm text-gray-700 dark:text-slate-300">{nachricht}</p>
              <Link to="/dashboard" className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Zum Dashboard
              </Link>
            </>
          )}
          {status === 'fehler' && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 dark:text-slate-100">Bestätigung fehlgeschlagen</p>
              <p className="text-sm text-gray-700 dark:text-slate-300">{nachricht}</p>
              <Link to="/einstellungen" className="text-brand-primary text-sm font-medium hover:underline">Zu den Einstellungen</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
