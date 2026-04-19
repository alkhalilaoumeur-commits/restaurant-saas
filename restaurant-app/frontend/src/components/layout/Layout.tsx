import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ReservierungToast from './ReservierungToast';
import AbwesenheitToast from './AbwesenheitToast';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#f8f8fa] dark:bg-[#0A0F1A] overflow-hidden">
      <ReservierungToast />
      <AbwesenheitToast />

      {/* Desktop: Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Hauptinhalt */}
      <main className="flex-1 overflow-auto">
        {/* Mobile: safe area oben (Notch) + Platz für Bottom Nav unten */}
        <div className="p-4 pt-safe pb-24 lg:pb-8 lg:p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>

      {/* Mobile: Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
