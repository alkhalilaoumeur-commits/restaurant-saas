import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';

interface ToastNachricht {
  id: number;
  mitarbeiterName: string;
  vonDatum: string;
  bisDatum: string;
  typ: string;
  betroffeneSchichten: number;
}

let toastId = 0;

const TYP_LABEL: Record<string, string> = {
  urlaub: 'Urlaub',
  krank: 'Krankheit',
  sonstiges: 'Abwesenheit',
};

/**
 * Zeigt eine Toast-Benachrichtigung wenn ein Mitarbeiter eine Abwesenheit im
 * laufenden Monat einträgt, die bereits geplante Schichten betrifft.
 *
 * Datenfluss: MA trägt Abwesenheit ein → Backend prüft Konflikte → emittiert
 * Socket.io Event 'abwesenheit_konflikt' → dieser Toast fängt es ab → 8 Sek. sichtbar.
 */
export default function AbwesenheitToast() {
  const socket = useSocket();
  const [toasts, setToasts] = useState<ToastNachricht[]>([]);

  const entfernen = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onKonflikt = (daten: {
      mitarbeiter_name: string;
      von_datum: string;
      bis_datum: string;
      typ: string;
      betroffene_schichten: number;
    }) => {
      const id = ++toastId;

      const formatDatum = (s: string) => {
        const [y, m, d] = s.split('-');
        return `${d}.${m}.${y}`;
      };

      setToasts((prev) => [...prev, {
        id,
        mitarbeiterName: daten.mitarbeiter_name,
        vonDatum: formatDatum(daten.von_datum),
        bisDatum: formatDatum(daten.bis_datum),
        typ: TYP_LABEL[daten.typ] || daten.typ,
        betroffeneSchichten: daten.betroffene_schichten,
      }]);

      setTimeout(() => entfernen(id), 8000);
    };

    socket.on('abwesenheit_konflikt', onKonflikt);
    return () => { socket.off('abwesenheit_konflikt', onKonflikt); };
  }, [socket, entfernen]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-amber-200 dark:border-amber-500/30 p-4 animate-fade-in-up flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              Schicht-Konflikt: {toast.typ}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              <strong>{toast.mitarbeiterName}</strong> ist vom {toast.vonDatum} bis {toast.bisDatum} abwesend —{' '}
              <strong>{toast.betroffeneSchichten} Schicht{toast.betroffeneSchichten !== 1 ? 'en' : ''}</strong> betroffen
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Dienstplan anpassen
            </p>
          </div>
          <button
            onClick={() => entfernen(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
