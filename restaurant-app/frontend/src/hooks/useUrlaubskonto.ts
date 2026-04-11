import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface UrlaubskontoInfo {
  anspruch: number;
  verbraucht: number;
  verbleibend: number;
  jahr: number;
}

/**
 * Lädt den Urlaubsstand des eingeloggten Mitarbeiters.
 * Rechtsgrundlage: Art. 6(1)(c) DSGVO i.V.m. §3 BUrlG.
 */
export function useUrlaubskonto(jahr?: number) {
  const [konto, setKonto] = useState<UrlaubskontoInfo | null>(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const j = jahr || new Date().getFullYear();
    setLaden(true);
    api.get<UrlaubskontoInfo>(`/abwesenheiten/urlaubskonto?jahr=${j}`)
      .then(setKonto)
      .catch(() => {})
      .finally(() => setLaden(false));
  }, [jahr]);

  return { konto, laden };
}
