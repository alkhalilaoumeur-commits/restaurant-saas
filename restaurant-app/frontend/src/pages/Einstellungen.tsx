import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import { useRestaurant } from '../hooks/useRestaurant';
import { useThemeStore } from '../store/theme';

const ABO_STATUS_LABEL: Record<string, string> = {
  trial: 'Testphase',
  active: 'Aktiv',
  expired: 'Abgelaufen',
};

const ABO_STATUS_FARBE: Record<string, string> = {
  trial: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
};

function IconLizenz() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function IconGebaeude() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function IconMitarbeiter() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

const FARB_VORLAGEN = [
  '#ea580c', // Orange (Standard)
  '#dc2626', // Rot
  '#16a34a', // Grün
  '#2563eb', // Blau
  '#7c3aed', // Violett
  '#ca8a04', // Gold
  '#0d9488', // Teal
  '#db2777', // Pink
  '#374151', // Dunkelgrau
];

function IconPalette() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconDarkMode() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function Einstellungen() {
  const { restaurant, laden, aktualisieren } = useRestaurant();
  const [farbeSpeichern, setFarbeSpeichern] = useState(false);
  const { theme, toggle: toggleTheme } = useThemeStore();

  if (laden) {
    return (
      <div>
        <Topbar titel="Einstellungen" />
        <p className="text-sm text-gray-400">Wird geladen...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div>
        <Topbar titel="Einstellungen" />
        <p className="text-sm text-red-500">Restaurant-Daten konnten nicht geladen werden.</p>
      </div>
    );
  }

  const mitarbeiterProzent = Math.round((restaurant.aktive_mitarbeiter / restaurant.max_mitarbeiter) * 100);
  const limitNah = mitarbeiterProzent >= 80;

  return (
    <div className="animate-fade-in-up">
      <Topbar titel="Einstellungen" untertitel="Restaurant & Lizenz verwalten" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Lizenz-Karte */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <IconLizenz />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Lizenz</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Dein aktueller Plan</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Lizenzcode</span>
              <span className="text-sm font-mono font-semibold text-gray-800 dark:text-slate-200">{restaurant.lizenz_code || '–'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Abo-Status</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ABO_STATUS_FARBE[restaurant.abo_status] || 'bg-gray-100 text-gray-500'}`}>
                {ABO_STATUS_LABEL[restaurant.abo_status] || restaurant.abo_status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Registriert am</span>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                {new Date(restaurant.erstellt_am).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Mitarbeiter-Nutzung */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <IconMitarbeiter />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Mitarbeiter</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Nutzung deines Kontingents</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Aktive Mitarbeiter</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                {restaurant.aktive_mitarbeiter} / {restaurant.max_mitarbeiter}
              </span>
            </div>
            {/* Fortschrittsbalken */}
            <div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    limitNah ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(mitarbeiterProzent, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${limitNah ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-slate-500'}`}>
                {mitarbeiterProzent >= 100
                  ? 'Limit erreicht – keine weiteren Mitarbeiter möglich'
                  : limitNah
                    ? `${restaurant.max_mitarbeiter - restaurant.aktive_mitarbeiter} Plätze frei`
                    : `${restaurant.max_mitarbeiter - restaurant.aktive_mitarbeiter} Plätze frei`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-500/15 flex items-center justify-center text-slate-600 dark:text-amber-400">
                <IconDarkMode />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Erscheinungsbild</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {theme === 'dark' ? 'Dunkles Design aktiv' : 'Helles Design aktiv'}
                </p>
              </div>
            </div>
            {/* Toggle-Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                theme === 'dark' ? 'bg-amber-500' : 'bg-gray-200 dark:bg-white/10'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center text-[11px] ${
                  theme === 'dark' ? 'translate-x-[30px]' : 'translate-x-0.5'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        {/* Design-Anpassung */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-500/15 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <IconPalette />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Design</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Primärfarbe für deine Gäste-Bestellseite</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {FARB_VORLAGEN.map((farbe) => (
              <button
                key={farbe}
                onClick={async () => {
                  setFarbeSpeichern(true);
                  try { await aktualisieren({ primaerfarbe: farbe }); } finally { setFarbeSpeichern(false); }
                }}
                disabled={farbeSpeichern}
                className={`w-10 h-10 rounded-xl transition-all duration-150 ${
                  restaurant.primaerfarbe === farbe
                    ? 'ring-2 ring-offset-2 dark:ring-offset-[#0A0F1A] ring-gray-400 dark:ring-slate-400 scale-110'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: farbe }}
                title={farbe}
              />
            ))}
            {/* Eigene Farbe per Input */}
            <label className="relative cursor-pointer group" title="Eigene Farbe wählen">
              <input
                type="color"
                value={restaurant.primaerfarbe}
                onChange={async (e) => {
                  setFarbeSpeichern(true);
                  try { await aktualisieren({ primaerfarbe: e.target.value }); } finally { setFarbeSpeichern(false); }
                }}
                className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:border-gray-400 dark:group-hover:border-slate-400 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </label>
          </div>

          {/* Vorschau */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-slate-400">Vorschau:</span>
            <button
              className="px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: restaurant.primaerfarbe }}
            >
              Bestellen
            </button>
            <span className="text-sm font-semibold" style={{ color: restaurant.primaerfarbe }}>
              12,90 €
            </span>
          </div>
        </div>

        {/* Restaurant-Daten */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-500/15 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <IconGebaeude />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Restaurant-Daten</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Kontakt & Adresse</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <InfoZeile label="Name" wert={restaurant.name} />
            <InfoZeile label="Währung" wert={restaurant.waehrung} />
            <InfoZeile label="Straße" wert={restaurant.strasse} />
            <InfoZeile label="PLZ / Stadt" wert={[restaurant.plz, restaurant.stadt].filter(Boolean).join(' ') || null} />
            <InfoZeile label="Telefon" wert={restaurant.telefon} />
            <InfoZeile label="E-Mail" wert={restaurant.email} />
            <InfoZeile label="Öffnungszeiten" wert={restaurant.oeffnungszeiten} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoZeile({ label, wert }: { label: string; wert: string | null }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-white/5">
      <span className="text-xs text-gray-500 dark:text-slate-400">{label}</span>
      <span className="text-sm text-gray-800 dark:text-slate-200">{wert || '–'}</span>
    </div>
  );
}
