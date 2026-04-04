import { Reservierung, ReservierungStatus } from '../../types';
import { formatDatum, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL } from '../../lib/utils';

interface ReservierungZeileProps {
  reservierung: Reservierung;
  onStatusAendern: (id: string, status: ReservierungStatus) => void;
}

export default function ReservierungZeile({ reservierung, onStatusAendern }: ReservierungZeileProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800">{reservierung.gast_name}</p>
        <p className="text-xs text-gray-400">{formatDatum(reservierung.datum)} · {reservierung.personen} Personen</p>
        {reservierung.anmerkung && <p className="text-xs text-gray-400 mt-0.5 italic">„{reservierung.anmerkung}"</p>}
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${RESERVIERUNG_STATUS_FARBE[reservierung.status]}`}>
        {RESERVIERUNG_STATUS_LABEL[reservierung.status]}
      </span>
      {reservierung.status === 'ausstehend' && (
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onStatusAendern(reservierung.id, 'bestaetigt')} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">Bestätigen</button>
          <button onClick={() => onStatusAendern(reservierung.id, 'storniert')} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">Stornieren</button>
        </div>
      )}
    </div>
  );
}
