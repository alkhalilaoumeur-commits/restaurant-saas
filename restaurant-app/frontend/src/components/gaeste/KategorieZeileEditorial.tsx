import { KategorieMitAnzahl } from '../../types';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  kategorie: KategorieMitAnzahl;
  index: number;
  gesamt: number;
  onClick: () => void;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
//
// Kategorie-Zeile im Editorial/Magazin-Stil (überarbeitet):
//
// Verbesserungen basierend auf Marktrecherche:
//   1. GRÖSSERE Nummern — das ist das visuelle Signature-Element
//      (vorher text-sm, jetzt text-2xl — die Nummern "tragen" das Layout)
//   2. Nummer in Terracotta statt gedämpft — stärkere visuelle Hierarchie
//   3. Bild-Thumbnail mit besserem Aspect-Ratio
//   4. Dezente Trennlinie mit Fade-Effekt
//   5. Besseres Hover-Feedback (ganzer Hintergrund)
//   6. Pfeil-Animation subtiler
export default function KategorieZeileEditorial({ kategorie, index, onClick }: Props) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-center gap-4
                 py-6 border-b border-gastro-border/20
                 transition-all duration-200 hover:bg-gastro-primary/[0.03]
                 hover:pl-1"
    >
      {/* Nummer — das Signature-Element des Editorial-Layouts */}
      <span className="w-10 shrink-0 text-2xl italic text-gastro-primary/40 font-theme-heading
                       tabular-nums leading-none transition-colors duration-200
                       group-hover:text-gastro-primary/70">
        {num}
      </span>

      {/* Bild-Thumbnail (48x48, abgerundet) */}
      {kategorie.bild_url ? (
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0
                        ring-1 ring-gastro-border/20
                        transition-transform duration-200 group-hover:scale-105">
          <img
            src={kategorie.bild_url}
            alt={kategorie.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        /* Dezenter Punkt als Platzhalter wenn kein Bild */
        <div className="w-1.5 h-1.5 rounded-full bg-gastro-primary/20 shrink-0" />
      )}

      {/* Name + Anzahl */}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-gastro-text font-theme-heading tracking-tight leading-snug
                        transition-colors duration-200 group-hover:text-gastro-primary">
          {kategorie.name}
        </div>
        <div className="text-xs text-gastro-muted/60 mt-0.5 italic">
          {kategorie.anzahl_gerichte} {kategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
        </div>
      </div>

      {/* Pfeil — subtil, wird bei Hover sichtbarer */}
      <svg
        className="w-4 h-4 text-gastro-muted/25 shrink-0 transition-all duration-200
                   group-hover:text-gastro-primary group-hover:translate-x-0.5"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}
