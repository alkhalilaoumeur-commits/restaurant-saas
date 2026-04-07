import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

interface GerichtKarteProps {
  gericht: Gericht;
  onToggle: (id: string, verfuegbar: boolean) => void;
  onBearbeiten: (gericht: Gericht) => void;
  onLoeschen: (id: string) => void;
}

export default function GerichtKarte({ gericht, onToggle, onBearbeiten, onLoeschen }: GerichtKarteProps) {
  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-4 shadow-sm flex gap-4 card-hover ${!gericht.verfuegbar ? 'opacity-60' : ''}`}>
      {gericht.bild_url && (
        <img src={gericht.bild_url} alt={gericht.name} className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-gray-100" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm text-gray-800 dark:text-slate-200">{gericht.name}</p>
            {gericht.beschreibung && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-2">{gericht.beschreibung}</p>}
            {gericht.allergene && (
              <p className="text-xs text-gray-300 dark:text-slate-600 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {gericht.allergene}
              </p>
            )}
          </div>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400 shrink-0 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg">{formatPreis(gericht.preis)}</p>
        </div>
        <div className="flex gap-1.5 mt-3">
          <button
            onClick={() => onToggle(gericht.id, !gericht.verfuegbar)}
            className={`text-xs px-2.5 py-1.5 rounded-lg transition-all duration-200 font-medium ${
              gericht.verfuegbar
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {gericht.verfuegbar ? 'Verfügbar' : 'Ausverkauft'}
          </button>
          <button
            onClick={() => onBearbeiten(gericht)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 font-medium"
          >
            Bearbeiten
          </button>
          <button
            onClick={() => onLoeschen(gericht.id)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
