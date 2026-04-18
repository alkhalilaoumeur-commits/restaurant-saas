import { useState } from 'react';
import { useRezepturen, useArtikel } from '../../hooks/useInventur';
import type { Gericht } from '../../types';

interface Props {
  gericht: Gericht;
}

export default function RezepturVerwaltung({ gericht }: Props) {
  const { rezepturen, laden, erstellen, loeschen } = useRezepturen(gericht.id);
  const { artikel } = useArtikel();

  const [artikelId, setArtikelId] = useState('');
  const [menge, setMenge] = useState('');
  const [speichert, setSpeichert] = useState(false);

  // Artikel die noch nicht verknüpft sind (für das Dropdown)
  const verfuegbar = artikel.filter(a => !rezepturen.some(r => r.artikel_id === a.id));
  const ausgewaehlt = artikel.find(a => a.id === artikelId);

  const handleHinzufuegen = async () => {
    const mengeNum = parseFloat(menge);
    if (!artikelId || !mengeNum || mengeNum <= 0) return;
    setSpeichert(true);
    try {
      await erstellen({ gericht_id: gericht.id, artikel_id: artikelId, menge: mengeNum });
      setArtikelId('');
      setMenge('');
    } finally {
      setSpeichert(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Erklärung */}
      <p className="text-sm text-slate-400">
        Definiere welche Inventar-Artikel pro Portion abgezogen werden. Wenn eine Bestellung
        bezahlt wird, werden die Mengen automatisch vom Lager abgezogen.
      </p>

      {/* Bestehende Verknüpfungen */}
      {laden ? (
        <p className="text-sm text-slate-500">Lädt…</p>
      ) : rezepturen.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500">Noch keine Inventar-Verknüpfung.</p>
          <p className="text-xs text-slate-600 mt-1">
            Für einfache 1:1-Artikel (z.B. Cola) einfach Menge 1 eintragen.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rezepturen.map(r => {
            const inventarArtikel = artikel.find(a => a.id === r.artikel_id);
            return (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Inventur-Icon */}
                  <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 8h14M5 12h14M5 16h6" /><rect x="2" y="3" width="20" height="18" rx="2" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {r.artikel_name ?? inventarArtikel?.name ?? r.artikel_id}
                    </p>
                    <p className="text-xs text-slate-400">
                      {Number(r.menge).toLocaleString('de-DE', { maximumFractionDigits: 3 })} {r.einheit ?? inventarArtikel?.einheit ?? ''}
                      {' '}pro Portion
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => loeschen(r.id)}
                  className="shrink-0 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Verknüpfung entfernen"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Neue Verknüpfung */}
      <div className="border-t border-white/10 pt-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Verknüpfung hinzufügen
        </p>
        <div className="flex gap-2">
          <select
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 min-w-0"
            value={artikelId}
            onChange={e => setArtikelId(e.target.value)}
          >
            <option value="">— Inventar-Artikel wählen —</option>
            {verfuegbar.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.einheit})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min="0.001"
              step="0.001"
              placeholder="Menge"
              className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              value={menge}
              onChange={e => setMenge(e.target.value)}
            />
            {ausgewaehlt && (
              <span className="text-xs text-slate-400 w-10 shrink-0">{ausgewaehlt.einheit}</span>
            )}
          </div>
          <button
            onClick={handleHinzufuegen}
            disabled={speichert || !artikelId || !menge || parseFloat(menge) <= 0}
            className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-sm rounded-xl font-medium transition-colors"
          >
            {speichert ? '…' : '+ Hinzufügen'}
          </button>
        </div>

        {/* Hinweis für 1:1 Artikel */}
        {artikelId && !menge && (
          <p className="text-xs text-slate-500 mt-2">
            Tipp: Für Getränke/Artikel die 1:1 verbraucht werden → Menge <strong className="text-slate-400">1</strong> eintragen.
          </p>
        )}

        {verfuegbar.length === 0 && artikel.length > 0 && (
          <p className="text-xs text-slate-600 mt-2">
            Alle Inventar-Artikel sind bereits verknüpft.
          </p>
        )}
        {artikel.length === 0 && (
          <p className="text-xs text-amber-500 mt-2">
            Noch keine Inventar-Artikel vorhanden. Zuerst unter <strong>Inventur → Artikel</strong> anlegen.
          </p>
        )}
      </div>
    </div>
  );
}
