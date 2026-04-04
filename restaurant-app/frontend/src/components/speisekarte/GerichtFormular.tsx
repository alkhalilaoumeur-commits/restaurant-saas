import { useState, FormEvent } from 'react';
import { Kategorie } from '../../types';
import { api } from '../../lib/api';

interface GerichtFormularProps {
  kategorien: Kategorie[];
  onErfolg: () => void;
  onAbbrechen: () => void;
}

export default function GerichtFormular({ kategorien, onErfolg, onAbbrechen }: GerichtFormularProps) {
  const [felder, setFelder] = useState({ kategorie_id: '', name: '', beschreibung: '', preis: '', allergene: '' });
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
      await api.post('/speisekarte', { ...felder, preis: parseFloat(felder.preis) });
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
        className="w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Kategorie wählen...</option>
        {kategorien.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
      </select>
      <input placeholder="Name" value={felder.name} onChange={(e) => setFeld('name', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
      <input placeholder="Beschreibung" value={felder.beschreibung} onChange={(e) => setFeld('beschreibung', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
      <input placeholder="Preis (z.B. 12.90)" type="number" step="0.01" value={felder.preis} onChange={(e) => setFeld('preis', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
      <input placeholder="Allergene (optional)" value={felder.allergene} onChange={(e) => setFeld('allergene', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
      {fehler && <p className="text-xs text-red-600">{fehler}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={laden} className="flex-1 bg-orange-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
          {laden ? 'Speichern...' : 'Hinzufügen'}
        </button>
        <button type="button" onClick={onAbbrechen} className="flex-1 border rounded-lg py-2 text-sm text-gray-600">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
