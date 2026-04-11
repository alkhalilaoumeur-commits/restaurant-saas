import { useState } from 'react';
import { Schicht, MitarbeiterDetail } from '../../types';

interface SchichtFormularProps {
  mitarbeiter: MitarbeiterDetail[];
  schicht?: Schicht | null;
  vorauswahlDatum?: string;
  vorauswahlMitarbeiter?: string;
  onSpeichern: (daten: {
    mitarbeiter_id: string;
    datum: string;
    beginn: string;
    ende: string;
    notiz?: string;
  }) => Promise<{ warnungen?: string[] }>;
  onLoeschen?: () => Promise<void>;
  onAbbrechen: () => void;
}

export default function SchichtFormular({
  mitarbeiter,
  schicht,
  vorauswahlDatum,
  vorauswahlMitarbeiter,
  onSpeichern,
  onLoeschen,
  onAbbrechen,
}: SchichtFormularProps) {
  const [mitarbeiterId, setMitarbeiterId] = useState(schicht?.mitarbeiter_id || vorauswahlMitarbeiter || '');
  const [datum, setDatum] = useState(schicht?.datum?.slice(0, 10) || vorauswahlDatum || '');
  const [beginn, setBeginn] = useState(schicht?.beginn?.slice(0, 5) || '09:00');
  const [ende, setEnde] = useState(schicht?.ende?.slice(0, 5) || '17:00');
  const [notiz, setNotiz] = useState(schicht?.notiz || '');
  const [fehler, setFehler] = useState<string | null>(null);
  const [speichert, setSpeichert] = useState(false);

  // ArbZG-Warnungen nach erfolgreichem Speichern
  const [warnungen, setWarnungen] = useState<string[]>([]);
  const [gespeichert, setGespeichert] = useState(false);

  const aktiveMitarbeiter = mitarbeiter.filter((m) => m.aktiv);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mitarbeiterId) { setFehler('Bitte Mitarbeiter auswählen'); return; }
    if (!datum) { setFehler('Bitte Datum auswählen'); return; }
    if (beginn >= ende) { setFehler('Ende muss nach Beginn liegen'); return; }
    setFehler(null);
    setSpeichert(true);
    try {
      const result = await onSpeichern({ mitarbeiter_id: mitarbeiterId, datum, beginn, ende, notiz: notiz || undefined });
      const warns = result?.warnungen || [];
      if (warns.length > 0) {
        // Schicht wurde gespeichert, aber es gibt ArbZG-Hinweise → Modal bleibt offen
        setWarnungen(warns);
        setGespeichert(true);
      }
      // Wenn keine Warnungen: Modal wurde bereits vom Parent geschlossen
    } catch (e: any) {
      // Doppelbuchung (409) oder anderer Fehler → als Fehler anzeigen
      setFehler(e.message || 'Fehler beim Speichern');
    } finally {
      setSpeichert(false);
    }
  }

  const inputKlasse = 'w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors';

  // ── Nach dem Speichern: Warnungen anzeigen ───────────────────────────────────
  if (gespeichert && warnungen.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Schicht gespeichert — ArbZG-Hinweise
            </p>
            <ul className="space-y-1">
              {warnungen.map((w, i) => (
                <li key={i} className="text-xs text-amber-700 dark:text-amber-400">• {w}</li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-600 dark:text-amber-500 pt-1">
              Die Schicht wurde trotzdem gespeichert. Bitte prüfen und ggf. anpassen.
            </p>
          </div>
        </div>
        <button
          onClick={onAbbrechen}
          className="w-full h-10 rounded-lg text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
        >
          Schließen
        </button>
      </div>
    );
  }

  // ── Formular ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Fehler (Doppelbuchung = rot) */}
      {fehler && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
          <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-700 dark:text-red-400">{fehler}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Mitarbeiter</label>
        <select value={mitarbeiterId} onChange={(e) => setMitarbeiterId(e.target.value)} className={inputKlasse}>
          <option value="">– Bitte wählen –</option>
          {aktiveMitarbeiter.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.rolle})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Datum</label>
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputKlasse} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Beginn</label>
          <input type="time" value={beginn} onChange={(e) => setBeginn(e.target.value)} className={inputKlasse} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Ende</label>
          <input type="time" value={ende} onChange={(e) => setEnde(e.target.value)} className={inputKlasse} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Notiz (optional)</label>
        <input type="text" value={notiz} onChange={(e) => setNotiz(e.target.value)} placeholder="z.B. Frühschicht, Vertretung..." className={inputKlasse} />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={speichert}
          className="flex-1 bg-[#dc2626] text-white rounded-lg h-10 text-sm font-medium hover:bg-[#c52222] transition-colors disabled:opacity-50"
        >
          {speichert ? 'Speichert...' : schicht ? 'Aktualisieren' : 'Schicht eintragen'}
        </button>
        {schicht && onLoeschen && (
          <button
            type="button"
            onClick={onLoeschen}
            className="px-4 h-10 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
          >
            Löschen
          </button>
        )}
        <button
          type="button"
          onClick={onAbbrechen}
          className="px-4 h-10 rounded-lg text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
