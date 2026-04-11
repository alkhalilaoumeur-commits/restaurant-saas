import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Dietary Icons ──────────────────────────────────────────────────────────
interface DietaryIcon {
  kuerzel: string;
  label: string;
  farbe: string;
}

function dietaryIcons(allergene: string | null): DietaryIcon[] {
  if (!allergene) return [];
  const icons: DietaryIcon[] = [];
  const lower = allergene.toLowerCase();

  if (lower.includes('vegan'))
    icons.push({ kuerzel: 'VG', label: 'Vegan', farbe: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' });
  else if (lower.includes('vegetarisch'))
    icons.push({ kuerzel: 'V', label: 'Vegetarisch', farbe: 'text-green-400 bg-green-500/15 border-green-500/20' });

  if (lower.includes('glutenfrei'))
    icons.push({ kuerzel: 'GF', label: 'Glutenfrei', farbe: 'text-amber-400 bg-amber-500/15 border-amber-500/20' });

  if (lower.includes('laktosefrei'))
    icons.push({ kuerzel: 'LF', label: 'Laktosefrei', farbe: 'text-blue-400 bg-blue-500/15 border-blue-500/20' });

  if (lower.includes('scharf') || lower.includes('chili'))
    icons.push({ kuerzel: '🌶', label: 'Scharf', farbe: 'text-red-400 bg-red-500/15 border-red-500/20' });

  if (lower.includes('nüsse') || lower.includes('nuss'))
    icons.push({ kuerzel: '🥜', label: 'Enthält Nüsse', farbe: 'text-amber-400 bg-amber-500/15 border-amber-500/20' });

  return icons;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Premium Gericht-Karte für das Showcase-Layout:
//
//   MIT BILD:
//     ┌──────────────────────────────┐
//     │  Bild (16:9, full-width)     │
//     │  mit Gradient-Overlay        │
//     ├──────────────────────────────┤
//     │  Name ................. Preis │
//     │  Beschreibung (kursiv)       │
//     │  [VG] [GF]        [−] 2 [+] │
//     └──────────────────────────────┘
//
//   OHNE BILD:
//     ┌──────────────────────────────┐
//     │ ·  Name .............. Preis │
//     │    Beschreibung (kursiv)     │
//     │    [VG] [GF]      [−] 2 [+] │
//     └──────────────────────────────┘
//
// Design-Prinzipien:
//   - Glasmorphismus (backdrop-blur + halbtransparente Oberfläche)
//   - Leuchtender Primär-Akzent links bei Auswahl
//   - Premium-Mengensteuerung mit Glow-Effekt
//   - Kein eigener 3D-Effekt — wird von Tilt3DKarte umschlossen
//
export default function GerichtKarteShowcase({ gericht, menge, onAendern }: Props) {
  const istAusgewaehlt = menge > 0;
  const icons = dietaryIcons(gericht.allergene);
  const hatBild = !!gericht.bild_url;

  return (
    <div
      className={`
        relative overflow-hidden rounded-theme
        bg-gastro-surface/60 backdrop-blur-md
        border transition-all duration-300
        ${istAusgewaehlt
          ? 'border-gastro-primary/40 shadow-[0_0_20px_-5px] shadow-gastro-primary/20'
          : 'border-gastro-border/30 hover:border-gastro-border/50'
        }
      `}
    >
      {/* Primär-Akzent links bei Auswahl */}
      {istAusgewaehlt && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gastro-primary via-gastro-primary to-gastro-secondary" />
      )}

      {/* Bild (16:9) */}
      {hatBild && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={gericht.bild_url!}
            alt={gericht.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gastro-surface/90 via-transparent to-transparent" />
          {/* Preis-Badge über dem Bild */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-gastro-surface/80 backdrop-blur-sm text-gastro-primary font-bold text-sm
                             px-3 py-1 rounded-full border border-gastro-primary/20 shadow-lg">
              {formatPreis(gericht.preis)}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div className={`flex items-start gap-3 ${hatBild ? 'px-4 pb-4 pt-2' : 'p-4'}`}>
        {/* Decorative Dot (nur ohne Bild) */}
        {!hatBild && (
          <span className="mt-1.5 w-2 h-2 rounded-full bg-gastro-primary/40 shrink-0" />
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Name + Preis */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-gastro-text font-theme-heading tracking-tight leading-snug">
              {gericht.name}
            </h3>
            {!hatBild && (
              <span className="text-sm text-gastro-primary font-semibold tabular-nums shrink-0">
                {formatPreis(gericht.preis)}
              </span>
            )}
          </div>

          {/* Beschreibung */}
          {gericht.beschreibung && (
            <p className="text-[13px] text-gastro-muted mt-1 italic leading-relaxed line-clamp-2">
              {gericht.beschreibung}
            </p>
          )}

          {/* Dietary Icons + Mengensteuerung */}
          <div className="flex items-center justify-between mt-3">
            {/* Icons */}
            <div className="flex items-center gap-1.5">
              {icons.map((icon, i) => (
                <span
                  key={i}
                  title={icon.label}
                  className={`inline-flex items-center justify-center rounded-full text-[9px] font-bold
                              leading-none select-none border
                              ${icon.kuerzel.length <= 2 ? 'w-[22px] h-[22px]' : 'px-1.5 h-[22px]'}
                              ${icon.farbe}`}
                >
                  {icon.kuerzel}
                </span>
              ))}
            </div>

            {/* Mengensteuerung */}
            <div className="shrink-0">
              {istAusgewaehlt ? (
                <div className="flex items-center rounded-full border border-gastro-border/50
                                bg-gastro/80 backdrop-blur-sm overflow-hidden">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAendern(-1); }}
                    className="w-8 h-8 flex items-center justify-center text-gastro-text text-sm
                               transition-colors hover:bg-gastro-primary/15 hover:text-gastro-primary"
                  >
                    −
                  </button>
                  <span className="min-w-[22px] text-center text-sm font-bold text-gastro-primary font-theme-heading tabular-nums">
                    {menge}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAendern(1); }}
                    className="w-8 h-8 flex items-center justify-center text-gastro-text text-sm
                               transition-colors hover:bg-gastro-primary/15 hover:text-gastro-primary"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onAendern(1); }}
                  className="w-9 h-9 rounded-full border border-gastro-primary/30
                             bg-gastro-primary/10 text-gastro-primary text-lg leading-none
                             flex items-center justify-center transition-all duration-200
                             hover:bg-gastro-primary hover:text-gastro-on-primary hover:border-gastro-primary
                             hover:shadow-[0_0_15px_-3px] hover:shadow-gastro-primary/40
                             active:scale-95"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
