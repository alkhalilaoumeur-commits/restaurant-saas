import { useState, useMemo, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import ReservierungZeile from '../components/reservierungen/ReservierungZeile';
import ReservierungFormular from '../components/reservierungen/ReservierungFormular';
import { useReservierungen } from '../hooks/useReservierungen';
import { useAuthStore } from '../store/auth';

const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function datumFormatiert(d: Date): string {
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function datumString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function wocheTage(basis: Date): Date[] {
  const tag = basis.getDay(); // 0=So, 1=Mo
  const montag = new Date(basis);
  montag.setDate(basis.getDate() - ((tag + 6) % 7)); // Montag der Woche
  const tage: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(montag);
    d.setDate(montag.getDate() + i);
    tage.push(d);
  }
  return tage;
}

export default function Reservierungen() {
  const { mitarbeiter } = useAuthStore();
  const [datum, setDatum] = useState(() => new Date());
  const [formularOffen, setFormularOffen] = useState(false);
  const [linkKopiert, setLinkKopiert] = useState(false);

  const buchungsLink = mitarbeiter
    ? `${window.location.origin}/buchen/${mitarbeiter.restaurantId}`
    : '';

  const linkKopieren = useCallback(() => {
    navigator.clipboard.writeText(buchungsLink);
    setLinkKopiert(true);
    setTimeout(() => setLinkKopiert(false), 2000);
  }, [buchungsLink]);

  const datumStr = datumString(datum);
  const { reservierungen, laden, laden_, statusAendern } = useReservierungen(datumStr);

  const woche = useMemo(() => wocheTage(datum), [datumStr]);
  const heuteStr = datumString(new Date());

  function tagWechseln(offset: number) {
    setDatum((prev) => {
      const neu = new Date(prev);
      neu.setDate(prev.getDate() + offset);
      return neu;
    });
  }

  // Reservierungen nach Uhrzeit sortieren
  const sortiert = [...reservierungen].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );

  // Zähler pro Status
  const ausstehend = reservierungen.filter((r) => r.status === 'ausstehend').length;
  const bestaetigt = reservierungen.filter((r) => r.status === 'bestaetigt').length;
  const storniert = reservierungen.filter((r) => r.status === 'storniert').length;
  const gesamtPersonen = reservierungen
    .filter((r) => r.status !== 'storniert')
    .reduce((s, r) => s + r.personen, 0);

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Reservierungen"
        aktion={
          <div className="flex gap-2">
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

      {/* Datumsnavigation */}
      <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-4 mb-6">
        {/* Wochenleiste */}
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

        {/* Datum + Heute-Button */}
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

        {/* Tages-Statistiken */}
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

      {/* Liste */}
      {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}

      {!laden && reservierungen.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-slate-500">Keine Reservierungen für diesen Tag.</p>
      )}

      <div className="space-y-3">
        {sortiert.map((r) => (
          <ReservierungZeile key={r.id} reservierung={r} onStatusAendern={statusAendern} />
        ))}
      </div>
    </div>
  );
}
