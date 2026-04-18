import { useState } from 'react';
import { useArtikel, useLieferanten, useBewegungen, useInventurAuswertung, useVorschlaege, bestellanfrageSenden } from '../hooks/useInventur';
import type { InventarArtikel, Lieferant, LagerBewegungTyp } from '../types';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function formatMenge(menge: number, einheit: string) {
  return `${Number(menge).toLocaleString('de-DE', { maximumFractionDigits: 3 })} ${einheit}`;
}

function formatPreis(preis: number | null) {
  if (preis === null) return '—';
  return preis.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

const TYP_FARBEN: Record<LagerBewegungTyp, string> = {
  eingang:    'bg-green-400/15 text-green-400',
  abgang:     'bg-red-400/15 text-red-400',
  korrektur:  'bg-amber-400/15 text-amber-400',
  bestellung: 'bg-blue-400/15 text-blue-400',
};

const TYP_LABEL: Record<LagerBewegungTyp, string> = {
  eingang:    'Eingang',
  abgang:     'Abgang',
  korrektur:  'Korrektur',
  bestellung: 'Bestellung',
};

const WOCHENTAGE = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];

// ─── Artikel-Modal ────────────────────────────────────────────────────────────

function ArtikelModal({
  artikel, lieferanten, onSpeichern, onSchliessen,
}: {
  artikel: InventarArtikel | null;
  lieferanten: Lieferant[];
  onSpeichern: (daten: Partial<InventarArtikel>) => Promise<void>;
  onSchliessen: () => void;
}) {
  const [form, setForm] = useState({
    name:              artikel?.name             ?? '',
    kategorie:         artikel?.kategorie        ?? 'Rohstoffe',
    einheit:           artikel?.einheit          ?? 'kg',
    mindestbestand:    artikel?.mindestbestand   ?? 0,
    einkaufspreis:     artikel?.einkaufspreis    ?? '',
    lieferant_id:      artikel?.lieferant_id     ?? '',
    aktueller_bestand: artikel?.aktueller_bestand ?? 0,
  });
  const [laden, setLaden] = useState(false);

  const handleSpeichern = async () => {
    if (!form.name.trim()) return;
    setLaden(true);
    try {
      await onSpeichern({
        name:              form.name.trim(),
        kategorie:         form.kategorie,
        einheit:           form.einheit,
        mindestbestand:    Number(form.mindestbestand),
        einkaufspreis:     form.einkaufspreis !== '' ? Number(form.einkaufspreis) : null,
        lieferant_id:      form.lieferant_id || null,
        aktueller_bestand: Number(form.aktueller_bestand),
      });
      onSchliessen();
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {artikel ? 'Artikel bearbeiten' : 'Neuer Artikel'}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Name*</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. Mehl Typ 405"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Kategorie</label>
              <select
                className="w-full bg-[#0F1724] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.kategorie} onChange={e => setForm(f => ({ ...f, kategorie: e.target.value }))}
              >
                {['Rohstoffe', 'Getränke', 'Milchprodukte', 'Fleisch & Fisch', 'Gemüse & Obst', 'Gewürze', 'Verpackung', 'Sonstiges'].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Einheit</label>
              <select
                className="w-full bg-[#0F1724] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.einheit} onChange={e => setForm(f => ({ ...f, einheit: e.target.value }))}
              >
                {['kg', 'g', 'L', 'ml', 'Stück', 'Packung', 'Flasche', 'Dose', 'Beutel'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            {!artikel && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Startbestand</label>
                <input
                  type="number" min="0" step="0.001"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  value={form.aktueller_bestand}
                  onChange={e => setForm(f => ({ ...f, aktueller_bestand: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Mindestbestand</label>
              <input
                type="number" min="0" step="0.001"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.mindestbestand}
                onChange={e => setForm(f => ({ ...f, mindestbestand: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Einkaufspreis (€/Einheit)</label>
              <input
                type="number" min="0" step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.einkaufspreis}
                onChange={e => setForm(f => ({ ...f, einkaufspreis: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Lieferant</label>
              <select
                className="w-full bg-[#0F1724] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.lieferant_id} onChange={e => setForm(f => ({ ...f, lieferant_id: e.target.value }))}
              >
                <option value="">— Kein Lieferant —</option>
                {lieferanten.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
          <button onClick={onSchliessen} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            Abbrechen
          </button>
          <button
            onClick={handleSpeichern} disabled={laden || !form.name.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {laden ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Buchungs-Modal ───────────────────────────────────────────────────────────

function BuchungsModal({
  artikel, onBuchen, onSchliessen,
}: {
  artikel: InventarArtikel;
  onBuchen: (daten: { artikel_id: string; typ: 'eingang' | 'abgang' | 'korrektur'; menge: number; notiz?: string }) => Promise<void>;
  onSchliessen: () => void;
}) {
  const [typ, setTyp] = useState<'eingang' | 'abgang' | 'korrektur'>('eingang');
  const [menge, setMenge] = useState('');
  const [notiz, setNotiz] = useState('');
  const [laden, setLaden] = useState(false);

  const handleBuchen = async () => {
    const mengeNum = parseFloat(menge);
    if (!mengeNum || mengeNum === 0) return;
    setLaden(true);
    try {
      await onBuchen({ artikel_id: artikel.id, typ, menge: mengeNum, notiz: notiz || undefined });
      onSchliessen();
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Bewegung buchen</h2>
          <p className="text-sm text-slate-400 mt-1">{artikel.name} — Bestand: {formatMenge(artikel.aktueller_bestand, artikel.einheit)}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2">Typ</label>
            <div className="flex gap-2">
              {(['eingang', 'abgang', 'korrektur'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTyp(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${typ === t ? TYP_FARBEN[t] + ' ring-1 ring-current' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                >
                  {TYP_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Menge ({artikel.einheit})
              {typ === 'korrektur' && <span className="ml-1 text-amber-400">positiv = Zugang, negativ = Abgang</span>}
            </label>
            <input
              type="number" step="0.001"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              value={menge} onChange={e => setMenge(e.target.value)}
              placeholder={typ === 'korrektur' ? 'z.B. -5 oder +10' : 'z.B. 10'}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notiz (optional)</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              value={notiz} onChange={e => setNotiz(e.target.value)}
              placeholder="z.B. Lieferung Montag"
            />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
          <button onClick={onSchliessen} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            Abbrechen
          </button>
          <button
            onClick={handleBuchen} disabled={laden || !menge}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {laden ? 'Buchen…' : 'Buchen'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lieferanten-Modal ────────────────────────────────────────────────────────

function LieferantModal({
  lieferant, onSpeichern, onSchliessen,
}: {
  lieferant: Lieferant | null;
  onSpeichern: (daten: Partial<Lieferant>) => Promise<void>;
  onSchliessen: () => void;
}) {
  const [form, setForm] = useState({
    name:            lieferant?.name            ?? '',
    kontakt_email:   lieferant?.kontakt_email   ?? '',
    kontakt_telefon: lieferant?.kontakt_telefon ?? '',
    liefertage:      lieferant?.liefertage      ?? [] as string[],
    notiz:           lieferant?.notiz           ?? '',
  });
  const [laden, setLaden] = useState(false);

  const toggleTag = (tag: string) =>
    setForm(f => ({
      ...f,
      liefertage: f.liefertage.includes(tag) ? f.liefertage.filter(t => t !== tag) : [...f.liefertage, tag],
    }));

  const handleSpeichern = async () => {
    if (!form.name.trim()) return;
    setLaden(true);
    try {
      await onSpeichern({
        name:            form.name.trim(),
        kontakt_email:   form.kontakt_email   || null,
        kontakt_telefon: form.kontakt_telefon || null,
        liefertage:      form.liefertage,
        notiz:           form.notiz           || null,
      });
      onSchliessen();
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{lieferant ? 'Lieferant bearbeiten' : 'Neuer Lieferant'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Name*</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="z.B. Großmarkt München"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">E-Mail</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.kontakt_email} onChange={e => setForm(f => ({ ...f, kontakt_email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Telefon</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                value={form.kontakt_telefon} onChange={e => setForm(f => ({ ...f, kontakt_telefon: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">Liefertage</label>
            <div className="flex flex-wrap gap-2">
              {WOCHENTAGE.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    form.liefertage.includes(tag) ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag.slice(0, 2).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notiz</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={2} value={form.notiz} onChange={e => setForm(f => ({ ...f, notiz: e.target.value }))}
            />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
          <button onClick={onSchliessen} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Abbrechen</button>
          <button
            onClick={handleSpeichern} disabled={laden || !form.name.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {laden ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bestellanfrage-Modal ─────────────────────────────────────────────────────

function BestellanfrageModal({
  artikel,
  onSchliessen,
}: {
  artikel: InventarArtikel[];
  onSchliessen: () => void;
}) {
  // Vorschlagsmenge = mindestbestand - aktueller_bestand (aufgerundet)
  const [mengen, setMengen] = useState<Record<string, number>>(
    Object.fromEntries(
      artikel.map(a => [a.id, Math.max(0, Math.ceil(a.mindestbestand - a.aktueller_bestand))])
    )
  );
  const [notiz, setNotiz] = useState('');
  const [laden, setLaden] = useState(false);
  const [ergebnis, setErgebnis] = useState<{ gesendet_an: string[]; ohne_email: string[] } | null>(null);

  const ohneEmail = artikel.filter(a => !a.lieferant_name);

  const handleSenden = async () => {
    const positiv = artikel.filter(a => (mengen[a.id] ?? 0) > 0);
    if (positiv.length === 0) return;
    setLaden(true);
    try {
      const result = await bestellanfrageSenden({
        artikel: positiv.map(a => ({ id: a.id, bestellmenge: mengen[a.id] })),
        notiz: notiz || undefined,
      });
      setErgebnis(result);
    } catch (e: any) {
      alert(e.message || 'Fehler beim Senden');
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl">
        {!ergebnis ? (
          <>
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Bestellanfrage an Lieferanten</h2>
              <p className="text-sm text-slate-400 mt-1">
                Prüfe die Mengen und bestätige — die Email geht direkt an den jeweiligen Lieferanten.
              </p>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {artikel.map(a => (
                <div key={a.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{a.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {a.lieferant_name
                        ? <span className="text-green-400">✓ {a.lieferant_name}</span>
                        : <span className="text-amber-400">⚠ Kein Lieferant — wird übersprungen</span>
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number" min="0" step="0.001"
                      className="w-24 bg-[#0F1724] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm text-right focus:outline-none focus:border-blue-500"
                      value={mengen[a.id] ?? 0}
                      onChange={e => setMengen(m => ({ ...m, [a.id]: parseFloat(e.target.value) || 0 }))}
                    />
                    <span className="text-xs text-slate-400 w-8">{a.einheit}</span>
                  </div>
                </div>
              ))}
              {ohneEmail.length > 0 && (
                <p className="text-xs text-amber-400/80 px-1">
                  Artikel ohne Lieferant werden nicht bestellt. Lieferanten in den Artikel-Einstellungen hinterlegen.
                </p>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notiz an Lieferant (optional)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  rows={2} value={notiz} onChange={e => setNotiz(e.target.value)}
                  placeholder="z.B. Bitte bis Freitag liefern"
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
              <button onClick={onSchliessen} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Abbrechen
              </button>
              <button
                onClick={handleSenden}
                disabled={laden || artikel.every(a => (mengen[a.id] ?? 0) === 0)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors"
              >
                {laden ? 'Wird gesendet…' : '📧 Bestellung absenden'}
              </button>
            </div>
          </>
        ) : (
          // Erfolgs-Anzeige
          <>
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-lg font-semibold text-white mb-2">Bestellung gesendet</h2>
              {ergebnis.gesendet_an.length > 0 && (
                <p className="text-sm text-slate-400 mb-1">
                  Email an: {ergebnis.gesendet_an.join(', ')}
                </p>
              )}
              {ergebnis.ohne_email.length > 0 && (
                <p className="text-xs text-amber-400 mt-2">
                  Übersprungen (kein Lieferant/Email): {ergebnis.ohne_email.join(', ')}
                </p>
              )}
            </div>
            <div className="p-6 border-t border-white/10 flex justify-center">
              <button onClick={onSchliessen} className="px-6 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg font-medium transition-colors">
                Schließen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Haupt-Seite ──────────────────────────────────────────────────────────────

type Tab = 'artikel' | 'lieferanten' | 'bewegungen' | 'auswertung';

export default function Inventur() {
  const [aktuellerTab, setAktuellerTab] = useState<Tab>('artikel');
  const [auswertungTage, setAuswertungTage] = useState(30);

  // Hooks
  const { artikel, laden: artikelLaden, neu_laden, erstellen: artikelErstellen, aktualisieren: artikelAktualisieren, loeschen: artikelLoeschen } = useArtikel();
  const { lieferanten, laden: lieferantenLaden, erstellen: lieferantErstellen, aktualisieren: lieferantAktualisieren, loeschen: lieferantLoeschen } = useLieferanten();
  const { bewegungen, laden: bewegungenLaden, buchen } = useBewegungen();
  const { auswertung, laden: auswertungLaden } = useInventurAuswertung(auswertungTage);
  const { vorschlaege } = useVorschlaege();

  // Modal-State
  const [artikelModal, setArtikelModal] = useState<{ open: boolean; artikel: InventarArtikel | null }>({ open: false, artikel: null });
  const [buchungsModal, setBuchungsModal] = useState<InventarArtikel | null>(null);
  const [lieferantModal, setLieferantModal] = useState<{ open: boolean; lieferant: Lieferant | null }>({ open: false, lieferant: null });
  const [bestellModal, setBestellModal] = useState<InventarArtikel[] | null>(null);

  // Suche / Filter
  const [suche, setSuche] = useState('');
  const [kategorieFilter, setKategorieFilter] = useState('');

  const kategorien = [...new Set(artikel.map(a => a.kategorie))].sort();

  const gefilterteArtikel = artikel.filter(a => {
    const suchMatch = a.name.toLowerCase().includes(suche.toLowerCase());
    const katMatch  = !kategorieFilter || a.kategorie === kategorieFilter;
    return suchMatch && katMatch;
  });

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'artikel',     label: 'Artikel',     count: artikel.length },
    { id: 'lieferanten', label: 'Lieferanten',  count: lieferanten.length },
    { id: 'bewegungen',  label: 'Bewegungen',   count: bewegungen.length },
    { id: 'auswertung',  label: 'Auswertung' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventur</h1>
          <p className="text-slate-400 text-sm mt-0.5">Lagerbestand, Lieferanten und Verbrauchsauswertung</p>
        </div>
        {aktuellerTab === 'artikel' && (
          <button
            onClick={() => setArtikelModal({ open: true, artikel: null })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl font-medium transition-colors"
          >
            <span className="text-lg leading-none">+</span> Neuer Artikel
          </button>
        )}
        {aktuellerTab === 'lieferanten' && (
          <button
            onClick={() => setLieferantModal({ open: true, lieferant: null })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl font-medium transition-colors"
          >
            <span className="text-lg leading-none">+</span> Neuer Lieferant
          </button>
        )}
      </div>

      {/* ── Alarm-Banner (Mindestbestand unterschritten) ─── */}
      {vorschlaege.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <p className="text-red-300 font-semibold text-sm">
                {vorschlaege.length} {vorschlaege.length === 1 ? 'Artikel' : 'Artikel'} unter Mindestbestand
              </p>
              <p className="text-red-400/80 text-xs mt-0.5">
                {vorschlaege.slice(0, 3).map(a => a.name).join(', ')}{vorschlaege.length > 3 ? ` +${vorschlaege.length - 3} weitere` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setBestellModal(vorschlaege)}
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            📧 Bestellen
          </button>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────── */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAktuellerTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              aktuellerTab === tab.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* TAB: ARTIKEL                                    */}
      {/* ════════════════════════════════════════════════ */}
      {aktuellerTab === 'artikel' && (
        <div className="space-y-4">
          {/* Filter-Leiste */}
          <div className="flex gap-3">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Artikel suchen…"
              value={suche} onChange={e => setSuche(e.target.value)}
            />
            <select
              className="bg-[#1e293b] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              value={kategorieFilter} onChange={e => setKategorieFilter(e.target.value)}
            >
              <option value="">Alle Kategorien</option>
              {kategorien.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          {/* Artikel-Tabelle */}
          {artikelLaden ? (
            <div className="text-center py-12 text-slate-500">Lädt…</div>
          ) : gefilterteArtikel.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {artikel.length === 0 ? 'Noch keine Artikel angelegt.' : 'Keine Artikel gefunden.'}
            </div>
          ) : (
            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Artikel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategorie</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Bestand</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Minimum</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Einkauf</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Lieferant</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {gefilterteArtikel.map(a => (
                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {a.unter_mindestbestand && (
                            <span className="text-red-400 text-xs" title="Unter Mindestbestand">⚠️</span>
                          )}
                          <span className="font-medium text-white">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 text-xs">{a.kategorie}</span>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${a.unter_mindestbestand ? 'text-red-400' : 'text-white'}`}>
                        {formatMenge(a.aktueller_bestand, a.einheit)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {formatMenge(a.mindestbestand, a.einheit)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {formatPreis(a.einkaufspreis)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 text-xs">
                        {a.lieferant_name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setBuchungsModal(a)}
                            className="px-2.5 py-1 bg-green-500/15 hover:bg-green-500/25 text-green-400 text-xs rounded-lg transition-colors"
                          >
                            Buchen
                          </button>
                          <button
                            onClick={() => setArtikelModal({ open: true, artikel: a })}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-400 text-xs rounded-lg transition-colors"
                          >
                            Bearbeiten
                          </button>
                          <button
                            onClick={() => { if (confirm(`"${a.name}" wirklich löschen?`)) artikelLoeschen(a.id); }}
                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors"
                          >
                            Löschen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* TAB: LIEFERANTEN                                */}
      {/* ════════════════════════════════════════════════ */}
      {aktuellerTab === 'lieferanten' && (
        <div className="space-y-3">
          {lieferantenLaden ? (
            <div className="text-center py-12 text-slate-500">Lädt…</div>
          ) : lieferanten.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Noch keine Lieferanten angelegt.</div>
          ) : (
            lieferanten.map(l => (
              <div key={l.id} className="bg-[#1e293b] border border-white/5 rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{l.name}</h3>
                    {!l.aktiv && <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded-lg">Inaktiv</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    {l.kontakt_email && <span>✉ {l.kontakt_email}</span>}
                    {l.kontakt_telefon && <span>📞 {l.kontakt_telefon}</span>}
                    {l.liefertage.length > 0 && (
                      <span>🚚 {l.liefertage.map(t => t.slice(0, 2).toUpperCase()).join(', ')}</span>
                    )}
                  </div>
                  {l.notiz && <p className="text-xs text-slate-500 mt-1">{l.notiz}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setLieferantModal({ open: true, lieferant: l })}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 text-sm rounded-lg transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => { if (confirm(`"${l.name}" wirklich löschen?`)) lieferantLoeschen(l.id); }}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* TAB: BEWEGUNGEN                                 */}
      {/* ════════════════════════════════════════════════ */}
      {aktuellerTab === 'bewegungen' && (
        <div>
          {bewegungenLaden ? (
            <div className="text-center py-12 text-slate-500">Lädt…</div>
          ) : bewegungen.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Noch keine Bewegungen erfasst.</div>
          ) : (
            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Datum</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Artikel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Typ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Menge</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Notiz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bewegungen.map(b => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(b.erstellt_am).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{b.artikel_name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${TYP_FARBEN[b.typ]}`}>
                          {TYP_LABEL[b.typ]}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${b.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {b.delta > 0 ? '+' : ''}{Number(b.delta).toLocaleString('de-DE', { maximumFractionDigits: 3 })} {b.einheit}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{b.notiz ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* TAB: AUSWERTUNG                                 */}
      {/* ════════════════════════════════════════════════ */}
      {aktuellerTab === 'auswertung' && (
        <div className="space-y-4">
          {/* Zeitraum-Wahl */}
          <div className="flex gap-2">
            {[7, 14, 30, 90].map(t => (
              <button
                key={t}
                onClick={() => setAuswertungTage(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  auswertungTage === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {t} Tage
              </button>
            ))}
          </div>

          {/* Gesamt-Kosten */}
          {!auswertungLaden && auswertung.length > 0 && (() => {
            const gesamtKosten = auswertung.reduce((sum, a) => sum + a.kosten_gesamt, 0);
            return (
              <div className="bg-[#1e293b] border border-white/5 rounded-xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Gesamtkosten ({auswertungTage} Tage)</p>
                <p className="text-3xl font-bold text-white">{formatPreis(gesamtKosten)}</p>
              </div>
            );
          })()}

          {/* Auswertungs-Tabelle */}
          {auswertungLaden ? (
            <div className="text-center py-12 text-slate-500">Lädt…</div>
          ) : auswertung.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Keine Daten für diesen Zeitraum.</div>
          ) : (
            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Artikel</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Eingang</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Abgang</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Kosten</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auswertung.map(a => (
                    <tr key={a.artikel_id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium text-white">{a.artikel_name}</td>
                      <td className="px-4 py-3 text-right text-green-400">
                        +{Number(a.eingang_gesamt).toLocaleString('de-DE', { maximumFractionDigits: 3 })} {a.einheit}
                      </td>
                      <td className="px-4 py-3 text-right text-red-400">
                        -{Number(a.abgang_gesamt).toLocaleString('de-DE', { maximumFractionDigits: 3 })} {a.einheit}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">
                        {formatPreis(a.kosten_gesamt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────── */}
      {artikelModal.open && (
        <ArtikelModal
          artikel={artikelModal.artikel}
          lieferanten={lieferanten}
          onSpeichern={async (daten) => {
            if (artikelModal.artikel) {
              await artikelAktualisieren(artikelModal.artikel.id, daten);
            } else {
              await artikelErstellen(daten as Parameters<typeof artikelErstellen>[0]);
            }
          }}
          onSchliessen={() => setArtikelModal({ open: false, artikel: null })}
        />
      )}

      {buchungsModal && (
        <BuchungsModal
          artikel={buchungsModal}
          onBuchen={async (daten) => {
            await buchen(daten);
            await neu_laden(); // Artikelliste aktualisieren damit der neue Bestand sofort sichtbar ist
          }}
          onSchliessen={() => setBuchungsModal(null)}
        />
      )}

      {lieferantModal.open && (
        <LieferantModal
          lieferant={lieferantModal.lieferant}
          onSpeichern={async (daten) => {
            if (lieferantModal.lieferant) {
              await lieferantAktualisieren(lieferantModal.lieferant.id, daten);
            } else {
              await lieferantErstellen(daten as Parameters<typeof lieferantErstellen>[0]);
            }
          }}
          onSchliessen={() => setLieferantModal({ open: false, lieferant: null })}
        />
      )}

      {bestellModal && (
        <BestellanfrageModal
          artikel={bestellModal}
          onSchliessen={() => setBestellModal(null)}
        />
      )}
    </div>
  );
}
