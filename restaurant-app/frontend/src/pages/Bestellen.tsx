import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import GerichtAuswahl from '../components/gaeste/GerichtAuswahl';
import Warenkorb from '../components/gaeste/Warenkorb';
import BestellStatusTracker from '../components/gaeste/BestellStatusTracker';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { useGaesteSocket } from '../hooks/useGaesteSocket';
import { useRestaurantDesign } from '../hooks/useRestaurantDesign';
import { useGastroTheme } from '../hooks/useGastroTheme';
import { WarenkorbPosition, BestellungStatus } from '../types';

export default function Bestellen() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const { gerichte, laden } = useSpeisekarte(restaurantId);
  const design = useRestaurantDesign(restaurantId);
  // Theme aktivieren — setzt CSS Custom Properties (Farben, Fonts, Ecken) auf <html>
  // Später kommt die Preset-ID aus der DB (design?.theme_preset_id)
  useGastroTheme('modern');
  const [mengen, setMengen] = useState<Record<string, number>>({});
  const [anmerkung, setAnmerkung] = useState('');
  const [bestellt, setBestellt] = useState(false);
  const [bestellungId, setBestellungId] = useState<string | null>(null);
  const [bestellStatus, setBestellStatus] = useState<BestellungStatus>('offen');
  const [gespeicherterPreis, setGespeicherterPreis] = useState(0);
  const [sendenLaden, setSendenLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  // Socket: Live-Updates für den Bestellstatus
  const onStatusUpdate = useCallback((daten: { id: string; status: string }) => {
    if (bestellungId && daten.id === bestellungId) {
      setBestellStatus(daten.status as BestellungStatus);
    }
  }, [bestellungId]);
  useGaesteSocket(restaurantId, tischId, onStatusUpdate);

  function mengeAendern(gerichtId: string, delta: number) {
    setMengen((prev) => {
      const neu = Math.max(0, (prev[gerichtId] || 0) + delta);
      if (neu === 0) { const { [gerichtId]: _, ...rest } = prev; return rest; }
      return { ...prev, [gerichtId]: neu };
    });
  }

  const positionen: WarenkorbPosition[] = gerichte
    .filter((g) => mengen[g.id])
    .map((g) => ({ key: g.id, gericht: g, menge: mengen[g.id], extras: [] }));

  const gesamtpreis = positionen.reduce((s, p) => s + p.gericht.preis * p.menge, 0);

  async function bestellen() {
    setFehler('');
    setSendenLaden(true);
    try {
      const res = await fetch('/api/bestellungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          tisch_id: tischId,
          anmerkung: anmerkung || null,
          positionen: positionen.map((p) => ({
            gericht_id: p.gericht.id,
            menge: p.menge,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fehler || 'Bestellung fehlgeschlagen');

      setBestellungId(data.id);
      setGespeicherterPreis(data.gesamtpreis);
      setBestellStatus('offen');
      setBestellt(true);
    } catch (err) {
      setFehler((err as Error).message || 'Bestellung fehlgeschlagen ��� bitte erneut versuchen');
    } finally {
      setSendenLaden(false);
    }
  }

  if (bestellt) {
    return <BestellStatusTracker status={bestellStatus} gesamtpreis={gespeicherterPreis} />;
  }

  const kategorien = [...new Set(gerichte.map((g) => g.kategorie_name))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gastro font-theme-body pb-52">
      <header className="bg-gastro-surface/90 backdrop-blur-md border-b border-gastro-border px-4 py-3.5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gastro-primary text-gastro-on-primary shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3" />
              <path d="M18 22v-7" />
            </svg>
          </div>
          <h1 className="text-base font-semibold text-gastro-text font-theme-heading">{design?.name || 'Bestellen'}</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {laden && <p className="text-sm text-gastro-muted text-center py-8">Speisekarte wird geladen...</p>}

        {kategorien.map((kat) => (
          <section key={kat}>
            <h2 className="text-xs font-semibold text-gastro-muted uppercase mb-3 font-theme-heading">{kat}</h2>
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
