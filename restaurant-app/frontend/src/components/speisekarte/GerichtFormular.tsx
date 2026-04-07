import { useState, useRef, FormEvent } from 'react';
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
  const [bildUrl, setBildUrl] = useState<string | null>(gericht?.bild_url ?? null);
  const [bildDatei, setBildDatei] = useState<File | null>(null);
  const [bildVorschau, setBildVorschau] = useState<string | null>(gericht?.bild_url ?? null);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');
  const dateiRef = useRef<HTMLInputElement>(null);

  function setFeld(key: keyof typeof felder, value: string) {
    setFelder((prev) => ({ ...prev, [key]: value }));
  }

  function bildGewaehlt(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;

    // Lokale Vorschau erzeugen (wird im Browser angezeigt, ohne Upload)
    const vorschauUrl = URL.createObjectURL(datei);
    setBildDatei(datei);
    setBildVorschau(vorschauUrl);
  }

  function bildEntfernen() {
    setBildDatei(null);
    setBildVorschau(null);
    setBildUrl(null);
    if (dateiRef.current) dateiRef.current.value = '';
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      // 1) Falls neue Datei gewählt → erst hochladen
      let endgueltigeBildUrl = bildUrl;
      if (bildDatei) {
        endgueltigeBildUrl = await api.upload(bildDatei);
      }

      // 2) Gericht-Daten speichern (mit bild_url)
      const daten = {
        ...felder,
        preis: parseFloat(felder.preis),
        bild_url: endgueltigeBildUrl,
      };
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

  const inputKlassen = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors';

  return (
    <form onSubmit={submit} className="space-y-3">
      <select
        value={felder.kategorie_id}
        onChange={(e) => setFeld('kategorie_id', e.target.value)}
        required
        className={inputKlassen}
      >
        <option value="">Kategorie wählen...</option>
        {kategorien.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
      </select>

      <input placeholder="Name" value={felder.name} onChange={(e) => setFeld('name', e.target.value)} required className={inputKlassen} />
      <input placeholder="Beschreibung" value={felder.beschreibung} onChange={(e) => setFeld('beschreibung', e.target.value)} className={inputKlassen} />
      <input placeholder="Preis (z.B. 12.90)" type="number" step="0.01" value={felder.preis} onChange={(e) => setFeld('preis', e.target.value)} required className={inputKlassen} />
      <input placeholder="Allergene (optional)" value={felder.allergene} onChange={(e) => setFeld('allergene', e.target.value)} className={inputKlassen} />

      {/* ─── Bild-Upload ─── */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Bild (optional)</label>

        {bildVorschau ? (
          <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 mb-2">
            <img src={bildVorschau} alt="Vorschau" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={bildEntfernen}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 rounded-full w-7 h-7 flex items-center justify-center shadow-sm text-sm"
              title="Bild entfernen"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => dateiRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-xs">Bild auswählen</span>
          </button>
        )}

        <input
          ref={dateiRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={bildGewaehlt}
          className="hidden"
        />

        {bildVorschau && (
          <button
            type="button"
            onClick={() => dateiRef.current?.click()}
            className="text-xs text-blue-600 hover:underline"
          >
            Anderes Bild wählen
          </button>
        )}
      </div>

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
