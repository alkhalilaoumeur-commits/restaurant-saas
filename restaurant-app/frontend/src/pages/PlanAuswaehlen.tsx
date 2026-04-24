import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAboStore } from '../store/abo';
import { useAuthStore } from '../store/auth';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

const PLAENE = [
  {
    id: 'basis',
    name: 'Basis',
    preis: 19,
    farbe: 'border-slate-600 hover:border-slate-400',
    akzent: 'text-slate-300',
    badge: null,
    features: [
      'Dashboard & Bestellungen',
      'Speisekarte verwalten',
      'Tischplan & Reservierungen',
      'Einstellungen',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    preis: 39,
    farbe: 'border-blue-500 hover:border-blue-400',
    akzent: 'text-blue-400',
    badge: 'Beliebt',
    features: [
      'Alles aus Basis',
      'Dienstplan & Mitarbeiter',
      'Warteliste',
      'Gäste & Bewertungen',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    preis: 69,
    farbe: 'border-cyan-500 hover:border-cyan-400',
    akzent: 'text-cyan-400',
    badge: 'Vollständig',
    features: [
      'Alles aus Standard',
      'Inventur',
      'Statistiken & Auswertungen',
      'Erlebnisse verkaufen',
    ],
  },
];

export default function PlanAuswaehlen() {
  const navigate = useNavigate();
  const { laden } = useAboStore();
  const logout = useAuthStore((s) => s.logout);
  const [gewaehlterPlan, setGewaehlterPlan] = useState<string>('standard');
  const [ladend, setLadend] = useState(false);
  const [fehler, setFehler] = useState('');

  const handleAbmelden = () => {
    logout();
    navigate('/login');
  };

  const handleWeiter = async () => {
    setLadend(true);
    setFehler('');
    try {
      const data = await api.post<{ redirect_url: string; gratis?: boolean }>(
        '/abo/checkout',
        { plan: gewaehlterPlan },
      );
      await laden();
      if (data.gratis) {
        navigate('/dashboard');
      } else {
        window.location.href = data.redirect_url;
      }
    } catch (e: unknown) {
      setFehler((e as Error).message || 'Fehler beim Starten des Checkouts');
      setLadend(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Aurora-Background */}
      <div
        className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none animate-aurora"
        aria-hidden
      />
      <div
        className="absolute bottom-[-25%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none animate-aurora"
        style={{ animationDelay: '-7s' }}
        aria-hidden
      />

      {/* Grid-Pattern subtle */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 blur-2xl" aria-hidden />
          <div className="relative">
            <ServeFlowLogo variante="voll" groesse="lg" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
            Noch ein Schritt
          </div>
          <h1 className="text-[36px] font-heading font-semibold text-white mb-3 tracking-[-0.02em]">
            Wähle deinen <span className="text-brand-gradient">Plan</span>
          </h1>
          <p className="text-slate-400 text-[14px] max-w-md mx-auto leading-relaxed">
            Starte mit dem Plan der am besten zu deinem Restaurant passt. Du kannst jederzeit upgraden oder kündigen.
          </p>
        </div>
      </div>

      {/* Plan-Karten — Premium */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {PLAENE.map((plan, idx) => {
          const aktiv = gewaehlterPlan === plan.id;
          const istStandard = plan.id === 'standard';
          return (
            <button
              key={plan.id}
              onClick={() => setGewaehlterPlan(plan.id)}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`group relative text-left rounded-2xl p-6 transition-all duration-300 animate-fade-in-up overflow-hidden ${
                aktiv
                  ? 'bg-gradient-to-br from-[#0F1724] to-[#0A0F1A] border border-blue-500/40 shadow-[0_0_32px_-8px_rgba(59,130,246,0.4)] scale-[1.02]'
                  : 'bg-[#0F1724]/80 border border-white/10 hover:border-white/20 hover:bg-[#0F1724]'
              }`}
            >
              {/* Aktive Glow im Hintergrund */}
              {aktiv && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" aria-hidden />
              )}

              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                  {plan.badge}
                </span>
              )}

              <div className="relative mb-5">
                <p className={`text-[13px] font-semibold uppercase tracking-[0.12em] ${aktiv ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="nums text-[38px] font-bold text-white leading-none tracking-tight">{plan.preis}</span>
                  <span className="text-slate-500 text-sm">€</span>
                  <span className="text-slate-500 text-xs ml-1">/Monat</span>
                </div>
              </div>

              <div className="relative h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-4" />

              <ul className="relative space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                    <svg className={`w-4 h-4 mt-0.5 shrink-0 ${aktiv || istStandard ? 'text-cyan-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {aktiv && (
                <div className="relative mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-cyan-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ausgewählt
                </div>
              )}
            </button>
          );
        })}
      </div>

      {fehler && (
        <p className="text-red-400 text-sm mb-4">{fehler}</p>
      )}

      <button
        onClick={handleWeiter}
        disabled={ladend}
        className="btn-premium relative z-10 px-8 h-12 text-[14px]"
      >
        {ladend ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Weiterleitung zu Stripe…
          </>
        ) : (
          <>
            {PLAENE.find(p => p.id === gewaehlterPlan)?.name} wählen
            <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-slate-600">
        Sicher bezahlen über Stripe · Jederzeit kündbar
      </p>

      <button
        onClick={handleAbmelden}
        className="mt-8 text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
      >
        Abmelden und zum Login
      </button>
    </div>
  );
}
