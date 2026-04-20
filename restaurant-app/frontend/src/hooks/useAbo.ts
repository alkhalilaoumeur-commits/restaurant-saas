/**
 * useAbo — Abo-Status, Checkout + Rabattcode-Logik
 *
 * Liefert:
 *   - aboStatus:     'trial' | 'active' | 'expired'
 *   - laeuftBis:     Datum als string oder null
 *   - zahlungen:     Zahlungshistorie
 *   - checkout():    Zahlungslink anfordern (leitet zu Stripe weiter)
 *   - codePruefen(): Rabattcode via Stripe validieren und Preisinfo zurückgeben
 *
 * Rabattcodes werden im Stripe Dashboard erstellt (Produkte → Gutscheine → Aktionscodes).
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

interface AboStatus {
  abo_status: 'trial' | 'active' | 'expired';
  abo_plan: 'basis' | 'standard' | 'pro';
  abo_laeuft_bis: string | null;
  plan_preise: Record<string, { cent: number; label: string }>;
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

  const checkout = useCallback(async (rabattcode?: string, plan?: string): Promise<void> => {
    const data = await api.post<{ redirect_url: string; gratis?: boolean }>(
      '/abo/checkout',
      { rabattcode: rabattcode || undefined, plan: plan || undefined },
    );
    if (data.gratis) {
      await laden_();
    } else {
      window.location.href = data.redirect_url;
    }
  }, [laden_]);

  const codePruefen = useCallback(async (code: string, plan?: string): Promise<RabattcodeInfo> => {
    return api.post<RabattcodeInfo>('/abo/rabattcode/pruefen', { code, plan });
  }, []);

  return {
    aboStatus:   status?.abo_status ?? null,
    aboPlan:     status?.abo_plan ?? 'basis',
    laeuftBis:   status?.abo_laeuft_bis ?? null,
    planPreise:  status?.plan_preise ?? { basis: { cent: 1900, label: 'Basis' }, standard: { cent: 3900, label: 'Standard' }, pro: { cent: 6900, label: 'Pro' } },
    zahlungen:   status?.zahlungen ?? [],
    laden,
    fehler,
    checkout,
    codePruefen,
    neu: laden_,
  };
}
