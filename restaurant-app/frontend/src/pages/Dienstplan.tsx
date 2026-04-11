import { useState, useMemo } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import SchichtFormular from '../components/dienstplan/SchichtFormular';
import { useDienstplan } from '../hooks/useDienstplan';
import { useMitarbeiter } from '../hooks/useMitarbeiter';
import { useSchichttausch } from '../hooks/useSchichttausch';
import { usePersonalbedarf } from '../hooks/usePersonalbedarf';
import { useAuthStore } from '../store/auth';
import { Schicht, Schichttausch, MitarbeiterDetail } from '../types';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function montag(datum: Date): Date {
  const d = new Date(datum);
  const tag = d.getDay();
  const diff = tag === 0 ? -6 : 1 - tag;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function datumStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function wocheTage(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const WOCHEN_TAG_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const ROLLEN_FARBE: Record<string, { bg: string; text: string; border: string }> = {
  admin:   { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
  kellner: { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200' },
  kueche:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
};

// ─── Admin-Panel: Tausch-Übersicht (Tap 3) ───────────────────────────────────

interface TauschAdminPanelProps {
  tausche: Schichttausch[];
  onGenehmigen: (id: string) => Promise<void>;
  onAblehnen: (id: string) => Promise<void>;
  onSchliessen: () => void;
}

function TauschAdminPanel({ tausche, onGenehmigen, onAblehnen, onSchliessen }: TauschAdminPanelProps) {
  const [aktiv,      setAktiv]      = useState<string | null>(null);
  // Tausch der gerade auf Bestätigung wartet
  const [bestaetigen, setBestaetigen] = useState<Schichttausch | null>(null);
  const [fehlerMeldung, setFehlerMeldung] = useState<string | null>(null);

  const offen     = tausche.filter(t => t.status === 'offen');
  const angeboten = tausche.filter(t => t.status === 'angeboten');

  async function handleGenehmigenBestaetigt() {
    if (!bestaetigen) return;
    const id = bestaetigen.id;
    setBestaetigen(null);
    setAktiv(id);
    try {
      await onGenehmigen(id);
    } catch (e: any) {
      setFehlerMeldung(e.message || 'Fehler beim Genehmigen.');
    } finally {
      setAktiv(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schichttausch-Anfragen</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{tausche.length} aktive Anfrage(n)</p>
          </div>
          <button onClick={onSchliessen} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Fehlermeldung (z.B. Schicht gehört nicht mehr dieser Person) */}
          {fehlerMeldung && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Genehmigung nicht möglich</p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{fehlerMeldung}</p>
              </div>
              <button onClick={() => setFehlerMeldung(null)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
            </div>
          )}

          {tausche.length === 0 && !fehlerMeldung && (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-8">Keine offenen Tausch-Anfragen.</p>
          )}

          {angeboten.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Warten auf Genehmigung ({angeboten.length})
              </p>
              <div className="space-y-2">
                {angeboten.map(t => (
                  <div key={t.id} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                          <span className="text-orange-700 dark:text-orange-400">{t.anbieter_name}</span>
                          <span className="text-gray-300 dark:text-slate-600 mx-1.5">↔</span>
                          <span className="text-sky-700 dark:text-sky-400">{t.annehmer_name}</span>
                        </p>
                        <div className="mt-1 space-y-0.5">
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {t.anbieter_datum?.slice(0, 10)} · {t.anbieter_beginn?.slice(0, 5)}–{t.anbieter_ende?.slice(0, 5)}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-500">
                            ↔ {t.annehmer_datum?.slice(0, 10)} · {t.annehmer_beginn?.slice(0, 5)}–{t.annehmer_ende?.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Klick → Bestätigungs-Popup öffnen (nicht direkt genehmigen) */}
                        <button
                          disabled={aktiv === t.id}
                          onClick={() => setBestaetigen(t)}
                          className="px-2.5 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {aktiv === t.id ? '…' : '✓ OK'}
                        </button>
                        <button
                          disabled={aktiv === t.id}
                          onClick={() => { setAktiv(t.id); onAblehnen(t.id).finally(() => setAktiv(null)); }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 disabled:opacity-50 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors"
                        >
                          Ablehnen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offen.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Suchen Tauschpartner ({offen.length})
              </p>
              <div className="space-y-2">
                {offen.map(t => (
                  <div key={t.id} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-medium">{t.anbieter_name}</span></p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        {t.anbieter_datum?.slice(0, 10)} · {t.anbieter_beginn?.slice(0, 5)}–{t.anbieter_ende?.slice(0, 5)}
                      </p>
                    </div>
                    <button
                      disabled={aktiv === t.id}
                      onClick={() => { setAktiv(t.id); onAblehnen(t.id).finally(() => setAktiv(null)); }}
                      className="text-xs text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      Zurücksetzen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bestätigungs-Popup ──────────────────────────────────────────────── */}
      {bestaetigen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">

            {/* Icon + Titel */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tausch genehmigen?</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Bitte prüfe, ob die Schichten noch den genannten Personen gehören.
                </p>
              </div>
            </div>

            {/* Tausch-Details */}
            <div className="bg-gray-50 dark:bg-white/[0.05] rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold flex items-center justify-center">A</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{bestaetigen.anbieter_name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    {bestaetigen.anbieter_datum?.slice(0, 10)} · {bestaetigen.anbieter_beginn?.slice(0, 5)}–{bestaetigen.anbieter_ende?.slice(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-gray-300 dark:text-slate-600 text-lg">⇅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-[10px] font-bold flex items-center justify-center">B</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{bestaetigen.annehmer_name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">
                    {bestaetigen.annehmer_datum?.slice(0, 10)} · {bestaetigen.annehmer_beginn?.slice(0, 5)}–{bestaetigen.annehmer_ende?.slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>

            {/* Hinweis */}
            <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-relaxed">
              Nach der Genehmigung werden die Schichten automatisch getauscht. Das Backend prüft zusätzlich ob die Schichten noch den richtigen Personen gehören.
            </p>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setBestaetigen(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleGenehmigenBestaetigt}
                className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
              >
                Ja, genehmigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MA-Panel: Tausch annehmen (Tap 2 — offener Tausch) ──────────────────────

interface TauschAnnehmenPanelProps {
  offeneTausche: Schichttausch[];
  ichId: string;
  eigeneSchichten: Schicht[];
  onAnnehmen: (tauschId: string, schichtId: string) => Promise<void>;
  onSchliessen: () => void;
}

function TauschAnnehmenPanel({ offeneTausche, ichId, eigeneSchichten, onAnnehmen, onSchliessen }: TauschAnnehmenPanelProps) {
  const [gewaehlteTauschId, setGewaehlteTauschId] = useState<string | null>(null);
  const [gewaehlteSchichtId, setGewaehlteSchichtId] = useState<string>('');
  const [speichert, setSpeichert] = useState(false);

  const verfuegbar = offeneTausche.filter(t => t.anbieter_id !== ichId);

  async function bestaetigen() {
    if (!gewaehlteTauschId || !gewaehlteSchichtId) return;
    setSpeichert(true);
    try { await onAnnehmen(gewaehlteTauschId, gewaehlteSchichtId); onSchliessen(); }
    finally { setSpeichert(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schicht tauschen</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Wähle eine Schicht die du übernehmen möchtest</p>
          </div>
          <button onClick={onSchliessen} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {verfuegbar.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Aktuell keine Tausch-Angebote verfügbar.</p>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Schritt 1 · Welche Schicht willst du übernehmen?
                </p>
                <div className="space-y-2">
                  {verfuegbar.map(t => (
                    <label key={t.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      gewaehlteTauschId === t.id
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700'
                        : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}>
                      <input type="radio" name="tausch" value={t.id} checked={gewaehlteTauschId === t.id}
                        onChange={() => { setGewaehlteTauschId(t.id); setGewaehlteSchichtId(''); }}
                        className="mt-0.5 accent-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{t.anbieter_name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {t.anbieter_datum?.slice(0, 10)} · {t.anbieter_beginn?.slice(0, 5)}–{t.anbieter_ende?.slice(0, 5)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {gewaehlteTauschId && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Schritt 2 · Deine Schicht als Gegenleistung
                  </p>
                  {eigeneSchichten.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-slate-500">Du hast diese Woche keine Schichten zum Tauschen.</p>
                  ) : (
                    <select value={gewaehlteSchichtId} onChange={e => setGewaehlteSchichtId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value="">– Deine Schicht auswählen –</option>
                      {eigeneSchichten.map(s => (
                        <option key={s.id} value={s.id}>{s.datum.slice(0, 10)} · {s.beginn.slice(0, 5)}–{s.ende.slice(0, 5)}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <button onClick={bestaetigen} disabled={!gewaehlteTauschId || !gewaehlteSchichtId || speichert}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
                {speichert ? 'Wird gesendet…' : 'Tausch vorschlagen →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Direkter Tausch Picker ───────────────────────────────────────────────────

interface DirekterTauschPickerProps {
  eigeneSchichtId: string;           // meine Schicht die ich hergebe
  alleSchichten: Schicht[];          // alle Schichten der Woche
  mitarbeiter: MitarbeiterDetail[];
  ichId: string;
  schichtImTausch: Map<string, string>; // schicht_id → status
  onBestaetigen: (eigeneId: string, zielId: string) => Promise<void>;
  onSchliessen: () => void;
}

function DirekterTauschPicker({
  eigeneSchichtId,
  alleSchichten,
  mitarbeiter,
  ichId,
  schichtImTausch,
  onBestaetigen,
  onSchliessen,
}: DirekterTauschPickerProps) {
  const [gewaehlteZielId, setGewaehlteZielId] = useState<string>('');
  const [speichert, setSpeichert] = useState(false);

  // Alle Schichten anderer MA die nicht schon im Tausch sind
  const auswahl = alleSchichten.filter(
    s => s.mitarbeiter_id !== ichId && !schichtImTausch.has(s.id)
  );

  // Schicht → MA-Name nachschlagen
  function maName(schicht: Schicht) {
    const m = mitarbeiter.find(m => m.id === schicht.mitarbeiter_id);
    return m?.name || schicht.mitarbeiter_name || '?';
  }

  async function bestaetigen() {
    if (!gewaehlteZielId) return;
    setSpeichert(true);
    try { await onBestaetigen(eigeneSchichtId, gewaehlteZielId); onSchliessen(); }
    finally { setSpeichert(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Direkten Tausch vorschlagen</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Wähle die Schicht die du dafür übernehmen möchtest</p>
          </div>
          <button onClick={onSchliessen} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {auswahl.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">
              Keine Schichten anderer Mitarbeiter in dieser Woche verfügbar.
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Wähle eine Zielschicht diese Woche
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {auswahl.map(s => {
                  const rolle = mitarbeiter.find(m => m.id === s.mitarbeiter_id)?.rolle || 'kellner';
                  const farbe = ROLLEN_FARBE[rolle] || ROLLEN_FARBE.kellner;
                  return (
                    <label key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      gewaehlteZielId === s.id
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700'
                        : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}>
                      <input type="radio" name="ziel" value={s.id} checked={gewaehlteZielId === s.id}
                        onChange={() => setGewaehlteZielId(s.id)} className="mt-0.5 accent-orange-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${farbe.text}`}>{maName(s)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                          {s.datum.slice(0, 10)} · {s.beginn.slice(0, 5)}–{s.ende.slice(0, 5)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button onClick={bestaetigen} disabled={!gewaehlteZielId || speichert}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
                {speichert ? 'Wird gesendet…' : 'Tausch vorschlagen →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function Dienstplan() {
  const [wochenStart, setWochenStart] = useState(() => montag(new Date()));
  const tage = useMemo(() => wocheTage(wochenStart), [wochenStart]);
  const start = datumStr(tage[0]);
  const ende  = datumStr(tage[6]);

  const { schichten, erstellen, aktualisieren, loeschen, laden_: schichtenNeuLaden } = useDienstplan(start, ende);
  const { mitarbeiter } = useMitarbeiter();
  const aktiveMitarbeiter = mitarbeiter.filter((m) => m.aktiv);
  const { bedarf: personalBedarf } = usePersonalbedarf(start, ende);

  const ichId    = useAuthStore(s => s.mitarbeiter?.id);
  const ichRolle = useAuthStore(s => s.mitarbeiter?.rolle);
  const istAdmin = ichRolle === 'admin';

  const {
    tausche,
    laden_: tauscheNeuLaden,
    anbieten,
    annehmen,
    genehmigen,
    ablehnen,
    zurueckziehen,
  } = useSchichttausch();

  // Panel-State
  const [tauschAdminOffen,    setTauschAdminOffen]    = useState(false);
  const [tauschAnnehmenOffen, setTauschAnnehmenOffen] = useState(false);
  const [direktTauschFuer,    setDirektTauschFuer]    = useState<string | null>(null);
  const [tauschMeldung,       setTauschMeldung]       = useState<{ text: string; ok: boolean } | null>(null);

  // Map schicht_id → Tausch-Status / Tausch-ID
  const schichtTauschStatus = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tausche) {
      map.set(t.anbieter_schicht_id, t.status);
      if (t.annehmer_schicht_id) map.set(t.annehmer_schicht_id, t.status);
    }
    return map;
  }, [tausche]);

  const schichtTauschId = useMemo(() => {
    const map = new Map<string, string>(); // schicht_id → tausch_id
    for (const t of tausche) {
      map.set(t.anbieter_schicht_id, t.id);
      if (t.annehmer_schicht_id) map.set(t.annehmer_schicht_id, t.id);
    }
    return map;
  }, [tausche]);

  const angeboteneCount = tausche.filter(t => t.status === 'angeboten').length;
  const offeneTausche   = tausche.filter(t => t.status === 'offen');

  // Modal-State (Schicht erstellen/bearbeiten — nur Admin)
  const [modalOffen,            setModalOffen]            = useState(false);
  const [bearbeitung,           setBearbeitung]           = useState<Schicht | null>(null);
  const [vorauswahlDatum,       setVorauswahlDatum]       = useState<string>('');
  const [vorauswahlMitarbeiter, setVorauswahlMitarbeiter] = useState<string>('');

  const schichtMap = useMemo(() => {
    const map = new Map<string, Schicht[]>();
    for (const s of schichten) {
      const key = `${s.mitarbeiter_id}_${s.datum.slice(0, 10)}`;
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    }
    return map;
  }, [schichten]);

  const eigeneSchichten = useMemo(
    () => (ichId ? schichten.filter(s => s.mitarbeiter_id === ichId) : []),
    [schichten, ichId]
  );

  // ── Navigation ────────────────────────────────────────────────────────────
  function vorherigeWoche() { const d = new Date(wochenStart); d.setDate(d.getDate() - 7); setWochenStart(d); }
  function naechsteWoche()  { const d = new Date(wochenStart); d.setDate(d.getDate() + 7); setWochenStart(d); }
  function heute() { setWochenStart(montag(new Date())); }

  function zelleKlicken(mitarbeiterId: string, datum: string) {
    if (!istAdmin) return;
    setBearbeitung(null); setVorauswahlDatum(datum); setVorauswahlMitarbeiter(mitarbeiterId); setModalOffen(true);
  }
  function schichtKlicken(s: Schicht) {
    if (!istAdmin) return;
    setBearbeitung(s); setVorauswahlDatum(''); setVorauswahlMitarbeiter(''); setModalOffen(true);
  }
  function modalSchliessen() { setModalOffen(false); setBearbeitung(null); }

  // ── Tausch-Aktionen ───────────────────────────────────────────────────────
  function meldung(text: string, ok = true) {
    setTauschMeldung({ text, ok });
    setTimeout(() => setTauschMeldung(null), 3500);
  }

  /** Tap 1a: Freigeben — offen für alle */
  async function handleFreigeben(schichtId: string) {
    try {
      await anbieten(schichtId);
      meldung('Schicht freigegeben. Warte auf Interessenten.');
    } catch (e: any) {
      meldung(e.message || 'Fehler beim Freigeben.', false);
    }
  }

  /** Tap 1b: Direkter Tausch — mit Zielschicht */
  async function handleDirekterTausch(eigeneId: string, zielId: string) {
    try {
      await anbieten(eigeneId, zielId);
      await tauscheNeuLaden();
      meldung('Direkter Tausch vorgeschlagen! Der Admin entscheidet.');
    } catch (e: any) {
      meldung(e.message || 'Fehler beim Tauschvorschlag.', false);
    }
  }

  /** Tap 2: Offenen Tausch annehmen */
  async function handleTauschAnnehmen(tauschId: string, schichtId: string) {
    await annehmen(tauschId, schichtId);
    await tauscheNeuLaden();
    meldung('Tausch vorgeschlagen! Der Admin entscheidet.');
  }

  /** Eigene Anfrage zurückziehen */
  async function handleZurueckziehen(schichtId: string) {
    const tauschId = schichtTauschId.get(schichtId);
    if (!tauschId) return;
    try {
      await zurueckziehen(tauschId);
      await tauscheNeuLaden();
      meldung('Tausch-Anfrage zurückgezogen.');
    } catch (e: any) {
      meldung(e.message || 'Fehler beim Zurückziehen.', false);
    }
  }

  /** Tap 3: Admin genehmigt */
  async function handleGenehmigen(tauschId: string) {
    await genehmigen(tauschId);
    await schichtenNeuLaden();
    await tauscheNeuLaden();
  }

  async function handleAblehnen(tauschId: string) {
    await ablehnen(tauschId);
    await tauscheNeuLaden();
  }

  // ── Berechnungen ──────────────────────────────────────────────────────────
  function stundenProMitarbeiter(mitarbeiterId: string): number {
    let gesamt = 0;
    for (const s of schichten) {
      if (s.mitarbeiter_id !== mitarbeiterId) continue;
      const [bH, bM] = s.beginn.slice(0, 5).split(':').map(Number);
      const [eH, eM] = s.ende.slice(0, 5).split(':').map(Number);
      gesamt += (eH * 60 + eM - bH * 60 - bM) / 60;
    }
    return Math.round(gesamt * 10) / 10;
  }

  function lohnkostenProMitarbeiter(m: MitarbeiterDetail): number | null {
    if (!m.stundenlohn) return null;
    return Math.round(stundenProMitarbeiter(m.id) * m.stundenlohn * 100) / 100;
  }

  const gesamtLohnkosten = useMemo(() => {
    let summe = 0;
    let vollstaendig = true;
    for (const m of aktiveMitarbeiter) {
      const k = lohnkostenProMitarbeiter(m);
      if (k === null) { vollstaendig = false; continue; }
      summe += k;
    }
    return { summe: Math.round(summe * 100) / 100, vollstaendig };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schichten, aktiveMitarbeiter]);

  const heuteStr = datumStr(new Date());

  const kwDatum = new Date(wochenStart);
  kwDatum.setDate(kwDatum.getDate() + 3);
  const kw = Math.ceil(
    ((kwDatum.getTime() - new Date(kwDatum.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
  );

  const monatStart = tage[0].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const monatEnde  = tage[6].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const monatLabel = monatStart === monatEnde
    ? monatStart
    : `${tage[0].toLocaleDateString('de-DE', { month: 'short' })} – ${tage[6].toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`;

  const eigeneTauscheOffen  = tausche.filter(t => t.anbieter_id === ichId && t.status === 'offen');
  const fremdeOffeneTausche = offeneTausche.filter(t => t.anbieter_id !== ichId);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Dienstplan"
        untertitel={`KW ${kw} · ${monatLabel}`}
        aktion={
          <div className="flex items-center gap-2">
            {!istAdmin && fremdeOffeneTausche.length > 0 && (
              <button
                onClick={() => setTauschAnnehmenOffen(true)}
                className="relative px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800/50 transition-colors"
              >
                Tausch-Angebote
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {fremdeOffeneTausche.length}
                </span>
              </button>
            )}
            {istAdmin && tausche.length > 0 && (
              <button
                onClick={() => setTauschAdminOffen(true)}
                className="relative px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800/50 transition-colors"
              >
                Tausche ({tausche.length})
                {angeboteneCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {angeboteneCount}
                  </span>
                )}
              </button>
            )}
            {istAdmin && (
              <button
                onClick={() => { setBearbeitung(null); setVorauswahlDatum(''); setVorauswahlMitarbeiter(''); setModalOffen(true); }}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                + Schicht
              </button>
            )}
          </div>
        }
      />

      {/* Toast */}
      {tauschMeldung && (
        <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm border ${
          tauschMeldung.ok
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'
        }`}>
          {tauschMeldung.text}
        </div>
      )}

      {/* Info: eigene offene Anfragen */}
      {!istAdmin && eigeneTauscheOffen.length > 0 && (
        <div className="mb-4 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          Du hast {eigeneTauscheOffen.length} Schicht(en) zum Tausch freigegeben — warte auf Interessenten oder ziehe die Anfrage zurück.
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={vorherigeWoche} className="w-9 h-9 rounded-lg bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={heute} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 shadow-sm text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            Heute
          </button>
          <button onClick={naechsteWoche} className="w-9 h-9 rounded-lg bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{monatLabel}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">KW {kw}</p>
        </div>
      </div>

      {/* Wochen-Tabelle */}
      <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="w-[180px] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Mitarbeiter</th>
                {tage.map((tag, i) => {
                  const istHeute = datumStr(tag) === heuteStr;
                  return (
                    <th key={i} className={`px-2 py-3 text-center min-w-[100px] ${istHeute ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                      <p className={`text-[11px] font-semibold uppercase tracking-wider ${istHeute ? 'text-red-600' : 'text-gray-400 dark:text-slate-500'}`}>{WOCHEN_TAG_KURZ[i]}</p>
                      <p className={`text-lg font-bold leading-tight ${istHeute ? 'text-red-600' : 'text-gray-700 dark:text-slate-200'}`}>{tag.getDate()}</p>
                    </th>
                  );
                })}
                <th className="w-[70px] px-3 py-3 text-center text-xs font-semibold text-gray-400 dark:text-slate-500">Std.</th>
                {istAdmin && <th className="w-[80px] px-3 py-3 text-center text-xs font-semibold text-gray-400 dark:text-slate-500">Lohn €</th>}
              </tr>
            </thead>
            <tbody>
              {aktiveMitarbeiter.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-500">Keine aktiven Mitarbeiter vorhanden.</td></tr>
              )}

              {aktiveMitarbeiter.map((m) => {
                const farbe   = ROLLEN_FARBE[m.rolle] || ROLLEN_FARBE.kellner;
                const stunden = stundenProMitarbeiter(m.id);
                const istIch  = m.id === ichId;

                return (
                  <tr key={m.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${farbe.bg} flex items-center justify-center text-xs font-bold ${farbe.text}`}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                            {m.name}
                            {istIch && !istAdmin && <span className="ml-1.5 text-[10px] text-gray-400 dark:text-slate-600">(ich)</span>}
                          </p>
                          <span className={`text-[10px] font-semibold ${farbe.text}`}>{m.rolle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tages-Zellen */}
                    {tage.map((tag, i) => {
                      const ds            = datumStr(tag);
                      const istHeuteZelle = ds === heuteStr;
                      const zellenSchichten = schichtMap.get(`${m.id}_${ds}`) || [];

                      return (
                        <td key={i}
                          className={`px-1.5 py-2 align-top ${istAdmin ? 'cursor-pointer group' : ''} ${istHeuteZelle ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                          onClick={() => zelleKlicken(m.id, ds)}
                        >
                          {zellenSchichten.length > 0 ? (
                            <div className="space-y-1">
                              {zellenSchichten.map((s) => {
                                const tauschStatus = schichtTauschStatus.get(s.id);
                                const istEigeneSchicht = s.mitarbeiter_id === ichId;
                                // Eigene Schicht, kein Tausch läuft → Aktionen zeigen
                                const kannAktion = !istAdmin && istEigeneSchicht && !tauschStatus;
                                // Eigene Schicht ist "offen" → zurückziehen möglich
                                const kannZurueck = !istAdmin && istEigeneSchicht && tauschStatus === 'offen';

                                return (
                                  <div key={s.id}
                                    onClick={(e) => { e.stopPropagation(); schichtKlicken(s); }}
                                    className={`px-2 py-1.5 rounded-lg border text-center transition-all ${farbe.bg} ${farbe.border} ${istAdmin ? 'cursor-pointer hover:shadow-sm' : ''}`}
                                  >
                                    <p className={`text-xs font-semibold ${farbe.text}`}>
                                      {s.beginn.slice(0, 5)}–{s.ende.slice(0, 5)}
                                    </p>
                                    {s.notiz && <p className="text-[10px] text-gray-400 truncate mt-0.5">{s.notiz}</p>}

                                    {/* Status-Badge */}
                                    {tauschStatus === 'offen' && (
                                      <span className="mt-1 block text-[9px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 rounded px-1 py-0.5">
                                        ⇄ Im Tausch
                                      </span>
                                    )}
                                    {tauschStatus === 'angeboten' && (
                                      <span className="mt-1 block text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded px-1 py-0.5">
                                        ⏳ Wartet auf Admin
                                      </span>
                                    )}

                                    {/* Zurückziehen (eigene Schicht, status=offen) */}
                                    {kannZurueck && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleZurueckziehen(s.id); }}
                                        className="mt-1 w-full text-[9px] font-semibold text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded px-1 py-0.5 transition-colors"
                                      >
                                        × Zurückziehen
                                      </button>
                                    )}

                                    {/* Aktionen: Freigeben / Direkt tauschen */}
                                    {kannAktion && (
                                      <div className="mt-1 flex gap-1">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleFreigeben(s.id); }}
                                          className="flex-1 text-[9px] font-semibold text-gray-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded px-1 py-0.5 transition-colors"
                                        >
                                          ↑ Freigeben
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setDirektTauschFuer(s.id); }}
                                          className="flex-1 text-[9px] font-semibold text-gray-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded px-1 py-0.5 transition-colors"
                                        >
                                          ⇄ Direkt
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className={`h-10 rounded-lg border border-dashed border-transparent ${istAdmin ? 'group-hover:border-gray-200 dark:group-hover:border-white/20' : ''} transition-colors flex items-center justify-center`}>
                              {istAdmin && <span className="text-gray-300 dark:text-slate-600 text-lg opacity-0 group-hover:opacity-100 transition-opacity">+</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Stunden */}
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-semibold ${stunden > 40 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-slate-300'}`}>
                        {stunden}h
                      </span>
                    </td>

                    {/* Lohnkosten (nur Admin) */}
                    {istAdmin && (
                      <td className="px-3 py-3 text-center">
                        {(() => {
                          const k = lohnkostenProMitarbeiter(m);
                          if (k === null) return <span className="text-xs text-gray-300 dark:text-slate-600">–</span>;
                          return (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {k.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                            </span>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {aktiveMitarbeiter.length > 0 && (
          <div className="border-t border-gray-100 dark:border-white/10">
            {/* Personalbedarf-Zeile (nur wenn Daten vorhanden) */}
            {personalBedarf.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-white/10">
                      <td className="w-[180px] px-4 py-2">
                        <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Empf. Personal</span>
                      </td>
                      {tage.map((tag, i) => {
                        const ds = datumStr(tag);
                        const tagBedarf = personalBedarf.find(b => b.datum === ds);
                        return (
                          <td key={i} className="px-1.5 py-2 min-w-[100px]">
                            {tagBedarf && tagBedarf.geoeffnet ? (
                              <div className="text-center space-y-0.5">
                                {tagBedarf.empfohlen_kellner > 0 && (
                                  <div className="text-[10px] font-medium text-sky-600 dark:text-sky-400">
                                    {tagBedarf.empfohlen_kellner} Kellner
                                  </div>
                                )}
                                {tagBedarf.empfohlen_kueche > 0 && (
                                  <div className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                    {tagBedarf.empfohlen_kueche} Küche
                                  </div>
                                )}
                                {tagBedarf.gaeste_gesamt > 0 && (
                                  <div className="text-[9px] text-gray-400 dark:text-slate-500">
                                    ~{tagBedarf.gaeste_gesamt} Gäste
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-[9px] text-gray-300 dark:text-slate-600">
                                {tagBedarf && !tagBedarf.geoeffnet ? 'Ruhetag' : '–'}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="w-[70px]" />
                      {istAdmin && <td className="w-[80px]" />}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Zusammenfassung */}
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs text-gray-400 dark:text-slate-500">{schichten.length} Schichten diese Woche</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">{aktiveMitarbeiter.length} Mitarbeiter</span>
                {tausche.length > 0 && (
                  <span className="text-xs text-orange-500 dark:text-orange-400 font-medium">{tausche.length} Tausch-Anfrage(n)</span>
                )}
                {istAdmin && gesamtLohnkosten.summe > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Lohnkosten: {gesamtLohnkosten.summe.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    {!gesamtLohnkosten.vollstaendig && <span className="text-gray-400 dark:text-slate-500 font-normal"> (unvollständig)</span>}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {Object.entries(ROLLEN_FARBE).map(([rolle, farbe]) => (
                  <div key={rolle} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded ${farbe.bg} border ${farbe.border}`} />
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 capitalize">{rolle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin: Schicht-Modal */}
      {istAdmin && (
        <Modal offen={modalOffen} onSchliessen={modalSchliessen} titel={bearbeitung ? 'Schicht bearbeiten' : 'Neue Schicht'}>
          <SchichtFormular
            mitarbeiter={aktiveMitarbeiter}
            schicht={bearbeitung}
            vorauswahlDatum={vorauswahlDatum}
            vorauswahlMitarbeiter={vorauswahlMitarbeiter}
            onSpeichern={async (daten) => {
              if (bearbeitung) { await aktualisieren(bearbeitung.id, daten); }
              else { await erstellen(daten); }
              modalSchliessen();
              return {};
            }}
            onLoeschen={bearbeitung ? async () => { await loeschen(bearbeitung.id); modalSchliessen(); } : undefined}
            onAbbrechen={modalSchliessen}
          />
        </Modal>
      )}

      {/* Admin: Tausch-Übersicht */}
      {istAdmin && tauschAdminOffen && (
        <TauschAdminPanel
          tausche={tausche}
          onGenehmigen={handleGenehmigen}
          onAblehnen={handleAblehnen}
          onSchliessen={() => setTauschAdminOffen(false)}
        />
      )}

      {/* MA: Offenen Tausch annehmen */}
      {!istAdmin && tauschAnnehmenOffen && (
        <TauschAnnehmenPanel
          offeneTausche={offeneTausche}
          ichId={ichId || ''}
          eigeneSchichten={eigeneSchichten}
          onAnnehmen={handleTauschAnnehmen}
          onSchliessen={() => setTauschAnnehmenOffen(false)}
        />
      )}

      {/* MA: Direkten Tausch vorschlagen */}
      {!istAdmin && direktTauschFuer && (
        <DirekterTauschPicker
          eigeneSchichtId={direktTauschFuer}
          alleSchichten={schichten}
          mitarbeiter={aktiveMitarbeiter}
          ichId={ichId || ''}
          schichtImTausch={schichtTauschStatus}
          onBestaetigen={handleDirekterTausch}
          onSchliessen={() => setDirektTauschFuer(null)}
        />
      )}
    </div>
  );
}
