import { useAuthStore } from '../../store/auth';
import { useRestaurant } from '../../hooks/useRestaurant';

export default function AppHeader() {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const { restaurant } = useRestaurant();

  return (
    <header
      className="lg:hidden w-full bg-white/95 dark:bg-[#0A0F1A]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] flex-shrink-0"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[12px] font-bold text-white shrink-0">
          {mitarbeiter?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-widest leading-none">ServeFlow</p>
          <p className="text-[14px] font-semibold text-gray-900 dark:text-slate-100 truncate">{restaurant?.name || 'Restaurant'}</p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
        </div>
      </div>
    </header>
  );
}
