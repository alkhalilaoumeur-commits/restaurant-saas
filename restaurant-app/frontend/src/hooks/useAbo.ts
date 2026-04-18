/**
 * useAbo — Abo-Status, Checkout + Rabattcode-Logik
 *
 * Liefert:
 *   - aboStatus:     'trial' | 'active' | 'expired'
 *   - laeuftBis:     Datum als string oder null
 *   - preisCenter:   Preis in Cent (z.B. 4900)
 *   - zahlungen:     Zahlungshistorie
 *   - checkout():    Zahlungslink anfordern (leitet zu Stripe weiter)
 *   - codePruefen(): Rabattcode validieren und Preisinfo zurückgeben
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export interface Zahlung {
  id: string;
  stripe_session_id: string;
  betrag_cent: number;
  status: 'open' | 'paid' | 'failed' | 'cancelled' | 'expired';
  monate: number;
  rabattcode: string | null;
  erstellt_am: string;
  bezahlt_am: string | null;
}

export interface RabattcodeInfo {
  gueltig: boolean;
  code: string;
  rabatt_prozent: number;
  monate: number;
  original_cent: number;
  rabatt_cent: number;
  endpreis_cent: number;
}

export interface Rabattcode {
  id: string;
  code: string;
  rabatt_prozent: number;
  monate: number;
  max_nutzungen: number | null;
  nutzungen: number;
  gueltig_bis: string | null;
  aktiv: boolean;
  erstellt_am: string;
}

interface AboStatus {
  abo_status: 'trial' | 'active' | 'expired';
  abo_laeuft_bis: string | null;
  preis_cent: number;
  zahlungen: Zahlung[];
}

export function useAbo() {
  const [status, setStatus] = useState<AboStatus | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
    try {
      setLaden(true);
      const data = await api.get<AboStatus>('/abo/status');
      setStatus(data);
    } catch {
      setFehler('Abo-Status konnte nicht geladen werden');
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  const checkout = useCallback(async (rabattcode?: string): Promise<void> => {
    const data = await api.post<{ redirect_url: string; gratis?: boolean }>(
      '/abo/checkout',
      { rabattcode: rabattcode || undefined },
    );
    if (data.gratis) {
      // 100% Rabatt — kein Redirect, direkt neu laden
      await laden_();
    } else {
      window.location.href = data.redirect_url;
    }
  }, [laden_]);

  const codePruefen = useCallback(async (code: string): Promise<RabattcodeInfo> => {
    return api.post<RabattcodeInfo>('/abo/rabattcode/pruefen', { code });
  }, []);

  return {
    aboStatus:   status?.abo_status ?? null,
    laeuftBis:   status?.abo_laeuft_bis ?? null,
    preisCent:   status?.preis_cent ?? 4900,
    zahlungen:   status?.zahlungen ?? [],
    laden,
    fehler,
    checkout,
    codePruefen,
    neu: laden_,
  };
}

/** Admin: Rabattcodes verwalten */
export function useRabattcodes() {
  const [codes, setCodes] = useState<Rabattcode[]>([]);
  const [laden, setLaden] = useState(true);

  const laden_ = useCallback(async () => {
    try {
      setLaden(true);
      const data = await api.get<Rabattcode[]>('/abo/rabattcodes');
      setCodes(data);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  const erstellen = async (data: {
    code: string;
    rabatt_prozent: number;
    monate: number;
    max_nutzungen?: number | null;
    gueltig_bis?: string | null;
  }) => {
    await api.post('/abo/rabattcodes', data);
    await laden_();
  };

  const toggle = async (id: string, aktiv: boolean) => {
    await api.patch(`/abo/rabattcodes/${id}`, { aktiv });
    await laden_();
  };

  const loeschen = async (id: string) => {
    await api.delete(`/abo/rabattcodes/${id}`);
    await laden_();
  };

  return { codes, laden, erstellen, toggle, loeschen, neu: laden_ };
}
