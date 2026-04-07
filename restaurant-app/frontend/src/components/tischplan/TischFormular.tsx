import { useState } from 'react';
import { Tisch } from '../../types';

interface TischFormularProps {
  tisch?: Tisch;
  onSpeichern: (nummer: number, kapazitaet: number | null) => void;
  onAktualisieren?: (id: string, felder: { nummer?: number; kapazitaet?: number | null }) => void;
  onAbbrechen: () => void;
}

export default function TischFormular({ tisch, onSpeichern, onAktualisieren, onAbbrechen }: TischFormularProps) {
  const bearbeiten = !!tisch;
  const [nummer, setNummer] = useState(tisch?.nummer?.toString() ?? '');
  const [kapazitaet, setKapazitaet] = useState(tisch?.kapazitaet?.toString() ?? '');
  const [fehler, setFehler] = useState('');

  function absenden(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(nummer);
    if (!num || num < 1) { setFehler('Bitte eine gültige Tischnummer eingeben.'); return; }
    const kap = kapazitaet ? parseInt(kapazitaet) : null;
    if (kap !== null && kap < 1) { setFehler('Kapazität muss mindestens 1 sein.'); return; }

    if (bearbeiten && onAktualisieren) {
      onAktualisieren(tisch!.id, { nummer: num, kapazitaet: kap });
    } else {
      onSpeichern(num, kap);
    }
  }

  return (
    <form onSubmit={absenden} className="space-y-3">
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Tischnummer *</label>
        <input
          type="number"
          min={1}
          value={nummer}
          onChange={(e) => setNummer(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          placeholder="z.B. 1"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Kapazität (Plätze)</label>
        <input
          type="number"
          min={1}
          value={kapazitaet}
          onChange={(e) => setKapazitaet(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          placeholder="z.B. 4"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="bg-[#dc2626] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c52222] transition-colors"
        >
          {bearbeiten ? 'Speichern' : 'Hinzufügen'}
        </button>
        <button
          type="button"
          onClick={onAbbrechen}
          className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
