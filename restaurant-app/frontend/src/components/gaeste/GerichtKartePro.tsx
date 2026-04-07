import { useState } from 'react';
import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Allergene → Label + Emoji ──────────────────────────────────────────────
// Die DB speichert Allergene als kommaseparierten String (z.B. "Gluten, Laktose")
// Hier mappen wir bekannte Allergene auf kurze Badges mit Emoji.
const ALLERGEN_EMOJI: Record<string, string> = {
  gluten: '🌾',
  laktose: '🥛',
  nüsse: '🥜',
  ei: '🥚',
  fisch: '🐟',
  soja: '🫘',
  sellerie: '🥬',
  senf: '🟡',
  sesam: '⚪',
  vegan: '🌱',
  vegetarisch: '🥬',
};

function allergenBadges(allergene: string | null): { label: string; emoji: string }[] {
  if (!allergene) return [];
  return allergene
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .map((a) => ({
      label: a.charAt(0).toUpperCase() + a.slice(1),
      emoji: ALLERGEN_EMOJI[a] || '⚠️',
    }));
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
// Professionelle Gerichtkarte im "Food-Forward"-Stil:
//   - Großes Bild oben (aspect-ratio 4:3)
//   - Name + Preis prominent darunter
//   - Beschreibung + Allergene-Badges
//   - Mengen-Steuerung unten rechts
//   - Ring-Highlight wenn ausgewählt (menge > 0)
//   - Badge mit Anzahl oben rechts über dem Bild
export default function GerichtKartePro({ gericht, menge, onAendern }: Props) {
  const [bildGeladen, setBildGeladen] = useState(false);
  const istAusgewaehlt = menge > 0;
  const badges = allergenBadges(gericht.allergene);

  return (
    <div
      className={`
        bg-gastro-surface rounded-theme overflow-hidden
        shadow-theme-card border-theme-card border-gastro-border
        transition-all duration-300 relative group
        ${istAusgewaehlt
          ? 'ring-2 ring-gastro-primary shadow-lg scale-[1.02]'
          : 'hover:shadow-lg hover:-translate-y-0.5'
        }
      `}
    >
      {/* ── Bild-Bereich ─────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-gastro-border/30 overflow-hidden">
        {gericht.bild_url ? (
          <>
            {/* Skeleton-Shimmer solange Bild lädt */}
            {!bildGeladen && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gastro-border/30 via-gastro-border/60 to-gastro-border/30 bg-[length:200%_100%]" />
            )}
            <img
              src={gericht.bild_url}
              alt={gericht.name}
              loading="lazy"
              onLoad={() => setBildGeladen(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                bildGeladen ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          // Platzhalter wenn kein Bild vorhanden
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gastro-muted/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3M18 22v-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Mengen-Badge oben rechts — zeigt an wie viele im Warenkorb */}
        {istAusgewaehlt && (
          <div className="absolute top-2.5 right-2.5 bg-gastro-primary text-gastro-on-primary w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-[scale-in_0.2s_ease-out]">
            {menge}
          </div>
        )}

        {/* Leichter Gradient unten für bessere Lesbarkeit des Preises */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Preis-Badge unten links über dem Bild */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-gastro-surface/95 backdrop-blur-sm text-gastro-primary font-bold text-sm px-2.5 py-1 rounded-full shadow-md">
            {formatPreis(gericht.preis)}
          </span>
        </div>
      </div>

      {/* ── Inhalt ───────────────────────────────────────────────────── */}
      <div className="p-3.5">
        {/* Name */}
        <h3 className="font-semibold text-gastro-text font-theme-heading text-[15px] leading-snug line-clamp-1">
          {gericht.name}
        </h3>

        {/* Beschreibung */}
        {gericht.beschreibung && (
          <p className="text-xs text-gastro-muted mt-1 line-clamp-2 leading-relaxed">
            {gericht.beschreibung}
          </p>
        )}

        {/* Allergene-Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-0.5 text-[10px] text-gastro-muted bg-gastro-border/40 rounded-full px-1.5 py-0.5"
              >
                <span>{b.emoji}</span>
                <span>{b.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* ── Mengen-Steuerung ───────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-2 mt-3">
          {istAusgewaehlt ? (
            // Wenn ausgewählt: volle Steuerung mit −/Zahl/+
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
            // Wenn nicht ausgewählt: nur +-Button (cleaner)
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
    </div>
  );
}
