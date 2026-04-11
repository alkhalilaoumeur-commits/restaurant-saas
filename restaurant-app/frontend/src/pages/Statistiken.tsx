import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area,
} from 'recharts';
import Topbar from '../components/layout/Topbar';
import StatKarte from '../components/dashboard/StatKarte';
import { useStatistiken } from '../hooks/useStatistiken';
import { formatPreis } from '../lib/utils';
import { useThemeStore } from '../store/theme';

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconEuro() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" /><path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12a7.9 7.9 0 007.8 8 7.7 7.7 0 005.2-2" />
    </svg>
  );
}
function IconBestellungen() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z" />
      <path d="M15 3v4a2 2 0 002 2h4" />
    </svg>
  );
}
function IconDurchschnitt() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}
function IconKalender() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconRepeat() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Tooltip-Stil (einheitlich) ──────────────────────────────────────────────

function getTooltipStyle(dark: boolean) {
  return {
    backgroundColor: dark ? '#0F1724' : '#1e293b',
    border: dark ? '1px solid rgba(255,255,255,0.1)' : 'none',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#fff',
    padding: '8px 12px',
  };
}

// ─── Kategorie-Farben ────────────────────────────────────────────────────────

const KATEGORIE_FARBEN = [
  '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#84cc16', '#6366f1',
];

// ─── Zeitraum-Tabs ───────────────────────────────────────────────────────────

const ZEITRAEUME = [
  { label: '7 Tage', wert: 7 },
  { label: '30 Tage', wert: 30 },
  { label: '90 Tage', wert: 90 },
];

// ─── Hauptkomponente ─────────────────────────────────────────────────────────

