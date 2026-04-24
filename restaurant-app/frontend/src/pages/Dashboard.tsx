import { useNavigate } from 'react-router-dom';
import { useBestellungen } from '../hooks/useBestellungen';
import { useTische } from '../hooks/useTische';
import { useReservierungen } from '../hooks/useReservierungen';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatPreis, formatZeit, BESTELLUNG_STATUS_FARBE, BESTELLUNG_STATUS_LABEL, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL } from '../lib/utils';
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

      {/* ══════ DESKTOP — EDITORIAL DASHBOARD ══════ */}
      <div className="hidden lg:block">

        {/* ─── HERO METRIC ─── */}
        <header className="mb-12 pb-8 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-end justify-between gap-8 flex-wrap">

            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-cyan-400 mb-3 flex items-center gap-3">
                <span>§ 01</span>
                <span className="h-px w-10 bg-blue-600/30 dark:bg-cyan-400/30" />
                <span>Tagesumsatz</span>
                <span className="ml-auto text-slate-400 dark:text-slate-600">
                  {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
                </span>
              </div>

              <h1 className="font-display font-light text-[88px] leading-[0.9] tracking-[-0.04em] text-slate-900 dark:text-white nums">
                {formatPreis(tagesumsatz)}
              </h1>

              <p className="mt-4 font-sans text-[14px] text-slate-500 dark:text-slate-400">
                {restaurant?.name || 'Willkommen zurück'}
                <span className="mx-2 text-slate-300 dark:text-slate-700">·</span>
                <span className="font-mono text-[12px] text-slate-400 dark:text-slate-500">{bestellungen.length} Bestellungen heute</span>
              </p>
            </div>

            {/* Inline-Stat-Pills für schnelle Übersicht */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 self-end font-mono text-[11px] uppercase tracking-[0.15em]">
              <div>
                <p className="text-slate-400 dark:text-slate-500">Offen</p>
                <p className="nums font-display text-[28px] tracking-tight text-amber-600 dark:text-amber-400 mt-0.5">{offen}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">In Arbeit</p>
                <p className="nums font-display text-[28px] tracking-tight text-orange-600 dark:text-orange-400 mt-0.5">{inZubereitung}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Reservierungen</p>
                <p className="nums font-display text-[28px] tracking-tight text-blue-600 dark:text-cyan-400 mt-0.5">{reservierungenAktiv.length}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500">Tische</p>
                <p className="nums font-display text-[28px] tracking-tight text-violet-600 dark:text-violet-400 mt-0.5">{tischeBesetzt}<span className="text-slate-300 dark:text-slate-600">/{tischeGesamt}</span></p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── § 02 — CHARTS ─── */}
        <section className="mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-cyan-400 mb-5 flex items-center gap-3">
            <span>§ 02</span>
            <span className="h-px w-10 bg-blue-600/30 dark:bg-cyan-400/30" />
            <span>Auswertung</span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2"><UmsatzChart bestellungen={bestellungen} /></div>
            <AuslastungDonut tische={tische} />
          </div>
        </section>

        {/* ─── § 03 — LIVE-AKTIVITÄT ─── */}
        <section>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-cyan-400 mb-5 flex items-center gap-3">
            <span>§ 03</span>
            <span className="h-px w-10 bg-blue-600/30 dark:bg-cyan-400/30" />
            <span>Live-Aktivität</span>
            <span className="ml-auto flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span>Echtzeit</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <BestellVerteilung bestellungen={bestellungen} />

            {/* Bestellungen — Editorial List */}
            <div className="bg-white dark:bg-white/[0.025] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-dot" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Bestellungen</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{letzteBestellungen.length} aktiv</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {letzteBestellungen.length === 0 ? (
                  <p className="px-5 py-8 font-sans text-[13px] text-slate-400 dark:text-slate-500 text-center italic">
                    Keine aktiven Bestellungen.
                  </p>
                ) : letzteBestellungen.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 shrink-0 w-7">
                      T{b.tisch_nummer}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] text-slate-800 dark:text-slate-200 truncate">
                        {b.positionen.map((p) => `${p.menge}× ${p.gericht_name}`).join(', ')}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-1">
                        {formatPreis(b.gesamtpreis)}
                      </p>
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>
                      {BESTELLUNG_STATUS_LABEL[b.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservierungen */}
            <div className="bg-white dark:bg-white/[0.025] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Reservierungen</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{naechsteReservierungen.length} heute</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {naechsteReservierungen.length === 0 ? (
                  <p className="px-5 py-8 font-sans text-[13px] text-slate-400 dark:text-slate-500 text-center italic">
                    Keine Reservierungen heute.
                  </p>
                ) : naechsteReservierungen.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="font-mono text-[11px] tabular-nums text-slate-700 dark:text-slate-300 shrink-0 w-12">
                      {formatZeit(r.datum)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] text-slate-800 dark:text-slate-200 truncate">
                        {r.gast_name}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-1">
                        {r.personen} Pers.
                      </p>
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 shrink-0 ${RESERVIERUNG_STATUS_FARBE[r.status]}`}>
                      {RESERVIERUNG_STATUS_LABEL[r.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
