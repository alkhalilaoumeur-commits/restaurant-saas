import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import AppHeader from './AppHeader';
import ReservierungToast from './ReservierungToast';
import AbwesenheitToast from './AbwesenheitToast';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#0A0F1A] overflow-hidden">
      <ReservierungToast />
      <AbwesenheitToast />

      {/* Desktop: Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile: App-Header oben */}
        <AppHeader titel="ServeFlow" />

        {/* Hauptinhalt */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8 max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile: Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
