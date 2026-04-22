import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAboStore } from '../store/abo';
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
  const [gewaehlterPlan, setGewaehlterPlan] = useState<string>('standard');
  const [ladend, setLadend] = useState(false);
  const [fehler, setFehler] = useState('');

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
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <div className="mb-8">
        <ServeFlowLogo variante="voll" groesse="lg" />
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Wähle deinen Plan</h1>
        <p className="text-slate-400 text-sm max-w-md">
          Wähle den Plan der am besten zu deinem Restaurant passt. Du kannst jederzeit upgraden.
        </p>
      </div>

      {/* Plan-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        {PLAENE.map((plan) => {
          const aktiv = gewaehlterPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setGewaehlterPlan(plan.id)}
              className={`relative text-left rounded-2xl p-5 border-2 transition-all duration-200 bg-[#0F1724] ${
                aktiv ? plan.farbe + ' ring-1 ring-inset ring-white/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white`}>
                  {plan.badge}
                </span>
              )}

              <div className="mb-4">
                <p className={`text-lg font-bold ${aktiv ? plan.akzent : 'text-white'}`}>{plan.name}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {plan.preis} €
                  <span className="text-sm font-normal text-slate-500 ml-1">/Monat</span>
                </p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className={`mt-0.5 shrink-0 ${aktiv ? plan.akzent : 'text-slate-600'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {aktiv && (
                <div className={`mt-4 text-xs font-semibold ${plan.akzent}`}>Ausgewählt ✓</div>
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
        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ladend ? 'Weiterleitung zu Stripe...' : `${PLAENE.find(p => p.id === gewaehlterPlan)?.name} wählen & bezahlen →`}
      </button>

      <p className="mt-4 text-xs text-slate-600">
        Sicher bezahlen über Stripe · Jederzeit kündbar
      </p>
    </div>
  );
}
