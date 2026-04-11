import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { ExtrasGruppe, Extra } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  gerichtId: string;
  gerichtName: string;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Admin-UI für Extras-Verwaltung pro Gericht.
// Zeigt alle Gruppen + Extras, erlaubt CRUD für beides.
//
// Datenfluss:
//   GET /api/speisekarte/{gerichtId}/extras/admin → Alle Gruppen + Extras (auch nicht-verfügbare)
//   POST /api/speisekarte/{gerichtId}/extras/gruppen → Neue Gruppe
//   PATCH /api/speisekarte/extras/gruppen/{id} → Gruppe bearbeiten
//   DELETE /api/speisekarte/extras/gruppen/{id} → Gruppe löschen
//   POST /api/speisekarte/extras/gruppen/{id}/extras → Neues Extra
//   PATCH /api/speisekarte/extras/{id} → Extra bearbeiten
//   DELETE /api/speisekarte/extras/{id} → Extra löschen
export default function ExtrasVerwaltung({ gerichtId, gerichtName }: Props) {
  const [gruppen, setGruppen] = useState<ExtrasGruppe[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');

  // Neue Gruppe Form-State
  const [neueGruppe, setNeueGruppe] = useState({ name: '', pflicht: false, max_auswahl: 1 });
  const [gruppeAnlegen, setGruppeAnlegen] = useState(false);

  // Neues Extra Form-State (pro Gruppe)
  const [neuesExtra, setNeuesExtra] = useState<Record<string, { name: string; aufpreis: string }>>({});
  const [extraAnlegen, setExtraAnlegen] = useState<string | null>(null);

  // Bearbeitung
  const [bearbeiteGruppe, setBearbeiteGruppe] = useState<string | null>(null);
  const [bearbeiteExtra, setBearbeiteExtra] = useState<string | null>(null);

  // ── Daten laden ───────────────────────────────────────────────────────

  async function laden_() {
    try {
      const data = await api.get<ExtrasGruppe[]>(`/speisekarte/${gerichtId}/extras/admin`);
      setGruppen(data);
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => { laden_(); }, [gerichtId]);

  // ── Gruppe CRUD ───────────────────────────────────────────────────────

  async function gruppeErstellen() {
    if (!neueGruppe.name.trim()) return;
    setFehler('');
    try {
      await api.post(`/speisekarte/${gerichtId}/extras/gruppen`, {
        name: neueGruppe.name.trim(),
        pflicht: neueGruppe.pflicht,
        max_auswahl: neueGruppe.max_auswahl,
        reihenfolge: gruppen.length,
      });
      setNeueGruppe({ name: '', pflicht: false, max_auswahl: 1 });
      setGruppeAnlegen(false);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  async function gruppeAktualisieren(gruppeId: string, felder: Partial<ExtrasGruppe>) {
    setFehler('');
    try {
      await api.patch(`/speisekarte/extras/gruppen/${gruppeId}`, felder);
      setBearbeiteGruppe(null);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  async function gruppeLoeschen(gruppeId: string) {
    setFehler('');
    try {
      await api.delete(`/speisekarte/extras/gruppen/${gruppeId}`);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  // ── Extra CRUD ────────────────────────────────────────────────────────

  async function extraErstellen(gruppeId: string) {
    const extra = neuesExtra[gruppeId];
    if (!extra?.name.trim()) return;
    setFehler('');
    try {
      const gruppe = gruppen.find((g) => g.id === gruppeId);
      await api.post(`/speisekarte/extras/gruppen/${gruppeId}/extras`, {
        name: extra.name.trim(),
        aufpreis: parseFloat(extra.aufpreis) || 0,
        reihenfolge: gruppe?.extras?.length ?? 0,
      });
      setNeuesExtra((prev) => ({ ...prev, [gruppeId]: { name: '', aufpreis: '' } }));
      setExtraAnlegen(null);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  async function extraAktualisieren(extraId: string, felder: Partial<Extra>) {
    setFehler('');
    try {
      await api.patch(`/speisekarte/extras/${extraId}`, felder);
      setBearbeiteExtra(null);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  async function extraLoeschen(extraId: string) {
    setFehler('');
    try {
      await api.delete(`/speisekarte/extras/${extraId}`);
      await laden_();
    } catch (e) { setFehler((e as Error).message); }
  }

  // ── Styles ────────────────────────────────────────────────────────────

  const inputKlassen = 'w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-colors';
  const btnPrimaer = 'bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-700 transition-colors';
  const btnSekundaer = 'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors';

  // ── Render ────────────────────────────────────────────────────────────

  if (laden) {
    return <p className="text-sm text-gray-400 dark:text-slate-500">Extras werden geladen...</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 dark:text-slate-500">
        Extras für <span className="font-semibold text-gray-600 dark:text-slate-300">{gerichtName}</span>
      </p>

      {fehler && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-lg px-3 py-2 text-xs">
          {fehler}
        </div>
      )}

      {/* ── Gruppen-Liste ──────────────────────────────────────────────── */}
      {gruppen.length === 0 && !gruppeAnlegen && (
        <div className="text-center py-6">
          <div className="text-3xl mb-2 opacity-50">🧩</div>
          <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">
            Noch keine Extras-Gruppen vorhanden.
          </p>
          <p className="text-xs text-gray-300 dark:text-slate-600">
            Erstelle eine Gruppe wie "Sauce", "Größe" oder "Toppings" — darin legst du dann einzelne Optionen an.
          </p>
        </div>
      )}

      {gruppen.map((gruppe) => (
        <div key={gruppe.id} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] rounded-xl overflow-hidden">
          {/* Gruppen-Header */}
          {bearbeiteGruppe === gruppe.id ? (
            <GruppeBearbeitenForm
              gruppe={gruppe}
              onSpeichern={(felder) => gruppeAktualisieren(gruppe.id, felder)}
              onAbbrechen={() => setBearbeiteGruppe(null)}
              inputKlassen={inputKlassen}
              btnPrimaer={btnPrimaer}
              btnSekundaer={btnSekundaer}
            />
          ) : (
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{gruppe.name}</p>
                  {gruppe.pflicht && (
                    <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded">
                      Pflicht
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    max. {gruppe.max_auswahl} {gruppe.max_auswahl === 1 ? '(Radio)' : '(Checkbox)'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setBearbeiteGruppe(gruppe.id)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Bearbeiten
                </button>
                <button onClick={() => gruppeLoeschen(gruppe.id)} className="text-xs text-red-500 dark:text-red-400 hover:underline">
                  Löschen
                </button>
              </div>
            </div>
          )}

          {/* Extras in dieser Gruppe */}
          <div className="border-t border-gray-100 dark:border-white/[0.05]">
            {(!gruppe.extras || gruppe.extras.length === 0) && extraAnlegen !== gruppe.id && (
              <p className="px-4 py-3 text-xs text-gray-300 dark:text-slate-600 italic">
                Noch keine Optionen. Füge mindestens eine hinzu.
              </p>
            )}

            {gruppe.extras?.map((extra) => (
              <div key={extra.id}>
                {bearbeiteExtra === extra.id ? (
                  <ExtraBearbeitenForm
                    extra={extra}
                    onSpeichern={(felder) => extraAktualisieren(extra.id, felder)}
                    onAbbrechen={() => setBearbeiteExtra(null)}
                    inputKlassen={inputKlassen}
                    btnPrimaer={btnPrimaer}
                    btnSekundaer={btnSekundaer}
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-colors">
                    {/* Verfügbarkeits-Indikator */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${extra.verfuegbar ? 'bg-green-400' : 'bg-gray-300 dark:bg-slate-600'}`} />

                    <span className={`text-sm flex-1 ${extra.verfuegbar ? 'text-gray-700 dark:text-slate-200' : 'text-gray-400 dark:text-slate-500 line-through'}`}>
                      {extra.name}
                    </span>

                    {extra.aufpreis > 0 && (
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded">
                        +{formatPreis(extra.aufpreis)}
                      </span>
                    )}
                    {extra.aufpreis === 0 && (
                      <span className="text-xs text-gray-300 dark:text-slate-600">kostenlos</span>
                    )}

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => extraAktualisieren(extra.id, { verfuegbar: !extra.verfuegbar })}
                        className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                          extra.verfuegbar
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400 hover:bg-gray-200'
                        }`}
                      >
                        {extra.verfuegbar ? 'Verfügbar' : 'Aus'}
                      </button>
                      <button onClick={() => setBearbeiteExtra(extra.id)} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => extraLoeschen(extra.id)} className="text-[11px] text-red-500 dark:text-red-400 hover:underline">
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Neues Extra anlegen */}
            {extraAnlegen === gruppe.id ? (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.05] space-y-2">
                <div className="flex gap-2">
                  <input
                    placeholder="Name (z.B. Ketchup)"
                    value={neuesExtra[gruppe.id]?.name ?? ''}
                    onChange={(e) => setNeuesExtra((prev) => ({
                      ...prev,
                      [gruppe.id]: { ...prev[gruppe.id], name: e.target.value },
                    }))}
                    className={inputKlassen}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && extraErstellen(gruppe.id)}
                  />
                  <input
                    placeholder="Aufpreis"
                    type="number"
                    step="0.01"
                    min="0"
                    value={neuesExtra[gruppe.id]?.aufpreis ?? ''}
                    onChange={(e) => setNeuesExtra((prev) => ({
                      ...prev,
                      [gruppe.id]: { ...prev[gruppe.id], aufpreis: e.target.value },
                    }))}
                    className={`${inputKlassen} w-24`}
                    onKeyDown={(e) => e.key === 'Enter' && extraErstellen(gruppe.id)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => extraErstellen(gruppe.id)} className={btnPrimaer}>
                    Hinzufügen
                  </button>
                  <button onClick={() => setExtraAnlegen(null)} className={btnSekundaer}>
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setExtraAnlegen(gruppe.id);
                  setNeuesExtra((prev) => ({ ...prev, [gruppe.id]: { name: '', aufpreis: '' } }));
                }}
                className="w-full px-4 py-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors border-t border-gray-100 dark:border-white/[0.05] text-left font-medium"
              >
                + Option hinzufügen
              </button>
            )}
          </div>
        </div>
      ))}

      {/* ── Neue Gruppe anlegen ─────────────────────────────────────────── */}
      {gruppeAnlegen ? (
        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Neue Extras-Gruppe</p>

          <input
            placeholder="Gruppenname (z.B. Sauce, Größe, Toppings)"
            value={neueGruppe.name}
            onChange={(e) => setNeueGruppe((prev) => ({ ...prev, name: e.target.value }))}
            className={inputKlassen}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && gruppeErstellen()}
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={neueGruppe.pflicht}
                onChange={(e) => setNeueGruppe((prev) => ({ ...prev, pflicht: e.target.checked }))}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Pflichtfeld
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
              Max. Auswahl:
              <input
                type="number"
                min="1"
                max="10"
                value={neueGruppe.max_auswahl}
                onChange={(e) => setNeueGruppe((prev) => ({ ...prev, max_auswahl: parseInt(e.target.value) || 1 }))}
                className="w-14 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-slate-200 rounded-lg px-2 py-1 text-sm text-center"
              />
            </label>
          </div>

          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            {neueGruppe.max_auswahl === 1
              ? '→ Gast kann genau 1 Option wählen (Radio-Buttons)'
              : `→ Gast kann bis zu ${neueGruppe.max_auswahl} Optionen wählen (Checkboxen)`}
            {neueGruppe.pflicht ? ' · Auswahl ist Pflicht' : ' · Auswahl ist optional'}
          </p>

          <div className="flex gap-2">
            <button onClick={gruppeErstellen} className={btnPrimaer}>
              Gruppe erstellen
            </button>
            <button onClick={() => setGruppeAnlegen(false)} className={btnSekundaer}>
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setGruppeAnlegen(true)}
          className="w-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl py-3 text-sm text-gray-400 dark:text-slate-500 hover:border-orange-300 dark:hover:border-orange-500/30 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium"
        >
          + Extras-Gruppe hinzufügen
        </button>
      )}
    </div>
  );
}

// ── Inline-Bearbeitungsformulare ──────────────────────────────────────────

function GruppeBearbeitenForm({
  gruppe, onSpeichern, onAbbrechen, inputKlassen, btnPrimaer, btnSekundaer,
}: {
  gruppe: ExtrasGruppe;
  onSpeichern: (felder: Partial<ExtrasGruppe>) => void;
  onAbbrechen: () => void;
  inputKlassen: string;
  btnPrimaer: string;
  btnSekundaer: string;
}) {
  const [name, setName] = useState(gruppe.name);
  const [pflicht, setPflicht] = useState(gruppe.pflicht);
  const [maxAuswahl, setMaxAuswahl] = useState(gruppe.max_auswahl);

  return (
    <div className="px-4 py-3 space-y-2 bg-blue-50/50 dark:bg-blue-500/5">
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputKlassen} autoFocus />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" checked={pflicht} onChange={(e) => setPflicht(e.target.checked)} className="rounded border-gray-300 text-orange-600" />
          Pflicht
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
          Max:
          <input type="number" min="1" max="10" value={maxAuswahl} onChange={(e) => setMaxAuswahl(parseInt(e.target.value) || 1)} className="w-14 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg px-2 py-1 text-xs text-center text-gray-800 dark:text-slate-200" />
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSpeichern({ name, pflicht, max_auswahl: maxAuswahl })} className={btnPrimaer}>Speichern</button>
        <button onClick={onAbbrechen} className={btnSekundaer}>Abbrechen</button>
      </div>
    </div>
  );
}

function ExtraBearbeitenForm({
  extra, onSpeichern, onAbbrechen, inputKlassen, btnPrimaer, btnSekundaer,
}: {
  extra: Extra;
  onSpeichern: (felder: Partial<Extra>) => void;
  onAbbrechen: () => void;
  inputKlassen: string;
  btnPrimaer: string;
  btnSekundaer: string;
}) {
  const [name, setName] = useState(extra.name);
  const [aufpreis, setAufpreis] = useState(String(extra.aufpreis));

  return (
    <div className="flex gap-2 px-4 py-2.5 bg-blue-50/50 dark:bg-blue-500/5">
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputKlassen} autoFocus />
      <input type="number" step="0.01" min="0" value={aufpreis} onChange={(e) => setAufpreis(e.target.value)} className={`${inputKlassen} w-24`} placeholder="Aufpreis" />
      <button onClick={() => onSpeichern({ name, aufpreis: parseFloat(aufpreis) || 0 })} className={btnPrimaer}>OK</button>
      <button onClick={onAbbrechen} className={btnSekundaer}>×</button>
    </div>
  );
}
