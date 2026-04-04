import { Bestellung, BestellungStatus } from '../../types';
import { formatPreis, formatZeit, NAECHSTER_STATUS, BESTELLUNG_STATUS_LABEL } from '../../lib/utils';
import StatusBadge from './StatusBadge';

interface BestellungKarteProps {
  bestellung: Bestellung;
  onStatusAendern: (id: string, status: BestellungStatus) => void;
}

export default function BestellungKarte({ bestellung, onStatusAendern }: BestellungKarteProps) {
  const naechster = NAECHSTER_STATUS[bestellung.status];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-semibold text-gray-800">Tisch {bestellung.tisch_nummer}</span>
          <StatusBadge status={bestellung.status} />
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">{formatPreis(bestellung.gesamtpreis)}</p>
          <p className="text-xs text-gray-400">{formatZeit(bestellung.erstellt_am)}</p>
        </div>
      </div>

      <ul className="text-sm text-gray-600 space-y-0.5 mb-3">
        {bestellung.positionen?.map((p, i) => (
          <li key={i} className="flex justify-between">
            <span>{p.menge}× {p.gericht_name}</span>
            <span className="text-gray-400">{formatPreis(p.einzelpreis)}</span>
          </li>
        ))}
      </ul>

      {bestellung.anmerkung && (
        <p className="text-xs text-gray-400 italic mb-3">„{bestellung.anmerkung}"</p>
      )}

      {naechster && (
        <button
          onClick={() => onStatusAendern(bestellung.id, naechster)}
          className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
        >
          → {BESTELLUNG_STATUS_LABEL[naechster]}
        </button>
      )}
    </div>
  );
}
