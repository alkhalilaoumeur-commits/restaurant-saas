import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Food-Icons ─────────────────────────────────────────────────────────────
// Emoji-Fallback wenn kein Bild vorhanden ist
const KATEGORIE_ICONS: Record<string, string> = {
  vorspeisen: '🥗', antipasti: '🥗', hauptgerichte: '🍽️',
  pasta: '🍝', pizza: '🍕', desserts: '🍰', nachtisch: '🍰',
  'getränke': '🥤', drinks: '🍹', salate: '🥬', suppen: '🍲',
  grill: '🔥', sushi: '🍣', burger: '🍔', 'frühstück': '☕',
  fisch: '🐟', fleisch: '🥩', vegan: '🌱', beilagen: '🥔',
};

function getIcon(kategorieName?: string): string {
  if (!kategorieName) return '🍴';
  return KATEGORIE_ICONS[kategorieName.toLowerCase()] || '🍴';
}

// ─── Allergene → Tags ───────────────────────────────────────────────────────
// Zerlegt den Allergene-String in einzelne Tags mit passenden Farben
interface Tag { label: string; klasse: string; }

function allergeneTags(allergene: string | null): Tag[] {
  if (!allergene) return [];
  return allergene.split(',').map((a) => {
    const name = a.trim().toLowerCase();
    if (name.includes('vegetarisch') || name.includes('vegan'))
      return { label: a.trim(), klasse: 'bg-green-500/12 text-green-400' };
    if (name.includes('scharf') || name.includes('chili'))
      return { label: a.trim(), klasse: 'bg-red-500/12 text-red-400' };
    if (name.includes('fisch') || name.includes('meer') || name.includes('krebs'))
      return { label: a.trim(), klasse: 'bg-orange-500/12 text-orange-400' };
    return { label: a.trim(), klasse: 'bg-gastro-primary/12 text-gastro-primary' };
  });
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Gericht-Karte im Osteria-Stil:
//   - Links: Bild (52x52) oder Emoji-Icon auf dunklem Feld
//   - Mitte: Name (Serif), Beschreibung (1 Zeile), farbige Tags
//   - Rechts: Preis (Gold, fett) + Mengen-Steuerung
//   - Gold-Akzent-Leiste am linken Rand wenn im Warenkorb
export default function GerichtKarteOsteria({ gericht, menge, onAendern }: Props) {
  const istAusgewaehlt = menge > 0;
  const tags = allergeneTags(gericht.allergene);
  const icon = getIcon(gericht.kategorie_name);

  return (
    <div
      className={`
        relative flex items-center gap-3.5 bg-gastro-surface rounded-theme overflow-hidden
        border transition-all duration-150 p-4 cursor-pointer
        ${istAusgewaehlt
          ? 'border-gastro-primary/35'
          : 'border-gastro-border/50 hover:border-gastro-primary/25 hover:bg-gastro-border/20'
        }
      `}
    >
      {/* ── Gold-Akzent links (nur wenn im Warenkorb) ─────────────────── */}
      {istAusgewaehlt && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gastro-primary" />
      )}

      {/* ── Bild oder Emoji-Icon ──────────────────────────────────────── */}
      <div className="w-[52px] h-[52px] rounded-[10px] bg-gastro-border/30 border border-gastro-border/50 flex items-center justify-center shrink-0 overflow-hidden">
        {gericht.bild_url ? (
          <img
            src={gericht.bild_url}
            alt={gericht.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[26px] select-none">{icon}</span>
        )}
      </div>

      {/* ── Text: Name + Beschreibung + Tags ──────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-normal text-gastro-text font-theme-heading leading-snug">
          {gericht.name}
        </h3>
        {gericht.beschreibung && (
          <p className="text-xs text-gastro-muted mt-0.5 truncate leading-relaxed">
            {gericht.beschreibung}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tag.klasse}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Preis + Mengen-Steuerung ──────────────────────────────────── */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">
        <span className="text-base font-bold text-gastro-primary tracking-tight">
          {formatPreis(gericht.preis)}
        </span>

        {istAusgewaehlt ? (
          <div className="flex items-center gap-0">
            <button
              onClick={(e) => { e.stopPropagation(); onAendern(-1); }}
              className="w-7 h-7 rounded-[7px] border border-gastro-border bg-gastro-border/30 text-gastro-text
                         text-sm flex items-center justify-center transition-all hover:bg-gastro-primary hover:text-gastro-on-primary hover:border-gastro-primary"
            >
              −
            </button>
            <span className="w-7 text-center text-sm font-bold text-gastro-text tabular-nums">
              {menge}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onAendern(1); }}
              className="w-7 h-7 rounded-[7px] border border-gastro-border bg-gastro-border/30 text-gastro-text
                         text-sm flex items-center justify-center transition-all hover:bg-gastro-primary hover:text-gastro-on-primary hover:border-gastro-primary"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onAendern(1); }}
            className="w-7 h-7 rounded-[7px] border border-gastro-primary/40 bg-gastro-primary/10 text-gastro-primary
                       text-sm font-medium flex items-center justify-center transition-all
                       hover:bg-gastro-primary hover:text-gastro-on-primary hover:border-gastro-primary"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
