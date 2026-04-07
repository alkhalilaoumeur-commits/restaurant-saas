import { WarenkorbPosition } from '../../types';
import { formatPreis } from '../../lib/utils';

interface WarenkorbProps {
  positionen: WarenkorbPosition[];
  gesamtpreis: number;
  anmerkung: string;
  onAnmerkungAendern: (wert: string) => void;
  onBestellen: () => void;
  laden: boolean;
}

export default function Warenkorb({ positionen, gesamtpreis, anmerkung, onAnmerkungAendern, onBestellen, laden }: WarenkorbProps) {
  const leer = positionen.length === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gastro-surface/95 backdrop-blur-md border-t border-gastro-border shadow-2xl shadow-black/10 p-4 max-w-lg mx-auto rounded-t-theme">
      {!leer && (
        <ul className="text-xs text-gastro-muted mb-3 space-y-1 max-h-32 overflow-y-auto">
          {positionen.map(({ gericht, menge }) => (
            <li key={gericht.id} className="flex justify-between py-0.5">
              <span className="font-medium text-gastro-text">{menge}× {gericht.name}</span>
              <span>{formatPreis(gericht.preis * menge)}</span>
            </li>
          ))}
          <li className="flex justify-between pt-1.5 border-t border-gastro-border font-semibold text-gastro-text text-sm">
            <span>Gesamt</span>
            <span>{formatPreis(gesamtpreis)}</span>
          </li>
        </ul>
      )}
      <textarea
        value={anmerkung}
        onChange={(e) => onAnmerkungAendern(e.target.value)}
        placeholder="Anmerkung zur Bestellung..."
        rows={1}
        className="w-full border border-gastro-border bg-gastro/50 text-gastro-text placeholder:text-gastro-muted rounded-theme px-3 py-2 text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-gastro-primary/30 focus:border-transparent transition-all"
      />
      <button
        onClick={onBestellen}
        disabled={leer || laden}
        className="w-full bg-gastro-primary text-gastro-on-primary rounded-theme py-3.5 font-semibold text-sm disabled:opacity-40 transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-gastro-primary/25"
      >
        {laden ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Wird gesendet...
          </span>
        ) : leer ? 'Bitte Gerichte auswählen' : `Bestellen · ${formatPreis(gesamtpreis)}`}
      </button>
    </div>
  );
}
