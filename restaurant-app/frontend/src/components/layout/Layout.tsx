import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import AppHeader from './AppHeader';
import ReservierungToast from './ReservierungToast';
import AbwesenheitToast from './AbwesenheitToast';
import LegalLinks from '../LegalLinks';
import RechtsdokumenteBanner from '../RechtsdokumenteBanner';

export default function Layout() {
  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row bg-[#f8f8fa] dark:bg-[#0A0F1A] overflow-hidden">
      <ReservierungToast />
      <AbwesenheitToast />

      {/* Desktop: Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile: App-Header */}
        <AppHeader />

        {/* AGB/AVV-Banner (nur Admin, nur wenn Versions-Mismatch) */}
        <RechtsdokumenteBanner />

        {/* Scrollbarer Inhalt */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8">
            <Outlet />
          </div>
          {/* Footer mit Rechts-Links — wird mit dem Inhalt mitgescrollt */}
          <div className="px-4 pb-24 lg:px-8 lg:pb-6">
            <LegalLinks />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
