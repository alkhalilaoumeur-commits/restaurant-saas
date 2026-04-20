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

      {/* ════════════════════ MOBILE ════════════════════ */}
      <div className="lg:hidden space-y-4">

        {/* Horizontale Stat-Karten */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Heute</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {[
              { label: 'Offen', wert: offen, von: 'from-amber-500', zu: 'to-orange-600', icon: <IcoBestellung /> },
              { label: 'In Arbeit', wert: inZubereitung, von: 'from-orange-500', zu: 'to-red-500', icon: <IcoKoch /> },
              { label: 'Umsatz', wert: formatPreis(tagesumsatz), von: 'from-emerald-500', zu: 'to-teal-600', icon: <IcoEuro /> },
              { label: 'Reserv.', wert: reservierungenAktiv.length, von: 'from-blue-500', zu: 'to-indigo-600', icon: <IcoKalender /> },
              { label: 'Tische', wert: `${tischeBesetzt}/${tischeGesamt}`, von: 'from-violet-500', zu: 'to-purple-600', icon: <IcoTisch /> },
            ].map(({ label, wert, von, zu, icon }) => (
              <div key={label} className={`snap-start shrink-0 w-[120px] rounded-2xl p-3.5 bg-gradient-to-br ${von} ${zu} flex flex-col gap-2`}>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">{icon}</div>
                <div>
                  <p className="text-[20px] font-bold text-white leading-none">{wert}</p>
                  <p className="text-[11px] text-white/70 font-medium mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Schnellzugriff</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Bestellung', to: '/bestellungen', farbe: 'bg-amber-500/15 text-amber-400', icon: <IcoBestellung /> },
              { label: 'Tischplan', to: '/tischplan', farbe: 'bg-blue-500/15 text-blue-400', icon: <IcoTisch /> },
              { label: 'Reservierung', to: '/reservierungen', farbe: 'bg-violet-500/15 text-violet-400', icon: <IcoKalender /> },
              { label: 'Speisekarte', to: '/speisekarte', farbe: 'bg-emerald-500/15 text-emerald-400', icon: <IcoKoch /> },
            ].map(({ label, to, farbe, icon }) => (
              <button key={to} onClick={() => navigate(to)} className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] active:scale-95 transition-transform duration-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${farbe}`}>{icon}</div>
                <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aktive Bestellungen */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[13px] font-semibold text-slate-200">Aktive Bestellungen</p>
            </div>
            <button onClick={() => navigate('/bestellungen')} className="text-[11px] text-blue-400 font-medium">Alle →</button>
          </div>
          {letzteBestellungen.length === 0
            ? <p className="text-[13px] text-slate-500 px-4 py-4 text-center">Keine aktiven Bestellungen</p>
            : <div className="divide-y divide-white/[0.05]">
              {letzteBestellungen.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0">T{b.tisch_nummer}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-slate-200 truncate">{b.positionen.map((p) => `${p.menge}× ${p.gericht_name}`).join(', ')}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{formatZeit(b.erstellt_am)} · {formatPreis(b.gesamtpreis)}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>{BESTELLUNG_STATUS_LABEL[b.status]}</span>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Reservierungen heute */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-[13px] font-semibold text-slate-200">Reservierungen heute</p>
            </div>
            <button onClick={() => navigate('/reservierungen')} className="text-[11px] text-blue-400 font-medium">Alle →</button>
          </div>
          {naechsteReservierungen.length === 0
            ? <p className="text-[13px] text-slate-500 px-4 py-4 text-center">Keine Reservierungen heute</p>
            : <div className="divide-y divide-white/[0.05]">
              {naechsteReservierungen.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-300 shrink-0">{formatZeit(r.datum)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-slate-200">{r.gast_name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.personen} Personen</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${RESERVIERUNG_STATUS_FARBE[r.status]}`}>{RESERVIERUNG_STATUS_LABEL[r.status]}</span>
                </div>
              ))}
            </div>
          }
        </div>

      </div>

      {/* ════════════════════ DESKTOP ════════════════════ */}
      <div className="hidden lg:block">
        <Topbar titel="Dashboard" untertitel={restaurant?.name || 'Willkommen zurück'} />
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatKarte label="Offene Bestellungen" wert={offen} icon={<IcoBestellung />} akzentFarbe="bg-amber-500" />
          <StatKarte label="In Zubereitung" wert={inZubereitung} icon={<IcoKoch />} akzentFarbe="bg-orange-500" />
          <StatKarte label="Tagesumsatz" wert={formatPreis(tagesumsatz)} icon={<IcoEuro />} akzentFarbe="bg-emerald-500" />
          <StatKarte label="Reservierungen" wert={reservierungenAktiv.length} icon={<IcoKalender />} akzentFarbe="bg-blue-500" />
          <StatKarte label="Tische belegt" wert={`${tischeBesetzt}/${tischeGesamt}`} icon={<IcoTisch />} akzentFarbe="bg-violet-500" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2"><UmsatzChart bestellungen={bestellungen} /></div>
          <AuslastungDonut tische={tische} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <BestellVerteilung bestellungen={bestellungen} />
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2"><div className="w-1.5 h-5 rounded-full bg-orange-400" /><p className="text-sm font-semibold text-slate-200">Aktive Bestellungen</p></div>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{letzteBestellungen.length}</span>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {letzteBestellungen.length === 0 ? <p className="text-sm text-slate-500">Keine aktiven Bestellungen.</p>
                : letzteBestellungen.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">T{b.tisch_nummer}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-slate-200 truncate">{b.positionen.map((p) => `${p.menge}x ${p.gericht_name}`).join(', ')}</p><p className="text-xs text-slate-500">{formatPreis(b.gesamtpreis)}</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>{BESTELLUNG_STATUS_LABEL[b.status]}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2"><div className="w-1.5 h-5 rounded-full bg-blue-400" /><p className="text-sm font-semibold text-slate-200">Reservierungen heute</p></div>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{naechsteReservierungen.length}</span>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {naechsteReservierungen.length === 0 ? <p className="text-sm text-slate-500">Keine Reservierungen heute.</p>
                : naechsteReservierungen.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-300">{formatZeit(r.datum)}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-slate-200">{r.gast_name}</p><p className="text-xs text-slate-500">{r.personen} Personen</p></div>
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
