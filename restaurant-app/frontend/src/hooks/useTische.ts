import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Tisch, TischStatus } from '../types';

export function useTische() {
  const [tische, setTische] = useState<Tisch[]>([]);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
    try {
      setTische(await api.get<Tisch[]>('/tische'));
    } catch (e) {
      setFehler((e as Error).message);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => { laden_(); }, [laden_]);

  const statusAendern = useCallback(async (id: string, status: TischStatus) => {
    await api.patch(`/tische/${id}/status`, { status });
    await laden_();
  }, [laden_]);

  return { tische, laden, fehler, laden_, statusAendern };
}
