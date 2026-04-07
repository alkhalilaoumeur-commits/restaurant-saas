import { useState } from 'react';
import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Horizontale Zeile für die Listen-Ansicht (Elegant Dunkel Layout):
//   - Volle Breite, dunkler Hintergrund
//   - Links: kleines quadratisches Bild (oder Platzhalter-Icon)
//   - Mitte: Name, Beschreibung (1 Zeile), Preis
//   - Rechts: Mengen-Steuerung (+/−)
//   - Ring-Highlight wenn ausgewählt (menge > 0)
export default function GerichtZeile({ gericht, menge, onAendern }: Props) {
  const [bildGeladen, setBildGeladen] = useState(false);
  const istAusgewaehlt = menge > 0;

  return (
    <div
      className={`
        flex items-center gap-3 bg-gastro-surface rounded-theme overflow-hidden
        border transition-all duration-200 p-3
        ${istAusgewaehlt
          ? 'border-gastro-primary/60 ring-1 ring-gastro-primary/30 bg-gastro-primary/5'
          : 'border-gastro-border/50 hover:border-gastro-border'
        }
      `}
    >
      {/* ── Bild (quadratisch, klein) ───────────────────────────────── */}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gastro-border/30 relative">
        {gericht.bild_url ? (
          <>
            {!bildGeladen && (
              <div className="absolute inset-0 animate-pulse bg-gastro-border/50" />
            )}
            <img
              src={gericht.bild_url}
              alt={gericht.name}
              loading="lazy"
              onLoad={() => setBildGeladen(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                bildGeladen ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-7 h-7 text-gastro-muted/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3M18 22v-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Text: Name + Beschreibung + Preis ───────────────────────── */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gastro-text font-theme-heading text-[15px] leading-snug truncate">
          {gericht.name}
        </h3>
        {gericht.beschreibung && (
          <p className="text-xs text-gastro-muted mt-0.5 line-clamp-1 leading-relaxed">
            {gericht.beschreibung}
          </p>
        )}
        <p className="text-sm font-bold text-gastro-primary mt-1">
          {formatPreis(gericht.preis)}
        </p>
      </div>

      {/* ── Mengen-Steuerung ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        {istAusgewaehlt ? (
          <>
            <button
              onClick={() => onAendern(-1)}
              className="w-8 h-8 rounded-full bg-gastro-border/50 text-gastro-muted text-base font-medium
                         transition-all duration-200 hover:bg-gastro-border active:scale-90
                         flex items-center justify-center"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-bold text-gastro-text tabular-nums">
              {menge}
            </span>
            <button
              onClick={() => onAendern(1)}
              className="w-8 h-8 rounded-full bg-gastro-primary text-gastro-on-primary text-base font-medium
                         transition-all duration-200 hover:opacity-90 active:scale-90 shadow-sm
                         flex items-center justify-center"
            >
              +
            </button>
          </>
        ) : (
          <button
            onClick={() => onAendern(1)}
            className="w-9 h-9 rounded-full bg-gastro-primary text-gastro-on-primary text-lg font-medium
                       transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95
                       shadow-md shadow-gastro-primary/25 flex items-center justify-center"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
