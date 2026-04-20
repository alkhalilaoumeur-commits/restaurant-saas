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
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="4" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="11" width="7" height="10" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/bestellungen',
    label: 'Bestellen',
    rollen: ['admin', 'kellner', 'kueche'],
    icon: (aktiv) => (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z" />
        <path d="M15 3v4a2 2 0 002 2h4" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    to: '/tischplan',
    label: 'Tische',
    rollen: ['admin', 'kellner'],
    icon: (aktiv) => (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="4" rx="1" />
        <path d="M4 11v6M20 11v6M12 7V4" />
      </svg>
    ),
  },
  {
    to: '/reservierungen',
    label: 'Reserv.',
    rollen: ['admin', 'kellner'],
    icon: (aktiv) => (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    to: '/einstellungen',
    label: 'Mehr',
    rollen: ['admin', 'kellner', 'kueche'],
    icon: (aktiv) => (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={aktiv ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
      {/* Blur-Hintergrund */}
      <div className="absolute inset-0 bg-[#0A0F1A]/80 backdrop-blur-2xl border-t border-white/[0.07]" />

      <div className="relative flex items-stretch h-16">
        {sichtbar.map(({ to, label, icon }) => {
          const aktiv = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-90 relative"
            >
              {/* Aktiv-Indikator oben */}
              {aktiv && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              )}
              <span className={`transition-all duration-200 ${aktiv ? 'text-blue-400 scale-110' : 'text-slate-600'}`}>
                {icon(aktiv)}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${aktiv ? 'text-blue-400' : 'text-slate-600'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
