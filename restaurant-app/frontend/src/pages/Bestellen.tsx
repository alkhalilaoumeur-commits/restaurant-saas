import { useState } from 'react';
import { useParams } from 'react-router-dom';
import GerichtAuswahl from '../components/gaeste/GerichtAuswahl';
import Warenkorb from '../components/gaeste/Warenkorb';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { WarenkorbPosition } from '../types';
import { api } from '../lib/api';

export default function Bestellen() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const { gerichte, laden } = useSpeisekarte(restaurantId);
  const [mengen, setMengen] = useState<Record<string, number>>({});
  const [anmerkung, setAnmerkung] = useState('');
  const [bestellt, setBestellt] = useState(false);
  const [sendenLaden, setSendenLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  function mengeAendern(gerichtId: string, delta: number) {
    setMengen((prev) => {
      const neu = Math.max(0, (prev[gerichtId] || 0) + delta);
      if (neu === 0) { const { [gerichtId]: _, ...rest } = prev; return rest; }
      return { ...prev, [gerichtId]: neu };
    });
  }

  const positionen: WarenkorbPosition[] = gerichte
    .filter((g) => mengen[g.id])
    .map((g) => ({ gericht: g, menge: mengen[g.id] }));

  const gesamtpreis = positionen.reduce((s, p) => s + p.gericht.preis * p.menge, 0);

  async function bestellen() {
    setFehler('');
    setSendenLaden(true);
    try {
      await api.post('/bestellungen', {
        restaurant_id: restaurantId,
        tisch_id: tischId,
        positionen: positionen.map((p) => ({ gericht_id: p.gericht.id, menge: p.menge })),
        anmerkung,
      });
      setBestellt(true);
    } catch (err) {
      setFehler((err as Error).message || 'Bestellung fehlgeschlagen – bitte erneut versuchen');
    } finally {
      setSendenLaden(false);
    }
  }

  if (bestellt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-800">Bestellung eingegangen!</h2>
          <p className="text-sm text-gray-400 mt-2">Wir bereiten alles für dich vor.</p>
        </div>
      </div>
    );
  }

  const kategorien = [...new Set(gerichte.map((g) => g.kategorie_name))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <h1 className="text-base font-semibold text-orange-600">Bestellen</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {laden && <p className="text-sm text-gray-400 text-center py-8">Speisekarte wird geladen...</p>}

        {kategorien.map((kat) => (
          <section key={kat}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">{kat}</h2>
            <div className="space-y-3">
              {gerichte
                .filter((g) => g.kategorie_name === kat && g.verfuegbar)
                .map((g) => (
                  <GerichtAuswahl
                    key={g.id}
                    gericht={g}
                    menge={mengen[g.id] || 0}
                    onAendern={(delta) => mengeAendern(g.id, delta)}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {fehler && <p className="fixed bottom-48 left-0 right-0 mx-4 text-center text-sm text-red-600 bg-red-50 rounded-lg py-2">{fehler}</p>}
      <Warenkorb
        positionen={positionen}
        gesamtpreis={gesamtpreis}
        anmerkung={anmerkung}
        onAnmerkungAendern={setAnmerkung}
        onBestellen={bestellen}
        laden={sendenLaden}
      />
    </div>
  );
}
