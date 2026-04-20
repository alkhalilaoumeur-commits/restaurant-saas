import { useAuthStore } from '../../store/auth';
import { useRestaurant } from '../../hooks/useRestaurant';

interface AppHeaderProps {
  titel: string;
  zurueck?: () => void;
  aktion?: React.ReactNode;
}

export default function AppHeader({ titel, zurueck, aktion }: AppHeaderProps) {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const { restaurant } = useRestaurant();

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[#0A0F1A]/90 backdrop-blur-xl border-b border-white/[0.06] pt-safe">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Links: Zurück oder Avatar */}
        <div className="w-10">
          {zurueck ? (
            <button
              onClick={zurueck}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 active:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[12px] font-bold text-white">
              {mitarbeiter?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Mitte: Titel */}
        <div className="flex-1 text-center">
          {!zurueck && restaurant?.name ? (
            <div>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-none mb-0.5">ServeFlow</p>
              <p className="text-[15px] font-semibold text-slate-100 leading-tight truncate px-2">{restaurant.name}</p>
            </div>
          ) : (
            <p className="text-[16px] font-semibold text-slate-100">{titel}</p>
          )}
        </div>

        {/* Rechts: Aktion */}
        <div className="w-10 flex justify-end">
          {aktion || (
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" title="Online" />
          )}
        </div>
      </div>
    </header>
  );
}
