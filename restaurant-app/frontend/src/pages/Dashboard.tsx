import Topbar from '../components/layout/Topbar';
import StatKarte from '../components/dashboard/StatKarte';
import UmsatzChart from '../components/dashboard/UmsatzChart';
import AuslastungDonut from '../components/dashboard/AuslastungDonut';
import BestellVerteilung from '../components/dashboard/BestellVerteilung';
import { useBestellungen } from '../hooks/useBestellungen';
import { useTische } from '../hooks/useTische';
import { useReservierungen } from '../hooks/useReservierungen';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatPreis, formatZeit, BESTELLUNG_STATUS_FARBE, BESTELLUNG_STATUS_LABEL, RESERVIERUNG_STATUS_FARBE, RESERVIERUNG_STATUS_LABEL } from '../lib/utils';

// ─── Kleine Icon-Komponenten fuer Stat-Karten ──────────────────────────────

function IconBestellungen() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8Z" />
      <path d="M15 3v4a2 2 0 002 2h4" />
    </svg>
  );
}

function IconKoch() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93" />
      <path d="M8 6a4 4 0 013.25 3.93" />
      <path d="M15.75 9.93A4 4 0 0120 6" />
      <path d="M4 6a4 4 0 004 4" />
      <rect x="6" y="14" width="12" height="8" rx="2" />
      <path d="M6 14v-2a6 6 0 0112 0v2" />
    </svg>
  );
}

function IconEuro() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12a7.9 7.9 0 007.8 8 7.7 7.7 0 005.2-2" />
    </svg>
  );
}

function IconKalender() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconTische() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="4" rx="1" />
      <path d="M4 11v8" />
      <path d="M20 11v8" />
      <path d="M9 11v8" />
      <path d="M15 11v8" />
    </svg>
  );
}

export default function Dashboard() {
  const { bestellungen } = useBestellungen();
  const { tische } = useTische();
  const { restaurant } = useRestaurant();

  const heute = new Date().toISOString().slice(0, 10);
  const { reservierungen: heutigeReservierungen } = useReservierungen(heute);

  // Bestellungs-Stats
  const offen = bestellungen.filter((b) => b.status === 'offen').length;
  const inZubereitung = bestellungen.filter((b) => b.status === 'in_zubereitung').length;

  // Tagesumsatz: alle Bestellungen (serviert + bezahlt = Umsatz)
  const tagesumsatz = bestellungen
    .filter((b) => b.status === 'serviert' || b.status === 'bezahlt')
    .reduce((sum, b) => sum + b.gesamtpreis, 0);

  // Reservierungen heute (nicht storniert)
  const reservierungenAktiv = heutigeReservierungen.filter((r) => r.status !== 'storniert');

  // Tische
  const tischeGesamt = tische.length;
  const tischeBesetzt = tische.filter((t) => t.status !== 'frei').length;

  // Letzte 5 aktive Bestellungen
  const letzteBestellungen = bestellungen
    .filter((b) => b.status !== 'bezahlt')
    .slice(0, 5);

  // Nächste Reservierungen (sortiert nach Uhrzeit)
  const naechsteReservierungen = reservierungenAktiv
    .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Dashboard"
        untertitel={restaurant?.name || 'Willkommen zurück'}
        aktion={
          restaurant?.logo_url ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 shadow-sm">
              <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
            </div>
          ) : undefined
        }
      />

      {/* Stat-Karten – 5 Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <StatKarte
          label="Offene Bestellungen"
          wert={offen}
          icon={<IconBestellungen />}
          akzentFarbe="bg-amber-500"
        />
        <StatKarte
          label="In Zubereitung"
          wert={inZubereitung}
          icon={<IconKoch />}
          akzentFarbe="bg-orange-500"
        />
        <StatKarte
          label="Tagesumsatz"
          wert={formatPreis(tagesumsatz)}
          icon={<IconEuro />}
          akzentFarbe="bg-emerald-500"
        />
        <StatKarte
          label="Reservierungen"
          wert={reservierungenAktiv.length}
          icon={<IconKalender />}
          akzentFarbe="bg-blue-500"
        />
        <StatKarte
          label="Tische belegt"
          wert={`${tischeBesetzt}/${tischeGesamt}`}
          icon={<IconTische />}
          akzentFarbe="bg-violet-500"
        />
      </div>

      {/* Charts – Umsatz (groß) + Auslastung Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="lg:col-span-2">
          <UmsatzChart bestellungen={bestellungen} />
        </div>
        <AuslastungDonut tische={tische} />
      </div>

      {/* Zweite Zeile: Bestell-Verteilung + Aktive Bestellungen + Reservierungen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Bestellungs-Verteilung */}
        <BestellVerteilung bestellungen={bestellungen} />

        {/* Aktive Bestellungen */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-orange-400" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Aktive Bestellungen</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">{letzteBestellungen.length} aktiv</span>
          </div>
          <div className="px-5 pb-5">
            {letzteBestellungen.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-500">Keine aktiven Bestellungen.</p>
            ) : (
              <div className="space-y-3">
                {letzteBestellungen.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 ring-1 ring-slate-200/50 dark:ring-white/10">
                      T{b.tisch_nummer}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-slate-200 truncate">
                        {b.positionen.map((p) => `${p.menge}x ${p.gericht_name}`).join(', ')}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{formatPreis(b.gesamtpreis)}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${BESTELLUNG_STATUS_FARBE[b.status]}`}>
                      {BESTELLUNG_STATUS_LABEL[b.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Heutige Reservierungen */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-blue-400" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Reservierungen heute</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">{naechsteReservierungen.length} heute</span>
          </div>
          <div className="px-5 pb-5">
            {naechsteReservierungen.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-500">Keine Reservierungen heute.</p>
            ) : (
              <div className="space-y-3">
                {naechsteReservierungen.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 ring-1 ring-blue-200/50 dark:ring-blue-500/20">
                      {formatZeit(r.datum)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-slate-200">{r.gast_name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{r.personen} Personen</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${RESERVIERUNG_STATUS_FARBE[r.status]}`}>
                      {RESERVIERUNG_STATUS_LABEL[r.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
