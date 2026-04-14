import { useState, useCallback } from 'react';
import { SchichtTemplate } from '../types';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

export function useSchichtTemplates() {
  const [templates, setTemplates] = useState<SchichtTemplate[]>([]);
  const [laden, setLaden] = useState(false);
  const demo = useAuthStore((s) => s.demo);

  const laden_ = useCallback(async () => {
    if (demo) { setTemplates([]); return; }
    setLaden(true);
    try {
      const data = await api.get<SchichtTemplate[]>('/dienstplan/templates');
      setTemplates(data);
    } finally {
      setLaden(false);
    }
  }, [demo]);

  /** Aktuelle Woche als Vorlage speichern */
  const speichern = useCallback(async (
    name: string,
    eintraege: Array<{
      mitarbeiter_id: string;
      wochentag: number;
      beginn: string;
      ende: string;
      notiz?: string | null;
    }>
  ): Promise<SchichtTemplate> => {
    if (demo) throw new Error('Im Demo-Modus nicht verfügbar');
    const neu = await api.post<SchichtTemplate>('/dienstplan/templates', { name, eintraege });
    setTemplates(prev => [neu, ...prev]);
    return neu;
  }, [demo]);

  /** Vorlage auf eine Woche anwenden — erstellt echte Schichten */
  const anwenden = useCallback(async (
    templateId: string,
    montag: string  // "YYYY-MM-DD"
  ): Promise<{ erstellt: number; uebersprungen: number }> => {
    if (demo) throw new Error('Im Demo-Modus nicht verfügbar');
    return api.post<{ erstellt: number; uebersprungen: number }>(
      `/dienstplan/templates/${templateId}/anwenden`,
      { montag }
    );
  }, [demo]);

  const loeschen = useCallback(async (templateId: string) => {
    if (demo) return;
    await api.delete(`/dienstplan/templates/${templateId}`);
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }, [demo]);

  return { templates, laden, laden_, speichern, anwenden, loeschen };
}
