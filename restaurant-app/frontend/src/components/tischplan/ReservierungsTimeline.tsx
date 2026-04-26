import { useEffect, useRef, useMemo } from 'react';
import { Reservierung, Tisch } from '../../types';

type Props = {
  reservierungen: Reservierung[];
  tische: Tisch[];
  jetzt: number;
  ausgewaehlteRes: string | null;
  onResAuswaehlen: (id: string | null) => void;
  onTagsBearbeiten?: (res: Reservierung) => void;
  scrollAufJetzt: number; // Tick — wenn sich der Wert ändert, scrollt die Liste auf "jetzt"
};

/**
 * Chronologische Reservierungs-Liste links neben dem Floor Plan.
 * Zeigt pro Eintrag: Uhrzeit, Name, Personen, Tisch, Status-Icon, Gast-Stats, Tags.
 */
export default function ReservierungsTimeline({
  reservierungen,
  tische,
  jetzt,
  ausgewaehlteRes,
  onResAuswaehlen,
  onTagsBearbeiten,
  scrollAufJetzt,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jetztMarkerRef = useRef<HTMLDivElement>(null);

  // Sortiert nach Uhrzeit
  const sortiert = useMemo(
    () => [...reservierungen].sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()),
    [reservierungen]
  );

  // Index der ersten Reservierung, die in der Zukunft liegt — dort kommt der "Jetzt"-Marker davor
  const jetztIndex = useMemo(() => {
    const i = sortiert.findIndex(r => new Date(r.datum).getTime() >= jetzt);
    return i === -1 ? sortiert.length : i;
  }, [sortiert, jetzt]);

  // "Auf jetzt wechseln" — scrollt zur aktuellen Zeit
  useEffect(() => {
    if (scrollAufJetzt > 0 && jetztMarkerRef.current && containerRef.current) {
      jetztMarkerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollAufJetzt]);

  if (sortiert.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/[0.05] flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-medium">Keine Reservierungen heute</p>
          <p className="text-xs text-slate-500 mt-1">Online-Buchungen erscheinen automatisch</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {sortiert.map((r, idx) => {
        const datumObj = new Date(r.datum);
        const uhrzeit = datumObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const tischNr = r.tisch_id ? tische.find(t => t.id === r.tisch_id)?.nummer : null;
        const minBis = (datumObj.getTime() - jetzt) / 60000;
        const istVergangen = minBis < -(r.verweilzeit_min || 90);
        const istUeberfaellig = minBis < 0 && !istVergangen && r.status === 'ausstehend';
        const istBaldDran = minBis >= 0 && minBis <= 30 && r.status === 'ausstehend';
        const istAusgewaehlt = ausgewaehlteRes === r.id;
        const istStorniert = r.status === 'storniert' || r.status === 'no_show';
        const istBestaetigt = r.status === 'bestaetigt';
        const istAbgeschlossen = r.status === 'abgeschlossen';

        // Status-Indikator-Farbe (rechts)
        const statusColor =
          istStorniert ? 'text-red-400 border-red-500/30 bg-red-500/10' :
          istBestaetigt ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
          istUeberfaellig ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
          istAbgeschlossen ? 'text-slate-500 border-slate-600/30 bg-slate-500/10' :
          'text-slate-400 border-slate-600/30 bg-slate-500/10';

        const showJetztMarker = idx === jetztIndex;

        return (
          <div key={r.id}>
            {showJetztMarker && (
              <div ref={jetztMarkerRef} className="flex items-center gap-2 py-2 px-1 my-1">
                <div className="flex-1 h-px bg-cyan-500/40" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400">
                  Jetzt · {new Date(jetzt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex-1 h-px bg-cyan-500/40" />
              </div>
            )}
            <button
              onClick={() => {
                if (!r.tisch_id && !istStorniert && !istAbgeschlossen) {
                  onResAuswaehlen(istAusgewaehlt ? null : r.id);
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                istAusgewaehlt
                  ? 'bg-blue-500/15 border-blue-500/40 ring-1 ring-blue-500/30'
                  : istUeberfaellig
                  ? 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'
                  : istBaldDran
                  ? 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
              } ${istStorniert || istAbgeschlossen ? 'opacity-50' : ''}`}
            >
              {/* Uhrzeit */}
              <div className="shrink-0 w-12 pt-0.5">
                <div className={`text-sm font-bold tabular-nums ${
                  istUeberfaellig ? 'text-orange-400' :
                  istBaldDran ? 'text-cyan-400' :
                  istStorniert ? 'text-slate-500 line-through' :
                  'text-slate-200'
                }`}>{uhrzeit}</div>
              </div>

              {/* Hauptbereich */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${
                  istStorniert ? 'text-slate-500 line-through' : 'text-slate-100'
                }`}>
                  {r.gast_name}
                  <span className="text-slate-500 font-normal"> · {r.personen}P</span>
                  {tischNr != null && (
                    <span className="ml-1.5 inline-flex items-center text-[10px] font-bold text-cyan-400">
                      T{tischNr}
                    </span>
                  )}
                </div>

                {/* Tags-Reihe */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.anlass && (
                    <Tag color="rose" label={r.anlass} />
                  )}
                  {r.sitzplatz_wunsch && (
                    <Tag color="amber" label={r.sitzplatz_wunsch} />
                  )}
                  {/* Reservierungs-eigene Tags */}
                  {r.tags?.map((t) => (
                    <Tag key={`r-${t}`} color="cyan" label={t} />
                  ))}
                  {/* CRM-Tags vom Gast */}
                  {r.gast_tags?.slice(0, 2).map((t) => (
                    <Tag key={`g-${t}`} color="cyan" label={t} />
                  ))}
                  {r.gast_besuche != null && r.gast_besuche > 0 && (
                    <Tag color="slate" label={`${r.gast_besuche} Besuche`} />
                  )}
                  {r.gast_no_shows != null && r.gast_no_shows > 0 && (
                    <Tag color="red" label={`${r.gast_no_shows} No-Shows`} />
                  )}
                  {istUeberfaellig && (
                    <Tag color="orange" label="Überfällig" />
                  )}
                  {istBaldDran && (
                    <Tag color="cyan" label={`in ${Math.round(minBis)}m`} />
                  )}
                  {/* Edit-Tags Button (nur bei aktiven Reservierungen) */}
                  {onTagsBearbeiten && !istStorniert && !istAbgeschlossen && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onTagsBearbeiten(r); }}
                      title="Tags bearbeiten"
                      className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border border-dashed border-slate-600/50 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors font-medium"
                    >
                      + Tag
                    </button>
                  )}
                </div>

                {r.anmerkung && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{r.anmerkung}</p>
                )}
              </div>

              {/* Status-Indikator rechts */}
              <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center ${statusColor}`}>
                {istBestaetigt && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                )}
                {istStorniert && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
                {!istBestaetigt && !istStorniert && !istAbgeschlossen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
            </button>
          </div>
        );
      })}

      {jetztIndex === sortiert.length && (
        <div className="flex items-center gap-2 py-2 px-1">
          <div className="flex-1 h-px bg-cyan-500/40" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400">
            Jetzt · {new Date(jetzt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex-1 h-px bg-cyan-500/40" />
        </div>
      )}
    </div>
  );
}

// ─── Tag-Komponente ──────────────────────────────────────────────────────────

const TAG_FARBEN: Record<string, string> = {
  cyan:   'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  rose:   'bg-rose-500/15 text-rose-300 border-rose-500/20',
  amber:  'bg-amber-500/15 text-amber-300 border-amber-500/20',
  red:    'bg-red-500/15 text-red-300 border-red-500/20',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  slate:  'bg-white/[0.04] text-slate-400 border-white/10',
};

function Tag({ color, label }: { color: keyof typeof TAG_FARBEN; label: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ${TAG_FARBEN[color]}`}>
      {label}
    </span>
  );
}
