import { useNavigate } from 'react-router-dom';

interface PaywallKarteProps {
  feature: string;
  benoetigterPlan: 'standard' | 'pro';
  beschreibung?: string;
}

const PLAN_LABEL: Record<string, string> = { standard: 'Standard (39 €/Monat)', pro: 'Pro (69 €/Monat)' };
const PLAN_FARBE: Record<string, string> = {
  standard: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  pro:      'from-amber-500/20 to-orange-500/20 border-amber-500/30',
};
const PLAN_BTN: Record<string, string> = {
  standard: 'bg-blue-600 hover:bg-blue-700',
  pro:      'bg-amber-600 hover:bg-amber-700',
};

export default function PaywallKarte({ feature, benoetigterPlan, beschreibung }: PaywallKarteProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className={`max-w-md w-full rounded-2xl border bg-gradient-to-br p-8 text-center ${PLAN_FARBE[benoetigterPlan]}`}>
        {/* Schloss-Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <svg className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-white">
          {feature} ist gesperrt
        </h2>
        <p className="mb-1 text-sm text-white/60">
          Diese Funktion ist nur im <span className="font-semibold text-white/80">{PLAN_LABEL[benoetigterPlan]}</span> verfügbar.
        </p>
        {beschreibung && (
          <p className="mb-6 text-sm text-white/50">{beschreibung}</p>
        )}

        <button
          onClick={() => navigate('/einstellungen?tab=abo')}
          className={`w-full rounded-xl py-3 px-6 text-sm font-semibold text-white transition ${PLAN_BTN[benoetigterPlan]}`}
        >
          Jetzt upgraden →
        </button>
        <p className="mt-3 text-xs text-white/40">Plan-Verwaltung unter Einstellungen → Abo & Kasse</p>
      </div>
    </div>
  );
}
