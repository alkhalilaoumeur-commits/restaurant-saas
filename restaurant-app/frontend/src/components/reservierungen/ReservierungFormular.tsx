import { useState, useEffect, useRef, FormEvent } from 'react';
import { api } from '../../lib/api';
import { Gast } from '../../types';

interface ReservierungFormularProps {
  restaurantId: string;
  onErfolg: () => void;
  onAbbrechen: () => void;
}

const INPUT_KLASSE = 'w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-400 transition-colors';

function initialien(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join('');
}

export default function ReservierungFormular({ restaurantId, onErfolg, onAbbrechen }: ReservierungFormularProps) {
  const [felder, setFelder] = useState({ gast_name: '', email: '', telefon: '', datum: '', personen: '2', anmerkung: '' });
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  // CRM-Suche
  const [gastSuche, setGastSuche] = useState('');
  const [alleGaeste, setAlleGaeste] = useState<Gast[]>([]);
  const [gaesteLaden, setGaesteLaden] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [gewaehlterGastId, setGewaehlterGastId] = useState<string | null>(null);
  const sucheRef = useRef<HTMLDivElement>(null);

  // Gäste beim Öffnen des Formulars laden
  useEffect(() => {
    setGaesteLaden(true);
    api.get<Gast[]>('/gaeste')
      .then(setAlleGaeste)
      .catch(() => {}) // CRM nicht verfügbar → kein Blocker
      .finally(() => setGaesteLaden(false));
  }, []);

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sucheRef.current && !sucheRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const gefiltert = gastSuche.trim().length >= 1
    ? alleGaeste.filter((g) => {
        const s = gastSuche.toLowerCase();
        return (
          g.name.toLowerCase().includes(s) ||
          g.email?.toLowerCase().includes(s) ||
          g.telefon?.includes(s)
        );
      }).slice(0, 6)
    : [];

  function gastWaehlen(gast: Gast) {
    setGewaehlterGastId(gast.id);
    setGastSuche(gast.name);
    setFelder((prev) => ({
      ...prev,
      gast_name: gast.name,
      email: gast.email ?? '',
      telefon: gast.telefon ?? '',
    }));
    setDropdown(false);
  }

  function gastVerbindungLoesen() {
    setGewaehlterGastId(null);
    setGastSuche('');
  }

  function setFeld(key: keyof typeof felder, value: string) {
    // Wenn ein Gast verknüpft ist und Name geändert wird → Verknüpfung lösen
    if (key === 'gast_name' && gewaehlterGastId) gastVerbindungLoesen();
    setFelder((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      await api.post('/reservierungen', {
        ...felder,
        restaurant_id: restaurantId,
        personen: parseInt(felder.personen),
        ...(gewaehlterGastId ? { gast_id: gewaehlterGastId } : {}),
      });
      onErfolg();
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }

  const verknuepft = gewaehlterGastId !== null;
  const verknuepfterGast = verknuepft ? alleGaeste.find((g) => g.id === gewaehlterGastId) : null;

  return (
    <form onSubmit={submit} className="space-y-3">

      {/* ─── CRM-Suche ─────────────────────────────────────────────────────── */}
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-700/20 rounded-xl p-3">
        <p className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
          Gast aus CRM verknüpfen (optional)
        </p>

        {verknuepft && verknuepfterGast ? (
          /* Verknüpfter Gast — Chip */
          <div className="flex items-center gap-2 bg-white dark:bg-white/[0.06] border border-orange-200 dark:border-orange-600/30 rounded-lg px-3 py-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {initialien(verknuepfterGast.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{verknuepfterGast.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">
                {[verknuepfterGast.email, verknuepfterGast.telefon].filter(Boolean).join(' · ') || 'Kein Kontakt'}
                {verknuepfterGast.besuche > 0 && ` · ${verknuepfterGast.besuche}× besucht`}
              </p>
            </div>
            <button
              type="button"
              onClick={gastVerbindungLoesen}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
              title="Verknüpfung lösen"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* Suche-Feld */
          <div ref={sucheRef} className="relative">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={gastSuche}
                onChange={(e) => { setGastSuche(e.target.value); setDropdown(true); }}
                onFocus={() => gastSuche.trim().length >= 1 && setDropdown(true)}
                placeholder={gaesteLaden ? 'Lädt…' : 'Name, Email oder Telefon suchen…'}
                disabled={gaesteLaden}
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
              />
            </div>

            {dropdown && gefiltert.length > 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
                {gefiltert.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => gastWaehlen(g)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {initialien(g.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{g.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">
                        {[g.email, g.telefon].filter(Boolean).join(' · ') || '—'}
                        {g.besuche > 0 && ` · ${g.besuche}× Besuche`}
                      </p>
                    </div>
                    {g.tags.includes('VIP') && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">★ VIP</span>
                    )}
                    {g.tags.includes('Stammgast') && !g.tags.includes('VIP') && (
                      <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 shrink-0">Stammgast</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {dropdown && gastSuche.trim().length >= 2 && gefiltert.length === 0 && !gaesteLaden && (
              <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg px-3 py-2.5">
                <p className="text-xs text-gray-400 dark:text-slate-500 italic">Kein Gast gefunden für „{gastSuche}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Formularfelder ────────────────────────────────────────────────── */}
      <input
        placeholder="Name des Gastes"
        value={felder.gast_name}
        onChange={(e) => setFeld('gast_name', e.target.value)}
        required
        className={INPUT_KLASSE}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="email"
          placeholder="E-Mail (optional)"
          value={felder.email}
          onChange={(e) => setFeld('email', e.target.value)}
          className={INPUT_KLASSE}
        />
        <input
          placeholder="Telefon (optional)"
          value={felder.telefon}
          onChange={(e) => setFeld('telefon', e.target.value)}
          className={INPUT_KLASSE}
        />
      </div>
      <input
        type="datetime-local"
        value={felder.datum}
        onChange={(e) => setFeld('datum', e.target.value)}
        required
        className={INPUT_KLASSE}
      />
      <input
        type="number"
        min="1"
        placeholder="Personen"
        value={felder.personen}
        onChange={(e) => setFeld('personen', e.target.value)}
        required
        className={INPUT_KLASSE}
      />
      <textarea
        placeholder="Anmerkung (optional)"
        value={felder.anmerkung}
        onChange={(e) => setFeld('anmerkung', e.target.value)}
        rows={2}
        className={INPUT_KLASSE}
      />

      {fehler && <p className="text-xs text-red-600">{fehler}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={laden}
          className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-orange-700 transition-colors"
        >
          {laden ? 'Speichern...' : verknuepft ? '✓ Reservierung + CRM anlegen' : 'Reservierung anlegen'}
        </button>
        <button
          type="button"
          onClick={onAbbrechen}
          className="flex-1 border border-gray-200 dark:border-white/10 rounded-lg py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
