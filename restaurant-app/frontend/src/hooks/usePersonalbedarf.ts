import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { PersonalbedarfTag } from '../types';

export function usePersonalbedarf(start: string, ende: string) {
  const [bedarf, setBedarf] = useState<PersonalbedarfTag[]>([]);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden_ = useCallback(async () => {
    if (!start || !ende) return;
    setLaden(true);
    setFehler(null);
    try {
      const data = await api.get<PersonalbedarfTag[]>(
        `/reservierungen/personalbedarf?start=${start}&ende=${ende}`
      );
      setBedarf(data);
    } catch (e: any) {
      setFehler(e.message || 'Fehler beim Laden des Personalbedarfs');
    } finally {
      setLaden(false);
    }
  }, [start, ende]);

  useEffect(() => { laden_(); }, [laden_]);

  return { bedarf, laden, fehler };
}
