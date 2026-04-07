import { Reservierung, ReservierungStatus } from '../../types';
import { formatDatum, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL } from '../../lib/utils';

interface ReservierungZeileProps {
  reservierung: Reservierung;
  onStatusAendern: (id: string, status: ReservierungStatus) => void;
}

// Linker Akzent-Rand pro Status
const STATUS_BORDER: Record<ReservierungStatus, string> = {
  ausstehend: 'border-l-yellow-400',
  bestaetigt: 'border-l-green-400',
  storniert: 'border-l-gray-300',
};

export default function ReservierungZeile({ reservierung, onStatusAendern }: ReservierungZeileProps) {
  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-4 shadow-sm flex items-center gap-4 border-l-[3px] ${STATUS_BORDER[reservierung.status]} card-hover`}>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 dark:text-slate-200">{reservierung.gast_name}</p>
        <p className="text-xs text-gray-400 dark:text-slate-500">{formatDatum(reservierung.datum)} · {reservierung.personen} Personen</p>
        {reservierung.anmerkung && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 italic bg-gray-50 dark:bg-white/5 rounded px-2 py-0.5 inline-block">{reservierung.anmerkung}</p>}
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${RESERVIERUNG_STATUS_FARBE[reservierung.status]}`}>
        {RESERVIERUNG_STATUS_LABEL[reservierung.status]}
      </span>
      {reservierung.status === 'ausstehend' && (
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => onStatusAendern(reservierung.id, 'bestaetigt')} className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors font-medium">Bestätigen</button>
          <button onClick={() => onStatusAendern(reservierung.id, 'storniert')} className="text-xs bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">Stornieren</button>
        </div>
      )}
    </div>
  );
}
