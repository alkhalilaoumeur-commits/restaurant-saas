import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

interface GerichtAuswahlProps {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

export default function GerichtAuswahl({ gericht, menge, onAendern }: GerichtAuswahlProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
      {gericht.bild_url && (
        <img src={gericht.bild_url} alt={gericht.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800">{gericht.name}</p>
        {gericht.beschreibung && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{gericht.beschreibung}</p>}
        <p className="text-sm font-semibold text-orange-600 mt-1">{formatPreis(gericht.preis)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onAendern(-1)}
          disabled={menge === 0}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-lg font-medium disabled:opacity-30"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold">{menge}</span>
        <button
          onClick={() => onAendern(1)}
          className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
}
