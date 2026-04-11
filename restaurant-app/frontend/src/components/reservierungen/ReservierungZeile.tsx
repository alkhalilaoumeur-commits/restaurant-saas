import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservierung, ReservierungStatus, Tisch } from '../../types';
import {
  formatDatum, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL,
  RESERVIERUNG_QUELLE_LABEL, RESERVIERUNG_QUELLE_FARBE,
} from '../../lib/utils';

interface ReservierungZeileProps {
  reservierung: Reservierung;
  onStatusAendern: (id: string, status: ReservierungStatus) => void;
  tische?: Tisch[];
  onAutoZuweisen?: (id: string) => Promise<boolean>;
}

// Linker Akzent-Rand pro Status
const STATUS_BORDER: Record<string, string> = {
  ausstehend:    'border-l-yellow-400',
  bestaetigt:    'border-l-green-400',
  storniert:     'border-l-gray-300',
  abgeschlossen: 'border-l-gray-300',
  no_show:       'border-l-red-400',
};

const ANLASS_LABELS: Record<string, string> = {
  geburtstag: '🎂 Geburtstag',
  jubilaeum:  '💍 Jubiläum',
  date_night: '❤️ Date Night',
  geschaeft:  '💼 Geschäftsessen',
  feier:      '🥂 Feier',
  sonstiges:  '✨ Sonstiges',
};

const SITZPLATZ_LABELS: Record<string, string> = {
  innen:    'Innen',
  terrasse: 'Terrasse',
  bar:      'Bar',
  fenster:  'Fensterplatz',
  ruhig:    'Ruhige Ecke',
};

export default function ReservierungZeile({ reservierung, onStatusAendern, tische, onAutoZuweisen }: ReservierungZeileProps) {
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [offen, setOffen] = useState(false);
  const navigate = useNavigate();

  // Tisch-Nummer(n) aus Liste nachschlagen
  const tisch = tische?.find(t => t.id === reservierung.tisch_id);
  const tischKombiniert = reservierung.tisch_kombiniert_id
    ? tische?.find(t => t.id === reservierung.tisch_kombiniert_id)
    : null;

  const handleAutoZuweisen = async () => {
    if (!onAutoZuweisen) return;
    setLaedt(true);
    setFehler(null);
    const erfolg = await onAutoZuweisen(reservierung.id);
    if (!erfolg) setFehler('Kein freier Tisch gefunden');
    setLaedt(false);
  };

  const borderKlasse = STATUS_BORDER[reservierung.status] ?? 'border-l-gray-200';

  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm border-l-[3px] ${borderKlasse} overflow-hidden`}>

      {/* ── Kopfzeile (immer sichtbar, klickbar zum Aufklappen) ────────────────── */}
      <button
        type="button"
        onClick={() => setOffen((v) => !v)}
        className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm text-gray-800 dark:text-slate-200">{reservierung.gast_name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${RESERVIERUNG_QUELLE_FARBE[reservierung.quelle]}`}>
              {RESERVIERUNG_QUELLE_LABEL[reservierung.quelle]}
            </span>
            {reservierung.gast_id && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                CRM
              </span>
            )}
            {/* Tisch-Badge(s) */}
            {tisch ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                {tischKombiniert
                  ? `Tisch ${tisch.nummer} + ${tischKombiniert.nummer}`
                  : `Tisch ${tisch.nummer}`}
              </span>
            ) : reservierung.status !== 'storniert' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400">
                Kein Tisch
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {formatDatum(reservierung.datum)} · {reservierung.personen} Personen
            {reservierung.email && <span> · {reservierung.email}</span>}
          </p>
          {(reservierung.anlass || reservierung.sitzplatz_wunsch) && (
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {reservierung.anlass && ANLASS_LABELS[reservierung.anlass] && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 font-medium">
                  {ANLASS_LABELS[reservierung.anlass]}
                </span>
              )}
              {reservierung.sitzplatz_wunsch && SITZPLATZ_LABELS[reservierung.sitzplatz_wunsch] && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium">
                  {SITZPLATZ_LABELS[reservierung.sitzplatz_wunsch]}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${RESERVIERUNG_STATUS_FARBE[reservierung.status]}`}>
            {RESERVIERUNG_STATUS_LABEL[reservierung.status]}
          </span>
          {/* Aufklapp-Pfeil */}
          <svg
            className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${offen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── Detail-Bereich (aufgeklappt) ───────────────────────────────────────── */}
      {offen && (
        <div className="border-t border-gray-100 dark:border-white/[0.06] px-4 pb-4 pt-3">

          {/* Notiz */}
          {reservierung.anmerkung && (
            <div className="mb-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl px-3 py-2">
              <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Anmerkung</p>
              <p className="text-xs text-gray-700 dark:text-slate-300">{reservierung.anmerkung}</p>
            </div>
          )}

          {/* Detail-Raster */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs">
            {reservierung.email && (
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-0.5">Email</p>
                <p className="text-gray-700 dark:text-slate-200 truncate">{reservierung.email}</p>
              </div>
            )}
            {reservierung.telefon && (
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-0.5">Telefon</p>
                <p className="text-gray-700 dark:text-slate-200">{reservierung.telefon}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-0.5">Verweildauer</p>
              <p className="text-gray-700 dark:text-slate-200">{reservierung.verweilzeit_min} Min.</p>
            </div>
          </div>

          {/* Aktions-Zeile */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Gast-Profil Button — nur wenn CRM-Profil verknüpft */}
            {reservierung.gast_id && (
              <button
                type="button"
                onClick={() => navigate('/gaeste', { state: { openGastId: reservierung.gast_id } })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Gast-Profil öffnen
              </button>
            )}

            {/* Status-Aktionen */}
            {reservierung.status === 'ausstehend' && (
              <>
                <button
                  onClick={() => onStatusAendern(reservierung.id, 'bestaetigt')}
                  className="text-xs bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/25 transition-colors font-medium"
                >
                  ✓ Bestätigen
                </button>
                <button
                  onClick={() => onStatusAendern(reservierung.id, 'storniert')}
                  className="text-xs bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/25 transition-colors font-medium"
                >
                  Stornieren
                </button>
              </>
            )}
            {reservierung.status === 'bestaetigt' && (
              <>
                <button
                  onClick={() => onStatusAendern(reservierung.id, 'abgeschlossen')}
                  className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/15 transition-colors font-medium"
                >
                  Abschließen
                </button>
                <button
                  onClick={() => onStatusAendern(reservierung.id, 'no_show')}
                  className="text-xs bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/25 transition-colors font-medium"
                >
                  No-Show
                </button>
              </>
            )}

            {/* Auto-Zuweisung */}
            {!reservierung.tisch_id && reservierung.status !== 'storniert' && onAutoZuweisen && (
              <button
                onClick={handleAutoZuweisen}
                disabled={laedt}
                className="text-xs bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors font-medium disabled:opacity-50"
              >
                {laedt ? '...' : '🪄 Auto-Tisch'}
              </button>
            )}

            {fehler && <p className="text-[10px] text-red-500">{fehler}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
