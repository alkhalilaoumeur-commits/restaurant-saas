import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';

interface TopbarProps {
  titel: string;
  untertitel?: string;
  aktion?: React.ReactNode;
  /** Editorial section number, e.g. "01" */
  sektion?: string;
}

export default function Topbar({ titel, untertitel, aktion, sektion }: TopbarProps) {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const demo = useAuthStore((s) => s.demo);
  const [zeit, setZeit] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setZeit(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Mobile */}
      {(untertitel || aktion) && (
        <div className="lg:hidden flex items-center justify-between mb-4">
          {untertitel
            ? <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{untertitel}</p>
            : <span />
          }
          {aktion && <div>{aktion}</div>}
        </div>
      )}

      {/* Desktop — Editorial Mission-Control Header */}
      <div className="hidden lg:block mb-10">
        {/* Top-Strip — Mono breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-3">
            {sektion && (
              <>
                <span className="text-blue-600 dark:text-cyan-400">§ {sektion}</span>
                <span className="h-px w-10 bg-blue-600/30 dark:bg-cyan-400/30" />
              </>
            )}
            <span>{titel}</span>
            {demo && (
              <>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-cyan-400">
                  <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse-dot" />
                  Demo
                </span>
              </>
            )}
          </div>
          <span className="hidden xl:block">
            {zeit.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' })} · {zeit.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Hauptzeile: Titel + Aktionen + Profile */}
        <div className="flex items-end justify-between gap-6 pb-5 border-b border-slate-200 dark:border-white/10">
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-light text-[44px] leading-[1.0] tracking-[-0.03em] text-slate-900 dark:text-white truncate">
              {titel}
            </h1>
            {untertitel && (
              <p className="font-sans text-[13px] text-slate-500 dark:text-slate-400 mt-2">{untertitel}</p>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {aktion && <div>{aktion}</div>}

            {mitarbeiter && (
              <div className="flex items-center gap-3 pl-4 ml-1 border-l border-slate-200 dark:border-white/10">
                <div className="text-right hidden xl:block">
                  <p className="font-display text-[15px] text-slate-800 dark:text-slate-100 leading-tight">{mitarbeiter.name}</p>
                  {mitarbeiter.rolle && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-0.5">{mitarbeiter.rolle}</p>
                  )}
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-display text-[15px] text-white ring-2 ring-white dark:ring-[#0F1724] shadow-[0_4px_16px_-4px_rgba(59,130,246,0.4)]">
                    {mitarbeiter.foto_url ? (
                      <img src={mitarbeiter.foto_url} alt={mitarbeiter.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{mitarbeiter.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0F1724]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
