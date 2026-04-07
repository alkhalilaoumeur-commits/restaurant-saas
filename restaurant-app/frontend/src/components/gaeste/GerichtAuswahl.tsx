import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

interface GerichtAuswahlProps {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

export default function GerichtAuswahl({ gericht, menge, onAendern }: GerichtAuswahlProps) {
  const istAusgewaehlt = menge > 0;

  return (
    <div
      className={`bg-gastro-surface rounded-theme p-4 shadow-theme-card border-theme-card border-gastro-border flex items-center gap-3 transition-all duration-200 ${
        istAusgewaehlt
          ? 'ring-2 ring-gastro-primary shadow-lg'
          : 'hover:shadow-md'
      }`}
    >
      {gericht.bild_url && (
        <img src={gericht.bild_url} alt={gericht.name} className="w-14 h-14 rounded-theme object-cover shrink-0 ring-1 ring-gastro-border" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gastro-text">{gericht.name}</p>
        {gericht.beschreibung && <p className="text-xs text-gastro-muted mt-0.5 line-clamp-1">{gericht.beschreibung}</p>}
        <p className="text-sm font-bold mt-1 text-gastro-primary">{formatPreis(gericht.preis)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onAendern(-1)}
          disabled={menge === 0}
          className="w-8 h-8 rounded-full bg-gastro-border/50 text-gastro-muted text-lg font-medium disabled:opacity-30 transition-all duration-200 hover:bg-gastro-border active:scale-90"
        >
          −
        </button>
        <span className={`w-6 text-center text-sm font-bold transition-colors ${istAusgewaehlt ? 'text-gastro-text' : 'text-gastro-muted'}`}>{menge}</span>
        <button
          onClick={() => onAendern(1)}
          className="w-8 h-8 rounded-full text-lg font-medium bg-gastro-primary text-gastro-on-primary transition-all duration-200 hover:opacity-90 active:scale-90 shadow-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}
