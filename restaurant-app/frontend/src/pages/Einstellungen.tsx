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

function IconLayout() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
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
  const { theme, toggle: toggleTheme } = useThemeStore();
  const [layoutSpeichern, setLayoutSpeichern] = useState(false);

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

        {/* Layout Bestellseite */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <IconLayout />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Layout Bestellseite</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Design deiner digitalen Speisekarte für Gäste</p>
            </div>
          </div>

          {/* Layout-Auswahl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* ── Modern (helles Grid) ─────────────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'modern') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'modern' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'modern'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'modern' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: 4 Kacheln im Grid */}
              <div className="w-full aspect-[3/2] rounded-xl bg-gray-100 dark:bg-white/10 p-2 mb-3 flex flex-col gap-1.5">
                <div className="flex gap-1.5 flex-1">
                  <div className="flex-1 rounded-md bg-gradient-to-br from-amber-400 to-orange-500" />
                  <div className="flex-1 rounded-md bg-gradient-to-br from-rose-400 to-pink-500" />
                </div>
                <div className="flex gap-1.5 flex-1">
                  <div className="flex-1 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <div className="flex-1 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Modern</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Helle Kacheln im Grid — farbenfroh & modern
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Inter
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Hell
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Rund
                </span>
              </div>
            </button>

            {/* ── Elegant Dunkel (dunkle Liste) ─────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'elegant-dunkel') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'elegant-dunkel' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'elegant-dunkel'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'elegant-dunkel' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: 4 Balken auf dunklem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#0A0A0A] p-2 mb-3 flex flex-col gap-1.5 justify-center">
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#C9B97A] mr-1.5" />
                  <div className="h-1.5 w-12 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#86754D] mr-1.5" />
                  <div className="h-1.5 w-10 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#A89060] mr-1.5" />
                  <div className="h-1.5 w-14 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#B8A468] mr-1.5" />
                  <div className="h-1.5 w-8 rounded bg-[#F5F0E8]/30" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Elegant Dunkel</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Dunkles Design mit eleganten Listen-Balken
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Playfair
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Dunkel
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Eckig
                </span>
              </div>
            </button>

            {/* ── Osteria (dunkles Gold, Pills) ─────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'osteria') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'osteria' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'osteria'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'osteria' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: Pill-Tabs + Karten auf dunklem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#0C0C0C] p-2 mb-3 flex flex-col gap-1.5">
                {/* Pill-Leiste */}
                <div className="flex gap-1 px-0.5">
                  <div className="h-3.5 w-7 rounded-full bg-[#C9A84C]" />
                  <div className="h-3.5 w-10 rounded-full border border-[#252525]" />
                  <div className="h-3.5 w-8 rounded-full border border-[#252525]" />
                </div>
                {/* Karten */}
                <div className="flex-1 flex flex-col gap-1 mt-0.5">
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-8 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1 border-l-2 border-l-[#C9A84C]">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-6 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-10 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Osteria</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Goldene Pill-Navigation auf dunklem Grund
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Cormorant
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Dunkel
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Alles auf 1 Seite
                </span>
              </div>
            </button>

            {/* ── Editorial (Creme, Magazin-Stil) ──────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'editorial') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'editorial' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'editorial'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'editorial' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: Nummerierte Liste auf cremefarbenem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#F7F3EE] p-2 mb-3 flex flex-col gap-1 justify-center">
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">01</span>
                  <div className="h-1.5 w-12 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">02</span>
                  <div className="h-1.5 w-10 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">03</span>
                  <div className="h-1.5 w-14 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">04</span>
                  <div className="h-1.5 w-8 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Editorial</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Magazin-Stil mit Creme & Terracotta
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Playfair
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Hell
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Nummeriert
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Buchungswidget */}
        <BuchungsWidget restaurantId={restaurant.id} />

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

function BuchungsWidget({ restaurantId }: { restaurantId: string }) {
  const [kopiert, setKopiert] = useState(false);
  const buchungsUrl = `${window.location.origin}/buchen/${restaurantId}`;
  const snippet = `<iframe src="${buchungsUrl}" style="width:100%;min-height:650px;border:none;border-radius:12px;" title="Tisch reservieren"></iframe>`;

  const kopieren = (text: string) => {
    navigator.clipboard.writeText(text);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Online-Buchung</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Link & Widget für Ihre Website</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Direkter Link */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Buchungsseite (direkter Link)</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={buchungsUrl}
              className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 dark:text-slate-300"
            />
            <button
              onClick={() => kopieren(buchungsUrl)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 shrink-0"
            >
              {kopiert ? '✓' : 'Kopieren'}
            </button>
          </div>
        </div>

        {/* Embed-Code */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Widget für Ihre Website (HTML-Code)</label>
          <div className="relative">
            <pre className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-600 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
              {snippet}
            </pre>
            <button
              onClick={() => kopieren(snippet)}
              className="absolute top-2 right-2 px-3 py-1 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600"
            >
              {kopiert ? '✓' : 'Kopieren'}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">
            Diesen Code auf Ihrer Restaurant-Website einfügen — Gäste können dann direkt dort reservieren.
          </p>
        </div>
      </div>
    </div>
  );
}
