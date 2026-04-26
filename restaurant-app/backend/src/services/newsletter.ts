/**
 * Newsletter / Bestandskundenwerbung — Widerspruchsverwaltung nach § 7 Abs. 3 UWG + EuGH C-654/23.
 *
 * Bestandskunden duerfen ohne Einwilligung E-Mails ueber aehnliche eigene Produkte erhalten,
 * sofern der Hinweis bei Datenerhebung UND in jeder Werbe-Mail erfolgt + Widerspruch jederzeit moeglich ist.
 *
 * Widerspruchs-Token: HMAC-SHA256 mit JWT_SECRET — kein DB-Storage noetig, sebst-validierend.
 */

import crypto from 'crypto';

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET fehlt — Newsletter-Token-Signierung nicht moeglich');
  return s;
}

/** Erzeugt einen signierten Widerspruchs-Token fuer eine Restaurant-ID. */
export function widerspruchsTokenErstellen(restaurantId: string): string {
  const sig = crypto.createHmac('sha256', secret()).update(`newsletter:${restaurantId}`).digest('hex').slice(0, 32);
  return `${restaurantId}.${sig}`;
}

/** Prueft einen Token und gibt die Restaurant-ID zurueck, oder null bei ungueltigem Token. */
export function widerspruchsTokenPruefen(token: string): string | null {
  const teile = token.split('.');
  if (teile.length !== 2) return null;
  const [restaurantId, sig] = teile;
  const erwartet = crypto.createHmac('sha256', secret()).update(`newsletter:${restaurantId}`).digest('hex').slice(0, 32);
  // timing-safe Vergleich
  if (sig.length !== erwartet.length) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(erwartet);
  return crypto.timingSafeEqual(a, b) ? restaurantId : null;
}

/** Erstellt den vollstaendigen Widerspruchs-Link fuer eine Werbe-Mail. */
export function widerspruchsLink(restaurantId: string, frontendUrl: string): string {
  const token = widerspruchsTokenErstellen(restaurantId);
  return `${frontendUrl}/newsletter-widerspruch/${token}`;
}
