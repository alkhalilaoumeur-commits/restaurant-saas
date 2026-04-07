import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorie: KategorieMitAnzahl;
  index: number;
  onClick: () => void;
}

// ─── Akzent-Farben ──────────────────────────────────────────────────────────
// Jede Kategorie bekommt einen dezenten Farbakzent am linken Rand.
// Gold-Töne passend zum Eleganz-Theme.
const AKZENT_FARBEN = [
  '#C9B97A', // Champagner-Gold
  '#86754D', // Gedämpftes Gold
  '#A89060', // Warmes Gold
  '#B8A468', // Helles Gold
  '#7A6840', // Dunkles Gold
  '#D4C48A', // Blasses Gold
];

// ─── Food-Icons ─────────────────────────────────────────────────────────────
const KATEGORIE_ICONS: Record<string, string> = {
  vorspeisen: '🥗', antipasti: '🥗', hauptgerichte: '🍽️',
  pasta: '🍝', pizza: '🍕', desserts: '🍰', nachtisch: '🍰',
  'getränke': '🥤', drinks: '🍹', salate: '🥬', suppen: '🍲',
  grill: '🔥', sushi: '🍣', burger: '🍔', 'frühstück': '☕',
  fisch: '🐟', fleisch: '🥩', vegan: '🌱', beilagen: '🥔',
};

function getIcon(name: string): string {
  return KATEGORIE_ICONS[name.toLowerCase()] || '🍴';
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Horizontaler Balken für die Listen-Ansicht (Elegant Dunkel Layout):
//   - Volle Breite, dunkler Hintergrund (gastro-surface)
//   - Links: farbiger Akzent-Streifen + Food-Icon
//   - Mitte: Kategoriename + "X Gerichte"
//   - Rechts: Chevron-Pfeil
//   - Hover: leichter Helligkeitseffekt
export default function KategorieZeile({ kategorie, index, onClick }: Props) {
  const akzent = AKZENT_FARBEN[index % AKZENT_FARBEN.length];
  const icon = getIcon(kategorie.name);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-gastro-surface rounded-theme overflow-hidden
                 border border-gastro-border/50 transition-all duration-200
                 hover:border-gastro-primary/40 hover:bg-gastro-border/20
                 focus:outline-none focus:ring-2 focus:ring-gastro-primary/50
                 group text-left"
    >
      {/* Farbiger Akzent-Streifen links */}
      <div
        className="w-1.5 self-stretch shrink-0 rounded-l-theme"
        style={{ backgroundColor: akzent }}
      />

      {/* Bild oder Emoji-Icon */}
      {kategorie.bild_url ? (
        <img
          src={kategorie.bild_url}
          alt={kategorie.name}
          loading="lazy"
          className="w-12 h-12 rounded-xl object-cover shrink-0 my-3"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gastro-border/30 flex items-center justify-center text-2xl shrink-0 my-3">
          {icon}
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0 py-4 pr-2">
        <h3 className="font-semibold text-gastro-text font-theme-heading text-base leading-tight truncate">
          {kategorie.name}
        </h3>
        <p className="text-sm text-gastro-muted mt-0.5">
          {kategorie.anzahl_gerichte} {kategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
        </p>
      </div>

      {/* Chevron */}
      <div className="pr-4 text-gastro-muted group-hover:text-gastro-primary transition-colors shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}
