import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Gericht {
  id: string;
  name: string;
  beschreibung: string | null;
  preis: number;
  bild_url: string | null;
  allergene: string | null;
  verfuegbar: boolean;
  kategorie_name: string;
}

interface Warenkorb {
  [gerichtId: string]: number;
}

export default function BestellenPage() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const [gerichte, setGerichte] = useState<Gericht[]>([]);
  const [warenkorb, setWarenkorb] = useState<Warenkorb>({});
  const [anmerkung, setAnmerkung] = useState('');
  const [bestellt, setBestellt] = useState(false);
  const [laden, setLaden] = useState(false);

  useEffect(() => {
    fetch(`/api/gerichte?restaurantId=${restaurantId}`)
      .then((r) => r.json())
      .then(setGerichte);
  }, [restaurantId]);

  function menge(id: string) {
    return warenkorb[id] || 0;
  }

  function aendern(id: string, delta: number) {
    setWarenkorb((prev) => {
      const neu = Math.max(0, (prev[id] || 0) + delta);
      if (neu === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: neu };
    });
  }

  const gesamtpreis = gerichte.reduce((sum, g) => sum + (warenkorb[g.id] || 0) * g.preis, 0);
  const hatPositionen = Object.keys(warenkorb).length > 0;

  async function bestellen() {
    if (!hatPositionen) return;
    setLaden(true);
    const positionen = Object.entries(warenkorb).map(([gericht_id, menge]) => ({ gericht_id, menge }));
    const res = await fetch('/api/bestellungen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant_id: restaurantId, tisch_id: tischId, positionen, anmerkung }),
    });
    setLaden(false);
    if (res.ok) setBestellt(true);
  }

  // Gerichte nach Kategorie gruppieren
  const kategorien = [...new Set(gerichte.map((g) => g.kategorie_name))];

  if (bestellt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-800">Bestellung eingegangen!</h2>
          <p className="text-gray-500 text-sm mt-2">Wir bereiten deine Bestellung vor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white shadow-sm px-4 py-3">
        <h1 className="text-lg font-bold text-brand-600">Bestellen</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {kategorien.map((kat) => (
          <section key={kat}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">{kat}</h2>
            <div className="space-y-3">
              {gerichte
                .filter((g) => g.kategorie_name === kat && g.verfuegbar)
                .map((g) => (
                  <div key={g.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{g.name}</p>
                      {g.beschreibung && <p className="text-xs text-gray-400 mt-0.5">{g.beschreibung}</p>}
                      <p className="text-sm font-semibold text-brand-600 mt-1">{Number(g.preis).toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => aendern(g.id, -1)}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-medium">{menge(g.id)}</span>
                      <button
                        onClick={() => aendern(g.id, 1)}
                        className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}

        <div>
          <label className="block text-sm text-gray-600 mb-1">Anmerkung (optional)</label>
          <textarea
            value={anmerkung}
            onChange={(e) => setAnmerkung(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="z.B. keine Zwiebeln..."
          />
        </div>
      </div>

      {/* Sticky Warenkorb-Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-lg mx-auto">
        <button
          onClick={bestellen}
          disabled={!hatPositionen || laden}
          className="w-full bg-brand-600 text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          {laden ? 'Wird gesendet...' : `Bestellen · ${gesamtpreis.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );
}
