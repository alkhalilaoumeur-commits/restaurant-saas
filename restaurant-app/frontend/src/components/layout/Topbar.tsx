import { useAuthStore } from '../../store/auth';

interface TopbarProps {
  titel: string;
  untertitel?: string;
  aktion?: React.ReactNode;
}

export default function Topbar({ titel, untertitel, aktion }: TopbarProps) {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);

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

      {/* Desktop: vollständige Topbar mit Titel + Aktionen */}
      <div className="hidden lg:flex items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="text-[22px] font-heading font-semibold text-gray-900 dark:text-slate-50 tracking-[-0.02em]">{titel}</h1>
          {untertitel && <p className="text-[13px] text-gray-400 dark:text-slate-500 mt-0.5">{untertitel}</p>}
        </div>
        <div className="flex items-center gap-3">
          {aktion && <div>{aktion}</div>}
          {mitarbeiter && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[13px] font-semibold text-white ring-2 ring-white dark:ring-white/10 shadow-sm">
                {mitarbeiter.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="text-[13px] font-medium text-gray-600 dark:text-slate-400 hidden lg:block">{mitarbeiter.name}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
