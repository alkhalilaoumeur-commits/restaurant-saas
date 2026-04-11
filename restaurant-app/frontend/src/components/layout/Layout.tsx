import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ReservierungToast from './ReservierungToast';
import AbwesenheitToast from './AbwesenheitToast';

export default function Layout() {
  const [sidebarOffen, setSidebarOffen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f8fa] dark:bg-[#0A0F1A] overflow-hidden">
      {/* Toast-Benachrichtigungen für neue Online-Reservierungen */}
      <ReservierungToast />
      {/* Toast-Benachrichtigungen bei Abwesenheits-Konflikten (Schicht betroffen) */}
      <AbwesenheitToast />

      {/* Desktop: Sidebar immer sichtbar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile: Sidebar als Drawer mit Overlay */}
      {sidebarOffen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOffen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-[260px] h-full animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onSchliessen={() => setSidebarOffen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
          {/* Mobile: Hamburger-Button */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center mb-4 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors active:scale-95 ring-1 ring-black/5 dark:ring-white/10"
            onClick={() => setSidebarOffen(true)}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
