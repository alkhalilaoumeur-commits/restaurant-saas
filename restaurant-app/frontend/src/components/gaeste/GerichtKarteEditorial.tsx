import { Gericht } from '../../types';
import { formatPreisEditorial } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  index: number;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Dietary Icons ──────────────────────────────────────────────────────────
//
// Statt farbiger Text-Badges → kleine runde Icons im Fine-Dining-Stil.
// Jedes Icon ist ein 20x20 Kreis mit Buchstabe/Symbol + Tooltip.
// So machen es Uber Eats, Wolt und Premium-Restaurants.
interface DietaryIcon {
  kuerzel: string;
  label: string;
  farbe: string;    // Text + Border
  bg: string;       // Hintergrund
}

function dietaryIcons(allergene: string | null): DietaryIcon[] {
  if (!allergene) return [];
  const icons: DietaryIcon[] = [];
  const lower = allergene.toLowerCase();

  if (lower.includes('vegan'))
    icons.push({ kuerzel: 'VG', label: 'Vegan', farbe: 'text-emerald-700', bg: 'bg-emerald-50' });
  else if (lower.includes('vegetarisch'))
    icons.push({ kuerzel: 'V', label: 'Vegetarisch', farbe: 'text-green-700', bg: 'bg-green-50' });

  if (lower.includes('glutenfrei'))
    icons.push({ kuerzel: 'GF', label: 'Glutenfrei', farbe: 'text-amber-800', bg: 'bg-amber-50' });

  if (lower.includes('laktosefrei'))
    icons.push({ kuerzel: 'LF', label: 'Laktosefrei', farbe: 'text-blue-700', bg: 'bg-blue-50' });

  // Schärfe-Level: 1-3 Chilies
  const scharfMatch = lower.match(/scharf|chili|spicy/);
  if (scharfMatch) {
    const count = (lower.match(/scharf|chili/g) || []).length;
    icons.push({
      kuerzel: '🌶'.repeat(Math.min(count, 3)) || '🌶',
      label: count >= 3 ? 'Sehr scharf' : count >= 2 ? 'Mittel scharf' : 'Leicht scharf',
      farbe: 'text-red-600',
      bg: 'bg-red-50',
    });
  }

  if (lower.includes('fisch') || lower.includes('meer') || lower.includes('krebs'))
    icons.push({ kuerzel: '🐟', label: 'Enthält Fisch/Meeresfrüchte', farbe: 'text-blue-600', bg: 'bg-blue-50' });

  if (lower.includes('nüsse') || lower.includes('nuss'))
    icons.push({ kuerzel: '🥜', label: 'Enthält Nüsse', farbe: 'text-amber-700', bg: 'bg-amber-50' });

  return icons;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Komplett überarbeitete Gericht-Karte im Editorial/Magazin-Stil:
//
// Verbesserungen basierend auf Marktrecherche:
//   1. Preis rechts in der Name-Zeile (Fine-Dining-Stil, ohne €)
//   2. Beschreibung kursiv (editorial Standard)
//   3. Dietary Icons statt Text-Tags (runde Mini-Badges)
//   4. Drop-Cap für Gerichte ohne Bild (visueller Anker)
//   5. Bessere Bild-Ratio (aspect-ratio 4:3 statt fixer Höhe)
//   6. Dezenter Terracotta-Akzent links bei Auswahl
//   7. Feinere Typografie-Hierarchie
export default function GerichtKarteEditorial({ gericht, menge, onAendern }: Props) {
  const istAusgewaehlt = menge > 0;
  const icons = dietaryIcons(gericht.allergene);
  const hatBild = !!gericht.bild_url;

  return (
    <div
      className={`
        relative bg-gastro-surface overflow-hidden
        border transition-all duration-200
        ${hatBild ? 'rounded-theme' : ''}
        ${istAusgewaehlt
          ? 'border-gastro-primary/30 ring-1 ring-gastro-primary/10'
          : 'border-gastro-border/40 hover:border-gastro-border/70'
        }
      `}
    >
      {/* ── Terracotta-Akzent links (ausgewählt) ──────────────────── */}
      {istAusgewaehlt && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gastro-primary" />
      )}

      {/* ── Bild (aspect-ratio 4:3, full-width) ──────────────────── */}
      {hatBild && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={gericht.bild_url!}
            alt={gericht.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Dezenter Gradient unten für Übergang zum Text */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gastro-surface to-transparent" />
        </div>
      )}

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className={`flex items-start gap-3 ${hatBild ? 'px-4 pb-4 pt-2' : 'p-4'}`}>

        {/* Drop-Cap: Dekorativer Anfangsbuchstabe wenn kein Bild */}
        {!hatBild && (
          <span className="text-[32px] leading-none font-theme-heading text-gastro-primary/15 select-none shrink-0 -mt-0.5">
            {gericht.name.charAt(0)}
          </span>
        )}

        {/* Text-Spalte */}
        <div className="flex-1 min-w-0">
          {/* Zeile 1: Name .......... Preis (Fine-Dining-Stil) */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold text-gastro-text font-theme-heading tracking-tight leading-snug">
              {gericht.name}
            </h3>
            <span className="text-[14px] text-gastro-muted/80 font-theme-heading tabular-nums shrink-0 tracking-wide">
              {formatPreisEditorial(gericht.preis)}
            </span>
          </div>

          {/* Zeile 2: Beschreibung (kursiv — editorial Standard) */}
          {gericht.beschreibung && (
            <p className="text-[13px] text-gastro-muted/70 mt-1 italic leading-relaxed line-clamp-3 font-theme-body">
              {gericht.beschreibung}
            </p>
          )}

          {/* Zeile 3: Dietary Icons (runde Mini-Badges) */}
          {icons.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {icons.map((icon, i) => (
                <span
                  key={i}
                  title={icon.label}
                  className={`
                    inline-flex items-center justify-center rounded-full
                    text-[9px] font-bold leading-none select-none
                    ${icon.kuerzel.length <= 2
                      ? `w-[22px] h-[22px] ${icon.bg} ${icon.farbe} border border-current/10`
                      : `px-1.5 h-[22px] ${icon.bg} ${icon.farbe}`
                    }
                  `}
                >
                  {icon.kuerzel}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Controls ────────────────────────────────────────────── */}
        <div className="shrink-0 pt-0.5">
          {istAusgewaehlt ? (
            <div className="flex items-center rounded-full border border-gastro-border bg-gastro overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); onAendern(-1); }}
                className="w-8 h-8 flex items-center justify-center text-gastro-text text-sm font-medium
                           transition-colors hover:bg-gastro-primary/10 hover:text-gastro-primary"
              >
                −
              </button>
              <span className="min-w-[22px] text-center text-sm font-bold text-gastro-text font-theme-heading tabular-nums">
                {menge}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onAendern(1); }}
                className="w-8 h-8 flex items-center justify-center text-gastro-text text-sm font-medium
                           transition-colors hover:bg-gastro-primary/10 hover:text-gastro-primary"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAendern(1); }}
              className="w-9 h-9 rounded-full border border-gastro-primary/30
                         text-gastro-primary text-lg leading-none
                         flex items-center justify-center transition-all duration-200
                         hover:bg-gastro-primary hover:border-gastro-primary hover:text-gastro-on-primary
                         active:scale-95"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
