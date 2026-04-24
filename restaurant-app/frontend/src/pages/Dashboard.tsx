import { useNavigate } from 'react-router-dom';
import { useBestellungen } from '../hooks/useBestellungen';
import { useTische } from '../hooks/useTische';
import { useReservierungen } from '../hooks/useReservierungen';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatPreis, formatZeit, BESTELLUNG_STATUS_FARBE, BESTELLUNG_STATUS_LABEL, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL } from '../lib/utils';
import Topbar from '../components/layout/Topbar';
import StatKarte from '../components/dashboard/StatKarte';
import UmsatzChart from '../components/dashboard/UmsatzChart';
import AuslastungDonut from '../components/dashboard/AuslastungDonut';
import BestellVerteilung from '../components/dashboard/BestellVerteilung';

function IcoBestellung() { return <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z"/><path d="M15 3v4a2 2 0 002 2h4"/><path d="M8 13h8M8 17h5"/></svg>; }
function IcoKoch() { return <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8 6a4 4 0 013.25 3.93"/><path d="M15.75 9.93A4 4 0 0120 6"/><path d="M4 6a4 4 0 004 4"/><rect x="6" y="14" width="12" height="8" rx="2"/><path d="M6 14v-2a6 6 0 0112 0v2"/></svg>; }
function IcoEuro() { return <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12a7.9 7.9 0 007.8 8 7.7 7.7 0 005.2-2"/></svg>; }
function IcoKalender() { return <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function IcoTisch() { return <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="4" rx="1"/><path d="M4 11v6M20 11v6M12 7V4"/></svg>; }

export default function Dashboard() {
  const navigate = useNavigate();
  const { bestellungen } = useBestellungen();
  const { tische } = useTische();
  const { restaurant } = useRestaurant();
  const heute = new Date().toISOString().slice(0, 10);
  const { reservierungen: heutigeReservierungen } = useReservierungen(heute);

  const offen = bestellungen.filter((b) => b.status === 'offen').length;
  const inZubereitung = bestellungen.filter((b) => b.status === 'in_zubereitung').length;
  const tagesumsatz = bestellungen.filter((b) => b.status === 'serviert' || b.status === 'bezahlt').reduce((s, b) => s + b.gesamtpreis, 0);
  const reservierungenAktiv = heutigeReservierungen.filter((r) => r.status !== 'storniert');
  const tischeGesamt = tische.length;
  const tischeBesetzt = tische.filter((t) => t.status !== 'frei').length;
  const letzteBestellungen = bestellungen.filter((b) => b.status !== 'bezahlt').slice(0, 6);
  const naechsteReservierungen = reservierungenAktiv.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()).slice(0, 5);

  return (
    <div className="animate-fade-in-up">

      {/* ══════ MOBILE ══════ */}
      <div className="lg:hidden space-y-4">

        {/* Stat-Karten horizontal scrollbar */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Heute</p>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { label: 'Offen', wert: offen, von: 'from-amber-500', zu: 'to-orange-600', icon: <IcoBestellung /> },
              { label: 'In Arbeit', wert: inZubereitung, von: 'from-orange-500', zu: 'to-red-500', icon: <IcoKoch /> },
              { label: 'Umsatz', wert: formatPreis(tagesumsatz), von: 'from-emerald-500', zu: 'to-teal-600', icon: <IcoEuro /> },
              { label: 'Reserv.', wert: reservierungenAktiv.length, von: 'from-blue-500', zu: 'to-indigo-600', icon: <IcoKalender /> },
              { label: 'Tische', wert: `${tischeBesetzt}/${tischeGesamt}`, von: 'from-violet-500', zu: 'to-purple-600', icon: <IcoTisch /> },
            ].map(({ label, wert, von, zu, icon }) => (
              <div key={label} className={`shrink-0 w-[118px] rounded-2xl p-3.5 bg-gradient-to-br ${von} ${zu} flex flex-col gap-2`}>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">{icon}</div>
                <div>
                  <p className="text-[19px] font-bold text-white leading-none">{wert}</p>
                  <p className="text-[11px] text-white/70 font-medium mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Schnellzugriff</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Bestellung', to: '/bestellungen', licht: 'bg-amber-50 text-amber-600', dunkel: 'dark:bg-amber-500/15 dark:text-amber-400', icon: <IcoBestellung /> },
              { label: 'Tischplan', to: '/tischplan', licht: 'bg-blue-50 text-blue-600', dunkel: 'dark:bg-blue-500/15 dark:text-blue-400', icon: <IcoTisch /> },
              { label: 'Reservierung', to: '/reservierungen', licht: 'bg-violet-50 text-violet-600', dunkel: 'dark:bg-violet-500/15 dark:text-violet-400', icon: <IcoKalender /> },
              { label: 'Speisekarte', to: '/speisekarte', licht: 'bg-emerald-50 text-emerald-600', dunkel: 'dark:bg-emerald-500/15 dark:text-emerald-400', icon: <IcoKoch /> },
            ].map(({ label, to, licht, dunkel, icon }) => (
              <button key={to} onClick={() => navigate(to)}
                className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] active:scale-95 transition-transform duration-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${licht} ${dunkel}`}>{icon}</div>
                <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aktive Bestellungen */}
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] overflow-hidden shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[13px] font-semibold text-gray-800 dark:text-slate-200">Aktive Bestellungen</p>
            </div>
            <button onClick={() => navigate('/bestellungen')} className="text-[11px] text-blue-500 font-semibold">Alle →</button>
          </div>
          {letzteBestellungen.length === 0
            ? <p className="text-[13px] text-gray-400 dark:text-slate-500 px-4 py-4 text-center">Keine aktiven Bestellungen</p>
            : <div className="divide-y divide-gray-50 dark:divide-white/[0.05]">
              {letzteBestellungen.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-gray-600 dark:text-slate-300 shrink-0">T{b.tisch_nummer}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-800 dark:text-slate-200 truncate">{b.positionen.map((p) => `${p.menge}× ${p.gericht_name}`).join(', ')}</p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{formatZeit(b.erstellt_am)} · {formatPreis(b.gesamtpreis)}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>{BESTELLUNG_STATUS_LABEL[b.status]}</span>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Reservierungen */}
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] overflow-hidden shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-[13px] font-semibold text-gray-800 dark:text-slate-200">Reservierungen heute</p>
            </div>
            <button onClick={() => navigate('/reservierungen')} className="text-[11px] text-blue-500 font-semibold">Alle →</button>
          </div>
          {naechsteReservierungen.length === 0
            ? <p className="text-[13px] text-gray-400 dark:text-slate-500 px-4 py-4 text-center">Keine Reservierungen heute</p>
            : <div className="divide-y divide-gray-50 dark:divide-white/[0.05]">
              {naechsteReservierungen.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-300 shrink-0">{formatZeit(r.datum)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-800 dark:text-slate-200">{r.gast_name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{r.personen} Personen</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${RESERVIERUNG_STATUS_FARBE[r.status]}`}>{RESERVIERUNG_STATUS_LABEL[r.status]}</span>
                </div>
              ))}
            </div>
          }
        </div>

      </div>

      {/* ══════ DESKTOP ══════ */}
      <div className="hidden lg:block">
        <Topbar titel="Dashboard" untertitel={restaurant?.name || 'Willkommen zurück'} />
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Offene Bestellungen', wert: offen, icon: <IcoBestellung />, farbe: 'bg-amber-500' },
            { label: 'In Zubereitung',      wert: inZubereitung, icon: <IcoKoch />, farbe: 'bg-orange-500' },
            { label: 'Tagesumsatz',         wert: formatPreis(tagesumsatz), icon: <IcoEuro />, farbe: 'bg-emerald-500' },
            { label: 'Reservierungen',      wert: reservierungenAktiv.length, icon: <IcoKalender />, farbe: 'bg-blue-500' },
            { label: 'Tische belegt',       wert: `${tischeBesetzt}/${tischeGesamt}`, icon: <IcoTisch />, farbe: 'bg-violet-500' },
          ].map((s, i) => (
            <div key={s.label} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}>
              <StatKarte label={s.label} wert={s.wert} icon={s.icon} akzentFarbe={s.farbe} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 animate-fade-in-up opacity-0" style={{ animationDelay: '380ms', animationFillMode: 'forwards' }}>
            <UmsatzChart bestellungen={bestellungen} />
          </div>
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
            <AuslastungDonut tische={tische} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '520ms', animationFillMode: 'forwards' }}>
            <BestellVerteilung bestellungen={bestellungen} />
          </div>
          <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden card-hover animate-fade-in-up opacity-0" style={{ animationDelay: '590ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2"><div className="w-1.5 h-5 rounded-full bg-orange-400 animate-pulse-dot" /><p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Aktive Bestellungen</p></div>
              <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">{letzteBestellungen.length} aktiv</span>
            </div>
            <div className="px-5 pb-5 space-y-1.5">
              {letzteBestellungen.length === 0 ? <p className="text-sm text-gray-400 dark:text-slate-500 italic px-2">Keine aktiven Bestellungen.</p>
                : letzteBestellungen.map((b, i) => (
                  <div key={b.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-white/[0.05] transition-all duration-200 animate-fade-in-up opacity-0 cursor-pointer hover:translate-x-0.5" style={{ animationDelay: `${700 + i * 60}ms`, animationFillMode: 'forwards' }}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 ring-1 ring-slate-200/50 dark:ring-white/10 group-hover:ring-amber-300/50 group-hover:scale-105 transition-all duration-200">T{b.tisch_nummer}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-gray-800 dark:text-slate-200 truncate">{b.positionen.map((p) => `${p.menge}x ${p.gericht_name}`).join(', ')}</p><p className="text-xs text-gray-400 dark:text-slate-500">{formatPreis(b.gesamtpreis)}</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>{BESTELLUNG_STATUS_LABEL[b.status]}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden card-hover animate-fade-in-up opacity-0" style={{ animationDelay: '660ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2"><div className="w-1.5 h-5 rounded-full bg-blue-400 animate-pulse-dot" /><p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Reservierungen heute</p></div>
              <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">{naechsteReservierungen.length} heute</span>
            </div>
            <div className="px-5 pb-5 space-y-1.5">
              {naechsteReservierungen.length === 0 ? <p className="text-sm text-gray-400 dark:text-slate-500 italic px-2">Keine Reservierungen heute.</p>
                : naechsteReservierungen.map((r, i) => (
                  <div key={r.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-white/[0.05] transition-all duration-200 animate-fade-in-up opacity-0 cursor-pointer hover:translate-x-0.5" style={{ animationDelay: `${760 + i * 60}ms`, animationFillMode: 'forwards' }}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 ring-1 ring-blue-200/50 dark:ring-blue-500/20 group-hover:ring-blue-300 dark:group-hover:ring-blue-400/50 group-hover:scale-105 transition-all duration-200">{formatZeit(r.datum)}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-gray-800 dark:text-slate-200">{r.gast_name}</p><p className="text-xs text-gray-400 dark:text-slate-500">{r.personen} Personen</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${RESERVIERUNG_STATUS_FARBE[r.status]}`}>{RESERVIERUNG_STATUS_LABEL[r.status]}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
