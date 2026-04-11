import { useState, useRef } from 'react';
import Topbar from '../components/layout/Topbar';
import { useRestaurant } from '../hooks/useRestaurant';
import { useThemeStore } from '../store/theme';
import { api } from '../lib/api';

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
  const [logoLaden, setLogoLaden] = useState(false);
  const [logoFehler, setLogoFehler] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function logoHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setLogoFehler('');
    setLogoLaden(true);
    try {
      const url = await api.upload(datei);
      await aktualisieren({ logo_url: url });
    } catch (err) {
      setLogoFehler((err as Error).message || 'Upload fehlgeschlagen');
    } finally {
      setLogoLaden(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function logoEntfernen() {
    setLogoFehler('');
    setLogoLaden(true);
    try {
      await aktualisieren({ logo_url: null });
    } catch (err) {
      setLogoFehler((err as Error).message || 'Fehler beim Entfernen');
    } finally {
      setLogoLaden(false);
    }
  }

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

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

            {/* ── Showcase 3D (Premium, Glasmorphismus) ────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'showcase') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'showcase' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 group/sc ${
                restaurant.layout_id === 'showcase'
                  ? 'border-2 border-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-[0_0_20px_-5px] shadow-indigo-500/20'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/40'
              }`}
            >
              {/* Premium-Badge (immer sichtbar) */}
              <div className="absolute top-3 right-3 z-10">
                {restaurant.layout_id === 'showcase' ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 dark:text-indigo-300/70 bg-indigo-100/80 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                    Premium
                  </span>
                )}
              </div>

              {/* Mini-Vorschau: Ultra-Dark mit 3D-Glasmorphismus-Karten */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#07070E] p-2 mb-3 relative overflow-hidden">
                {/* Ambient Glow Orbs */}
                <div className="absolute top-1 left-3 w-8 h-8 rounded-full bg-indigo-500/10 blur-lg" />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-cyan-500/8 blur-md" />

                {/* 2x2 Grid: Glass-Karten mit Glow-Border */}
                <div className="relative z-10 grid grid-cols-2 gap-1.5 h-full">
                  {/* Karte 1 — mit Bild-Platzhalter */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col overflow-hidden
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/10">
                    <div className="flex-1 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent" />
                    <div className="px-1.5 py-1">
                      <div className="h-1 w-8 rounded bg-[#EAEAF4]/25" />
                      <div className="h-0.5 w-5 rounded bg-[#818CF8]/30 mt-0.5" />
                    </div>
                  </div>

                  {/* Karte 2 — mit Bild-Platzhalter */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col overflow-hidden
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/10">
                    <div className="flex-1 bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-transparent" />
                    <div className="px-1.5 py-1">
                      <div className="h-1 w-6 rounded bg-[#EAEAF4]/25" />
                      <div className="h-0.5 w-4 rounded bg-[#818CF8]/30 mt-0.5" />
                    </div>
                  </div>

                  {/* Karte 3 — ohne Bild, mit Dot */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#818CF8]/20 flex flex-col justify-center px-1.5 py-1
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/15">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#818CF8]/40" />
                      <div className="h-1 w-7 rounded bg-[#EAEAF4]/25" />
                    </div>
                    <div className="h-0.5 w-10 rounded bg-[#EAEAF4]/10 mt-1 ml-2" />
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/15 border border-emerald-500/20" />
                      </div>
                      <div className="w-3 h-3 rounded-full border border-[#818CF8]/30 flex items-center justify-center">
                        <span className="text-[5px] text-[#818CF8]">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Karte 4 — ohne Bild, mit Dot */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col justify-center px-1.5 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#818CF8]/40" />
                      <div className="h-1 w-9 rounded bg-[#EAEAF4]/25" />
                    </div>
                    <div className="h-0.5 w-8 rounded bg-[#EAEAF4]/10 mt-1 ml-2" />
                    <div className="flex items-center justify-end mt-1">
                      <div className="w-3 h-3 rounded-full border border-[#818CF8]/30 flex items-center justify-center">
                        <span className="text-[5px] text-[#818CF8]">+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spotlight-Effekt oben rechts */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-radial from-indigo-400/8 to-transparent rounded-full pointer-events-none" />
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">
                Showcase 3D
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Premium 3D-Karten mit Glasmorphismus & Glow
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                  Space Grotesk
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                  3D-Effekte
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                  Glasmorphismus
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Restaurant-Logo */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Restaurant-Logo</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Wird auf der Bestellseite und im Dashboard angezeigt</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Logo-Vorschau */}
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 flex items-center justify-center overflow-hidden shrink-0 bg-gray-50 dark:bg-white/5">
              {restaurant.logo_url ? (
                <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <svg className="w-8 h-8 text-gray-300 dark:text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
                </svg>
              )}
            </div>

            {/* Upload-Buttons */}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={logoHochladen}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoLaden}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {logoLaden ? 'Wird hochgeladen...' : restaurant.logo_url ? 'Logo ändern' : 'Logo hochladen'}
                </button>
                {restaurant.logo_url && (
                  <button
                    onClick={logoEntfernen}
                    disabled={logoLaden}
                    className="px-4 py-2 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                  >
                    Entfernen
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">JPG, PNG oder WebP. Max. 5 MB.</p>
              {logoFehler && <p className="text-xs text-red-500 mt-1">{logoFehler}</p>}
            </div>
          </div>
        </div>

        {/* Buchungswidget */}
        <BuchungsWidget restaurantId={restaurant.id} />

        {/* Google Reserve Integration */}
        <GoogleIntegration restaurantId={restaurant.id} />

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

// ─── Google Reserve Integration ──────────────────────────────────────────────

function GoogleIntegration({ restaurantId }: { restaurantId: string }) {
  const [kopiert, setKopiert] = useState(false);

  // Der Buchungs-Link mit ?quelle=google — damit kommen Reservierungen automatisch
  // als "Google" markiert rein. Restaurantbesitzer fügt diesen Link in Google Business Profile ein.
  const googleLink = `${window.location.origin}/buchen/${restaurantId}?quelle=google`;

  const kopieren = () => {
    navigator.clipboard.writeText(googleLink);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        {/* Google-Farben Icon */}
        <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Google Reserve</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              Manuell
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">Reservierungen aus Google Maps tracken</p>
        </div>
      </div>

      {/* Info-Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Wie funktioniert das?</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          Füge den Link unten in dein <strong>Google Business Profile</strong> ein (unter "Reservierungen" → "Links verwalten").
          Gäste, die über Google Maps buchen, werden dann in deinem System automatisch mit der Quelle <strong>"Google"</strong> erfasst.
          So siehst du in den Statistiken wie viele Reservierungen über Google Maps kommen.
        </p>
      </div>

      {/* Google-Link mit ?quelle=google */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
          Dein Google-Buchungslink
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={googleLink}
            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 dark:text-slate-300"
          />
          <button
            onClick={kopieren}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 shrink-0 transition-colors"
          >
            {kopiert ? '✓ Kopiert' : 'Kopieren'}
          </button>
        </div>
      </div>

      {/* Schritt-für-Schritt Anleitung */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Einrichten in 3 Schritten:</p>
        <ol className="space-y-2">
          {[
            { nr: 1, text: 'Google Business Profile öffnen: business.google.com' },
            { nr: 2, text: 'Menü → "Buchungen" oder "Links" → "Reservierungslink hinzufügen"' },
            { nr: 3, text: 'Den Link oben einfügen und speichern — fertig!' },
          ].map(({ nr, text }) => (
            <li key={nr} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {nr}
              </span>
              <span className="text-xs text-gray-600 dark:text-slate-300">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Zukunfts-Hinweis Option B */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
        <p className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>
            <strong>Geplant:</strong> Direkte Google Reserve API-Integration (automatisch, ohne manuellen Link) — sobald das Partnerprogramm aktiv ist.
          </span>
        </p>
      </div>
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
