import { useState, useRef } from 'react';
import { Kategorie } from '../../types';
import { api } from '../../lib/api';

interface KategorieVerwaltungProps {
  kategorien: Kategorie[];
  gerichteProKategorie: Record<string, number>;
  onErstellen: (name: string, bild_url?: string | null) => Promise<void>;
  onUmbenennen: (id: string, name: string) => Promise<void>;
  onBildAktualisieren: (id: string, bild_url: string | null) => Promise<void>;
  onLoeschen: (id: string) => Promise<void>;
}

export default function KategorieVerwaltung({
  kategorien, gerichteProKategorie, onErstellen, onUmbenennen, onBildAktualisieren, onLoeschen,
}: KategorieVerwaltungProps) {
  const [neueName, setNeueName] = useState('');
  const [neueBildDatei, setNeueBildDatei] = useState<File | null>(null);
  const [neueBildVorschau, setNeueBildVorschau] = useState<string | null>(null);
  const [laden, setLaden] = useState(false);
  const [bildLaden, setBildLaden] = useState<string | null>(null); // ID der Kategorie die gerade hochlädt
  const [bearbeiteId, setBearbeiteId] = useState<string | null>(null);
  const [bearbeiteName, setBearbeiteName] = useState('');
  const [fehler, setFehler] = useState('');
  const neueDateiRef = useRef<HTMLInputElement>(null);
  const updateDateiRef = useRef<HTMLInputElement>(null);
  const updateKategorieIdRef = useRef<string | null>(null);

  function neueBildGewaehlt(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setNeueBildDatei(datei);
    setNeueBildVorschau(URL.createObjectURL(datei));
  }

  async function hinzufuegen() {
    if (!neueName.trim()) return;
    setLaden(true);
    setFehler('');
    try {
      // Falls Bild gewählt → erst hochladen
      let bildUrl: string | null = null;
      if (neueBildDatei) {
        bildUrl = await api.upload(neueBildDatei);
      }
      await onErstellen(neueName.trim(), bildUrl);
      setNeueName('');
      setNeueBildDatei(null);
      setNeueBildVorschau(null);
      if (neueDateiRef.current) neueDateiRef.current.value = '';
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

  async function bildAktualisieren(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    const id = updateKategorieIdRef.current;
    if (!datei || !id) return;
    setBildLaden(id);
    setFehler('');
    try {
      const url = await api.upload(datei);
      await onBildAktualisieren(id, url);
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setBildLaden(null);
      if (updateDateiRef.current) updateDateiRef.current.value = '';
    }
  }

  async function bildEntfernen(id: string) {
    setFehler('');
    try {
      await onBildAktualisieren(id, null);
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
      {/* Versteckter File-Input für bestehende Kategorien */}
      <input ref={updateDateiRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={bildAktualisieren} className="hidden" />

      <div className="space-y-3 mb-4">
        {kategorien.map((k) => (
          <div key={k.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50/50">
            {/* Bild-Vorschau / Upload */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              {k.bild_url ? (
                <>
                  <img src={k.bild_url} alt={k.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => bildEntfernen(k.id)}
                    className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm hover:bg-red-600"
                    title="Bild entfernen"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { updateKategorieIdRef.current = k.id; updateDateiRef.current?.click(); }}
                  disabled={bildLaden === k.id}
                  className="w-full h-full flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Bild hinzufügen"
                >
                  {bildLaden === k.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {bearbeiteId === k.id ? (
              <>
                <input
                  value={bearbeiteName}
                  onChange={(e) => setBearbeiteName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && umbenennen(k.id)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  autoFocus
                />
                <button onClick={() => umbenennen(k.id)} className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100">OK</button>
                <button onClick={() => setBearbeiteId(null)} className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-500 hover:bg-gray-100">Abbrechen</button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 font-medium">{k.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{gerichteProKategorie[k.id] || 0} Gerichte</span>
                </div>
                <button
                  type="button"
                  onClick={() => { updateKategorieIdRef.current = k.id; updateDateiRef.current?.click(); }}
                  disabled={bildLaden === k.id}
                  className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100"
                  title={k.bild_url ? 'Bild ändern' : 'Bild hochladen'}
                >
                  {bildLaden === k.id ? '...' : k.bild_url ? 'Bild ändern' : 'Bild'}
                </button>
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

      {/* Neue Kategorie erstellen */}
      <div className="space-y-2 p-3 border border-dashed border-gray-200 rounded-lg">
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

        {/* Bild für neue Kategorie */}
        <div className="flex items-center gap-2">
          <input ref={neueDateiRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={neueBildGewaehlt} className="hidden" />
          {neueBildVorschau ? (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <img src={neueBildVorschau} alt="Vorschau" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setNeueBildDatei(null); setNeueBildVorschau(null); if (neueDateiRef.current) neueDateiRef.current.value = ''; }}
                className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
              >
                ✕
              </button>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => neueDateiRef.current?.click()}
            className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            {neueBildVorschau ? 'Anderes Bild' : 'Bild hinzufügen (optional)'}
          </button>
        </div>
      </div>

      {fehler && <p className="text-xs text-red-600 mt-2">{fehler}</p>}
    </div>
  );
}
