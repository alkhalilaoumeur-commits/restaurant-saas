import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display SC"', 'serif'],
        body: ['Karla', 'sans-serif'],
        'theme-heading': ['var(--t-font-heading)'],
        'theme-body': ['var(--t-font-body)'],
      },
      colors: {
        brand: {
          primary:    '#3B82F6',
          secondary:  '#06B6D4',
          accent:     '#0EA5E9',
          bg:         '#0A0F1A',
          fg:         '#F1F5F9',
          muted:      '#1E293B',
          border:     '#1E3A5F',
        },
        sidebar: {
          DEFAULT:    '#1e293b',
          hover:      'rgba(255,255,255,0.05)',
          active:     'rgba(255,255,255,0.10)',
          text:       '#94a3b8',
          heading:    '#64748b',
        },
        orange: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Gäste-Bestellseite — Farben aus CSS Custom Properties (useGastroTheme Hook)
        gastro: {
          DEFAULT:      'rgb(var(--t-bg, 247 247 247) / <alpha-value>)',
          surface:      'rgb(var(--t-surface, 255 255 255) / <alpha-value>)',
          primary:      'rgb(var(--t-primary, 37 99 235) / <alpha-value>)',
          secondary:    'rgb(var(--t-secondary, 59 130 246) / <alpha-value>)',
          text:         'rgb(var(--t-text, 17 24 39) / <alpha-value>)',
          muted:        'rgb(var(--t-muted, 107 114 128) / <alpha-value>)',
          border:       'rgb(var(--t-border, 229 231 235) / <alpha-value>)',
          'on-primary': 'rgb(var(--t-on-primary, 255 255 255) / <alpha-value>)',
        },
      },
      borderRadius: {
        theme: 'var(--t-radius, 20px)',
      },
      boxShadow: {
        'theme-card': 'var(--t-card-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1))',
      },
      borderWidth: {
        'theme-card': 'var(--t-card-border, 0px)',
      },
    },
  },
  plugins: [
    // Safe-Area Insets für iPhone Notch + Home Indicator
    // Klassen: pt-safe, pb-safe, pl-safe, pr-safe, mb-safe, etc.
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.pl-safe': { paddingLeft: 'env(safe-area-inset-left)' },
        '.pr-safe': { paddingRight: 'env(safe-area-inset-right)' },
        '.mt-safe': { marginTop: 'env(safe-area-inset-top)' },
        '.mb-safe': { marginBottom: 'env(safe-area-inset-bottom)' },
        '.h-safe-bottom': { height: 'env(safe-area-inset-bottom)' },
      });
    },
  ],
} satisfies Config;
