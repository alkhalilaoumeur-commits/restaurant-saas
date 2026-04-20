import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import { useErlebnisse, type Erlebnis, type ErlebnisBuchung } from '../hooks/useErlebnisse';
import { useRestaurant } from '../hooks/useRestaurant';
import { usePlan } from '../hooks/usePlan';
import PaywallKarte from '../components/PaywallKarte';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function preisFormatieren(cent: number) {
  return (cent / 100).toFixed(2).replace('.', ',') + ' €';
}

function dauerFormatieren(min: number) {
  if (min < 60) return `${min} Min.`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function datumFormatieren(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

const STATUS_FARBEN: Record<string, string> = {
  ausstehend:    'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  bezahlt:       'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400',
  storniert:     'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
  abgeschlossen: 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-slate-400',
};
const STATUS_LABELS: Record<string, string> = {
  ausstehend: 'Ausstehend', bezahlt: 'Bezahlt', storniert: 'Storniert', abgeschlossen: 'Abgeschlossen',
};

// ─── Erlebnis-Formular ────────────────────────────────────────────────────────

function ErlebnisFormular({
  initial, onSpeichern, onAbbrechen,
}: {
  initial?: Partial<Erlebnis>;
  onSpeichern: (daten: Partial<Erlebnis>) => Promise<void>;
  onAbbrechen: () => void;
}) {
  const [name, setName]               = useState(initial?.name ?? '');
  const [beschreibung, setBeschreibung] = useState(initial?.beschreibung ?? '');
  const [preisCent, setPreisCent]     = useState(initial?.preis_cent !== undefined ? (initial.preis_cent / 100).toFixed(2) : '');
  const [maxPersonen, setMaxPersonen] = useState(initial?.max_personen ?? 10);
  const [dauerMin, setDauerMin]       = useState(initial?.dauer_min ?? 120);
  const [aktiv, setAktiv]             = useState(initial?.aktiv ?? true);
  const [laden, setLaden]             = useState(false);
  const [fehler, setFehler]           = useState('');

  const handleSpeichern = async () => {
    if (!name.trim() || !preisCent) { setFehler('Name und Preis sind Pflichtfelder'); return; }
    const cent = Math.round(parseFloat(preisCent.replace(',', '.')) * 100);
    if (isNaN(cent) || cent < 0) { setFehler('Ungültiger Preis'); return; }
    setFehler('');
    setLaden(true);
    try {
      await onSpeichern({ name: name.trim(), beschreibung: beschreibung || null, preis_cent: cent, max_personen: maxPersonen, dauer_min: dauerMin, aktiv });
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Name *</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="z.B. 6-Gang-Degustation für 2"
          className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Beschreibung</label>
        <textarea
          value={beschreibung ?? ''} onChange={e => setBeschreibung(e.target.value)} rows={3}
          placeholder="Was erwartet die Gäste? Menügang-Details, Getränkepairing, besonderer Anlass..."
          className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Preis (€) *</label>
          <input
            type="text" value={preisCent} onChange={e => setPreisCent(e.target.value)}
            placeholder="120,00"
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Max. Personen</label>
          <input
            type="number" min={1} max={100} value={maxPersonen} onChange={e => setMaxPersonen(Number(e.target.value))}
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Dauer (Min.)</label>
          <input
            type="number" min={30} step={15} value={dauerMin} onChange={e => setDauerMin(Number(e.target.value))}
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAktiv(a => !a)}
          className={`relative w-10 h-5 rounded-full transition-colors ${aktiv ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/20'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${aktiv ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
        <span className="text-sm text-gray-600 dark:text-slate-300">{aktiv ? 'Aktiv — buchbar' : 'Inaktiv — nicht buchbar'}</span>
      </div>
      {fehler && <p className="text-xs text-red-500">{fehler}</p>}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSpeichern} disabled={laden}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {laden ? 'Wird gespeichert...' : 'Speichern'}
        </button>
        <button
          onClick={onAbbrechen}
          className="px-5 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

// ─── Erlebnis-Karte ───────────────────────────────────────────────────────────

function ErlebnisKarte({
  erlebnis, restaurantId, onBearbeiten, onLoeschen, onToggleAktiv,
}: {
  erlebnis: Erlebnis;
  restaurantId: string;
  onBearbeiten: () => void;
  onLoeschen: () => void;
  onToggleAktiv: () => void;
}) {
  const link = `${window.location.origin}/erlebnis/${restaurantId}/${erlebnis.id}`;
  const [kopiert, setKopiert] = useState(false);

  const kopieren = () => {
    navigator.clipboard.writeText(link);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm ${!erlebnis.aktiv ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{erlebnis.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${erlebnis.aktiv ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-slate-400'}`}>
              {erlebnis.aktiv ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>
          {erlebnis.beschreibung && (
            <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-2">{erlebnis.beschreibung}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
            <span className="font-bold text-gray-900 dark:text-slate-100 text-sm">{preisFormatieren(erlebnis.preis_cent)}</span>
            <span>·</span>
            <span>{dauerFormatieren(erlebnis.dauer_min)}</span>
            <span>·</span>
            <span>max. {erlebnis.max_personen} Pers.</span>
          </div>
        </div>
      </div>

      {/* Buchungslink */}
      <div className="flex gap-2 mb-3">
        <input
          readOnly value={link}
          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-500 dark:text-slate-400 truncate"
        />
        <button
          onClick={kopieren}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shrink-0 transition-colors"
        >
          {kopiert ? '✓' : 'Link'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAktiv}
          className="flex-1 py-1.5 text-xs font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          {erlebnis.aktiv ? 'Deaktivieren' : 'Aktivieren'}
        </button>
        <button
          onClick={onBearbeiten}
          className="flex-1 py-1.5 text-xs font-medium border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        >
          Bearbeiten
        </button>
        <button
          onClick={onLoeschen}
          className="py-1.5 px-3 text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

// ─── Buchungs-Zeile ───────────────────────────────────────────────────────────

function BuchungZeile({ buchung, onStatusAendern }: { buchung: ErlebnisBuchung; onStatusAendern: (status: ErlebnisBuchung['status']) => void }) {
  const naechsterStatus: Record<string, ErlebnisBuchung['status'] | null> = {
    ausstehend:    'bezahlt',
    bezahlt:       'abgeschlossen',
    abgeschlossen: null,
    storniert:     null,
  };
  const next = naechsterStatus[buchung.status];

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-white/[0.05] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{buchung.gast_name}</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{buchung.erlebnis_name}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
          {datumFormatieren(buchung.datum)} · {buchung.uhrzeit.slice(0, 5)}
        </p>
        <p className="text-xs text-gray-400 dark:text-slate-500">{buchung.personen} Person{buchung.personen > 1 ? 'en' : ''} · {preisFormatieren(buchung.preis_cent)}</p>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_FARBEN[buchung.status]}`}>
        {STATUS_LABELS[buchung.status]}
      </span>
      {next && (
        <button
          onClick={() => onStatusAendern(next)}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/15 transition-colors shrink-0"
        >
          → {STATUS_LABELS[next]}
        </button>
      )}
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function Erlebnisse() {
  const { hatZugang, laden: planLaden } = usePlan();
  const { erlebnisse, buchungen, laden, erstellen, aktualisieren, loeschen, buchungStatusAendern } = useErlebnisse();
  const { restaurant } = useRestaurant();
  const [aktivTab, setAktivTab]           = useState<'pakete' | 'buchungen'>('pakete');
  const [formularOffen, setFormularOffen] = useState(false);
  const [bearbeiteId, setBearbeiteId]     = useState<string | null>(null);

  const handleLoeschen = async (id: string, name: string) => {
    if (!confirm(`Erlebnis "${name}" wirklich löschen? Bestehende Buchungen bleiben erhalten.`)) return;
    try { await loeschen(id); } catch (err) { alert((err as Error).message); }
  };

  const handleSpeichern = async (daten: Partial<typeof erlebnisse[0]>) => {
    if (bearbeiteId) {
      await aktualisieren(bearbeiteId, daten);
      setBearbeiteId(null);
    } else {
      await erstellen(daten);
      setFormularOffen(false);
    }
  };

  const buchungenNachStatus = {
    bezahlt:       buchungen.filter(b => b.status === 'bezahlt'),
    ausstehend:    buchungen.filter(b => b.status === 'ausstehend'),
    abgeschlossen: buchungen.filter(b => b.status === 'abgeschlossen'),
    storniert:     buchungen.filter(b => b.status === 'storniert'),
  };

  if (!planLaden && !hatZugang('erlebnisse')) {
    return <PaywallKarte feature="Erlebnis-Buchungen" benoetigterPlan="pro" beschreibung="Verkaufe exklusive Pakete (Degustation, Kochkurs, etc.) mit Vorauszahlung per Stripe." />;
  }

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Erlebnisse"
        untertitel="Prepaid-Pakete erstellen — eliminiert No-Shows"
        aktion={aktivTab === 'pakete' ? (
          <button
            onClick={() => { setFormularOffen(true); setBearbeiteId(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Neues Paket
          </button>
        ) : undefined}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/[0.04] rounded-2xl mb-5 w-fit">
        {([
          { id: 'pakete',    label: `Pakete (${erlebnisse.length})` },
          { id: 'buchungen', label: `Buchungen (${buchungen.length})` },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setAktivTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              aktivTab === tab.id
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {laden ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ── Tab: Pakete ── */}
          {aktivTab === 'pakete' && (
            <div className="space-y-4">
              {/* Formular: neues Paket */}
              {formularOffen && !bearbeiteId && (
                <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Neues Erlebnis-Paket</p>
                  <ErlebnisFormular
                    onSpeichern={handleSpeichern}
                    onAbbrechen={() => setFormularOffen(false)}
                  />
                </div>
              )}

              {erlebnisse.length === 0 && !formularOffen ? (
                <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-12 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">Noch keine Erlebnisse</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">Erstelle ein Prepaid-Paket — Gäste zahlen sofort, du hast keine No-Shows.</p>
                  <button
                    onClick={() => setFormularOffen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Erstes Paket erstellen
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {erlebnisse.map(erlebnis => (
                    bearbeiteId === erlebnis.id ? (
                      <div key={erlebnis.id} className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Erlebnis bearbeiten</p>
                        <ErlebnisFormular
                          initial={erlebnis}
                          onSpeichern={handleSpeichern}
                          onAbbrechen={() => setBearbeiteId(null)}
                        />
                      </div>
                    ) : (
                      <ErlebnisKarte
                        key={erlebnis.id}
                        erlebnis={erlebnis}
                        restaurantId={restaurant?.id ?? ''}
                        onBearbeiten={() => { setBearbeiteId(erlebnis.id); setFormularOffen(false); }}
                        onLoeschen={() => handleLoeschen(erlebnis.id, erlebnis.name)}
                        onToggleAktiv={() => aktualisieren(erlebnis.id, { aktiv: !erlebnis.aktiv })}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Buchungen ── */}
          {aktivTab === 'buchungen' && (
            <div className="space-y-4">
              {buchungen.length === 0 ? (
                <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-12 text-center">
                  <p className="text-sm text-gray-400 dark:text-slate-500">Noch keine Buchungen eingegangen.</p>
                </div>
              ) : (
                <>
                  {/* Bezahlt zuerst */}
                  {(['bezahlt', 'ausstehend', 'abgeschlossen', 'storniert'] as const).map(status => {
                    const liste = buchungenNachStatus[status];
                    if (liste.length === 0) return null;
                    return (
                      <div key={status} className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                          {STATUS_LABELS[status]}
                          <span className="ml-2 text-xs font-normal text-gray-400 dark:text-slate-500">{liste.length} Buchung{liste.length !== 1 ? 'en' : ''}</span>
                        </p>
                        {liste.map(b => (
                          <BuchungZeile
                            key={b.id}
                            buchung={b}
                            onStatusAendern={(newStatus) => buchungStatusAendern(b.id, newStatus)}
                          />
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
