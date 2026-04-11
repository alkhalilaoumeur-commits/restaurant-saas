import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorie: KategorieMitAnzahl;
  index: number;
  onClick: () => void;
}

// ─── Premium Gradient-Fallbacks ─────────────────────────────────────────────
// Wenn kein Kategorie-Bild gesetzt ist, bekommt jede Kachel einen eigenen
// Premium-Gradient. Dunkle, tiefe Farben die zum Showcase-Theme passen.
const GRADIENTS = [
  'from-indigo-900/60 via-purple-900/40 to-slate-900/60',
  'from-cyan-900/60 via-blue-900/40 to-slate-900/60',
  'from-violet-900/60 via-fuchsia-900/40 to-slate-900/60',
  'from-emerald-900/60 via-teal-900/40 to-slate-900/60',
  'from-rose-900/60 via-pink-900/40 to-slate-900/60',
  'from-amber-900/60 via-orange-900/40 to-slate-900/60',
];

// ─── Food-Icons ─────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  vorspeisen: '🥗', antipasti: '🥗', hauptgerichte: '🍽️',
  pasta: '🍝', pizza: '🍕', desserts: '🍰', nachtisch: '🍰',
  'getränke': '🥤', drinks: '🍹', salate: '🥬', suppen: '🍲',
  grill: '🔥', sushi: '🍣', burger: '🍔', 'frühstück': '☕',
  fisch: '🐟', fleisch: '🥩', vegan: '🌱', beilagen: '🥔',
};

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Premium Kategorie-Karte für das Showcase-Layout:
//   - Glasmorphismus-Hintergrund (backdrop-blur + halbtransparent)
//   - 1px Border mit subtiler Transparenz (wird durch Tilt3DKarte's Border-Glow beleuchtet)
//   - Kategorie-Bild als Vollbild oder Gradient-Fallback mit großem Emoji
//   - Name + Gerichte-Count unten über dunklem Gradient
//   - Aspect Ratio 4:5 (hochkant, wie App-Store-Karten)
//
// KEIN eigener 3D-Effekt — wird von Tilt3DKarte umschlossen (Separation of Concerns)
//
export default function KategorieKarteShowcase({ kategorie, index, onClick }: Props) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const icon = ICONS[kategorie.name.toLowerCase()] || '🍴';

  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/5] rounded-theme overflow-hidden group cursor-pointer w-full text-left
                 focus:outline-none focus:ring-2 focus:ring-gastro-primary/50 focus:ring-offset-2 focus:ring-offset-gastro"
    >
      {/* Hintergrund: Bild oder Gradient */}
      {kategorie.bild_url ? (
        <img
          src={kategorie.bild_url}
          alt={kategorie.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-15 select-none pointer-events-none
                           transition-transform duration-700 group-hover:scale-125">
            {icon}
          </span>
        </div>
      )}

      {/* Glass-Overlay: subtile glasige Schicht über dem gesamten Bild */}
      <div className="absolute inset-0 bg-gastro-surface/10 backdrop-blur-[1px]" />

      {/* Gradient von unten: Text-Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Border: 1px inset — wird durch Tilt3DKarte's glowColor beleuchtet */}
      <div className="absolute inset-0 rounded-theme border border-gastro-border/30
                       transition-colors duration-300 group-hover:border-gastro-primary/30" />

      {/* Inhalt unten */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg font-theme-heading leading-tight drop-shadow-lg tracking-tight">
          {kategorie.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-white/50 text-sm">
            {kategorie.anzahl_gerichte} {kategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
          </span>
        </div>
      </div>

      {/* Pfeil oben rechts — erscheint bei Hover */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-all duration-300 group-hover:translate-x-0.5">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}
