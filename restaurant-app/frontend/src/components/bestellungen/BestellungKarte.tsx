import { Bestellung, BestellungStatus } from '../../types';
import { formatPreis, formatZeit, NAECHSTER_STATUS, BESTELLUNG_STATUS_LABEL } from '../../lib/utils';
import StatusBadge from './StatusBadge';

interface BestellungKarteProps {
  bestellung: Bestellung;
  onStatusAendern: (id: string, status: BestellungStatus) => void;
}

// Linke Rand-Farbe je nach Status
const STATUS_BORDER: Record<BestellungStatus, string> = {
  offen: 'border-l-yellow-400',
  in_zubereitung: 'border-l-orange-400',
  serviert: 'border-l-green-400',
  bezahlt: 'border-l-gray-300',
};

export default function BestellungKarte({ bestellung, onStatusAendern }: BestellungKarteProps) {
  const naechster = NAECHSTER_STATUS[bestellung.status];

  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-4 border-l-[3px] ${STATUS_BORDER[bestellung.status]} card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 dark:text-slate-200">Tisch {bestellung.tisch_nummer}</span>
          <StatusBadge status={bestellung.status} />
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800 dark:text-slate-200">{formatPreis(bestellung.gesamtpreis)}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{formatZeit(bestellung.erstellt_am)}</p>
        </div>
      </div>

      <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1 mb-3">
        {bestellung.positionen?.map((p, i) => (
          <li key={i} className="flex justify-between py-0.5">
            <span>{p.menge}× {p.gericht_name}</span>
            <span className="text-gray-400 dark:text-slate-500">{formatPreis(p.einzelpreis)}</span>
          </li>
        ))}
      </ul>

      {bestellung.anmerkung && (
        <p className="text-xs text-gray-400 dark:text-slate-500 italic mb-3 bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-1.5">{bestellung.anmerkung}</p>
      )}

      {naechster && (
        <button
          onClick={() => onStatusAendern(bestellung.id, naechster)}
          className="text-sm bg-orange-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-700 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          → {BESTELLUNG_STATUS_LABEL[naechster]}
        </button>
      )}
    </div>
  );
}
