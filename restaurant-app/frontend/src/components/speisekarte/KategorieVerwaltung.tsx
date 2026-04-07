import { useState } from 'react';
import { Kategorie } from '../../types';

interface KategorieVerwaltungProps {
  kategorien: Kategorie[];
  gerichteProKategorie: Record<string, number>;
  onErstellen: (name: string) => Promise<void>;
  onUmbenennen: (id: string, name: string) => Promise<void>;
  onLoeschen: (id: string) => Promise<void>;
}

export default function KategorieVerwaltung({
  kategorien, gerichteProKategorie, onErstellen, onUmbenennen, onLoeschen,
}: KategorieVerwaltungProps) {
  const [neueName, setNeueName] = useState('');
  const [laden, setLaden] = useState(false);
  const [bearbeiteId, setBearbeiteId] = useState<string | null>(null);
  const [bearbeiteName, setBearbeiteName] = useState('');
  const [fehler, setFehler] = useState('');

  async function hinzufuegen() {
    if (!neueName.trim()) return;
    setLaden(true);
    setFehler('');
    try {
      await onErstellen(neueName.trim());
      setNeueName('');
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }

  async function umbenennen(id: string) {
    if (!bearbeiteName.trim()) return;
    setFehler('');
    try {
      await onUmbenennen(id, bearbeiteName.trim());
      setBearbeiteId(null);
    } catch (e) {
      setFehler((e as Error).message);
    }
  }

  async function loeschen(id: string) {
    setFehler('');
    try {
      await onLoeschen(id);
    } catch (e) {
      setFehler((e as Error).message);
    }
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {kategorien.map((k) => (
          <div key={k.id} className="flex items-center gap-2">
            {bearbeiteId === k.id ? (
              <>
                <input
                  value={bearbeiteName}
                  onChange={(e) => setBearbeiteName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && umbenennen(k.id)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  autoFocus
                />
                <button
                  onClick={() => umbenennen(k.id)}
                  className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                >
                  OK
                </button>
                <button
                  onClick={() => setBearbeiteId(null)}
                  className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  Abbrechen
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700">{k.name}</span>
                <span className="text-xs text-gray-400">{gerichteProKategorie[k.id] || 0} Gerichte</span>
                <button
                  onClick={() => { setBearbeiteId(k.id); setBearbeiteName(k.name); }}
                  className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Umbenennen
                </button>
                <button
                  onClick={() => loeschen(k.id)}
                  disabled={(gerichteProKategorie[k.id] || 0) > 0}
                  className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={(gerichteProKategorie[k.id] || 0) > 0 ? 'Erst alle Gerichte löschen' : 'Kategorie löschen'}
                >
                  Löschen
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={neueName}
          onChange={(e) => setNeueName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && hinzufuegen()}
          placeholder="Neue Kategorie..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
        />
        <button
          onClick={hinzufuegen}
          disabled={laden || !neueName.trim()}
          className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {laden ? '...' : 'Hinzufügen'}
        </button>
      </div>

      {fehler && <p className="text-xs text-red-600 mt-2">{fehler}</p>}
    </div>
  );
}
