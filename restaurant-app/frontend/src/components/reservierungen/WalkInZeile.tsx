import { useState } from 'react';
import { WalkIn, Tisch } from '../../types';

interface WalkInZeileProps {
  walkIn: WalkIn;
  tische?: Tisch[];
  onPlatzieren: (id: string, tischId?: string) => Promise<boolean>;
  onAbgegangen: (id: string) => void;
  onReaktivieren?: (id: string) => void;
  onLoeschen: (id: string) => void;
  istAdmin: boolean;
}

function wartezeitLabel(min: number): string {
  if (min === 0) return 'Sofort verfügbar';
  if (min < 60) return `~${min} Min.`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `~${h}h ${m}min` : `~${h}h`;
}

function zeitSeitAnkunft(erstellt_am: string): string {
  const minuten = Math.floor((Date.now() - new Date(erstellt_am).getTime()) / 60000);
  if (minuten < 1) return 'Gerade angekommen';
  if (minuten < 60) return `Seit ${minuten} Min.`;
  return `Seit ${Math.floor(minuten / 60)}h ${minuten % 60}min`;
}

export default function WalkInZeile({ walkIn, tische, onPlatzieren, onAbgegangen, onReaktivieren, onLoeschen, istAdmin }: WalkInZeileProps) {
  const [laedt, setLaedt] = useState(false);
  const [keinTisch, setKeinTisch] = useState(false);
  const [tischAuswahlOffen, setTischAuswahlOffen] = useState(false);
  const [fehlerText, setFehlerText] = useState('');

  const tisch = tische?.find(t => t.id === walkIn.tisch_id);
  const freie = tische?.filter(t => t.status === 'frei') ?? [];

  const handleAuto = async () => {
    setLaedt(true);
    setKeinTisch(false);
    setFehlerText('');
    setTischAuswahlOffen(false);
    const erfolg = await onPlatzieren(walkIn.id);
    if (!erfolg) { setKeinTisch(true); setFehlerText('Kein freier Tisch für diese Gruppengröße'); }
    setLaedt(false);
  };

  const handleManuell = async (tischId: string) => {
    setLaedt(true);
    setFehlerText('');
    setTischAuswahlOffen(false);
    const erfolg = await onPlatzieren(walkIn.id, tischId);
    if (!erfolg) setFehlerText('Tisch konnte nicht zugewiesen werden');
    setLaedt(false);
  };

  const istWartend = walkIn.status === 'wartend';
  const istPlatziert = walkIn.status === 'platziert';
  const istAbgegangen = walkIn.status === 'abgegangen';

  const randFarbe = istWartend
    ? 'border-l-yellow-400'
    : istPlatziert
      ? 'border-l-green-400'
      : 'border-l-gray-300 dark:border-l-white/20';

  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-4 shadow-sm border-l-[3px] ${randFarbe}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Name + Status-Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm text-gray-800 dark:text-slate-200">{walkIn.gast_name}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
              Walk-in
            </span>
            {istPlatziert && tisch && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                Tisch {tisch.nummer}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {walkIn.personen} {walkIn.personen === 1 ? 'Person' : 'Personen'} · {zeitSeitAnkunft(walkIn.erstellt_am)}
          </p>

          {istWartend && (
            <div className="mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                walkIn.wartezeit_min === 0
                  ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400'
                  : 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
              }`}>
                ⏱ {wartezeitLabel(walkIn.wartezeit_min)}
              </span>
            </div>
          )}

          {walkIn.anmerkung && (
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 italic bg-gray-50 dark:bg-white/5 rounded px-2 py-0.5 inline-block">
              {walkIn.anmerkung}
            </p>
          )}

          {(keinTisch || fehlerText) && (
            <p className="text-[10px] text-red-500 mt-1">{fehlerText || 'Kein freier Tisch gefunden'}</p>
          )}
        </div>

        {/* Status-Badge */}
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
          istWartend
            ? 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
            : istPlatziert
              ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-slate-500'
        }`}>
          {istWartend ? 'Wartend' : istPlatziert ? 'Platziert' : 'Abgegangen'}
        </span>

        {/* Aktions-Buttons */}
        <div className="flex flex-col gap-1.5 shrink-0 items-end">
          {istWartend && (
            <>
              <button
                onClick={() => setTischAuswahlOffen(o => !o)}
                disabled={laedt}
                className="text-xs bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 px-2.5 py-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/25 transition-colors font-medium disabled:opacity-50"
              >
                {laedt ? '...' : '🪑 Platzieren'}
              </button>
              <button
                onClick={() => onAbgegangen(walkIn.id)}
                className="text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-medium"
              >
                Abgegangen
              </button>
            </>
          )}
          {istAbgegangen && onReaktivieren && (
            <button
              onClick={() => onReaktivieren(walkIn.id)}
              className="text-xs bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors font-medium"
            >
              Zurück
            </button>
          )}
          {istAdmin && !istWartend && (
            <button
              onClick={() => onLoeschen(walkIn.id)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {/* Tischauswahl-Panel */}
      {tischAuswahlOffen && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Tisch wählen oder automatisch zuweisen:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAuto}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 font-medium transition-colors"
            >
              ✨ Auto-Platzieren
            </button>
            {freie.map(t => (
              <button
                key={t.id}
                onClick={() => handleManuell(t.id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/25 font-medium transition-colors"
              >
                Tisch {t.nummer}{t.kapazitaet ? ` (${t.kapazitaet}P)` : ''}
              </button>
            ))}
            {freie.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 italic">Keine freien Tische verfügbar</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
