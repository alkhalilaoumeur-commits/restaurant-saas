import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorien: KategorieMitAnzahl[];
  /** null = "Alle" ist aktiv */
  aktiveKategorieId: string | null;
  onWaehlen: (kategorieId: string | null) => void;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Horizontale, scrollbare Pill-Leiste für das Osteria-Layout.
// Klebt oben am Bildschirm (sticky), scrollt horizontal ohne Scrollbar.
//
//   [Alle] [Vorspeisen] [Pasta] [Pizza] [Desserts] [Getränke]  →
//
// "Alle" zeigt alle Gerichte gruppiert nach Kategorie.
// Einzelne Pill → filtert auf diese Kategorie.
export default function KategoriePills({ kategorien, aktiveKategorieId, onWaehlen }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto py-3 px-4 bg-gastro-surface border-b border-gastro-border/50 sticky top-0 z-10"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {/* "Alle"-Pill */}
      <button
        onClick={() => onWaehlen(null)}
        className={`
          flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          ${aktiveKategorieId === null
            ? 'bg-gastro-primary text-gastro-on-primary font-bold'
            : 'bg-transparent border border-gastro-border text-gastro-muted hover:border-gastro-primary/40 hover:text-gastro-text'
          }
        `}
      >
        Alle
      </button>

      {kategorien.map((kat) => (
        <button
          key={kat.id}
          onClick={() => onWaehlen(kat.id)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${aktiveKategorieId === kat.id
              ? 'bg-gastro-primary text-gastro-on-primary font-bold'
              : 'bg-transparent border border-gastro-border text-gastro-muted hover:border-gastro-primary/40 hover:text-gastro-text'
            }
          `}
        >
          {kat.name}
        </button>
      ))}
    </div>
  );
}
