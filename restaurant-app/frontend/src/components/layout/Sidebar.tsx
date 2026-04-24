import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useAboStore } from '../../store/abo';
import { planHatZugriff, PLAN_ROUTEN, Plan } from '../../lib/plan-config';
import { Rolle } from '../../types';
import ServeFlowLogo from '../brand/ServeFlowLogo';

// ─── Icon-Komponenten (inline SVG) ──────────────────────────────────────────

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="4" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="11" width="7" height="10" rx="1" />
    </svg>
  );
}

function IconBestellungen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z" />
      <path d="M15 3v4a2 2 0 002 2h4" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function IconTischplan({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="4" rx="1" />
      <path d="M4 11v6" />
      <path d="M20 11v6" />
      <path d="M12 7V4" />
    </svg>
  );
}

function IconReservierungen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function IconDienstplan({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M7 14h2v2H7z" />
      <path d="M11 14h2v2h-2z" />
      <path d="M15 14h2v2h-2z" />
    </svg>
  );
}

function IconSpeisekarte({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3" />
      <path d="M18 22v-7" />
    </svg>
  );
}

function IconStatistiken({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-5 4 3 5-6" />
    </svg>
  );
}

function IconMitarbeiter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconGaeste({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconBewertungen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconInventur({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14" />
      <path d="M5 12h14" />
      <path d="M5 16h6" />
      <rect x="2" y="3" width="20" height="18" rx="2" />
    </svg>
  );
}

function IconWarteliste({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 11l-4 4-2-2" />
    </svg>
  );
}

function IconErlebnisse({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconEinstellungen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconAbmelden({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ─── Navigations-Konfiguration ──────────────────────────────────────────────

interface NavItem {
  to: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  rollen: Rolle[];
  plan?: Plan;
}

interface NavSection {
  titel: string;
  items: NavItem[];
}

const SEKTIONEN: NavSection[] = [
  {
    titel: 'Betrieb',
    items: [
      { to: '/dashboard',      label: 'Dashboard',      icon: IconDashboard,      rollen: ['admin', 'kellner', 'kueche'], plan: 'basis' },
      { to: '/bestellungen',   label: 'Bestellungen',   icon: IconBestellungen,   rollen: ['admin', 'kellner', 'kueche'], plan: 'basis' },
      { to: '/tischplan',      label: 'Tischplan',      icon: IconTischplan,      rollen: ['admin', 'kellner'],           plan: 'basis' },
      { to: '/reservierungen', label: 'Reservierungen', icon: IconReservierungen, rollen: ['admin', 'kellner'],           plan: 'basis' },
      { to: '/warteliste',     label: 'Warteliste',     icon: IconWarteliste,     rollen: ['admin', 'kellner'],           plan: 'standard' },
      { to: '/dienstplan',     label: 'Dienstplan',     icon: IconDienstplan,     rollen: ['admin', 'kellner', 'kueche'], plan: 'standard' },
    ],
  },
  {
    titel: 'Verwaltung',
    items: [
      { to: '/speisekarte',   label: 'Speisekarte',   icon: IconSpeisekarte,   rollen: ['admin'], plan: 'basis' },
      { to: '/mitarbeiter',   label: 'Mitarbeiter',   icon: IconMitarbeiter,   rollen: ['admin'], plan: 'standard' },
      { to: '/gaeste',        label: 'Gäste',         icon: IconGaeste,        rollen: ['admin'], plan: 'standard' },
      { to: '/bewertungen',   label: 'Bewertungen',   icon: IconBewertungen,   rollen: ['admin'], plan: 'standard' },
      { to: '/erlebnisse',    label: 'Erlebnisse',    icon: IconErlebnisse,    rollen: ['admin'], plan: 'pro' },
      { to: '/inventur',      label: 'Inventur',      icon: IconInventur,      rollen: ['admin'], plan: 'pro' },
      { to: '/statistiken',   label: 'Statistiken',   icon: IconStatistiken,   rollen: ['admin'], plan: 'pro' },
      { to: '/einstellungen', label: 'Einstellungen', icon: IconEinstellungen, rollen: ['admin'], plan: 'basis' },
    ],
  },
];

const ROLLEN_LABEL: Record<Rolle, string> = {
  admin: 'Administrator',
  kellner: 'Kellner',
  kueche: 'Küche',
};

const ROLLEN_FARBE: Record<Rolle, string> = {
  admin: 'bg-violet-400/20 text-violet-300',
  kellner: 'bg-sky-400/20 text-sky-300',
  kueche: 'bg-amber-400/20 text-amber-300',
};

// ─── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  onSchliessen?: () => void;
}

export default function Sidebar({ onSchliessen }: SidebarProps) {
  const { mitarbeiter, logout } = useAuthStore();
  const { plan } = useAboStore();
  const location = useLocation();

  return (
    <aside className="relative w-[260px] bg-[#1e293b] dark:bg-[#0F1724] flex flex-col shrink-0 select-none overflow-hidden">

      {/* Dekorativer Gradient-Glow oben — subtil */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-3xl pointer-events-none" aria-hidden />

      {/* ── Logo & App-Name ──────────────────────────────────────── */}
      <div className="relative px-5 pt-6 pb-5">
        <ServeFlowLogo variante="voll" groesse="md" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4" />

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="relative flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {SEKTIONEN.map((sektion) => {
          const sichtbar = sektion.items.filter((item) => {
            if (!mitarbeiter || !item.rollen.includes(mitarbeiter.rolle)) return false;
            const benoetigterPlan = item.plan ?? PLAN_ROUTEN[item.to];
            if (!benoetigterPlan) return true;
            return planHatZugriff(plan, benoetigterPlan);
          });
          if (sichtbar.length === 0) return null;

          return (
            <div key={sektion.titel}>
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]">
                {sektion.titel}
              </p>
              <div className="space-y-0.5">
                {sichtbar.map(({ to, label, icon: Icon }) => {
                  const aktiv = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onSchliessen}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200
                        ${aktiv
                          ? 'text-white'
                          : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                        }
                      `}
                    >
                      {/* Aktiver Background mit Gradient + Glow */}
                      {aktiv && (
                        <>
                          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent" />
                          <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                        </>
                      )}
                      <Icon className={`relative w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${aktiv ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="relative">{label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Benutzer-Bereich (unten) ────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="px-4 py-4">
          {/* Benutzer-Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg shrink-0 overflow-hidden ring-1 ring-white/10">
              {mitarbeiter?.foto_url ? (
                <img src={mitarbeiter.foto_url} alt={mitarbeiter.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[13px] font-semibold text-slate-200">
                  {mitarbeiter?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-slate-200 truncate">{mitarbeiter?.name}</p>
              {mitarbeiter?.rolle && (
                <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${ROLLEN_FARBE[mitarbeiter.rolle]}`}>
                  {ROLLEN_LABEL[mitarbeiter.rolle]}
                </span>
              )}
            </div>
          </div>

          {/* Abmelden */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all duration-150 cursor-pointer"
          >
            <IconAbmelden className="w-4 h-4" />
            <span>Abmelden</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
