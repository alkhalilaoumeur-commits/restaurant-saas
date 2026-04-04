import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display SC"', 'serif'],
        body: ['Karla', 'sans-serif'],
      },
      colors: {
        brand: {
          primary:    '#DC2626',
          secondary:  '#F87171',
          accent:     '#A16207',
          bg:         '#FEF2F2',
          fg:         '#450A0A',
          muted:      '#F0EDF1',
          border:     '#FECACA',
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
      },
    },
  },
  plugins: [],
} satisfies Config;
