import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/bestellungen', label: 'Bestellungen' },
  { to: '/admin/tische', label: 'Tische' },
  { to: '/admin/speisekarte', label: 'Speisekarte' },
  { to: '/admin/reservierungen', label: 'Reservierungen' },
  { to: '/admin/mitarbeiter', label: 'Mitarbeiter' },
];

export default function AdminLayout() {
  const { mitarbeiter, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-brand-600">Restaurant SaaS</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">{mitarbeiter?.name}</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm rounded mx-2 mb-1 ${
                  isActive
                    ? 'bg-brand-100 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-500 hover:text-red-600"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
