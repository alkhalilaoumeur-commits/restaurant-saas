import { useRestaurant } from './useRestaurant';

export type Plan = 'basis' | 'standard' | 'pro';

// Welcher Plan ist für welches Feature mindestens nötig
const FEATURE_PLAN: Record<string, Plan> = {
  dienstplan:   'standard',
  gaeste_crm:   'standard',
  floor_plan:   'standard',
  inventur:     'pro',
  erlebnisse:   'pro',
};

const PLAN_RANG: Record<Plan, number> = { basis: 0, standard: 1, pro: 2 };

export function usePlan() {
  const { restaurant, laden } = useRestaurant();
  const plan: Plan = restaurant?.abo_plan ?? 'basis';

  function hatZugang(feature: string): boolean {
    const benoetigt = FEATURE_PLAN[feature];
    if (!benoetigt) return true; // kein Guard → immer erlaubt
    return PLAN_RANG[plan] >= PLAN_RANG[benoetigt];
  }

  return { plan, laden, hatZugang };
}
