import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorie: KategorieMitAnzahl;
  index: number;
  onClick: () => void;
}

// ─── Gradient-Fallbacks ─────────────────────────────────────────────────────
// Wenn keine bild_url gesetzt ist, bekommt jede Kachel einen eigenen
// Farbverlauf basierend auf ihrem Index. So sehen sie trotzdem unterschiedlich
// und appetitlich aus. Die Farben sind warm und food-inspiriert.
const FALLBACK_GRADIENTS = [
  'from-amber-500 via-orange-500 to-red-400',
  'from-rose-500 via-pink-500 to-fuchsia-400',
  'from-emerald-500 via-teal-500 to-cyan-400',
  'from-blue-500 via-indigo-500 to-violet-400',
  'from-orange-500 via-amber-500 to-yellow-400',
  'from-purple-500 via-violet-500 to-pink-400',
];

// ─── Food-Icons als SVG ─────────────────────────────────────────────────────
// Dezente Icons die im Hintergrund der Gradient-Kacheln angezeigt werden.
// Matcht bekannte Kategorienamen. Fallback = Besteck-Icon.
const KATEGORIE_ICONS: Record<string, string> = {
  vorspeisen: '🥗',
  antipasti: '🥗',
  hauptgerichte: '🍽️',
  pasta: '🍝',
  pizza: '🍕',
  desserts: '🍰',
  nachtisch: '🍰',
  'getränke': '🥤',
  drinks: '🍹',
  salate: '🥬',
  suppen: '🍲',
  grill: '🔥',
  sushi: '🍣',
  burger: '🍔',
  'frühstück': '☕',
  fisch: '🐟',
  fleisch: '🥩',
  vegan: '🌱',
  beilagen: '🥔',
};

function getIcon(name: string): string {
  const key = name.toLowerCase();
  return KATEGORIE_ICONS[key] || '🍴';
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Große Kachel im "Food-App"-Stil (Deliveroo / Uber Eats):
//   - Hintergrundbild (wenn vorhanden) ODER Gradient mit Food-Icon
//   - Dunkler Gradient von unten für Textlesbarkeit
//   - Kategoriename + "X Gerichte" Badge
//   - Hover: leichter Scale-Effekt + Schatten
//   - Aspect Ratio 4:5 (hochkant, wie App-Kacheln)
export default function KategorieKarte({ kategorie, index, onClick }: Props) {
  const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const icon = getIcon(kategorie.name);

  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/5] rounded-theme overflow-hidden group cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-gastro-primary focus:ring-offset-2"
    >
      {/* ── Hintergrund: Bild oder Gradient ──────────────────────────── */}
      {kategorie.bild_url ? (
        <img
          src={kategorie.bild_url}
          alt={kategorie.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}>
          {/* Großes dezentes Icon im Hintergrund */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-20 select-none pointer-events-none">
            {icon}
          </span>
        </div>
      )}

      {/* ── Dunkler Overlay-Gradient von unten ────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* ── Hover-Effekt: leichter heller Schimmer ─────────────────── */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

      {/* ── Inhalt unten ──────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg font-theme-heading leading-tight drop-shadow-lg">
          {kategorie.name}
        </h3>
        <p className="text-white/70 text-sm mt-1 drop-shadow">
          {kategorie.anzahl_gerichte} {kategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
        </p>
      </div>

      {/* ── Pfeil-Icon oben rechts (dezent) ───────────────────────────── */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}
