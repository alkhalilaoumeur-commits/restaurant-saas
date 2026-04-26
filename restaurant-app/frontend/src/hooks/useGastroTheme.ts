import { useLayoutEffect } from 'react';
import { Theme } from '../types';
import { getTheme, eckenZuRadius, googleFontsUrl } from '../lib/themes';

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

/**
 * Konvertiert Hex (#RRGGBB) zu "R G B" (space-separated).
 * Dieses Format braucht CSS rgb() mit Tailwind's opacity-Support:
 *   rgb(var(--t-primary) / 0.5) → rgb(37 99 235 / 0.5)
 */
function hexZuRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)} ${parseInt(h.substring(2, 4), 16)} ${parseInt(h.substring(4, 6), 16)}`;
}

/**
 * Prüft ob eine Hex-Farbe "hell" ist (YIQ-Formel).
 * Wird genutzt um zu entscheiden ob Text auf dieser Farbe weiß oder schwarz sein soll.
 */
function istHelleFarbe(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  // YIQ-Formel: > 150 gilt als "hell" → dunkler Text nötig
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Setzt CSS Custom Properties für ein Restaurant-Theme auf <html>.
 * Lädt die passenden Google Fonts automatisch nach.
 *
 * Nutzung:
 *   useGastroTheme('modern')           → Preset-ID
 *   useGastroTheme(themeObjekt)        → Volles Theme-Objekt
 *   useGastroTheme()                   → Fallback auf 'modern'
 *
 * Gesetzte CSS-Variablen:
 *   --t-bg, --t-surface, --t-primary, --t-secondary,
 *   --t-text, --t-muted, --t-border          (jeweils RGB-Triplet, z.B. "37 99 235")
 *   --t-on-primary                            (Kontrastfarbe für Text auf Primär-Buttons)
 *   --t-radius                                (z.B. "12px")
 *   --t-font-heading, --t-font-body          (z.B. '"Inter", sans-serif')
 *   --t-card-shadow, --t-card-border         (Card-Stil: Schatten oder Border)
 *
 * Tailwind-Klassen nutzen diese über das gastro-* Farbschema:
 *   bg-gastro-primary, text-gastro-text, border-gastro-border, etc.
 */
export function useGastroTheme(input?: Theme | string | null): Theme {
  // Wenn input ein String oder null/undefined ist → Preset nachschlagen
  // Wenn input ein Theme-Objekt ist → direkt verwenden
  const theme = input && typeof input === 'object' ? input : getTheme(input as string);

  // JSON-Key für die Dependency — ändert sich nur wenn sich Theme-Werte ändern
  const themeKey = JSON.stringify(theme);

  // useLayoutEffect statt useEffect: setzt Variablen VOR dem ersten Paint,
  // damit es kein kurzes Aufblitzen mit falschen Farben gibt
  useLayoutEffect(() => {
    const root = document.documentElement;
    const { farben } = theme;

    // ── Farben als RGB-Triplets (für Tailwind opacity-Support) ──────────
    root.style.setProperty('--t-bg', hexZuRgb(farben.hintergrund));
    root.style.setProperty('--t-surface', hexZuRgb(farben.oberflaeche));
    root.style.setProperty('--t-primary', hexZuRgb(farben.primaer));
    root.style.setProperty('--t-secondary', hexZuRgb(farben.sekundaer));
    root.style.setProperty('--t-text', hexZuRgb(farben.text));
    root.style.setProperty('--t-muted', hexZuRgb(farben.textGedaempft));
    root.style.setProperty('--t-border', hexZuRgb(farben.border));

    // ── Kontrastfarbe für Text auf Primär-Buttons ───────────────────────
    // Helle Primärfarbe (z.B. Champagner-Gold) → schwarzer Text
    // Dunkle Primärfarbe (z.B. Blau, Rot) → weißer Text
    root.style.setProperty(
      '--t-on-primary',
      istHelleFarbe(farben.primaer) ? '0 0 0' : '255 255 255'
    );

    // ── Layout ──────────────────────────────────────────────────────────
    root.style.setProperty('--t-radius', eckenZuRadius(theme.ecken));
    root.style.setProperty('--t-font-heading', `"${theme.fontHeading}", sans-serif`);
    root.style.setProperty('--t-font-body', `"${theme.fontBody}", sans-serif`);

    // ── Card-Stil ───────────────────────────────────────────────────────
    switch (theme.cardStil) {
      case 'flach':
        root.style.setProperty('--t-card-shadow', 'none');
        root.style.setProperty('--t-card-border', '0px');
        break;
      case 'schatten':
        root.style.setProperty('--t-card-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--t-card-border', '0px');
        break;
      case 'border':
        root.style.setProperty('--t-card-shadow', 'none');
        root.style.setProperty('--t-card-border', '1px');
        break;
    }

    // Google Fonts wurden entfernt (DSGVO/LG Muenchen 2022).
    // Themes nutzen nun System-Font-Fallback. Falls ein Theme eine spezielle Schrift
    // braucht, muss diese ueber @fontsource (npm) lokal eingebunden werden.
    void googleFontsUrl;

    // ── Cleanup: CSS-Variablen entfernen wenn Komponente unmounted ──────
    return () => {
      [
        '--t-bg', '--t-surface', '--t-primary', '--t-secondary',
        '--t-text', '--t-muted', '--t-border', '--t-on-primary',
        '--t-radius', '--t-font-heading', '--t-font-body',
        '--t-card-shadow', '--t-card-border',
      ].forEach((v) => root.style.removeProperty(v));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);

  return theme;
}
