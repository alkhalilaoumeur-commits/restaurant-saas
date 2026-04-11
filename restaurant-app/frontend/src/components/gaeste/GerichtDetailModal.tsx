import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gericht, ExtrasGruppe, Extra, GewaehlteExtra } from '../../types';
import { useGerichtExtras } from '../../hooks/useGerichtExtras';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  gericht: Gericht | null;
  onSchliessen: () => void;
  onInWarenkorb: (gericht: Gericht, menge: number, extras: GewaehlteExtra[]) => void;
}

// ─── Hilfsfunktion: Erzeugt einen Warenkorb-Key aus Gericht + Extras ────────
// Gleiches Gericht mit unterschiedlichen Extras = separate Zeilen im Warenkorb
export function warenkorbKey(gerichtId: string, extras: GewaehlteExtra[]): string {
  const sortierteIds = extras.map((e) => e.extra_id).sort().join(',');
  return `${gerichtId}:${sortierteIds}`;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Bottom-Sheet-Modal das sich von unten einschiebt:
//   - Großes Bild oben (wenn vorhanden)
//   - Name, Beschreibung, Preis
//   - Extras-Gruppen (Radio/Checkbox je nach max_auswahl)
//   - Menge-Steuerung
//   - "In den Warenkorb"-Button mit live berechnetem Gesamtpreis
//
// Datenfluss:
//   gericht.id → useGerichtExtras → GET /api/speisekarte/{id}/extras
//   → ExtrasGruppe[] mit verfügbaren Extras
//   → User wählt Extras → onInWarenkorb() → BestellenPro State
export default function GerichtDetailModal({ gericht, onSchliessen, onInWarenkorb }: Props) {
  const { gruppen, laden } = useGerichtExtras(gericht?.id ?? null);
  const [menge, setMenge] = useState(1);
  const [gewaehlteExtras, setGewaehlteExtras] = useState<Map<string, Set<string>>>(new Map());

  // Reset wenn sich das Gericht ändert
  useEffect(() => {
    setMenge(1);
    setGewaehlteExtras(new Map());
  }, [gericht?.id]);

  if (!gericht) return null;

  // ── Extra-Auswahl-Logik ────────────────────────────────────────────────

  function extraToggle(gruppe: ExtrasGruppe, extra: Extra) {
    setGewaehlteExtras((prev) => {
      const neu = new Map(prev);
      const set = new Set(neu.get(gruppe.id) || []);

      if (set.has(extra.id)) {
        // Abwählen (nur wenn Gruppe nicht pflicht oder andere gewählt)
        set.delete(extra.id);
      } else {
        // Hinzufügen
        if (gruppe.max_auswahl === 1) {
          // Radio: nur eine Option → bisherige entfernen
          set.clear();
        } else if (set.size >= gruppe.max_auswahl) {
          // Max erreicht → älteste entfernen (FIFO)
          const erster = set.values().next().value!;
          set.delete(erster);
        }
        set.add(extra.id);
      }

      neu.set(gruppe.id, set);
      return neu;
    });
  }

  function istGewaehlt(gruppeId: string, extraId: string): boolean {
    return gewaehlteExtras.get(gruppeId)?.has(extraId) ?? false;
  }

  // ── Preis berechnen ────────────────────────────────────────────────────

  function extrasAufpreisGesamt(): number {
    let summe = 0;
    for (const gruppe of gruppen) {
      const gewaehlte = gewaehlteExtras.get(gruppe.id);
      if (!gewaehlte) continue;
      for (const extra of gruppe.extras) {
        if (gewaehlte.has(extra.id)) summe += Number(extra.aufpreis);
      }
    }
    return summe;
  }

  const einzelpreisMitExtras = gericht.preis + extrasAufpreisGesamt();
  const gesamtpreis = einzelpreisMitExtras * menge;

  // ── Pflicht-Gruppen validieren ─────────────────────────────────────────

  function pflichtGruppenErfuellt(): boolean {
    for (const gruppe of gruppen) {
      if (gruppe.pflicht) {
        const gewaehlte = gewaehlteExtras.get(gruppe.id);
        if (!gewaehlte || gewaehlte.size === 0) return false;
      }
    }
    return true;
  }

  // ── In den Warenkorb ──────────────────────────────────────────────────

  function hinzufuegen() {
    const extras: GewaehlteExtra[] = [];
    for (const gruppe of gruppen) {
      const gewaehlte = gewaehlteExtras.get(gruppe.id);
      if (!gewaehlte) continue;
      for (const extra of gruppe.extras) {
        if (gewaehlte.has(extra.id)) {
          extras.push({ extra_id: extra.id, name: extra.name, aufpreis: Number(extra.aufpreis) });
        }
      }
    }
    onInWarenkorb(gericht!, menge, extras);
    onSchliessen();
  }

  const kannHinzufuegen = pflichtGruppenErfuellt();

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onSchliessen}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-gastro-surface rounded-t-[24px] shadow-2xl max-h-[85vh] flex flex-col"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gastro-border" />
        </div>

        {/* Scrollbarer Inhalt */}
        <div className="flex-1 overflow-y-auto">

          {/* 3D-Modell (Premium) oder Bild */}
          {gericht.modell_3d_url ? (
            <div className="relative w-full aspect-square bg-gradient-to-b from-gastro/50 to-gastro-surface overflow-hidden">
              <model-viewer
                src={gericht.modell_3d_url}
                alt={gericht.name}
                auto-rotate=""
                camera-controls=""
                touch-action="pan-y"
                interaction-prompt="none"
                shadow-intensity="1.2"
                shadow-softness="0.8"
                exposure="1.1"
                camera-orbit="30deg 70deg 105%"
                min-camera-orbit="auto auto 50%"
                max-camera-orbit="auto auto 200%"
                style={{ display: 'block', width: '100%', height: '100%', '--poster-color': 'transparent' } as React.CSSProperties}
              />
              {/* Premium-Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300
                                 bg-indigo-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full
                                 border border-indigo-500/30 shadow-lg">
                  3D
                </span>
              </div>
              {/* Gradient zum Content */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gastro-surface to-transparent" />
            </div>
          ) : gericht.bild_url ? (
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={gericht.bild_url}
                alt={gericht.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient-Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gastro-surface/80 via-transparent to-transparent" />
            </div>
          ) : null}

          {/* Info */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-gastro-text font-theme-heading leading-tight">
                {gericht.name}
              </h2>
              <button
                onClick={onSchliessen}
                className="w-8 h-8 rounded-full bg-gastro-border/50 text-gastro-muted flex items-center justify-center
                           hover:bg-gastro-border transition-colors shrink-0 mt-0.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {gericht.beschreibung && (
              <p className="text-sm text-gastro-muted mt-1.5 leading-relaxed italic">
                {gericht.beschreibung}
              </p>
            )}

            <p className="text-lg font-bold text-gastro-primary mt-2 font-theme-heading">
              {formatPreis(gericht.preis)}
            </p>

            {/* Allergene */}
            {gericht.allergene && (
              <p className="text-xs text-gastro-muted/70 mt-1">
                Allergene: {gericht.allergene}
              </p>
            )}
          </div>

          {/* ── Extras-Gruppen ──────────────────────────────────────────── */}
          {laden ? (
            <div className="px-5 py-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gastro-border/30 rounded w-1/3" />
                <div className="h-10 bg-gastro-border/20 rounded-theme" />
                <div className="h-10 bg-gastro-border/20 rounded-theme" />
              </div>
            </div>
          ) : gruppen.length > 0 && (
            <div className="px-5 pt-2 pb-4 space-y-5">
              {gruppen.map((gruppe) => (
                <div key={gruppe.id}>
                  {/* Gruppen-Header */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <h3 className="text-sm font-semibold text-gastro-text">
                      {gruppe.name}
                    </h3>
                    {gruppe.pflicht && (
                      <span className="text-[10px] font-medium text-gastro-primary bg-gastro-primary/10 px-2 py-0.5 rounded-full">
                        Pflicht
                      </span>
                    )}
                    {gruppe.max_auswahl > 1 && (
                      <span className="text-[10px] text-gastro-muted">
                        max. {gruppe.max_auswahl}
                      </span>
                    )}
                  </div>

                  {/* Extras-Liste */}
                  <div className="space-y-1.5">
                    {gruppe.extras.map((extra) => {
                      const gewaehlt = istGewaehlt(gruppe.id, extra.id);
                      const istRadio = gruppe.max_auswahl === 1;

                      return (
                        <button
                          key={extra.id}
                          onClick={() => extraToggle(gruppe, extra)}
                          className={`
                            w-full flex items-center gap-3 px-3.5 py-3 rounded-xl
                            transition-all duration-150
                            ${gewaehlt
                              ? 'bg-gastro-primary/10 ring-1.5 ring-gastro-primary/40'
                              : 'bg-gastro-border/15 hover:bg-gastro-border/25'
                            }
                          `}
                        >
                          {/* Radio/Checkbox Indikator */}
                          <div className={`
                            w-5 h-5 rounded-${istRadio ? 'full' : 'md'} border-2 shrink-0
                            flex items-center justify-center transition-all
                            ${gewaehlt
                              ? 'border-gastro-primary bg-gastro-primary'
                              : 'border-gastro-border'
                            }
                          `}>
                            {gewaehlt && (
                              <svg className="w-3 h-3 text-gastro-on-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>

                          {/* Name */}
                          <span className={`text-sm flex-1 text-left ${gewaehlt ? 'text-gastro-text font-medium' : 'text-gastro-muted'}`}>
                            {extra.name}
                          </span>

                          {/* Aufpreis */}
                          {Number(extra.aufpreis) > 0 && (
                            <span className={`text-sm shrink-0 ${gewaehlt ? 'text-gastro-primary font-semibold' : 'text-gastro-muted'}`}>
                              +{formatPreis(Number(extra.aufpreis))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer: Menge + In den Warenkorb ──────────────────────────── */}
        <div className="border-t border-gastro-border px-5 pt-3 pb-5 shrink-0">
          <div className="flex items-center gap-4">
            {/* Menge-Steuerung */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setMenge((m) => Math.max(1, m - 1))}
                className="w-9 h-9 rounded-full bg-gastro-border/50 text-gastro-text text-lg font-medium
                           flex items-center justify-center transition-all hover:bg-gastro-border active:scale-90"
              >
                −
              </button>
              <span className="w-8 text-center text-lg font-bold text-gastro-text tabular-nums">
                {menge}
              </span>
              <button
                onClick={() => setMenge((m) => m + 1)}
                className="w-9 h-9 rounded-full bg-gastro-primary text-gastro-on-primary text-lg font-medium
                           flex items-center justify-center transition-all hover:opacity-90 active:scale-90"
              >
                +
              </button>
            </div>

            {/* Hinzufügen-Button */}
            <button
              onClick={hinzufuegen}
              disabled={!kannHinzufuegen}
              className={`
                flex-1 py-3.5 rounded-xl font-semibold text-sm
                transition-all duration-200 shadow-lg
                ${kannHinzufuegen
                  ? 'bg-gastro-primary text-gastro-on-primary shadow-gastro-primary/25 hover:opacity-90 active:scale-[0.98]'
                  : 'bg-gastro-border/50 text-gastro-muted cursor-not-allowed shadow-none'
                }
              `}
            >
              {kannHinzufuegen
                ? `In den Warenkorb · ${formatPreis(gesamtpreis)}`
                : 'Bitte Pflichtfelder auswählen'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
