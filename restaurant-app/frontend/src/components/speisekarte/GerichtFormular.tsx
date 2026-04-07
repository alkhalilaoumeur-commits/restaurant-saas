import { useState, FormEvent } from 'react';
import { Kategorie, Gericht } from '../../types';
import { api } from '../../lib/api';

interface GerichtFormularProps {
  kategorien: Kategorie[];
  gericht?: Gericht;
  onErfolg: () => void;
  onAbbrechen: () => void;
}

export default function GerichtFormular({ kategorien, gericht, onErfolg, onAbbrechen }: GerichtFormularProps) {
  const bearbeiten = !!gericht;
  const [felder, setFelder] = useState({
    kategorie_id: gericht?.kategorie_id ?? '',
    name: gericht?.name ?? '',
    beschreibung: gericht?.beschreibung ?? '',
    preis: gericht ? String(gericht.preis) : '',
    allergene: gericht?.allergene ?? '',
  });
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  function setFeld(key: keyof typeof felder, value: string) {
    setFelder((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      const daten = { ...felder, preis: parseFloat(felder.preis) };
      if (bearbeiten) {
        await api.patch(`/speisekarte/${gericht!.id}`, daten);
      } else {
        await api.post('/speisekarte', daten);
      }
      onErfolg();
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <select
        value={felder.kategorie_id}
        onChange={(e) => setFeld('kategorie_id', e.target.value)}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
      >
        <option value="">Kategorie wählen...</option>
        {kategorien.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
      </select>
      <input placeholder="Name" value={felder.name} onChange={(e) => setFeld('name', e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors" />
      <input placeholder="Beschreibung" value={felder.beschreibung} onChange={(e) => setFeld('beschreibung', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors" />
      <input placeholder="Preis (z.B. 12.90)" type="number" step="0.01" value={felder.preis} onChange={(e) => setFeld('preis', e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors" />
      <input placeholder="Allergene (optional)" value={felder.allergene} onChange={(e) => setFeld('allergene', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors" />
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={laden} className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
          {laden ? 'Speichern...' : bearbeiten ? 'Speichern' : 'Hinzufügen'}
        </button>
        <button type="button" onClick={onAbbrechen} className="flex-1 border rounded-lg py-2 text-sm text-gray-600">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
