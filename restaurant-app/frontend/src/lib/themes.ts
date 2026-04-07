import { Theme, ThemePresetId } from '../types';

// ─── 6 Theme-Presets für die Gäste-Bestellseite ─────────────────────────────
//
// Jedes Preset ist ein komplettes Design:
//   - Farben (7 Werte): Hintergrund, Oberfläche, Primär, Sekundär, Text, TextGedämpft, Border
//   - Fonts (2 Google Fonts): Heading + Body
//   - Layout: Ecken-Stil + Card-Stil
//
// Die Presets basieren auf einer Analyse erfolgreicher Restaurants:
//   Modern     → Allrounder (Sweetgreen, Uber Eats Stil)
//   Eleganz    → Fine Dining (Nobu, Block House Stil)
//   Trattoria  → Italienisch/Mediterran (L'Osteria, Vapiano Stil)
//   Fresh      → Bowl/Salat/Vegan (Sweetgreen Stil)
//   Street     → Burger/BBQ/Streetfood (Shake Shack, Five Guys Stil)
//   Rustikal   → Gasthaus/Brauerei (Farm-to-Table Stil)

export const THEME_PRESETS: Record<ThemePresetId, Theme> = {

  // ── 1. Modern ────────────────────────────────────────────────────────────────
  // Sauberes, zeitloses Design. Funktioniert für jeden Restaurant-Typ.
  // Inspiration: Wolt, Uber Eats — klares Weiß, ein kräftiger Akzent, runde Cards.
  modern: {
    id: 'modern',
    name: 'Modern',
    beschreibung: 'Klar, zeitlos, für jeden Restaurant-Typ',
    emoji: '✨',
    farben: {
      hintergrund: '#F7F7F7',
      oberflaeche: '#FFFFFF',
      primaer: '#2563EB',      // Kräftiges Blau
      sekundaer: '#3B82F6',    // Helleres Blau für Hover
      text: '#111827',         // Fast-Schwarz
      textGedaempft: '#6B7280', // Grau
      border: '#E5E7EB',
    },
    fontHeading: 'Inter',
    fontBody: 'Inter',
    ecken: 'rund',
    cardStil: 'schatten',
  },

  // ── 2. Eleganz ───────────────────────────────────────────────────────────────
  // Dunkler, luxuriöser Look. Gold-Akzente auf schwarzem Grund.
  // Inspiration: Nobu, Block House — Serif-Headings, Ghost-Buttons, viel Weißraum.
  eleganz: {
    id: 'eleganz',
    name: 'Eleganz',
    beschreibung: 'Dunkel & luxuriös — Fine Dining, Steakhaus',
    emoji: '🥂',
    farben: {
      hintergrund: '#0A0A0A',
      oberflaeche: '#1A1A1A',
      primaer: '#C9B97A',      // Champagner-Gold
      sekundaer: '#86754D',    // Gedämpftes Gold
      text: '#F5F0E8',         // Warmes Off-White
      textGedaempft: '#8A8A8A',
      border: '#2A2A2A',
    },
    fontHeading: 'Playfair Display',
    fontBody: 'Lato',
    ecken: 'eckig',
    cardStil: 'border',
  },

  // ── 3. Trattoria ─────────────────────────────────────────────────────────────
  // Warmes, einladendes Design. Rot/Terracotta auf cremigem Hintergrund.
  // Inspiration: L'Osteria, Vapiano — italienische Wärme, Serif-Headings.
  trattoria: {
    id: 'trattoria',
    name: 'Trattoria',
    beschreibung: 'Warm & einladend — Italienisch, Mediterran',
    emoji: '🍝',
    farben: {
      hintergrund: '#FDF8F3',
      oberflaeche: '#FFFFFF',
      primaer: '#C94C3A',      // Terracotta-Rot
      sekundaer: '#4A6741',    // Olivgrün
      text: '#1A1A1A',
      textGedaempft: '#7A6E5D', // Warmes Grau
      border: '#E8E0D4',       // Warmer Border
    },
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Open Sans',
    ecken: 'mittel',
    cardStil: 'border',
  },

  // ── 4. Fresh ─────────────────────────────────────────────────────────────────
  // Frisches, gesundheitsbewusstes Design. Grün/Orange auf hellem Grund.
  // Inspiration: Sweetgreen — Pill-Buttons, große Radien, diätetische Badges.
  fresh: {
    id: 'fresh',
    name: 'Fresh',
    beschreibung: 'Frisch & leicht — Bowl, Salat, Vegan',
    emoji: '🥗',
    farben: {
      hintergrund: '#F0FAF0',
      oberflaeche: '#FFFFFF',
      primaer: '#16A34A',      // Frisches Grün
      sekundaer: '#F97316',    // Akzent-Orange
      text: '#14532D',         // Dunkles Grün
      textGedaempft: '#6B7280',
      border: '#D1FAE5',       // Helles Grün
    },
    fontHeading: 'DM Serif Display',
    fontBody: 'DM Sans',
    ecken: 'rund',
    cardStil: 'schatten',
  },

  // ── 5. Street ────────────────────────────────────────────────────────────────
  // Kräftig, energisch, bold. Dunkler Hintergrund mit Neon-Akzent.
  // Inspiration: Shake Shack, Five Guys — Uppercase-Headings, große CTAs.
  street: {
    id: 'street',
    name: 'Street',
    beschreibung: 'Kräftig & bold — Burger, BBQ, Streetfood',
    emoji: '🍔',
    farben: {
      hintergrund: '#18181B',
      oberflaeche: '#27272A',
      primaer: '#EF4444',      // Kräftiges Rot
      sekundaer: '#FACC15',    // Gelb-Akzent
      text: '#FAFAFA',
      textGedaempft: '#A1A1AA',
      border: '#3F3F46',
    },
    fontHeading: 'Oswald',
    fontBody: 'Nunito Sans',
    ecken: 'mittel',
    cardStil: 'flach',
  },

  // ── 6. Rustikal ──────────────────────────────────────────────────────────────
  // Erdige Wärme, handwerklich. Creme-Hintergrund mit Natur-Akzenten.
  // Inspiration: Farm-to-Table, Brauerei, Landgasthof — Storytelling-Charakter.
  rustikal: {
    id: 'rustikal',
    name: 'Rustikal',
    beschreibung: 'Erdig & gemütlich — Gasthaus, Brauerei, Regional',
    emoji: '🍺',
    farben: {
      hintergrund: '#FAF5EE',
      oberflaeche: '#FFFFFF',
      primaer: '#92400E',      // Warmes Braun-Orange
      sekundaer: '#3A5F3F',    // Waldgrün
      text: '#2C2C2C',
      textGedaempft: '#7A6E5D',
      border: '#E5DDD0',
    },
    fontHeading: 'Josefin Sans',
    fontBody: 'Lora',
    ecken: 'mittel',
    cardStil: 'border',
  },

  // ── 7. Osteria ────────────────────────────────────────────────────────────────
  // Dunkles Gold-auf-Schwarz Design. Elegante Pill-Navigation, kompakte Karten.
  // Inspiration: Osteria Nobile HTML — warm-goldene Akzente, Serif-Headings,
  // Tags für Diät-Infos. Fokus auf Übersichtlichkeit mit Single-Page-Flow.
  osteria: {
    id: 'osteria',
    name: 'Osteria',
    beschreibung: 'Goldene Akzente auf Schwarz — Italienisch, Fine Casual',
    emoji: '🍷',
    farben: {
      hintergrund: '#0C0C0C',
      oberflaeche: '#161616',
      primaer: '#C9A84C',      // Warmes Gold
      sekundaer: '#A8843A',    // Gedämpftes Gold
      text: '#F5F0E8',         // Warmes Off-White
      textGedaempft: '#9A9488',
      border: '#252525',
    },
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Inter',
    ecken: 'mittel',
    cardStil: 'border',
  },

  // ── 8. Editorial ──────────────────────────────────────────────────────────
  // Magazin-Stil mit cremefarbenem Hintergrund und Terracotta-Akzenten.
  // Inspiration: Italienische Trattoria-Karte als Print-Editorial —
  // nummerierte Kategorien, Serif-Headings, warme Erd-Töne.
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    beschreibung: 'Magazin-Stil — Creme & Terracotta, nummeriert',
    emoji: '📰',
    farben: {
      hintergrund: '#F7F3EE',
      oberflaeche: '#FFFFFF',
      primaer: '#C4622D',      // Terracotta
      sekundaer: '#A34E22',    // Dunkleres Terracotta
      text: '#1A1209',         // Tinten-Schwarz
      textGedaempft: '#6B5F52', // Warmes Grau
      border: '#E5E0D8',       // Cremiger Border
    },
    fontHeading: 'Playfair Display',
    fontBody: 'DM Sans',
    ecken: 'mittel',
    cardStil: 'border',
  },
};

