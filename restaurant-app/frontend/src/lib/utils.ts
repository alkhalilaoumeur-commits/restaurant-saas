import { BestellungStatus, TischStatus, ReservierungStatus, ReservierungQuelle } from '../types';

// ─── Formatierung ─────────────────────────────────────────────────────────────

export function formatPreis(preis: number, waehrung = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: waehrung }).format(preis);
}

export function formatDatum(datum: string): string {
  return new Date(datum).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatZeit(datum: string): string {
  return new Date(datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// ─── Status-Labels ────────────────────────────────────────────────────────────

export const BESTELLUNG_STATUS_LABEL: Record<BestellungStatus, string> = {
  offen:          'Offen',
  in_zubereitung: 'In Zubereitung',
  serviert:       'Serviert',
  bezahlt:        'Bezahlt',
};

export const TISCH_STATUS_LABEL: Record<TischStatus, string> = {
  frei:               'Frei',
  besetzt:            'Besetzt',
  wartet_auf_zahlung: 'Zahlung',
};

export const RESERVIERUNG_STATUS_LABEL: Record<ReservierungStatus, string> = {
  ausstehend: 'Ausstehend',
  bestaetigt: 'Bestätigt',
  storniert:  'Storniert',
};

// ─── Status-Farben (Tailwind-Klassen) ────────────────────────────────────────

export const BESTELLUNG_STATUS_FARBE: Record<BestellungStatus, string> = {
  offen:          'bg-yellow-100 text-yellow-800',
  in_zubereitung: 'bg-orange-100 text-orange-800',
  serviert:       'bg-green-100 text-green-800',
  bezahlt:        'bg-gray-100 text-gray-500',
};

export const TISCH_STATUS_FARBE: Record<TischStatus, string> = {
  frei:               'bg-green-100 text-green-700',
  besetzt:            'bg-red-100 text-red-700',
  wartet_auf_zahlung: 'bg-yellow-100 text-yellow-700',
};

export const RESERVIERUNG_STATUS_FARBE: Record<ReservierungStatus, string> = {
  ausstehend: 'bg-yellow-100 text-yellow-700',
  bestaetigt: 'bg-green-100 text-green-700',
  storniert:  'bg-gray-100 text-gray-500',
};

export const RESERVIERUNG_QUELLE_LABEL: Record<ReservierungQuelle, string> = {
  app:      'Manuell',
  whatsapp: 'WhatsApp',
  telefon:  'Telefon',
  online:   'Online',
};

export const RESERVIERUNG_QUELLE_FARBE: Record<ReservierungQuelle, string> = {
  app:      'bg-gray-100 text-gray-600',
  whatsapp: 'bg-green-100 text-green-700',
  telefon:  'bg-blue-100 text-blue-700',
  online:   'bg-purple-100 text-purple-700',
};

// ─── Nächster Bestellstatus ───────────────────────────────────────────────────

export const NAECHSTER_STATUS: Partial<Record<BestellungStatus, BestellungStatus>> = {
  offen:          'in_zubereitung',
  in_zubereitung: 'serviert',
  serviert:       'bezahlt',
};
