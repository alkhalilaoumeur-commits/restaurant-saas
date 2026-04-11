import { ThemePresetId } from '../types';

// ─── Layout-System ──────────────────────────────────────────────────────────
//
// Ein Layout bestimmt WIE die Gäste-Bestellseite aussieht:
//   - Welches Farb-Theme (aus themes.ts) verwendet wird
//   - Ob Kategorien als Grid-Kacheln, vertikale Balken oder Pill-Tabs angezeigt werden
//   - Ob Gerichte als Grid-Cards oder als horizontale Zeilen angezeigt werden
//
// Das Layout wird pro Restaurant in der DB gespeichert (Spalte `layout_id`).

export type LayoutId = 'modern' | 'elegant-dunkel' | 'osteria' | 'editorial' | 'showcase';

export interface LayoutConfig {
  id: LayoutId;
  name: string;
  beschreibung: string;
  /** Welches Farb-Theme aus themes.ts benutzt wird */
  themeId: ThemePresetId;
  /** Kategorien: nebeneinander als Kacheln, untereinander als Balken, Pill-Tabs, oder nummerierte Liste */
  kategorienAnzeige: 'grid' | 'liste' | 'pills' | 'editorial' | 'showcase';
  /** Gerichte: nebeneinander als Cards oder untereinander als Zeilen */
  gerichteAnzeige: 'grid' | 'liste' | 'showcase';
}

export const LAYOUTS: Record<LayoutId, LayoutConfig> = {

  // ── 1. Modern ─────────────────────────────────────────────────────────────
  // Helles Design mit Kategorie-Kacheln im 2-Spalten-Grid.
  // So wie es bisher aussah — farbenfrohe Kacheln, runde Ecken.
  modern: {
    id: 'modern',
    name: 'Modern',
    beschreibung: 'Helle Kacheln im Grid — farbenfroh & modern',
    themeId: 'modern',
    kategorienAnzeige: 'grid',
    gerichteAnzeige: 'grid',
  },

  // ── 2. Elegant Dunkel ─────────────────────────────────────────────────────
  // Dunkles Design mit vertikalen Listen. Kategorien und Gerichte sind
  // längliche Balken untereinander — schlicht, edel, gut lesbar.
  'elegant-dunkel': {
    id: 'elegant-dunkel',
    name: 'Elegant Dunkel',
    beschreibung: 'Dunkles Design mit eleganten Listen-Balken',
    themeId: 'eleganz',
    kategorienAnzeige: 'liste',
    gerichteAnzeige: 'liste',
  },

  // ── 3. Osteria ────────────────────────────────────────────────────────────
  // Dunkles Gold-auf-Schwarz Design mit horizontaler Pill-Navigation.
  // Alle Gerichte auf einer Seite (kein Zwei-Schritt-Flow),
  // gruppiert nach Kategorie mit Sektions-Überschriften.
  osteria: {
    id: 'osteria',
    name: 'Osteria',
    beschreibung: 'Goldene Pill-Navigation — alle Gerichte auf einer Seite',
    themeId: 'osteria',
    kategorienAnzeige: 'pills',
    gerichteAnzeige: 'liste',
  },
  // ── 4. Editorial ──────────────────────────────────────────────────────────
  // Magazin-Stil: Creme-Hintergrund, Terracotta-Akzente, nummerierte
  // Kategorien im Listenstil. Zwei-Schritt-Flow wie Modern/Elegant,
  // aber mit dunklem Kategorie-Header und editorial-nummerierten Karten.
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    beschreibung: 'Magazin-Stil mit nummerierten Kategorien & Terracotta-Akzenten',
    themeId: 'editorial',
    kategorienAnzeige: 'editorial',
    gerichteAnzeige: 'liste',
  },
  // ── 5. Showcase 3D ─────────────────────────────────────────────────────────
  // Premium-Layout mit interaktiven 3D-Karten, Glasmorphismus und Lichteffekten.
  // Zwei-Schritt-Flow: Glasige Kategorie-Kacheln → Premium-Gerichtkarten.
  // Auf Desktop: 3D-Tilt, Maus-Spotlight und leuchtende Ränder.
  // Auf Mobile: Elegantes Dark-Theme mit Glaseffekt (graceful degradation).
  showcase: {
    id: 'showcase',
    name: 'Showcase 3D',
    beschreibung: 'Premium 3D-Karten mit Glasmorphismus & Lichteffekten',
    themeId: 'showcase',
    kategorienAnzeige: 'showcase',
    gerichteAnzeige: 'showcase',
  },
};

export const DEFAULT_LAYOUT_ID: LayoutId = 'modern';

export const LAYOUT_IDS: LayoutId[] = ['modern', 'elegant-dunkel', 'osteria', 'editorial', 'showcase'];

/** Gibt die Layout-Config für eine ID zurück, oder das Default-Layout */
export function getLayout(id: string | null | undefined): LayoutConfig {
  if (id && id in LAYOUTS) {
    return LAYOUTS[id as LayoutId];
  }
  return LAYOUTS[DEFAULT_LAYOUT_ID];
}
