import { Tisch, TischStatus } from '../../types';
import { TISCH_STATUS_FARBE, TISCH_STATUS_LABEL } from '../../lib/utils';

const STATUS_REIHENFOLGE: TischStatus[] = ['frei', 'besetzt', 'wartet_auf_zahlung'];

// Gradient-Backgrounds für den Status-Bereich
const STATUS_GRADIENT: Record<TischStatus, string> = {
  frei: 'from-green-50 to-green-100/50 text-green-700',
  besetzt: 'from-red-50 to-red-100/50 text-red-700',
  wartet_auf_zahlung: 'from-yellow-50 to-yellow-100/50 text-yellow-700',
};

interface TischKarteProps {
  tisch: Tisch;
  onStatusWechsel: (id: string, status: TischStatus) => void;
  onBearbeiten: (tisch: Tisch) => void;
  onLoeschen: (id: string) => void;
  onQrAnzeigen: (tisch: Tisch) => void;
  istAdmin: boolean;
}

export default function TischKarte({ tisch, onStatusWechsel, onBearbeiten, onLoeschen, onQrAnzeigen, istAdmin }: TischKarteProps) {
  function naechsterStatus(status: TischStatus): TischStatus {
    const idx = STATUS_REIHENFOLGE.indexOf(status);
    return STATUS_REIHENFOLGE[(idx + 1) % STATUS_REIHENFOLGE.length];
  }

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden card-hover group">
      {/* Status-Bereich – klickbar mit Gradient */}
      <button
        onClick={() => onStatusWechsel(tisch.id, naechsterStatus(tisch.status))}
        className={`w-full p-5 text-center transition-all duration-200 bg-gradient-to-b ${STATUS_GRADIENT[tisch.status]} hover:opacity-90 active:scale-[0.98]`}
      >
        <p className="text-2xl font-bold">T{tisch.nummer}</p>
        {tisch.kapazitaet && (
          <p className="text-xs opacity-60 mt-0.5">{tisch.kapazitaet} Plätze</p>
        )}
        <span className={`inline-block text-xs font-medium mt-2 px-2.5 py-0.5 rounded-full ${TISCH_STATUS_FARBE[tisch.status]}`}>
          {TISCH_STATUS_LABEL[tisch.status]}
        </span>
      </button>

      {/* Aktionen */}
      <div className="flex border-t border-gray-100 dark:border-white/10 divide-x divide-gray-100 dark:divide-white/10">
        <button
          onClick={() => onQrAnzeigen(tisch)}
          className="flex-1 py-2.5 text-xs text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-slate-300 transition-all duration-200"
          title="QR-Code / Bestell-Link"
        >
          <svg className="w-3.5 h-3.5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3h.01M17 14h3v3h-3v-3zm-3 4h.01M14 21h3" />
          </svg>
        </button>
        {istAdmin && (
          <>
            <button
              onClick={() => onBearbeiten(tisch)}
              className="flex-1 py-2.5 text-xs text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all duration-200"
              title="Bearbeiten"
            >
              <svg className="w-3.5 h-3.5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onLoeschen(tisch.id)}
              className="flex-1 py-2.5 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all duration-200"
              title="Löschen"
            >
              <svg className="w-3.5 h-3.5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
