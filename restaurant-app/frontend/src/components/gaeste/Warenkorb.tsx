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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 max-w-lg mx-auto">
      {!leer && (
        <ul className="text-xs text-gray-500 mb-2 space-y-0.5">
          {positionen.map(({ gericht, menge }) => (
            <li key={gericht.id} className="flex justify-between">
              <span>{menge}× {gericht.name}</span>
              <span>{formatPreis(gericht.preis * menge)}</span>
            </li>
          ))}
        </ul>
      )}
      <textarea
        value={anmerkung}
        onChange={(e) => onAnmerkungAendern(e.target.value)}
        placeholder="Anmerkung zur Bestellung..."
        rows={1}
        className="w-full border rounded-lg px-3 py-1.5 text-sm mb-2 resize-none"
      />
      <button
        onClick={onBestellen}
        disabled={leer || laden}
        className="w-full bg-orange-600 text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-40 transition-opacity"
      >
        {laden ? 'Wird gesendet...' : leer ? 'Bitte Gerichte auswählen' : `Bestellen · ${formatPreis(gesamtpreis)}`}
      </button>
    </div>
  );
}
