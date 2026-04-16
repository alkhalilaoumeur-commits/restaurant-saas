import { useState } from 'react';
import { useBewertungen } from '../hooks/useBewertungen';
import { Bewertung } from '../types';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function sternLabel(n: number | null): string {
  if (!n) return '—';
  return ['', 'Sehr schlecht', 'Schlecht', 'Okay', 'Gut', 'Hervorragend'][n] || '';
}

function sternFarbe(n: number | null): string {
  if (!n) return 'text-gray-400';
  if (n >= 4) return 'text-emerald-500';
  if (n === 3) return 'text-amber-500';
  return 'text-red-500';
}

function SternAnzeige({ wert, groesse = 'sm' }: { wert: number | null; groesse?: 'sm' | 'lg' }) {
  const basis = groesse === 'lg' ? 'text-2xl' : 'text-base';
  return (
    <span className={`${basis} leading-none`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={(wert || 0) >= n ? 'text-amber-400' : 'text-gray-200'}>★</span>
      ))}
    </span>
  );
}

function datumKurz(d: string): string {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Antwort-Modal ────────────────────────────────────────────────────────────

function AntwortModal({
  bewertung,
  onAbbrechen,
  onSpeichern,
}: {
  bewertung: Bewertung;
  onAbbrechen: () => void;
  onSpeichern: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(bewertung.antwort_text || '');
  const [speichert, setSpeichert] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const absenden = async () => {
    if (!text.trim()) { setFehler('Antwort darf nicht leer sein'); return; }
    setSpeichert(true);
    try {
      await onSpeichern(text.trim());
      onAbbrechen();
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Speichern');
    } finally {
      setSpeichert(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-6 max-w-lg w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Auf Bewertung antworten</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Gast: <strong>{bewertung.gast_name}</strong> · {datumKurz(bewertung.erstellt_am)}
        </p>

        {/* Original-Bewertung */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4">
          <SternAnzeige wert={bewertung.stern} />
          {bewertung.kommentar && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic">„{bewertung.kommentar}"</p>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Ihre Antwort an den Gast…"
          className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {fehler && <p className="mt-2 text-sm text-red-600">{fehler}</p>}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onAbbrechen}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={absenden}
            disabled={speichert}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {speichert ? 'Speichert…' : 'Antwort speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Anfrage-Modal ────────────────────────────────────────────────────────────

function AnfrageModal({
  onAbbrechen,
  onSenden,
}: {
  onAbbrechen: () => void;
  onSenden: (daten: { gast_name: string; gast_email: string }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState(false);

  const absenden = async () => {
    if (!name.trim() || !email.trim()) { setFehler('Name und E-Mail sind erforderlich'); return; }
    setSendet(true);
    try {
      await onSenden({ gast_name: name.trim(), gast_email: email.toLowerCase().trim() });
      setErfolg(true);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Senden');
    } finally {
      setSendet(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-6 max-w-md w-full">
        {erfolg ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✉️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Anfrage gesendet!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{name} erhält eine E-Mail mit dem Bewertungslink.</p>
            <button onClick={onAbbrechen} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Schließen</button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bewertungsanfrage senden</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name des Gastes</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Mail-Adresse</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max@beispiel.de"
                  className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {fehler && <p className="mt-3 text-sm text-red-600">{fehler}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={onAbbrechen} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Abbrechen</button>
              <button onClick={absenden} disabled={sendet} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                {sendet ? 'Sende…' : 'E-Mail senden'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────

export default function Bewertungen() {
  const { bewertungen, stats, laden, fehler, antworten, anfrageSenden } = useBewertungen();
  const [antwortFuer, setAntwortFuer] = useState<Bewertung | null>(null);
  const [zeigeAnfrage, setZeigeAnfrage] = useState(false);
  const [filter, setFilter] = useState<'alle' | '1' | '2' | '3' | '4' | '5' | 'offen'>('alle');

  const gefiltert = bewertungen.filter((b) => {
    if (filter === 'offen') return b.status === 'offen';
    if (filter === 'alle') return true;
    return String(b.stern) === filter;
  });

  if (laden) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fehler) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">{fehler}</div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bewertungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gäste-Feedback verwalten und beantworten
          </p>
        </div>
        <button
          onClick={() => setZeigeAnfrage(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
          Anfrage senden
        </button>
      </div>

      {/* ── Statistiken ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Durchschnitt */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/10 p-5 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Durchschnitt</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.durchschnitt ? stats.durchschnitt.toFixed(1) : '—'}
            </p>
            {stats.durchschnitt && (
              <div className="mt-1">
                <SternAnzeige wert={Math.round(stats.durchschnitt)} />
              </div>
            )}
          </div>

          {/* Gesamt */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/10 p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Gesamt</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.gesamt}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.abgeschlossen} bewertet</p>
          </div>

          {/* Verteilung */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/10 p-5 col-span-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">Verteilung</p>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const anzahl = stats.verteilung[n] || 0;
                const max = Math.max(...Object.values(stats.verteilung), 1);
                const breite = Math.round((anzahl / max) * 100);
                return (
                  <div key={n} className="flex items-center gap-2 text-xs">
                    <span className="text-amber-400 w-3">{n}★</span>
                    <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${breite}%` }} />
                    </div>
                    <span className="text-gray-500 w-4 text-right">{anzahl}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Filter ── */}
      <div className="flex gap-2 flex-wrap">
        {(['alle', '5', '4', '3', '2', '1', 'offen'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            {f === 'alle' ? 'Alle' : f === 'offen' ? 'Ausstehend' : `${f} ★`}
          </button>
        ))}
      </div>

      {/* ── Liste ── */}
      {gefiltert.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="text-5xl mb-3">⭐</div>
          <p className="font-medium">Noch keine Bewertungen</p>
          <p className="text-sm mt-1">Senden Sie Gästen nach ihrem Besuch eine Bewertungsanfrage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gefiltert.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/10 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{b.gast_name}</span>
                    <span className="text-xs text-gray-400">{datumKurz(b.erstellt_am)}</span>
                    {b.status === 'offen' && (
                      <span className="bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">
                        Ausstehend
                      </span>
                    )}
                  </div>

                  {b.stern ? (
                    <>
                      <div className="flex items-center gap-2 mt-2">
                        <SternAnzeige wert={b.stern} />
                        <span className={`text-xs font-medium ${sternFarbe(b.stern)}`}>
                          {sternLabel(b.stern)}
                        </span>
                      </div>
                      {b.kommentar && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">„{b.kommentar}"</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Noch keine Bewertung abgegeben</p>
                  )}

                  {/* Admin-Antwort */}
                  {b.antwort_text && (
                    <div className="mt-3 bg-blue-50 dark:bg-blue-400/10 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Ihre Antwort:</p>
                      <p className="text-xs text-blue-900 dark:text-blue-100">{b.antwort_text}</p>
                    </div>
                  )}
                </div>

                {/* Antwort-Button — nur bei abgeschlossenen Bewertungen */}
                {b.status === 'abgeschlossen' && (
                  <button
                    onClick={() => setAntwortFuer(b)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {b.antwort_text ? 'Antwort bearbeiten' : 'Antworten'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {antwortFuer && (
        <AntwortModal
          bewertung={antwortFuer}
          onAbbrechen={() => setAntwortFuer(null)}
          onSpeichern={(text) => antworten(antwortFuer.id, text)}
        />
      )}
      {zeigeAnfrage && (
        <AnfrageModal
          onAbbrechen={() => setZeigeAnfrage(false)}
          onSenden={anfrageSenden}
        />
      )}
    </div>
  );
}
