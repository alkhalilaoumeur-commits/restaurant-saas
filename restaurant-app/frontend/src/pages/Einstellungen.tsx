import { useState, useRef, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import { useRestaurant } from '../hooks/useRestaurant';
import { useThemeStore } from '../store/theme';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { Oeffnungszeit, Ausnahmetag } from '../types';
import { useAbo, type RabattcodeInfo } from '../hooks/useAbo';


function IconLizenz() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function IconGebaeude() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function IconMitarbeiter() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconLayout() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function IconDarkMode() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

// ─── Abo-Karte ────────────────────────────────────────────────────────────────

const PLAN_FEATURES: Record<string, string[]> = {
  basis: [
    'QR-Code Bestellseite',
    'Speisekarte verwalten',
    'Tischplan & Reservierungen',
    'Bestellungen live',
    'Bis zu 3 Mitarbeiter',
  ],
  standard: [
    'Alles aus Basis',
    'Bis zu 10 Mitarbeiter',
    'Dienstplan & Schichtplanung',
    'Gäste-CRM',
    'Floor Plan Editor',
  ],
  pro: [
    'Alles aus Standard',
    'Unbegrenzte Mitarbeiter',
    'Inventur & Lager',
    'Erlebnis-Buchungen (Stripe)',
  ],
};

function AboKarte() {
  const { aboStatus, aboPlan, laeuftBis, planPreise, zahlungen, laden, checkout, codePruefen, kuendigen, neu } = useAbo();
  const [gewaehlterPlan, setGewaehlterPlan] = useState<string>('');
  const [codeInput, setCodeInput]           = useState('');
  const [codeInfo, setCodeInfo]             = useState<RabattcodeInfo | null>(null);
  const [codeFehler, setCodeFehler]         = useState('');
  const [checkoutLaden, setCheckoutLaden]   = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('abo') === 'success') {
      neu();
      window.history.replaceState({}, '', window.location.pathname);
    }
    // Tab-Param auswerten
    if (params.get('tab') === 'abo') {
      window.history.replaceState({}, '', window.location.pathname + '?tab=abo');
    }
  }, [neu]);

  // Wenn Plan noch nicht gewählt → aktuellen Plan vorauswählen
  useEffect(() => {
    if (!gewaehlterPlan && aboPlan) setGewaehlterPlan(aboPlan);
  }, [aboPlan, gewaehlterPlan]);

  const codeAnwenden = async () => {
    setCodeFehler('');
    setCodeInfo(null);
    if (!codeInput.trim()) return;
    try {
      const info = await codePruefen(codeInput.trim(), gewaehlterPlan);
      setCodeInfo(info);
    } catch {
      setCodeFehler('Ungültiger oder abgelaufener Code');
    }
  };

  const handleCheckout = async () => {
    if (!gewaehlterPlan) return;
    setCheckoutLaden(true);
    try {
      await checkout(codeInfo?.code, gewaehlterPlan);
    } catch (e: unknown) {
      alert((e as Error).message || 'Fehler beim Checkout');
    } finally {
      setCheckoutLaden(false);
    }
  };

  const statusFarbe = aboStatus === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
    : aboStatus === 'trial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
    : aboStatus === 'payment_failed' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400'
    : aboStatus === 'cancelled' ? 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-slate-400'
    : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';

  const statusLabel = aboStatus === 'active' ? 'Aktiv'
    : aboStatus === 'trial' ? 'Testphase'
    : aboStatus === 'payment_failed' ? 'Zahlung fehlgeschlagen'
    : aboStatus === 'cancelled' ? 'Gekündigt'
    : 'Abgelaufen';

  const planPreisCent = gewaehlterPlan ? (planPreise[gewaehlterPlan]?.cent ?? 2900) : 2900;
  const endpreisCent  = codeInfo ? codeInfo.endpreis_cent : planPreisCent;
  const monateMitCode = codeInfo ? codeInfo.monate : 1;

  if (laden) {
    return (
      <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm animate-pulse lg:col-span-2">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:col-span-2">

      {/* Status-Header */}
      <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <IconLizenz />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">
              ServeFlow {aboPlan ? aboPlan.charAt(0).toUpperCase() + aboPlan.slice(1) : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">Dein aktueller Plan</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusFarbe}`}>
            {statusLabel}
          </span>
        </div>
        {laeuftBis && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Läuft ab am <span className="font-semibold text-gray-700 dark:text-slate-300">
              {new Date(laeuftBis).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </p>
        )}
        {aboStatus === 'payment_failed' && (
          <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
            Zahlung fehlgeschlagen — bitte Zahlungsmethode in Stripe aktualisieren oder ein neues Abo starten.
          </p>
        )}
        {aboStatus === 'active' && (
          <button
            onClick={async () => {
              if (!confirm('Abo wirklich zum Ende der Periode kündigen?')) return;
              try { await kuendigen(); } catch { alert('Kündigung fehlgeschlagen. Bitte erneut versuchen.'); }
            }}
            className="mt-3 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline"
          >
            Abo kündigen
          </button>
        )}
      </div>

      {/* Plan-Auswahl */}
      <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 px-1">Plan wählen</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['basis', 'standard', 'pro'] as const).map((plan) => {
          const preis = planPreise[plan];
          const aktiv = gewaehlterPlan === plan;
          const istAktuell = aboPlan === plan;
          return (
            <button
              key={plan}
              onClick={() => { setGewaehlterPlan(plan); setCodeInfo(null); }}
              className={`text-left rounded-2xl p-4 border-2 transition-all ${
                aktiv
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{plan}</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {(preis.cent / 100).toFixed(0)} €
                    <span className="text-xs font-normal text-gray-400 dark:text-slate-500 ml-1">/Monat</span>
                  </p>
                </div>
                {istAktuell && (
                  <span className="text-xs bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    Aktuell
                  </span>
                )}
              </div>
              <ul className="space-y-1">
                {PLAN_FEATURES[plan].map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Checkout-Bereich */}
      {gewaehlterPlan && (
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
            {aboStatus === 'active' ? 'Plan wechseln / verlängern' : 'Abo aktivieren'}
          </p>

          {/* Rabattcode-Eingabe */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeInfo(null); setCodeFehler(''); }}
              onKeyDown={e => e.key === 'Enter' && codeAnwenden()}
              placeholder="Rabattcode (optional)"
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={codeAnwenden}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
            >
              Prüfen
            </button>
          </div>

          {codeFehler && <p className="text-xs text-red-500 mb-3">{codeFehler}</p>}

          {/* Code-Info */}
          {codeInfo && (
            <div className="mb-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm">
              <p className="font-semibold text-green-700 dark:text-green-400">
                ✓ Code <span className="font-mono">{codeInfo.code}</span> — {codeInfo.rabatt_prozent}% Rabatt
              </p>
              <p className="text-green-600 dark:text-green-500 text-xs mt-1">
                {codeInfo.monate} Monat{codeInfo.monate > 1 ? 'e' : ''} ·{' '}
                {codeInfo.endpreis_cent === 0
                  ? 'Komplett gratis'
                  : `${(codeInfo.endpreis_cent / 100).toFixed(2).replace('.', ',')} € statt ${(codeInfo.original_cent / 100).toFixed(2).replace('.', ',')} €`}
              </p>
              </div>
            )}

            {/* Preis-Zusammenfassung + Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Zu zahlen</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {endpreisCent === 0 ? 'Kostenlos' : `${(endpreisCent / 100).toFixed(2).replace('.', ',')} €`}
                  <span className="text-sm font-normal text-gray-400 ml-1">/ {monateMitCode} Monat{monateMitCode > 1 ? 'e' : ''}</span>
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkoutLaden}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {checkoutLaden ? 'Weiterleitung...' : endpreisCent === 0 ? 'Kostenlos aktivieren' : 'Jetzt bezahlen →'}
              </button>
            </div>
          </div>
        )}

      {/* Zahlungshistorie */}
      {zahlungen.length > 0 && (
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Zahlungshistorie</p>
          <div className="space-y-2">
            {zahlungen.map(z => (
              <div key={z.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-700 dark:text-slate-300">
                    {z.betrag_cent === 0 ? 'Gratis' : `${(z.betrag_cent / 100).toFixed(2).replace('.', ',')} €`}
                  </span>
                  {z.rabattcode && (
                    <span className="ml-2 text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded">
                      {z.rabattcode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    z.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                    : z.status === 'open' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                  }`}>
                    {z.status === 'paid' ? 'Bezahlt' : z.status === 'open' ? 'Offen' : 'Fehlgeschlagen'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(z.erstellt_am).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function Einstellungen() {
  const { restaurant, laden, aktualisieren } = useRestaurant();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { mitarbeiter: ichDaten, setFotoUrl } = useAuthStore();
  const [layoutSpeichern, setLayoutSpeichern] = useState(false);
  const [logoLaden, setLogoLaden] = useState(false);
  const [logoFehler, setLogoFehler] = useState('');
  const [profilLaden, setProfilLaden] = useState(false);
  const [profilFehler, setProfilFehler] = useState('');
  const [telefonWert, setTelefonWert] = useState(ichDaten?.telefon || '');
  const [telefonLaden, setTelefonLaden] = useState(false);
  const [telefonErfolg, setTelefonErfolg] = useState(false);
  const [telefonFehler, setTelefonFehler] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const profilInputRef = useRef<HTMLInputElement>(null);
  const [aktivTab, setAktivTab] = useState<string>('allgemein');

  async function telefonSpeichern() {
    setTelefonFehler('');
    const val = telefonWert.trim();
    if (val && !/^\+[1-9]\d{7,14}$/.test(val)) {
      setTelefonFehler('Internationales Format erforderlich, z.B. +4915112345678');
      return;
    }
    setTelefonLaden(true);
    try {
      await api.patch('/mitarbeiter/ich/telefon', { telefon: val || null });
      setTelefonErfolg(true);
      setTimeout(() => setTelefonErfolg(false), 2500);
    } catch (err) {
      setTelefonFehler((err as Error).message || 'Fehler beim Speichern');
    } finally {
      setTelefonLaden(false);
    }
  }

  async function profilbildHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setProfilFehler('');
    setProfilLaden(true);
    try {
      const url = await api.upload(datei);
      await api.patch('/mitarbeiter/ich/foto', { foto_url: url });
      setFotoUrl(url);
    } catch (err) {
      setProfilFehler((err as Error).message || 'Upload fehlgeschlagen');
    } finally {
      setProfilLaden(false);
      if (profilInputRef.current) profilInputRef.current.value = '';
    }
  }

  async function profilbildEntfernen() {
    setProfilFehler('');
    setProfilLaden(true);
    try {
      await api.patch('/mitarbeiter/ich/foto', { foto_url: null });
      setFotoUrl(null);
    } catch (err) {
      setProfilFehler((err as Error).message || 'Fehler beim Entfernen');
    } finally {
      setProfilLaden(false);
    }
  }

  async function logoHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setLogoFehler('');
    setLogoLaden(true);
    try {
      const url = await api.upload(datei);
      await aktualisieren({ logo_url: url });
    } catch (err) {
      setLogoFehler((err as Error).message || 'Upload fehlgeschlagen');
    } finally {
      setLogoLaden(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function logoEntfernen() {
    setLogoFehler('');
    setLogoLaden(true);
    try {
      await aktualisieren({ logo_url: null });
    } catch (err) {
      setLogoFehler((err as Error).message || 'Fehler beim Entfernen');
    } finally {
      setLogoLaden(false);
    }
  }

  if (laden) {
    return (
      <div>
        <Topbar titel="Einstellungen" />
        <p className="text-sm text-gray-400">Wird geladen...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div>
        <Topbar titel="Einstellungen" />
        <p className="text-sm text-red-500">Restaurant-Daten konnten nicht geladen werden.</p>
      </div>
    );
  }

  const mitarbeiterProzent = Math.round((restaurant.aktive_mitarbeiter / restaurant.max_mitarbeiter) * 100);
  const limitNah = mitarbeiterProzent >= 80;

  return (
    <div className="animate-fade-in-up">
      <Topbar titel="Einstellungen" untertitel="Restaurant & Lizenz verwalten" />

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/[0.04] dark:border dark:border-white/[0.06] rounded-2xl mb-5 overflow-x-auto">
        {([
          { id: 'allgemein',      label: 'Allgemein' },
          { id: 'profil',         label: 'Mein Profil' },
          { id: 'bestellseite',   label: 'Bestellseite' },
          { id: 'reservierungen', label: 'Reservierungen' },
          { id: 'abo',            label: 'Abo & Kasse' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setAktivTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              aktivTab === tab.id
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {aktivTab === 'abo' && <>

        {/* Abo-Karte */}
        <AboKarte />

        {/* Mitarbeiter-Nutzung */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <IconMitarbeiter />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Mitarbeiter</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Nutzung deines Kontingents</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400">Aktive Mitarbeiter</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                {restaurant.aktive_mitarbeiter} / {restaurant.max_mitarbeiter}
              </span>
            </div>
            {/* Fortschrittsbalken */}
            <div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    limitNah ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(mitarbeiterProzent, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${limitNah ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-slate-500'}`}>
                {mitarbeiterProzent >= 100
                  ? 'Limit erreicht – keine weiteren Mitarbeiter möglich'
                  : limitNah
                    ? `${restaurant.max_mitarbeiter - restaurant.aktive_mitarbeiter} Plätze frei`
                    : `${restaurant.max_mitarbeiter - restaurant.aktive_mitarbeiter} Plätze frei`
                }
              </p>
            </div>
          </div>
        </div>

        </>}

        {aktivTab === 'allgemein' && <>

        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-500/15 flex items-center justify-center text-slate-600 dark:text-amber-400">
                <IconDarkMode />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Erscheinungsbild</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {theme === 'dark' ? 'Dunkles Design aktiv' : 'Helles Design aktiv'}
                </p>
              </div>
            </div>
            {/* Toggle-Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                theme === 'dark' ? 'bg-amber-500' : 'bg-gray-200 dark:bg-white/10'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center text-[11px] ${
                  theme === 'dark' ? 'translate-x-[30px]' : 'translate-x-0.5'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        </>}

        {aktivTab === 'bestellseite' && <>

        {/* Layout Bestellseite */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <IconLayout />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Layout Bestellseite</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Design deiner digitalen Speisekarte für Gäste</p>
            </div>
          </div>

          {/* Layout-Auswahl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            {/* ── Modern (helles Grid) ─────────────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'modern') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'modern' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'modern'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'modern' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: 4 Kacheln im Grid */}
              <div className="w-full aspect-[3/2] rounded-xl bg-gray-100 dark:bg-white/10 p-2 mb-3 flex flex-col gap-1.5">
                <div className="flex gap-1.5 flex-1">
                  <div className="flex-1 rounded-md bg-gradient-to-br from-amber-400 to-orange-500" />
                  <div className="flex-1 rounded-md bg-gradient-to-br from-rose-400 to-pink-500" />
                </div>
                <div className="flex gap-1.5 flex-1">
                  <div className="flex-1 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <div className="flex-1 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Modern</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Helle Kacheln im Grid — farbenfroh & modern
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Inter
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Hell
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Rund
                </span>
              </div>
            </button>

            {/* ── Elegant Dunkel (dunkle Liste) ─────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'elegant-dunkel') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'elegant-dunkel' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'elegant-dunkel'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'elegant-dunkel' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: 4 Balken auf dunklem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#0A0A0A] p-2 mb-3 flex flex-col gap-1.5 justify-center">
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#C9B97A] mr-1.5" />
                  <div className="h-1.5 w-12 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#86754D] mr-1.5" />
                  <div className="h-1.5 w-10 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#A89060] mr-1.5" />
                  <div className="h-1.5 w-14 rounded bg-[#F5F0E8]/30" />
                </div>
                <div className="h-5 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-2">
                  <div className="w-1 h-3 rounded-sm bg-[#B8A468] mr-1.5" />
                  <div className="h-1.5 w-8 rounded bg-[#F5F0E8]/30" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Elegant Dunkel</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Dunkles Design mit eleganten Listen-Balken
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Playfair
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Dunkel
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9B97A]" />
                  Eckig
                </span>
              </div>
            </button>

            {/* ── Osteria (dunkles Gold, Pills) ─────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'osteria') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'osteria' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'osteria'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'osteria' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: Pill-Tabs + Karten auf dunklem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#0C0C0C] p-2 mb-3 flex flex-col gap-1.5">
                {/* Pill-Leiste */}
                <div className="flex gap-1 px-0.5">
                  <div className="h-3.5 w-7 rounded-full bg-[#C9A84C]" />
                  <div className="h-3.5 w-10 rounded-full border border-[#252525]" />
                  <div className="h-3.5 w-8 rounded-full border border-[#252525]" />
                </div>
                {/* Karten */}
                <div className="flex-1 flex flex-col gap-1 mt-0.5">
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-8 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1 border-l-2 border-l-[#C9A84C]">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-6 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                  <div className="h-5 rounded bg-[#161616] border border-[#252525] flex items-center px-1.5 gap-1">
                    <div className="w-3 h-3 rounded bg-[#252525]" />
                    <div className="h-1 w-10 rounded bg-[#F5F0E8]/20" />
                    <div className="ml-auto h-1.5 w-4 rounded bg-[#C9A84C]/60" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Osteria</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Goldene Pill-Navigation auf dunklem Grund
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Cormorant
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Dunkel
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  Alles auf 1 Seite
                </span>
              </div>
            </button>

            {/* ── Editorial (Creme, Magazin-Stil) ──────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'editorial') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'editorial' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'editorial'
                  ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {restaurant.layout_id === 'editorial' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: Nummerierte Liste auf cremefarbenem Hintergrund */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#F7F3EE] p-2 mb-3 flex flex-col gap-1 justify-center">
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">01</span>
                  <div className="h-1.5 w-12 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">02</span>
                  <div className="h-1.5 w-10 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1 border-b border-[#1A1209]/10">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">03</span>
                  <div className="h-1.5 w-14 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="text-[8px] italic text-[#C4622D] font-serif">04</span>
                  <div className="h-1.5 w-8 rounded bg-[#1A1209]/20" />
                  <div className="ml-auto w-4 h-4 rounded-full border border-[#1A1209]/15" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Editorial</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Magazin-Stil mit Creme & Terracotta
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Playfair
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Hell
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D]" />
                  Nummeriert
                </span>
              </div>
            </button>

            {/* ── Showcase 3D (Premium, Glasmorphismus) ────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'showcase') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'showcase' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 group/sc ${
                restaurant.layout_id === 'showcase'
                  ? 'border-2 border-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-[0_0_20px_-5px] shadow-indigo-500/20'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/40'
              }`}
            >
              {/* Premium-Badge (immer sichtbar) */}
              <div className="absolute top-3 right-3 z-10">
                {restaurant.layout_id === 'showcase' ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 dark:text-indigo-300/70 bg-indigo-100/80 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                    Premium
                  </span>
                )}
              </div>

              {/* Mini-Vorschau: Ultra-Dark mit 3D-Glasmorphismus-Karten */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#07070E] p-2 mb-3 relative overflow-hidden">
                {/* Ambient Glow Orbs */}
                <div className="absolute top-1 left-3 w-8 h-8 rounded-full bg-indigo-500/10 blur-lg" />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-cyan-500/8 blur-md" />

                {/* 2x2 Grid: Glass-Karten mit Glow-Border */}
                <div className="relative z-10 grid grid-cols-2 gap-1.5 h-full">
                  {/* Karte 1 — mit Bild-Platzhalter */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col overflow-hidden
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/10">
                    <div className="flex-1 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent" />
                    <div className="px-1.5 py-1">
                      <div className="h-1 w-8 rounded bg-[#EAEAF4]/25" />
                      <div className="h-0.5 w-5 rounded bg-[#818CF8]/30 mt-0.5" />
                    </div>
                  </div>

                  {/* Karte 2 — mit Bild-Platzhalter */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col overflow-hidden
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/10">
                    <div className="flex-1 bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-transparent" />
                    <div className="px-1.5 py-1">
                      <div className="h-1 w-6 rounded bg-[#EAEAF4]/25" />
                      <div className="h-0.5 w-4 rounded bg-[#818CF8]/30 mt-0.5" />
                    </div>
                  </div>

                  {/* Karte 3 — ohne Bild, mit Dot */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#818CF8]/20 flex flex-col justify-center px-1.5 py-1
                                  shadow-[0_0_8px_-2px] shadow-indigo-500/15">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#818CF8]/40" />
                      <div className="h-1 w-7 rounded bg-[#EAEAF4]/25" />
                    </div>
                    <div className="h-0.5 w-10 rounded bg-[#EAEAF4]/10 mt-1 ml-2" />
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/15 border border-emerald-500/20" />
                      </div>
                      <div className="w-3 h-3 rounded-full border border-[#818CF8]/30 flex items-center justify-center">
                        <span className="text-[5px] text-[#818CF8]">+</span>
                      </div>
                    </div>
                  </div>

                  {/* Karte 4 — ohne Bild, mit Dot */}
                  <div className="rounded-lg bg-[#111122]/80 border border-[#1E1E35] flex flex-col justify-center px-1.5 py-1">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#818CF8]/40" />
                      <div className="h-1 w-9 rounded bg-[#EAEAF4]/25" />
                    </div>
                    <div className="h-0.5 w-8 rounded bg-[#EAEAF4]/10 mt-1 ml-2" />
                    <div className="flex items-center justify-end mt-1">
                      <div className="w-3 h-3 rounded-full border border-[#818CF8]/30 flex items-center justify-center">
                        <span className="text-[5px] text-[#818CF8]">+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spotlight-Effekt oben rechts */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-radial from-indigo-400/8 to-transparent rounded-full pointer-events-none" />
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">
                Showcase 3D
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Premium 3D-Karten mit Glasmorphismus & Glow
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                  Space Grotesk
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                  3D-Effekte
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                  Glasmorphismus
                </span>
              </div>
            </button>

            {/* ── QR-Menu (Violet App-Stil) ─────────────────────────────── */}
            <button
              disabled={layoutSpeichern}
              onClick={async () => {
                if (restaurant.layout_id === 'qr-menu') return;
                setLayoutSpeichern(true);
                try { await aktualisieren({ layout_id: 'qr-menu' }); } finally { setLayoutSpeichern(false); }
              }}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 ${
                restaurant.layout_id === 'qr-menu'
                  ? 'border-2 border-violet-400 bg-violet-50/50 dark:bg-violet-500/5 shadow-[0_0_20px_-5px] shadow-violet-500/20'
                  : 'border-2 border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/40'
              }`}
            >
              {/* Aktiv-Badge */}
              {restaurant.layout_id === 'qr-menu' && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              )}

              {/* Mini-Vorschau: Violet App-Stil mit Sidebar */}
              <div className="w-full aspect-[3/2] rounded-xl bg-[#F7F6FF] p-1.5 mb-3 overflow-hidden flex gap-1.5">
                {/* Linke Sidebar */}
                <div className="w-6 flex flex-col gap-1 bg-white rounded-lg p-1">
                  {[
                    { active: true,  h: 'w-3' },
                    { active: false, h: 'w-4' },
                    { active: false, h: 'w-2' },
                    { active: false, h: 'w-3' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className={`w-4 h-4 rounded-md ${item.active ? 'bg-[#EDE8FF]' : 'bg-gray-100'}`} />
                      <div className={`h-0.5 rounded ${item.h} ${item.active ? 'bg-[#7B61FF]' : 'bg-gray-200'}`} />
                    </div>
                  ))}
                </div>

                {/* Rechtes Grid */}
                <div className="flex-1 grid grid-cols-2 gap-1">
                  {[
                    { color: 'bg-violet-100' },
                    { color: 'bg-violet-50' },
                    { color: 'bg-indigo-50' },
                    { color: 'bg-purple-50' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden flex flex-col">
                      <div className={`flex-1 ${item.color}`} />
                      <div className="px-1 py-0.5">
                        <div className="h-1 w-5 rounded bg-gray-200" />
                        <div className="flex items-center justify-between mt-0.5">
                          <div className="h-1 w-3 rounded bg-[#7B61FF]/40" />
                          <div className="w-2.5 h-2.5 rounded-md bg-[#7B61FF] flex items-center justify-center">
                            <span className="text-[5px] text-white font-bold leading-none">+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">QR-Menu</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Violet App-Stil — Sidebar + 2-Spalten-Grid
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                  Violet
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                  App-Stil
                </span>
              </div>
            </button>
          </div>
        </div>

        </>}

        {aktivTab === 'allgemein' && <>

        {/* Restaurant-Logo */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Restaurant-Logo</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Wird auf der Bestellseite und im Dashboard angezeigt</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Logo-Vorschau */}
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 flex items-center justify-center overflow-hidden shrink-0 bg-gray-50 dark:bg-white/5">
              {restaurant.logo_url ? (
                <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <svg className="w-8 h-8 text-gray-300 dark:text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
                </svg>
              )}
            </div>

            {/* Upload-Buttons */}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={logoHochladen}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoLaden}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {logoLaden ? 'Wird hochgeladen...' : restaurant.logo_url ? 'Logo ändern' : 'Logo hochladen'}
                </button>
                {restaurant.logo_url && (
                  <button
                    onClick={logoEntfernen}
                    disabled={logoLaden}
                    className="px-4 py-2 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                  >
                    Entfernen
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">JPG, PNG oder WebP. Max. 5 MB.</p>
              {logoFehler && <p className="text-xs text-red-500 mt-1">{logoFehler}</p>}
            </div>
          </div>
        </div>

        </>}

        {aktivTab === 'profil' && <>

        {/* Mein Profilbild */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Mein Profilbild</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Wird im Dienstplan und in der Sidebar angezeigt</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Bild-Vorschau */}
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 flex items-center justify-center overflow-hidden shrink-0 bg-gray-50 dark:bg-white/5">
              {ichDaten?.foto_url ? (
                <img src={ichDaten.foto_url} alt={ichDaten.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20 flex items-center justify-center text-2xl font-bold text-violet-500 dark:text-violet-400">
                  {ichDaten?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Upload-Buttons */}
            <div className="flex-1">
              <input
                ref={profilInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={profilbildHochladen}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => profilInputRef.current?.click()}
                  disabled={profilLaden}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 disabled:opacity-50 transition-colors"
                >
                  {profilLaden ? 'Wird hochgeladen...' : ichDaten?.foto_url ? 'Bild ändern' : 'Bild hochladen'}
                </button>
                {ichDaten?.foto_url && (
                  <button
                    onClick={profilbildEntfernen}
                    disabled={profilLaden}
                    className="px-4 py-2 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                  >
                    Entfernen
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">JPG, PNG oder WebP. Max. 5 MB.</p>
              {profilFehler && <p className="text-xs text-red-500 mt-1">{profilFehler}</p>}
            </div>
          </div>
        </div>

        {/* Meine Telefonnummer */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-500/15 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Meine Telefonnummer</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Für SMS-Benachrichtigungen (Schichttausch, neue Schichten)</p>
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                Telefonnummer <span className="text-gray-300 dark:text-slate-600 font-normal">— optional</span>
              </label>
              <input
                type="tel"
                value={telefonWert}
                onChange={(e) => setTelefonWert(e.target.value)}
                placeholder="+4915112345678"
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-500/20 focus:border-green-400"
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Internationales Format: +49 für Deutschland, +43 für Österreich</p>
            </div>
            <button
              onClick={telefonSpeichern}
              disabled={telefonLaden}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                telefonErfolg
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {telefonErfolg ? '✓ Gespeichert' : telefonLaden ? '...' : 'Speichern'}
            </button>
          </div>
          {telefonFehler && <p className="text-xs text-red-500 mt-2">{telefonFehler}</p>}
        </div>

        </>}

        {aktivTab === 'reservierungen' && <>

        {/* Buchungswidget */}
        <BuchungsWidget restaurantId={restaurant.id} />

        {/* Google Reserve Integration */}
        <GoogleIntegration restaurantId={restaurant.id} />

        {/* Google Bewertungslink */}
        <GoogleBewertungslink
          aktuell={restaurant.google_bewertungs_link}
          onSpeichern={(link) => aktualisieren({ google_bewertungs_link: link })}
        />

        {/* Öffnungszeiten */}
        <OeffnungszeitenSektion restaurantId={restaurant.id} />

        {/* Reservierungseinstellungen */}
        <ReservierungsEinstellungen restaurant={restaurant} onSpeichern={aktualisieren} />

        </>}

        {aktivTab === 'allgemein' && <>

        {/* Restaurant-Daten */}
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-500/15 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <IconGebaeude />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Restaurant-Daten</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Kontakt & Adresse</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <InfoZeile label="Name" wert={restaurant.name} />
            <InfoZeile label="Währung" wert={restaurant.waehrung} />
            <InfoZeile label="Straße" wert={restaurant.strasse} />
            <InfoZeile label="PLZ / Stadt" wert={[restaurant.plz, restaurant.stadt].filter(Boolean).join(' ') || null} />
            <InfoZeile label="Telefon" wert={restaurant.telefon} />
            <InfoZeile label="E-Mail" wert={restaurant.email} />
            <InfoZeile label="Öffnungszeiten" wert={restaurant.oeffnungszeiten} />
          </div>
        </div>

        </>}

      </div>
    </div>
  );
}

function InfoZeile({ label, wert }: { label: string; wert: string | null }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-white/5">
      <span className="text-xs text-gray-500 dark:text-slate-400">{label}</span>
      <span className="text-sm text-gray-800 dark:text-slate-200">{wert || '–'}</span>
    </div>
  );
}

// ─── Google Reserve Integration ──────────────────────────────────────────────

function GoogleIntegration({ restaurantId }: { restaurantId: string }) {
  const [kopiert, setKopiert] = useState(false);

  // Der Buchungs-Link mit ?quelle=google — damit kommen Reservierungen automatisch
  // als "Google" markiert rein. Restaurantbesitzer fügt diesen Link in Google Business Profile ein.
  const googleLink = `${window.location.origin}/buchen/${restaurantId}?quelle=google`;

  const kopieren = () => {
    navigator.clipboard.writeText(googleLink);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        {/* Google-Farben Icon */}
        <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Google Reserve</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              Manuell
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">Reservierungen aus Google Maps tracken</p>
        </div>
      </div>

      {/* Info-Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Wie funktioniert das?</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          Füge den Link unten in dein <strong>Google Business Profile</strong> ein (unter "Reservierungen" → "Links verwalten").
          Gäste, die über Google Maps buchen, werden dann in deinem System automatisch mit der Quelle <strong>"Google"</strong> erfasst.
          So siehst du in den Statistiken wie viele Reservierungen über Google Maps kommen.
        </p>
      </div>

      {/* Google-Link mit ?quelle=google */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
          Dein Google-Buchungslink
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={googleLink}
            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 dark:text-slate-300"
          />
          <button
            onClick={kopieren}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 shrink-0 transition-colors"
          >
            {kopiert ? '✓ Kopiert' : 'Kopieren'}
          </button>
        </div>
      </div>

      {/* Schritt-für-Schritt Anleitung */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Einrichten in 3 Schritten:</p>
        <ol className="space-y-2">
          {[
            { nr: 1, text: 'Google Business Profile öffnen: business.google.com' },
            { nr: 2, text: 'Menü → "Buchungen" oder "Links" → "Reservierungslink hinzufügen"' },
            { nr: 3, text: 'Den Link oben einfügen und speichern — fertig!' },
          ].map(({ nr, text }) => (
            <li key={nr} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {nr}
              </span>
              <span className="text-xs text-gray-600 dark:text-slate-300">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Zukunfts-Hinweis Option B */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
        <p className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>
            <strong>Geplant:</strong> Direkte Google Reserve API-Integration (automatisch, ohne manuellen Link) — sobald das Partnerprogramm aktiv ist.
          </span>
        </p>
      </div>
    </div>
  );
}

function BuchungsWidget({ restaurantId }: { restaurantId: string }) {
  const [kopiert, setKopiert] = useState(false);
  const buchungsUrl = `${window.location.origin}/buchen/${restaurantId}`;
  const snippet = `<iframe src="${buchungsUrl}" style="width:100%;min-height:650px;border:none;border-radius:12px;" title="Tisch reservieren"></iframe>`;

  const kopieren = (text: string) => {
    navigator.clipboard.writeText(text);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Online-Buchung</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Link & Widget für Ihre Website</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Direkter Link */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Buchungsseite (direkter Link)</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={buchungsUrl}
              className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 dark:text-slate-300"
            />
            <button
              onClick={() => kopieren(buchungsUrl)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 shrink-0"
            >
              {kopiert ? '✓' : 'Kopieren'}
            </button>
          </div>
        </div>

        {/* Embed-Code */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Widget für Ihre Website (HTML-Code)</label>
          <div className="relative">
            <pre className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-600 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
              {snippet}
            </pre>
            <button
              onClick={() => kopieren(snippet)}
              className="absolute top-2 right-2 px-3 py-1 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600"
            >
              {kopiert ? '✓' : 'Kopieren'}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">
            Diesen Code auf Ihrer Restaurant-Website einfügen — Gäste können dann direkt dort reservieren.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Öffnungszeiten + Ausnahmetage ───────────────────────────────────────────

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

function OeffnungszeitenSektion({ restaurantId: _restaurantId }: { restaurantId: string }) {
  const [zeiten, setZeiten] = useState<Oeffnungszeit[]>([]);
  const [ausnahmetage, setAusnahmetage] = useState<Ausnahmetag[]>([]);
  const [speichern, setSpeichern] = useState<number | null>(null);
  const [neuesDatum, setNeuesDatum] = useState('');
  const [neuerGrund, setNeuerGrund] = useState('');
  const [hinzufuegenLaedt, setHinzufuegenLaedt] = useState(false);
  const [fehler, setFehler] = useState('');

  const laden = useCallback(async () => {
    try {
      const [z, a] = await Promise.all([
        api.get<Oeffnungszeit[]>('/oeffnungszeiten'),
        api.get<Ausnahmetag[]>('/oeffnungszeiten/ausnahmetage'),
      ]);
      setZeiten(z);
      setAusnahmetage(a);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden');
    }
  }, []);

  useEffect(() => { laden(); }, [laden]);

  const handleSpeichern = async (wochentag: number, von: string, bis: string, geschlossen: boolean) => {
    setSpeichern(wochentag);
    setFehler('');
    try {
      await api.put(`/oeffnungszeiten/${wochentag}`, { von, bis, geschlossen });
      await laden();
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Speichern');
    } finally {
      setSpeichern(null);
    }
  };

  const handleAusnahmeHinzufuegen = async () => {
    if (!neuesDatum) { setFehler('Bitte ein Datum auswählen'); return; }
    setHinzufuegenLaedt(true);
    setFehler('');
    try {
      await api.post('/oeffnungszeiten/ausnahmetage', { datum: neuesDatum, grund: neuerGrund || null });
      setNeuesDatum('');
      setNeuerGrund('');
      await laden();
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Hinzufügen');
    } finally {
      setHinzufuegenLaedt(false);
    }
  };

  const handleAusnahmeLoeschen = async (id: string) => {
    try {
      await api.delete(`/oeffnungszeiten/ausnahmetage/${id}`);
      setAusnahmetage(prev => prev.filter(a => a.id !== id));
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Löschen');
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center text-orange-600 dark:text-orange-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Öffnungszeiten</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Reguläre Zeiten + geschlossene Ausnahmetage</p>
        </div>
      </div>

      {fehler && <p className="text-xs text-red-500 mb-3">{fehler}</p>}

      {/* Wochentage */}
      <div className="space-y-2 mb-6">
        {WOCHENTAGE.map((tag, i) => {
          const eintrag = zeiten.find(z => z.wochentag === i);
          return (
            <WochentagZeile
              key={i}
              tagName={tag}
              eintrag={eintrag || null}
              laedt={speichern === i}
              onSpeichern={(von, bis, geschlossen) => handleSpeichern(i, von, bis, geschlossen)}
            />
          );
        })}
      </div>

      {/* Ausnahmetage */}
      <div className="border-t border-gray-100 dark:border-white/10 pt-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">Ausnahmetage</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">
          An diesen Tagen ist das Restaurant geschlossen (überschreibt die regulären Öffnungszeiten).
        </p>

        {ausnahmetage.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {ausnahmetage.map(a => (
              <div key={a.id} className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    {new Date(a.datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  {a.grund && <span className="text-xs text-red-500 dark:text-red-400/70 ml-2">· {a.grund}</span>}
                </div>
                <button
                  onClick={() => handleAusnahmeLoeschen(a.id)}
                  className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 px-2 py-1 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 dark:text-slate-400 mb-1">Datum</label>
            <input
              type="date"
              value={neuesDatum}
              onChange={e => setNeuesDatum(e.target.value)}
              className="border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-700 dark:text-slate-200"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs text-gray-500 dark:text-slate-400 mb-1">Grund (optional)</label>
            <input
              type="text"
              placeholder="z.B. Ostern, Betriebsferien"
              value={neuerGrund}
              onChange={e => setNeuerGrund(e.target.value)}
              className="w-full border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-700 dark:text-slate-200"
            />
          </div>
          <button
            onClick={handleAusnahmeHinzufuegen}
            disabled={hinzufuegenLaedt || !neuesDatum}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {hinzufuegenLaedt ? '...' : '+ Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  );
}

function defaultZeit(v: string | undefined, fallback: string): string {
  const t = v?.slice(0, 5);
  return (!t || t === '00:00') ? fallback : t;
}

function WochentagZeile({ tagName, eintrag, laedt, onSpeichern }: {
  tagName: string;
  eintrag: Oeffnungszeit | null;
  laedt: boolean;
  onSpeichern: (von: string, bis: string, geschlossen: boolean) => void;
}) {
  const [geschlossen, setGeschlossen] = useState(eintrag?.geschlossen ?? false);
  const [von, setVon] = useState(defaultZeit(eintrag?.von, '09:00'));
  const [bis, setBis] = useState(defaultZeit(eintrag?.bis, '22:00'));

  useEffect(() => {
    setGeschlossen(eintrag?.geschlossen ?? false);
    setVon(defaultZeit(eintrag?.von, '09:00'));
    setBis(defaultZeit(eintrag?.bis, '22:00'));
  }, [eintrag]);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm text-gray-600 dark:text-slate-300 w-24 shrink-0">{tagName}</span>

      {/* Geschlossen-Toggle */}
      <button
        onClick={() => setGeschlossen(g => !g)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          geschlossen ? 'bg-red-400 dark:bg-red-500/60' : 'bg-green-400 dark:bg-green-500/60'
        }`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          geschlossen ? 'translate-x-0.5' : 'translate-x-5'
        }`} />
      </button>

      {geschlossen ? (
        <span className="text-xs text-red-500 dark:text-red-400 italic">Geschlossen</span>
      ) : (
        <div className="flex items-center gap-1.5">
          <input
            type="time"
            value={von}
            onChange={e => setVon(e.target.value)}
            className="border border-gray-200 dark:border-white/15 rounded-lg px-2 py-1 text-sm bg-white dark:bg-white/5 text-gray-700 dark:text-slate-200"
          />
          <span className="text-xs text-gray-400">–</span>
          <input
            type="time"
            value={bis}
            onChange={e => setBis(e.target.value)}
            className="border border-gray-200 dark:border-white/15 rounded-lg px-2 py-1 text-sm bg-white dark:bg-white/5 text-gray-700 dark:text-slate-200"
          />
        </div>
      )}

      <button
        onClick={() => onSpeichern(von, bis, geschlossen)}
        disabled={laedt}
        className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/25 disabled:opacity-50 transition-colors font-medium"
      >
        {laedt ? '...' : 'Speichern'}
      </button>
    </div>
  );
}

// ─── Reservierungseinstellungen ───────────────────────────────────────────────

function ReservierungsEinstellungen({ restaurant, onSpeichern }: {
  restaurant: { buchungsintervall_min: number; tisch_dauer_min: number; max_gleichzeitige_reservierungen: number | null };
  onSpeichern: (felder: { buchungsintervall_min?: number; tisch_dauer_min?: number; max_gleichzeitige_reservierungen?: number | null }) => Promise<void>;
}) {
  const [intervall, setIntervall] = useState(restaurant.buchungsintervall_min);
  const [tischDauer, setTischDauer] = useState(restaurant.tisch_dauer_min);
  const [maxGleichzeitig, setMaxGleichzeitig] = useState<string>(
    restaurant.max_gleichzeitige_reservierungen?.toString() ?? ''
  );
  const [laedt, setLaedt] = useState(false);
  const [gespeichert, setGespeichert] = useState(false);

  const handleSpeichern = async () => {
    setLaedt(true);
    try {
      await onSpeichern({
        buchungsintervall_min: intervall,
        tisch_dauer_min: tischDauer,
        max_gleichzeitige_reservierungen: maxGleichzeitig === '' ? null : parseInt(maxGleichzeitig),
      });
      setGespeichert(true);
      setTimeout(() => setGespeichert(false), 2000);
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Reservierungseinstellungen</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Buchungsintervall, Tischdauer und Kapazität</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        {/* Buchungsintervall */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
            Buchungsintervall
          </label>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">
            Zeitabstand zwischen Buchungsslots
          </p>
          <div className="flex gap-2">
            {[15, 30, 60].map(min => (
              <button
                key={min}
                onClick={() => setIntervall(min)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  intervall === min
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {min} Min.
              </button>
            ))}
          </div>
        </div>

        {/* Tischdauer */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
            Tischdauer
          </label>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">
            Wie lange ein Tisch nach Reservierung gilt
          </p>
          <div className="flex gap-2">
            {[60, 90, 120].map(min => (
              <button
                key={min}
                onClick={() => setTischDauer(min)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tischDauer === min
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {min === 60 ? '1h' : min === 90 ? '1,5h' : '2h'}
              </button>
            ))}
          </div>
        </div>

        {/* Max gleichzeitige Reservierungen */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
            Max. gleichzeitige Reservierungen
          </label>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">
            Leer lassen = unbegrenzt
          </p>
          <input
            type="number"
            min={1}
            max={100}
            placeholder="Unbegrenzt"
            value={maxGleichzeitig}
            onChange={e => setMaxGleichzeitig(e.target.value)}
            className="w-full border border-gray-200 dark:border-white/15 rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/5 text-gray-700 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSpeichern}
          disabled={laedt}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          {gespeichert ? '✓ Gespeichert' : laedt ? 'Speichert...' : 'Einstellungen speichern'}
        </button>
      </div>
    </div>
  );
}

// ─── Google Bewertungslink ────────────────────────────────────────────────────

function GoogleBewertungslink({
  aktuell,
  onSpeichern,
}: {
  aktuell: string | null;
  onSpeichern: (link: string | null) => Promise<void>;
}) {
  const [link, setLink] = useState(aktuell || '');
  const [laedt, setLaedt] = useState(false);
  const [gespeichert, setGespeichert] = useState(false);
  const [fehler, setFehler] = useState('');

  const speichern = async () => {
    setFehler('');
    if (link && !link.startsWith('https://')) {
      setFehler('Der Link muss mit https:// beginnen');
      return;
    }
    setLaedt(true);
    try {
      await onSpeichern(link || null);
      setGespeichert(true);
      setTimeout(() => setGespeichert(false), 2000);
    } catch {
      setFehler('Fehler beim Speichern');
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Google Bewertungslink</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Wird Gästen mit 4–5 Sternen nach ihrer internen Bewertung angezeigt
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
            Google Maps Bewertungslink
          </label>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">
            Öffne Google Maps → dein Restaurant → „Rezension schreiben" → Link kopieren
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://g.page/r/..."
              className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={speichern}
              disabled={laedt}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${
                gespeichert
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {gespeichert ? '✓ Gespeichert' : laedt ? '...' : 'Speichern'}
            </button>
          </div>
          {fehler && <p className="text-xs text-red-600 mt-1.5">{fehler}</p>}
        </div>

        {link && (
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
            <span className="text-amber-500 text-sm">★</span>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Gäste die intern 4 oder 5 Sterne geben, sehen nach der Bewertung einen Button „Auf Google bewerten" mit diesem Link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
