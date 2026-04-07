import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';

interface ToastNachricht {
  id: number;
  gastName: string;
  personen: number;
  datum: string;
}

let toastId = 0;

/**
 * Zeigt eine Toast-Benachrichtigung wenn eine neue Online-Reservierung eingeht.
 * Wird im Layout eingebunden → sichtbar auf jeder Admin-Seite.
 *
 * Datenfluss: Gast bucht online → Backend sendet Socket.io Event 'neue_reservierung'
 * → dieser Hook fängt es auf → zeigt Toast → verschwindet nach 6 Sekunden.
 */
export default function ReservierungToast() {
  const socket = useSocket();
  const [toasts, setToasts] = useState<ToastNachricht[]>([]);

  const entfernen = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNeueReservierung = (daten: { gast_name: string; personen: number; datum: string }) => {
      const id = ++toastId;
      const datumObj = new Date(daten.datum);
      const zeitStr = datumObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      const tagStr = datumObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

      setToasts((prev) => [...prev, {
        id,
        gastName: daten.gast_name,
        personen: daten.personen,
        datum: `${tagStr} um ${zeitStr}`,
      }]);

      // Toast nach 6 Sekunden automatisch ausblenden
      setTimeout(() => entfernen(id), 6000);
    };

    socket.on('neue_reservierung', onNeueReservierung);
    return () => { socket.off('neue_reservierung', onNeueReservierung); };
  }, [socket, entfernen]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-green-200 dark:border-green-500/30 p-4 animate-fade-in-up flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-lg">📅</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              Neue Online-Reservierung
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              <strong>{toast.gastName}</strong> — {toast.personen} {toast.personen === 1 ? 'Person' : 'Pers.'} am {toast.datum}
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
