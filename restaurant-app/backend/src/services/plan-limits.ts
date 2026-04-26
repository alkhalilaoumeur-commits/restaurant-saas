/**
 * Plan-Limits — bestimmt was jeder Abo-Plan an Resourcen erlaubt.
 *
 * Wird genutzt:
 *  - beim Mitarbeiter-Anlegen ([routes/mitarbeiter.ts]) → Check vor INSERT
 *  - bei jeder Plan-Aenderung ([routes/abo.ts] + [models/Abo.ts]) → restaurants.max_mitarbeiter wird mit-aktualisiert
 *
 * Quelle der Wahrheit fuer Limits ist diese Datei.
 * Die Spalte restaurants.max_mitarbeiter ist nur ein DB-Cache (gespiegelt aus dem Plan).
 */

export type AboPlan = 'basis' | 'standard' | 'pro';

export const PLAN_MITARBEITER_LIMITS: Record<AboPlan, number> = {
  basis: 3,
  standard: 10,
  pro: 999, // praktisch unbegrenzt
};

/** Gibt das Mitarbeiter-Limit fuer einen Plan zurueck. Fallback: Basis (3). */
export function maxMitarbeiterFuerPlan(plan: string | null | undefined): number {
  if (plan && plan in PLAN_MITARBEITER_LIMITS) {
    return PLAN_MITARBEITER_LIMITS[plan as AboPlan];
  }
  return PLAN_MITARBEITER_LIMITS.basis;
}