/** Alle Preset-IDs als Array (für Iteration in der UI) */
export const THEME_PRESET_IDS: ThemePresetId[] = [
  'modern', 'eleganz', 'trattoria', 'fresh', 'street', 'rustikal', 'osteria', 'editorial',
];

/** Standard-Theme wenn nichts konfiguriert ist */
export const DEFAULT_THEME_ID: ThemePresetId = 'modern';

/** Gibt das Theme-Objekt für eine Preset-ID zurück, oder das Default-Theme */
export function getTheme(id: string | null | undefined): Theme {
  if (id && id in THEME_PRESETS) {
    return THEME_PRESETS[id as ThemePresetId];
  }
  return THEME_PRESETS[DEFAULT_THEME_ID];
}

/** Ecken-Stil → CSS border-radius Wert */
export function eckenZuRadius(ecken: Theme['ecken']): string {
  switch (ecken) {
    case 'eckig': return '4px';
    case 'mittel': return '12px';
    case 'rund': return '20px';
  }
}

/** Card-Stil → CSS-Klassen (Tailwind-kompatibel) */
export function cardStilZuKlasse(stil: Theme['cardStil']): string {
  switch (stil) {
    case 'flach': return '';
    case 'schatten': return 'shadow-md';
    case 'border': return `border`;
  }
}

/** Erzeugt die Google Fonts URL für ein Theme (zum Laden im <head>) */
export function googleFontsUrl(theme: Theme): string {
  const fonts = new Set([theme.fontHeading, theme.fontBody]);
  const params = [...fonts]
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
