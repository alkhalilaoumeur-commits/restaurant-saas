import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorie: KategorieMitAnzahl;
  index: number;
  gesamt: number;
  onClick: () => void;
}

// ─── Food-Icons ─────────────────────────────────────────────────────────────
const KATEGORIE_ICONS: Record<string, string> = {
  vorspeisen: '🫒', antipasti: '🫒', hauptgerichte: '🍽️',
  pasta: '🍝', pizza: '🍕', desserts: '🍮', nachtisch: '🍮',
  'getränke': '🍷', drinks: '🍹', salate: '🥬', suppen: '🍲',
  grill: '🔥', sushi: '🍣', burger: '🍔', 'frühstück': '☕',
  fisch: '🐟', fleisch: '🥩', vegan: '🌱', beilagen: '🥦',
  contorni: '🥦', dolci: '🍮', bevande: '🍷', secondi: '🥩',
  primi: '🍝',
};

function getIcon(name: string): string {
  return KATEGORIE_ICONS[name.toLowerCase()] || '🍴';
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Kategorie-Zeile im Editorial/Magazin-Stil:
//   - Links: Nummer (01, 02) in kursiver Serif + Primärfarbe
//   - Optional: Kategorie-Bild als kleines Thumbnail
//   - Mitte: Name (groß, Serif, bold) + Untertitel (Anzahl Gerichte)
//   - Rechts: Emoji-Icon + Pfeil-Kreis
//   - Hover: Terracotta-Hintergrund gleitet von links rein, Pfeil wird farbig
//   - Trennlinie unten
export default function KategorieZeileEditorial({ kategorie, index, onClick }: Props) {
  const num = String(index + 1).padStart(2, '0');
  const icon = getIcon(kategorie.name);

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center py-3.5 border-b border-gastro-border/50 cursor-pointer overflow-hidden"
    >
      {/* Hover-Hintergrund: gleitet von links rein */}
      <div className="absolute inset-0 bg-gastro-primary/[0.06] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-r-xl" />

      <div className="relative flex items-center w-full gap-0 group-hover:pl-3 transition-all duration-300">
        {/* Nummer */}
        <span className="w-8 shrink-0 text-[13px] italic text-gastro-primary font-theme-heading">
          {num}
        </span>

        {/* Bild (wenn vorhanden) */}
        {kategorie.bild_url && (
          <div className="w-11 h-11 rounded-lg overflow-hidden mr-3 shrink-0 border border-gastro-border/50">
            <img
              src={kategorie.bild_url}
              alt={kategorie.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name + Untertitel */}
        <div className="flex-1 min-w-0">
          <div className="text-[24px] font-bold text-gastro-text font-theme-heading tracking-tight leading-none">
            {kategorie.name}
          </div>
          <div className="text-[11px] text-gastro-muted mt-1">
            {kategorie.anzahl_gerichte} {kategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
          </div>
        </div>

        {/* Emoji (nur wenn kein Bild) */}
        {!kategorie.bild_url && (
          <span className="text-[22px] w-9 text-center shrink-0">{icon}</span>
        )}

        {/* Pfeil-Kreis */}
        <div className="w-8 h-8 rounded-full border border-gastro-border flex items-center justify-center text-gastro-muted text-sm shrink-0 ml-2 transition-all duration-200 group-hover:bg-gastro-primary group-hover:border-gastro-primary group-hover:text-gastro-on-primary">
          ›
        </div>
      </div>
    </div>
  );
}
