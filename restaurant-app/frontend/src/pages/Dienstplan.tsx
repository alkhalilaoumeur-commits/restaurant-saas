import { useState, useMemo } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import SchichtFormular from '../components/dienstplan/SchichtFormular';
import { useDienstplan } from '../hooks/useDienstplan';
import { useMitarbeiter } from '../hooks/useMitarbeiter';
import { Schicht } from '../types';

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

// ─── Hauptkomponente ─────────────────────────────────────────────────────────

export default function Dienstplan() {
  const [wochenStart, setWochenStart] = useState(() => montag(new Date()));
  const tage = useMemo(() => wocheTage(wochenStart), [wochenStart]);
  const start = datumStr(tage[0]);
  const ende = datumStr(tage[6]);

  const { schichten, erstellen, aktualisieren, loeschen } = useDienstplan(start, ende);
  const { mitarbeiter } = useMitarbeiter();
  const aktiveMitarbeiter = mitarbeiter.filter((m) => m.aktiv);

  // Modal-State
  const [modalOffen, setModalOffen] = useState(false);
  const [bearbeitung, setBearbeitung] = useState<Schicht | null>(null);
  const [vorauswahlDatum, setVorauswahlDatum] = useState<string>('');
  const [vorauswahlMitarbeiter, setVorauswahlMitarbeiter] = useState<string>('');

  // Schichten nach Mitarbeiter+Datum gruppieren
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

  // Wochen-Navigation
  function vorherigeWoche() {
    const d = new Date(wochenStart);
    d.setDate(d.getDate() - 7);
    setWochenStart(d);
  }
  function naechsteWoche() {
    const d = new Date(wochenStart);
    d.setDate(d.getDate() + 7);
    setWochenStart(d);
  }
  function heute() {
    setWochenStart(montag(new Date()));
  }

  // Zelle klicken → neue Schicht
  function zelleKlicken(mitarbeiterId: string, datum: string) {
    setBearbeitung(null);
    setVorauswahlDatum(datum);
    setVorauswahlMitarbeiter(mitarbeiterId);
    setModalOffen(true);
  }

  // Schicht klicken → bearbeiten
  function schichtKlicken(s: Schicht) {
    setBearbeitung(s);
    setVorauswahlDatum('');
    setVorauswahlMitarbeiter('');
    setModalOffen(true);
  }

  function modalSchliessen() {
    setModalOffen(false);
    setBearbeitung(null);
  }

  // Stunden pro Mitarbeiter für die Woche berechnen
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

  // Ist heute?
  const heuteStr = datumStr(new Date());

  // KW berechnen
  const kwDatum = new Date(wochenStart);
  kwDatum.setDate(kwDatum.getDate() + 3);
  const kw = Math.ceil(((kwDatum.getTime() - new Date(kwDatum.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);

  // Monatsname für Header
  const monatStart = tage[0].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const monatEnde = tage[6].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const monatLabel = monatStart === monatEnde ? monatStart : `${tage[0].toLocaleDateString('de-DE', { month: 'short' })} – ${tage[6].toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`;

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Dienstplan"
        untertitel={`KW ${kw} · ${monatLabel}`}
        aktion={
          <button
            onClick={() => { setBearbeitung(null); setVorauswahlDatum(''); setVorauswahlMitarbeiter(''); setModalOffen(true); }}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            + Schicht
          </button>
        }
      />

      {/* Wochen-Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={vorherigeWoche} className="w-9 h-9 rounded-lg bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={heute} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 shadow-sm text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            Heute
          </button>
          <button onClick={naechsteWoche} className="w-9 h-9 rounded-lg bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
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
            {/* Header: Tage */}
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="w-[180px] px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Mitarbeiter</th>
                {tage.map((tag, i) => {
                  const istHeute = datumStr(tag) === heuteStr;
                  return (
                    <th key={i} className={`px-2 py-3 text-center min-w-[100px] ${istHeute ? 'bg-red-50/50' : ''}`}>
                      <p className={`text-[11px] font-semibold uppercase tracking-wider ${istHeute ? 'text-red-600' : 'text-gray-400'}`}>
                        {WOCHEN_TAG_KURZ[i]}
                      </p>
                      <p className={`text-lg font-bold leading-tight ${istHeute ? 'text-red-600' : 'text-gray-700'}`}>
                        {tag.getDate()}
                      </p>
                    </th>
                  );
                })}
                <th className="w-[70px] px-3 py-3 text-center text-xs font-semibold text-gray-400 dark:text-slate-500">Std.</th>
              </tr>
            </thead>

            {/* Body: Mitarbeiter-Zeilen */}
            <tbody>
              {aktiveMitarbeiter.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-500">
                    Keine aktiven Mitarbeiter vorhanden.
                  </td>
                </tr>
              )}

              {aktiveMitarbeiter.map((m) => {
                const farbe = ROLLEN_FARBE[m.rolle] || ROLLEN_FARBE.kellner;
                const stunden = stundenProMitarbeiter(m.id);

                return (
                  <tr key={m.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    {/* Mitarbeiter-Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${farbe.bg} flex items-center justify-center text-xs font-bold ${farbe.text}`}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{m.name}</p>
                          <span className={`text-[10px] font-semibold ${farbe.text}`}>{m.rolle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tage-Zellen */}
                    {tage.map((tag, i) => {
                      const ds = datumStr(tag);
                      const istHeute = ds === heuteStr;
                      const zellenSchichten = schichtMap.get(`${m.id}_${ds}`) || [];

                      return (
                        <td
                          key={i}
                          className={`px-1.5 py-2 align-top cursor-pointer group ${istHeute ? 'bg-red-50/30' : ''}`}
                          onClick={() => zelleKlicken(m.id, ds)}
                        >
                          {zellenSchichten.length > 0 ? (
                            <div className="space-y-1">
                              {zellenSchichten.map((s) => (
                                <div
                                  key={s.id}
                                  onClick={(e) => { e.stopPropagation(); schichtKlicken(s); }}
                                  className={`px-2 py-1.5 rounded-lg border text-center cursor-pointer hover:shadow-sm transition-all ${farbe.bg} ${farbe.border}`}
                                >
                                  <p className={`text-xs font-semibold ${farbe.text}`}>
                                    {s.beginn.slice(0, 5)}–{s.ende.slice(0, 5)}
                                  </p>
                                  {s.notiz && (
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{s.notiz}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-10 rounded-lg border border-dashed border-transparent group-hover:border-gray-200 transition-colors flex items-center justify-center">
                              <span className="text-gray-300 text-lg opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Wochenstunden */}
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-semibold ${stunden > 40 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-slate-300'}`}>
                        {stunden}h
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Zusammenfassung */}
        {aktiveMitarbeiter.length > 0 && (
          <div className="px-4 py-3 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {schichten.length} Schichten diese Woche
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {aktiveMitarbeiter.length} Mitarbeiter
              </span>
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
        )}
      </div>

      {/* Schicht-Modal */}
      <Modal
        offen={modalOffen}
        onSchliessen={modalSchliessen}
        titel={bearbeitung ? 'Schicht bearbeiten' : 'Neue Schicht'}
      >
        <SchichtFormular
          mitarbeiter={aktiveMitarbeiter}
          schicht={bearbeitung}
          vorauswahlDatum={vorauswahlDatum}
          vorauswahlMitarbeiter={vorauswahlMitarbeiter}
          onSpeichern={async (daten) => {
            if (bearbeitung) {
              await aktualisieren(bearbeitung.id, daten);
            } else {
              await erstellen(daten);
            }
            modalSchliessen();
          }}
          onLoeschen={bearbeitung ? async () => {
            await loeschen(bearbeitung.id);
            modalSchliessen();
          } : undefined}
          onAbbrechen={modalSchliessen}
        />
      </Modal>
    </div>
  );
}
