import { Gericht } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  gericht: Gericht;
  index: number;
  menge: number;
  onAendern: (delta: number) => void;
}

// ─── Tags ───────────────────────────────────────────────────────────────────
// Allergene-String → farbige Tag-Badges (Editorial-Farbschema)
interface Tag { label: string; klasse: string; }

function allergeneTags(allergene: string | null): Tag[] {
  if (!allergene) return [];
  return allergene.split(',').map((a) => {
    const name = a.trim().toLowerCase();
    if (name.includes('vegetarisch') || name.includes('vegan'))
      return { label: a.trim(), klasse: 'bg-green-500/10 text-green-700' };
    if (name.includes('scharf') || name.includes('chili'))
      return { label: a.trim(), klasse: 'bg-gastro-primary/10 text-gastro-primary' };
    if (name.includes('fisch') || name.includes('meer') || name.includes('krebs'))
      return { label: a.trim(), klasse: 'bg-gastro-primary/10 text-gastro-secondary' };
    return { label: a.trim(), klasse: 'bg-gastro-text/[0.06] text-gastro-muted' };
  });
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Gericht-Karte im Editorial/Magazin-Stil:
//   - Grid-Layout: [Nummer] [Bild?] [Body] [Controls]
//   - Nummer: kursive Serif in Primärfarbe (01, 02, ...)
//   - Bild: 60x60 Thumbnail wenn vorhanden
//   - Body: Name (Serif bold), Beschreibung, Preis (Terracotta), Tags
//   - Controls: +/- Buttons oder einzelner + Button
//   - Im Warenkorb: Terracotta-Akzent links (3px inset)
//   - Weiße Karte mit Border, 12px Radius
export default function GerichtKarteEditorial({ gericht, index, menge, onAendern }: Props) {
  const istAusgewaehlt = menge > 0;
  const num = String(index + 1).padStart(2, '0');
  const tags = allergeneTags(gericht.allergene);

  return (
    <div
      className={`
        relative flex items-center gap-0 bg-gastro-surface rounded-theme overflow-hidden
        border transition-all duration-200 p-4 cursor-default
        ${istAusgewaehlt
          ? 'border-gastro-primary shadow-[inset_3px_0_0_rgb(var(--t-primary))]'
          : 'border-gastro-border/50 hover:border-gastro-border'
        }
      `}
    >
      {/* ── Nummer ──────────────────────────────────────────────────── */}
      <span className="w-7 shrink-0 text-[13px] italic text-gastro-primary font-theme-heading self-start pt-0.5">
        {num}
      </span>

      {/* ── Bild (optional) ─────────────────────────────────────────── */}
      {gericht.bild_url && (
        <div className="w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0 mr-3.5 border border-gastro-border/50">
          <img
            src={gericht.bild_url}
            alt={gericht.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── Body: Name + Beschreibung + Preis + Tags ────────────────── */}
      <div className="flex-1 min-w-0 pl-1">
        <h3 className="text-[17px] font-bold text-gastro-text font-theme-heading tracking-tight leading-tight">
          {gericht.name}
        </h3>
        {gericht.beschreibung && (
          <p className="text-xs text-gastro-muted mt-1 line-clamp-2 leading-relaxed font-light">
            {gericht.beschreibung}
          </p>
        )}
        <p className="text-base font-bold text-gastro-primary font-theme-heading tracking-tight mt-2">
          {formatPreis(gericht.preis)}
        </p>
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${tag.klasse}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Mengen-Steuerung ─────────────────────────────────────────── */}
      <div className="flex items-center shrink-0 ml-3">
        {istAusgewaehlt ? (
          <div className="flex items-center bg-gastro rounded-full border border-gastro-border overflow-hidden">
            <button
              onClick={(e) => { e.stopPropagation(); onAendern(-1); }}
              className="w-[30px] h-[30px] flex items-center justify-center text-gastro-text text-base font-medium
                         transition-colors hover:bg-gastro-primary/10 hover:text-gastro-primary"
            >
              −
            </button>
            <span className="min-w-[24px] text-center text-sm font-bold text-gastro-text font-theme-heading">
              {menge}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onAendern(1); }}
              className="w-[30px] h-[30px] flex items-center justify-center text-gastro-text text-base font-medium
                         transition-colors hover:bg-gastro-primary/10 hover:text-gastro-primary"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onAendern(1); }}
            className="w-[34px] h-[34px] rounded-full bg-gastro-text border-none
                       text-gastro text-xl font-light leading-none
                       flex items-center justify-center transition-colors
                       hover:bg-gastro-primary"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
