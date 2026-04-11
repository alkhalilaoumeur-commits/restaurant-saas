import { useState, useMemo, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import ReservierungZeile from '../components/reservierungen/ReservierungZeile';
import ReservierungFormular from '../components/reservierungen/ReservierungFormular';
import WalkInZeile from '../components/reservierungen/WalkInZeile';
import { useReservierungen } from '../hooks/useReservierungen';
import { useTische } from '../hooks/useTische';
import { useWalkIns } from '../hooks/useWalkIns';
import { useAuthStore } from '../store/auth';

const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function datumFormatiert(d: Date): string {
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function datumString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function wocheTage(basis: Date): Date[] {
  const tag = basis.getDay();
  const montag = new Date(basis);
  montag.setDate(basis.getDate() - ((tag + 6) % 7));
  const tage: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(montag);
    d.setDate(montag.getDate() + i);
    tage.push(d);
  }
  return tage;
}

type Ansicht = 'reservierungen' | 'walk-ins';

export default function Reservierungen() {
  const { mitarbeiter } = useAuthStore();
  const istAdmin = mitarbeiter?.rolle === 'admin';

  const [ansicht, setAnsicht] = useState<Ansicht>('reservierungen');
  const [datum, setDatum] = useState(() => new Date());
  const [formularOffen, setFormularOffen] = useState(false);
  const [linkKopiert, setLinkKopiert] = useState(false);

  // Walk-in Formular State
  const [walkInName, setWalkInName] = useState('');
  const [walkInPersonen, setWalkInPersonen] = useState('2');
  const [walkInAnmerkung, setWalkInAnmerkung] = useState('');
  const [walkInLaedt, setWalkInLaedt] = useState(false);

  const buchungsLink = mitarbeiter
    ? `${window.location.origin}/buchen/${mitarbeiter.restaurantId}`
    : '';

  const linkKopieren = useCallback(() => {
    navigator.clipboard.writeText(buchungsLink).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = buchungsLink;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setLinkKopiert(true);
    setTimeout(() => setLinkKopiert(false), 2000);
  }, [buchungsLink]);

  const datumStr = datumString(datum);
  const { reservierungen, laden, laden_, statusAendern, autoZuweisen } = useReservierungen(datumStr);
  const { tische } = useTische();
  const { walkIns, laden: walkInLaden, hinzufuegen, platzieren, abgegangen, loeschen } = useWalkIns();

  const woche = useMemo(() => wocheTage(datum), [datumStr]);
  const heuteStr = datumString(new Date());

  function tagWechseln(offset: number) {
    setDatum((prev) => {
      const neu = new Date(prev);
      neu.setDate(prev.getDate() + offset);
      return neu;
    });
  }

  const sortiert = [...reservierungen].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );

  const ausstehend = reservierungen.filter((r) => r.status === 'ausstehend').length;
  const bestaetigt = reservierungen.filter((r) => r.status === 'bestaetigt').length;
  const storniert = reservierungen.filter((r) => r.status === 'storniert').length;
  const gesamtPersonen = reservierungen
    .filter((r) => r.status !== 'storniert')
    .reduce((s, r) => s + r.personen, 0);

  const wartende = walkIns.filter(w => w.status === 'wartend').length;

  const handleWalkInHinzufuegen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;
    setWalkInLaedt(true);
    try {
      await hinzufuegen({
        gast_name: walkInName.trim(),
        personen: parseInt(walkInPersonen),
        anmerkung: walkInAnmerkung.trim() || undefined,
      });
      setWalkInName('');
      setWalkInPersonen('2');
      setWalkInAnmerkung('');
    } finally {
      setWalkInLaedt(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Reservierungen"
        aktion={
          <div className="flex gap-2">
            {ansicht === 'reservierungen' && (
              <>
                <button
                  onClick={linkKopieren}
                  className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  title="Online-Buchungslink kopieren"
                >
                  {linkKopiert ? '✓ Kopiert!' : '🔗 Buchungslink'}
                </button>
                <button
                  onClick={() => setFormularOffen(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700"
                >
                  + Reservierung
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Reservierung-Formular Modal */}
      <Modal
        offen={formularOffen}
        onSchliessen={() => setFormularOffen(false)}
        titel="Neue Reservierung"
      >
        {mitarbeiter && (
          <ReservierungFormular
            restaurantId={mitarbeiter.restaurantId}
            onErfolg={() => { setFormularOffen(false); laden_(); }}
            onAbbrechen={() => setFormularOffen(false)}
          />
        )}
      </Modal>

      {/* Tab-Umschalter */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.06] p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setAnsicht('reservierungen')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            ansicht === 'reservierungen'
              ? 'bg-white dark:bg-white/[0.1] text-gray-800 dark:text-slate-100 shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          Reservierungen
        </button>
        <button
          onClick={() => setAnsicht('walk-ins')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            ansicht === 'walk-ins'
              ? 'bg-white dark:bg-white/[0.1] text-gray-800 dark:text-slate-100 shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          Walk-ins
          {wartende > 0 && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {wartende}
            </span>
          )}
        </button>
      </div>

      {/* ── RESERVIERUNGEN ANSICHT ───────────────────────────────────────────────── */}
      {ansicht === 'reservierungen' && (
        <>
          {/* Datumsnavigation */}
          <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => tagWechseln(-7)}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1 shrink-0"
                title="Vorherige Woche"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex flex-1 gap-1 overflow-x-auto">
                {woche.map((tag) => {
                  const tagStr = datumString(tag);
                  const istHeute = tagStr === heuteStr;
                  const istGewaehlt = tagStr === datumStr;
                  return (
                    <button
                      key={tagStr}
                      onClick={() => setDatum(tag)}
                      className={`flex-1 min-w-[40px] py-2 rounded-lg text-center transition-colors ${
                        istGewaehlt
                          ? 'bg-[#dc2626] text-white'
                          : istHeute
                            ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                            : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      <p className="text-[10px] sm:text-xs font-medium">{WOCHENTAGE[tag.getDay()]}</p>
                      <p className={`text-sm sm:text-lg font-bold ${istGewaehlt ? 'text-white' : ''}`}>{tag.getDate()}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => tagWechseln(7)}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1 shrink-0"
                title="Nächste Woche"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => tagWechseln(-1)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-200">{datumFormatiert(datum)}</p>
                <button onClick={() => tagWechseln(1)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {datumStr !== heuteStr && (
                <button
                  onClick={() => setDatum(new Date())}
                  className="text-xs bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-500/25"
                >
                  Heute
                </button>
              )}
            </div>

            {reservierungen.length > 0 && (
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  <span className="font-medium text-gray-600 dark:text-slate-300">{reservierungen.length}</span> Reservierungen
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  <span className="font-medium text-gray-600 dark:text-slate-300">{gesamtPersonen}</span> Personen
                </p>
                {ausstehend > 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    <span className="font-medium">{ausstehend}</span> ausstehend
                  </p>
                )}
                {bestaetigt > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    <span className="font-medium">{bestaetigt}</span> bestätigt
                  </p>
                )}
                {storniert > 0 && (
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    <span className="font-medium">{storniert}</span> storniert
                  </p>
                )}
              </div>
            )}
          </div>

          {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}
          {!laden && reservierungen.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-slate-500">Keine Reservierungen für diesen Tag.</p>
          )}

          <div className="space-y-3">
            {sortiert.map((r) => (
              <ReservierungZeile
                key={r.id}
                reservierung={r}
                onStatusAendern={statusAendern}
                tische={tische}
                onAutoZuweisen={autoZuweisen}
              />
            ))}
          </div>
        </>
      )}

      {/* ── WALK-INS ANSICHT ─────────────────────────────────────────────────────── */}
      {ansicht === 'walk-ins' && (
        <>
          {/* Schnell-Erfassungs-Formular */}
          <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">Neuer Walk-in erfassen</p>
            <form onSubmit={handleWalkInHinzufuegen} className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Name</label>
                <input
                  type="text"
                  value={walkInName}
                  onChange={e => setWalkInName(e.target.value)}
                  placeholder="Mustermann"
                  required
                  className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Personen</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={walkInPersonen}
                  onChange={e => setWalkInPersonen(e.target.value)}
                  className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Anmerkung (optional)</label>
                <input
                  type="text"
                  value={walkInAnmerkung}
                  onChange={e => setWalkInAnmerkung(e.target.value)}
                  placeholder="z.B. Kinderstuhl"
                  className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={walkInLaedt || !walkInName.trim()}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 whitespace-nowrap"
              >
                {walkInLaedt ? '...' : '+ Walk-in'}
              </button>
            </form>
          </div>

          {/* Walk-in Liste */}
          {walkInLaden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}

          {!walkInLaden && walkIns.length === 0 && (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">🚶</p>
              <p className="text-sm text-gray-400 dark:text-slate-500">Keine Walk-ins gerade aktiv.</p>
            </div>
          )}

          {walkIns.length > 0 && (
            <>
              {/* Statistik-Leiste */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  <span className="font-medium text-gray-600 dark:text-slate-300">{walkIns.filter(w => w.status === 'wartend').length}</span> wartend
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  <span className="font-medium text-gray-600 dark:text-slate-300">{walkIns.filter(w => w.status === 'platziert').length}</span> platziert
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  <span className="font-medium text-gray-600 dark:text-slate-300">
                    {walkIns.filter(w => w.status !== 'abgegangen').reduce((s, w) => s + w.personen, 0)}
                  </span> Personen gesamt
                </p>
              </div>

              <div className="space-y-3">
                {walkIns.map((w) => (
                  <WalkInZeile
                    key={w.id}
                    walkIn={w}
                    tische={tische}
                    onPlatzieren={platzieren}
                    onAbgegangen={abgegangen}
                    onLoeschen={loeschen}
                    istAdmin={istAdmin}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
