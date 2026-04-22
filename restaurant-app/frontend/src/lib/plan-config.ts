export type Plan = 'basis' | 'standard' | 'pro';

const RANG: Record<Plan, number> = { basis: 1, standard: 2, pro: 3 };

// Welcher Plan wird pro Route mindestens benötigt
export const PLAN_ROUTEN: Record<string, Plan> = {
  '/dashboard':      'basis',
  '/bestellungen':   'basis',
  '/speisekarte':    'basis',
  '/tischplan':      'basis',
  '/reservierungen': 'basis',
  '/einstellungen':  'basis',
  '/dienstplan':     'standard',
  '/mitarbeiter':    'standard',
  '/warteliste':     'standard',
  '/bewertungen':    'standard',
  '/gaeste':         'standard',
  '/inventur':       'pro',
  '/statistiken':    'pro',
  '/erlebnisse':     'pro',
};

export function planHatZugriff(aktueller: Plan | null | undefined, benoetigter: Plan): boolean {
  if (!aktueller) return false;
  return RANG[aktueller] >= RANG[benoetigter];
}