export default function Statistiken() {
  const [zeitraum, setZeitraum] = useState(7);
  const { daten, laden, fehler } = useStatistiken(zeitraum);

  const dark = useThemeStore((s) => s.theme === 'dark');
  const tooltipStyle = getTooltipStyle(dark);
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const tickColor = dark ? '#64748b' : '#94a3b8';

  if (laden) {
    return (
      <div>
        <Topbar titel="Statistiken" />
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-8 text-center shadow-sm">
          <p className="text-sm text-gray-400 dark:text-slate-500">Statistiken werden geladen...</p>
        </div>
      </div>
    );
  }

  if (fehler || !daten) {
    return (
      <div>
        <Topbar titel="Statistiken" />
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-8 text-center shadow-sm">
          <p className="text-sm text-red-500">{fehler || 'Keine Daten verfügbar'}</p>
        </div>
      </div>
    );
  }

  const { zusammenfassung: zf, umsatzProTag, beliebteGerichte, stosszeiten, kategorieUmsatz, crmMetriken: crm } = daten;

  // Umsatz-Daten: Datum formatieren
  const umsatzDaten = umsatzProTag.map((d) => ({
    ...d,
    tag: new Date(d.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
  }));

  // Stosszeiten: Stunde formatieren
  const stosszeitenDaten = stosszeiten.map((s) => ({
    ...s,
    label: `${s.stunde.toString().padStart(2, '0')}:00`,
  }));

  // Max Stosszeit für Farbintensität
  const maxAnzahl = Math.max(...stosszeiten.map((s) => s.anzahl), 1);

  return (
    <div className="animate-fade-in-up">
      <Topbar titel="Statistiken" untertitel={`Letzte ${zeitraum} Tage`} />

      {/* Zeitraum-Auswahl */}
      <div className="flex gap-1.5 mb-5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        {ZEITRAEUME.map((z) => (
          <button
            key={z.wert}
            onClick={() => setZeitraum(z.wert)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              zeitraum === z.wert
                ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-slate-50 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Zusammenfassung – 4 Stat-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatKarte
          label="Gesamtumsatz"
          wert={formatPreis(zf.umsatz)}
          icon={<IconEuro />}
          akzentFarbe="bg-emerald-500"
        />
        <StatKarte
          label="Bestellungen"
          wert={zf.bestellungen}
          icon={<IconBestellungen />}
          akzentFarbe="bg-blue-500"
        />
        <StatKarte
          label="Ø Bestellwert"
          wert={formatPreis(zf.durchschnitt)}
          icon={<IconDurchschnitt />}
          akzentFarbe="bg-amber-500"
        />
        <StatKarte
          label="Reservierungen"
          wert={zf.reservierungen}
          icon={<IconKalender />}
          akzentFarbe="bg-violet-500"
        />
      </div>

      {/* Zeile 1: Umsatz-Verlauf (groß) + Kategorie-Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Umsatz pro Tag */}
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-400 opacity-80" />
          <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-blue-500" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Umsatz-Verlauf</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400 dark:text-slate-500">Umsatz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-400 dark:text-slate-500">Bestellungen</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-6 mb-4">
            <div>
              <p className="text-[28px] font-bold text-gray-900 dark:text-slate-50 leading-tight">{formatPreis(zf.umsatz)}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{zf.bestellungen} Bestellungen in {zeitraum} Tagen</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={umsatzDaten} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="statUmsatzGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={dark ? 0.3 : 0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="tag" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => `${v}€`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                  formatter={(value, name) => [
                    name === 'umsatz' ? formatPreis(Number(value)) : `${value} Stück`,
                    name === 'umsatz' ? 'Umsatz' : 'Bestellungen',
                  ]}
                />
                <Area type="monotone" dataKey="umsatz" stroke="#3b82f6" strokeWidth={2} fill="url(#statUmsatzGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="anzahl" stroke="#34d399" strokeWidth={2} fill="transparent" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>

        {/* Umsatz nach Kategorie – Donut */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">Umsatz nach Kategorie</p>
          {kategorieUmsatz.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-4">Keine Daten vorhanden.</p>
          ) : (
            <>
              <div className="relative w-full h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kategorieUmsatz}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="umsatz"
                      strokeWidth={0}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {kategorieUmsatz.map((_, i) => (
                        <Cell key={i} fill={KATEGORIE_FARBEN[i % KATEGORIE_FARBEN.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [formatPreis(Number(value)), 'Umsatz']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {kategorieUmsatz.slice(0, 6).map((k, i) => (
                  <div key={k.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: KATEGORIE_FARBEN[i % KATEGORIE_FARBEN.length] }} />
                      <span className="text-xs text-gray-500 dark:text-slate-400">{k.name}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{formatPreis(k.umsatz)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Zeile 1b: CRM-Metriken */}
      <div className="mb-6">
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-pink-400 opacity-80" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-violet-500" />
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Gäste CRM</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-full">
                  {crm.alleGaesteCrm} Profile gesamt
                </span>
                {crm.neueGaeste > 0 && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    +{crm.neueGaeste} neu
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stammgäste */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                  <IconPerson />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 leading-tight">{crm.stammgaeste}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Stammgäste</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">≥ 2 Besuche insgesamt</p>
                </div>
              </div>

              {/* Wiederkehrquote */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <IconRepeat />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 leading-tight">{crm.wiederkehrquote}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">%</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Wiederkehrquote</p>
                  <div className="mt-1.5 w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${Math.min(crm.wiederkehrquote, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* No-Show-Rate */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  crm.noShowRate >= 15
                    ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                    : crm.noShowRate >= 8
                    ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <IconAlert />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 leading-tight">{crm.noShowRate}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">%</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">No-Show-Rate</p>
                  <p className={`text-[10px] mt-0.5 ${
                    crm.noShowRate >= 15
                      ? 'text-red-500 dark:text-red-400'
                      : crm.noShowRate >= 8
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-emerald-500 dark:text-emerald-400'
                  }`}>
                    {crm.noShowRate >= 15 ? 'Hoch — Erinnerungen prüfen' : crm.noShowRate >= 8 ? 'Mittel — im Blick behalten' : 'Gut — unter Kontrolle'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zeile 2: Beliebteste Gerichte + Stoßzeiten */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Beliebteste Gerichte */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-amber-400" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Beliebteste Gerichte</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">Top {beliebteGerichte.length}</span>
          </div>
          <div className="px-5 pb-5">
          {beliebteGerichte.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">Keine Daten vorhanden.</p>
          ) : (
            <div className="space-y-3">
              {beliebteGerichte.map((g, i) => {
                const maxMenge = beliebteGerichte[0]?.menge || 1;
                const prozent = Math.round((g.menge / maxMenge) * 100);
                return (
                  <div key={g.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-slate-500">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm text-gray-800 dark:text-slate-200 truncate">{g.name}</p>
                        <span className="text-xs font-medium text-gray-600 dark:text-slate-300 ml-2 shrink-0">{g.menge}x</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${prozent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">{g.kategorie}</span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">{formatPreis(g.umsatz)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* Stoßzeiten */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-violet-400" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Stoßzeiten</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">pro Stunde</span>
          </div>
          <div className="px-5 pb-5">
          {stosszeitenDaten.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">Keine Daten vorhanden.</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stosszeitenDaten} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                    formatter={(value, name) => [
                      name === 'anzahl' ? `${value} Bestellungen` : formatPreis(Number(value)),
                      name === 'anzahl' ? 'Anzahl' : 'Umsatz',
                    ]}
                  />
                  <Bar dataKey="anzahl" radius={[4, 4, 0, 0]}>
                    {stosszeitenDaten.map((entry) => {
                      const intensity = entry.anzahl / maxAnzahl;
                      const r = Math.round(59 + (59 - 59) * (1 - intensity));
                      const g = Math.round(130 + (130 - 80) * (1 - intensity));
                      const b = Math.round(246 + (246 - 180) * (1 - intensity));
                      return <Cell key={entry.label} fill={`rgb(${r}, ${g}, ${b})`} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
