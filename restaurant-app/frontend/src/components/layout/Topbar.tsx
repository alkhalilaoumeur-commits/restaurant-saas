import { useAuthStore } from '../../store/auth';

interface TopbarProps {
  titel: string;
  untertitel?: string;
  aktion?: React.ReactNode;
}

export default function Topbar({ titel, untertitel, aktion }: TopbarProps) {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const demo = useAuthStore((s) => s.demo);

  return (
    <>
      {/* Mobile: Untertitel (falls vorhanden) + Aktionen */}
      {(untertitel || aktion) && (
        <div className="lg:hidden flex items-center justify-between mb-4">
          {untertitel
            ? <p className="text-xs text-gray-400 dark:text-slate-500">{untertitel}</p>
            : <span />
          }
          {aktion && <div>{aktion}</div>}
        </div>
      )}

      {/* Desktop: Premium Topbar mit Titel + Demo-Badge + Profile */}
      <div className="hidden lg:flex items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-heading font-semibold text-gray-900 dark:text-slate-50 tracking-[-0.02em] truncate">
              {titel}
            </h1>
            {demo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-dot" />
                Demo
              </span>
            )}
          </div>
          {untertitel && (
            <p className="text-[13px] text-gray-500 dark:text-slate-400 mt-1">{untertitel}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {aktion && <div>{aktion}</div>}

          {mitarbeiter && (
            <div className="flex items-center gap-2.5 pl-4 ml-1 border-l border-gray-200 dark:border-white/10">
              <div className="text-right hidden xl:block">
                <p className="text-[13px] font-medium text-gray-800 dark:text-slate-200 leading-tight">{mitarbeiter.name}</p>
                {mitarbeiter.rolle && (
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 capitalize mt-0.5">{mitarbeiter.rolle}</p>
                )}
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[13px] font-semibold text-white ring-2 ring-white dark:ring-[#0F1724] shadow-md shadow-blue-500/20">
                  {mitarbeiter.foto_url ? (
                    <img src={mitarbeiter.foto_url} alt={mitarbeiter.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{mitarbeiter.name?.charAt(0)?.toUpperCase() || '?'}</span>
                  )}
                </div>
                {/* Online-Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0F1724]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
