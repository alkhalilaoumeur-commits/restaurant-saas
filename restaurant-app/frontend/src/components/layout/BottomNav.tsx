import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Rolle } from '../../types';

interface NavItem {
  to: string;
  label: string;
  rollen: Rolle[];
  icon: (aktiv: boolean) => React.ReactNode;
}

const HAUPT_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Übersicht',
    rollen: ['admin', 'kellner', 'kueche'],
    icon: (aktiv) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="4" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="11" width="7" height="10" rx="1" />
      </svg>
    ),
  },
  {
    to: '/bestellungen',
    label: 'Bestellungen',
    rollen: ['admin', 'kellner', 'kueche'],
    icon: (aktiv) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z" />
        <path d="M15 3v4a2 2 0 002 2h4" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    ),
  },
  {
    to: '/tischplan',
    label: 'Tische',
    rollen: ['admin', 'kellner'],
    icon: (aktiv) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="4" rx="1" />
        <path d="M4 11v6" />
        <path d="M20 11v6" />
        <path d="M12 7V4" />
      </svg>
    ),
  },
  {
    to: '/reservierungen',
    label: 'Reservierung',
    rollen: ['admin', 'kellner'],
    icon: (aktiv) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    to: '/speisekarte',
    label: 'Mehr',
    rollen: ['admin', 'kellner', 'kueche'],
    icon: (aktiv) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { mitarbeiter } = useAuthStore();
  const location = useLocation();

  const sichtbar = HAUPT_ITEMS.filter((item) =>
    mitarbeiter ? item.rollen.includes(mitarbeiter.rolle) : false
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1724]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-stretch h-16">
        {sichtbar.map(({ to, label, icon }) => {
          const aktiv = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-90"
            >
              <span className={`transition-colors duration-150 ${aktiv ? 'text-blue-400' : 'text-slate-500'}`}>
                {icon(aktiv)}
              </span>
              <span className={`text-[10px] font-medium transition-colors duration-150 ${aktiv ? 'text-blue-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
