interface StatKarteProps {
  label: string;
  wert: string | number;
  icon?: React.ReactNode;
  akzentFarbe?: string;
  trend?: { wert: number; label?: string } | null;
}

// Mapping von Akzentfarbe zu Gradient + Schein
const GRADIENT_MAP: Record<string, { from: string; to: string; glow: string }> = {
  'bg-amber-500':   { from: 'from-amber-400',   to: 'to-orange-500',  glow: 'shadow-amber-500/25' },
  'bg-orange-500':  { from: 'from-orange-400',  to: 'to-red-500',     glow: 'shadow-orange-500/25' },
  'bg-emerald-500': { from: 'from-emerald-400', to: 'to-teal-500',    glow: 'shadow-emerald-500/25' },
  'bg-blue-500':    { from: 'from-blue-400',    to: 'to-cyan-500',    glow: 'shadow-blue-500/25' },
  'bg-violet-500':  { from: 'from-violet-400',  to: 'to-fuchsia-500', glow: 'shadow-violet-500/25' },
  'bg-red-500':     { from: 'from-red-400',     to: 'to-rose-500',    glow: 'shadow-red-500/25' },
};

export default function StatKarte({ label, wert, icon, akzentFarbe = 'bg-blue-500', trend }: StatKarteProps) {
  const g = GRADIENT_MAP[akzentFarbe] ?? GRADIENT_MAP['bg-blue-500'];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] shadow-premium card-hover">
      {/* Subtiler Farb-Akzent oben */}
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${g.from} ${g.to}`} />

      {/* Dezenter Gradient-Glow im Hintergrund (nur Hover) */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${g.from} ${g.to} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none`} />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="nums text-[30px] font-bold text-gray-900 dark:text-slate-50 mt-2 leading-none tracking-tight">
              {wert}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                  trend.wert >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                }`}>
                  <svg className={`w-3 h-3 ${trend.wert < 0 ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7l4-4 4 4" />
                    <path d="M6 3v7" />
                  </svg>
                  {Math.abs(trend.wert)}%
                </span>
                {trend.label && (
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">{trend.label}</span>
                )}
              </div>
            )}
          </div>

          {icon && (
            <div className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-white shrink-0 shadow-lg ${g.glow} group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}>
              {/* Inner highlight */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 to-transparent" />
              <span className="relative">{icon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
