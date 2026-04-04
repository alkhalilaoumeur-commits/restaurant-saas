import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

interface GerichtKarteProps {
  gericht: Gericht;
  onToggle: (id: string, verfuegbar: boolean) => void;
  onLoeschen: (id: string) => void;
}

export default function GerichtKarte({ gericht, onToggle, onLoeschen }: GerichtKarteProps) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm flex gap-3 ${!gericht.verfuegbar ? 'opacity-60' : ''}`}>
      {gericht.bild_url && (
        <img src={gericht.bild_url} alt={gericht.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm text-gray-800">{gericht.name}</p>
            {gericht.beschreibung && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{gericht.beschreibung}</p>}
            {gericht.allergene && <p className="text-xs text-gray-300 mt-0.5">Allergene: {gericht.allergene}</p>}
          </div>
          <p className="text-sm font-semibold text-orange-600 shrink-0">{formatPreis(gericht.preis)}</p>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onToggle(gericht.id, !gericht.verfuegbar)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              gericht.verfuegbar
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {gericht.verfuegbar ? 'Verfügbar' : 'Ausverkauft'}
          </button>
          <button
            onClick={() => onLoeschen(gericht.id)}
            className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
