import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',      rollen: ['admin', 'kellner', 'kueche'] },
  { to: '/bestellungen',  label: 'Bestellungen',   rollen: ['admin', 'kellner', 'kueche'] },
  { to: '/tischplan',     label: 'Tischplan',      rollen: ['admin', 'kellner'] },
  { to: '/reservierungen',label: 'Reservierungen', rollen: ['admin', 'kellner'] },
  { to: '/speisekarte',   label: 'Speisekarte',    rollen: ['admin'] },
  { to: '/statistiken',   label: 'Statistiken',    rollen: ['admin'] },
] as const;

export default function Sidebar() {
  const { mitarbeiter, logout } = useAuthStore();

  const sichtbar = NAV.filter((item) =>
    mitarbeiter ? item.rollen.includes(mitarbeiter.rolle as never) : false
  );

  return (
    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
      <div className="px-5 py-4 border-b">
        <p className="text-base font-bold text-orange-600">Restaurant</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{mitarbeiter?.name}</p>
      </div>

      <nav className="flex-1 py-3 space-y-0.5">
        {sichtbar.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Abmelden
        </button>
      </div>
    </aside>
  );
}
