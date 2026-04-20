import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Rolle } from '../../types';

interface NavItem { to: string; label: string; rollen: Rolle[]; icon: (a: boolean) => React.ReactNode; }
interface MehrItem { to: string; label: string; beschreibung: string; rollen: Rolle[]; farbe: string; icon: React.ReactNode; }

const HAUPT: NavItem[] = [
  { to: '/dashboard', label: 'Übersicht', rollen: ['admin', 'kellner', 'kueche'], icon: (a) => <svg className="w-6 h-6" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="11" width="7" height="10" rx="1.5"/></svg> },
  { to: '/bestellungen', label: 'Bestellen', rollen: ['admin', 'kellner', 'kueche'], icon: (a) => <svg className="w-6 h-6" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z"/><path d="M15 3v4a2 2 0 002 2h4M8 13h8M8 17h5"/></svg> },
  { to: '/tischplan', label: 'Tische', rollen: ['admin', 'kellner'], icon: (a) => <svg className="w-6 h-6" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="4" rx="1"/><path d="M4 11v6M20 11v6M12 7V4"/></svg> },
  { to: '/reservierungen', label: 'Reserv.', rollen: ['admin', 'kellner'], icon: (a) => <svg className="w-6 h-6" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
];

const MEHR: MehrItem[] = [
  { to: '/speisekarte', label: 'Speisekarte', beschreibung: 'Gerichte & Kategorien', rollen: ['admin'], farbe: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3M18 22v-7"/></svg> },
  { to: '/dienstplan', label: 'Dienstplan', beschreibung: 'Schichten & Mitarbeiter', rollen: ['admin', 'kellner', 'kueche'], farbe: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M7 14h2v2H7zM11 14h2v2h-2zM15 14h2v2h-2z"/></svg> },
  { to: '/warteliste', label: 'Warteliste', beschreibung: 'Wartende Gäste', rollen: ['admin', 'kellner'], farbe: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11l-4 4-2-2"/></svg> },
  { to: '/mitarbeiter', label: 'Mitarbeiter', beschreibung: 'Team verwalten', rollen: ['admin'], farbe: 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/gaeste', label: 'Gäste', beschreibung: 'Gästedatenbank', rollen: ['admin'], farbe: 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/erlebnisse', label: 'Erlebnisse', beschreibung: 'Events & Pakete', rollen: ['admin'], farbe: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg> },
  { to: '/bewertungen', label: 'Bewertungen', beschreibung: 'Gäste-Feedback', rollen: ['admin'], farbe: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { to: '/inventur', label: 'Inventur', beschreibung: 'Lagerbestand', rollen: ['admin'], farbe: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 12h14M5 16h6"/><rect x="2" y="3" width="20" height="18" rx="2"/></svg> },
  { to: '/statistiken', label: 'Statistiken', beschreibung: 'Auswertungen', rollen: ['admin'], farbe: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 16l4-5 4 3 5-6"/></svg> },
  { to: '/einstellungen', label: 'Einstellungen', beschreibung: 'Konto & App', rollen: ['admin', 'kellner', 'kueche'], farbe: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/></svg> },
];

export default function BottomNav() {
  const [mehrOffen, setMehrOffen] = useState(false);
  const { mitarbeiter, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const hauptSichtbar = HAUPT.filter((i) => mitarbeiter ? i.rollen.includes(mitarbeiter.rolle) : false);
  const mehrSichtbar = MEHR.filter((i) => mitarbeiter ? i.rollen.includes(mitarbeiter.rolle) : false);
  const mehrAktiv = mehrSichtbar.some((i) => location.pathname === i.to);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="absolute inset-0 bg-white/90 dark:bg-[#0A0F1A]/85 backdrop-blur-2xl border-t border-gray-200 dark:border-white/[0.08]" />
        <div className="relative flex items-stretch h-16">
          {hauptSichtbar.map(({ to, label, icon }) => {
            const aktiv = location.pathname === to;
            return (
              <NavLink key={to} to={to} className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform duration-100 relative">
                {aktiv && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />}
                <span className={aktiv ? 'text-blue-500' : 'text-gray-400 dark:text-slate-600'}>{icon(aktiv)}</span>
                <span className={`text-[10px] font-semibold ${aktiv ? 'text-blue-500' : 'text-gray-400 dark:text-slate-600'}`}>{label}</span>
              </NavLink>
            );
          })}
          <button onClick={() => setMehrOffen(true)} className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform duration-100 relative">
            {mehrAktiv && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5" cy="12" r="1.5" className={mehrAktiv || mehrOffen ? 'fill-blue-500 stroke-blue-500' : 'fill-gray-400 stroke-gray-400 dark:fill-slate-600 dark:stroke-slate-600'} />
              <circle cx="12" cy="12" r="1.5" className={mehrAktiv || mehrOffen ? 'fill-blue-500 stroke-blue-500' : 'fill-gray-400 stroke-gray-400 dark:fill-slate-600 dark:stroke-slate-600'} />
              <circle cx="19" cy="12" r="1.5" className={mehrAktiv || mehrOffen ? 'fill-blue-500 stroke-blue-500' : 'fill-gray-400 stroke-gray-400 dark:fill-slate-600 dark:stroke-slate-600'} />
            </svg>
            <span className={`text-[10px] font-semibold ${mehrAktiv || mehrOffen ? 'text-blue-500' : 'text-gray-400 dark:text-slate-600'}`}>Mehr</span>
          </button>
        </div>
      </nav>

      {mehrOffen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setMehrOffen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#0F1724] rounded-t-3xl border-t border-gray-200 dark:border-white/[0.08] animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
            </div>
            <div className="px-5 pb-3">
              <p className="text-[16px] font-semibold text-gray-900 dark:text-slate-100">Alle Bereiche</p>
              <p className="text-[12px] text-gray-500 dark:text-slate-500 mt-0.5">Vollständiger Zugriff auf alle Funktionen</p>
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto">
              {mehrSichtbar.map(({ to, label, beschreibung, farbe, icon }) => (
                <button key={to} onClick={() => { navigate(to); setMehrOffen(false); }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] active:scale-95 transition-transform text-left ${location.pathname === to ? 'ring-1 ring-blue-500/40' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${farbe}`}>{icon}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-200 truncate">{label}</p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-500 truncate">{beschreibung}</p>
                  </div>
                </button>
              ))}
              <button onClick={() => { logout(); setMehrOffen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 active:scale-95 transition-transform text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </div>
                <div><p className="text-[13px] font-semibold text-red-500 dark:text-red-400">Abmelden</p><p className="text-[11px] text-gray-500 dark:text-slate-500">Session beenden</p></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
