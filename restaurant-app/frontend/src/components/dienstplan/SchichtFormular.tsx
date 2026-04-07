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
  }) => Promise<void>;
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

  const aktiveMitarbeiter = mitarbeiter.filter((m) => m.aktiv);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mitarbeiterId) { setFehler('Bitte Mitarbeiter auswählen'); return; }
    if (!datum) { setFehler('Bitte Datum auswählen'); return; }
    if (beginn >= ende) { setFehler('Ende muss nach Beginn liegen'); return; }
    setFehler(null);
    setSpeichert(true);
    try {
      await onSpeichern({ mitarbeiter_id: mitarbeiterId, datum, beginn, ende, notiz: notiz || undefined });
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Speichern');
    } finally {
      setSpeichert(false);
    }
  }

  const inputKlasse = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Mitarbeiter</label>
        <select value={mitarbeiterId} onChange={(e) => setMitarbeiterId(e.target.value)} className={inputKlasse}>
          <option value="">– Bitte wählen –</option>
          {aktiveMitarbeiter.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.rolle})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputKlasse} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Beginn</label>
          <input type="time" value={beginn} onChange={(e) => setBeginn(e.target.value)} className={inputKlasse} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ende</label>
          <input type="time" value={ende} onChange={(e) => setEnde(e.target.value)} className={inputKlasse} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notiz (optional)</label>
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
            className="px-4 h-10 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Löschen
          </button>
        )}
        <button
          type="button"
          onClick={onAbbrechen}
          className="px-4 h-10 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
