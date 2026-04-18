import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

// ──────────────────────────────────────────────────────────
// TypeScript-Typen (gespiegelt vom Backend)
// ──────────────────────────────────────────────────────────

export type KssAnbieter = 'deaktiviert' | 'generic_webhook' | 'orderbird' | 'ready2order' | 'sumup';

export interface KssKonfig {
  id?: string;
  anbieter: KssAnbieter;
  webhook_url: string | null;
  aktiv: boolean;
  hat_api_key: boolean;
}

export interface KssLogEintrag {
  id: string;
  bestellung_id: string;
  anbieter: string;
  status: 'success' | 'failed' | 'retrying';
  http_status: number | null;
  fehler_meldung: string | null;
  versuche: number;
  erstellt_am: string;
}

// ──────────────────────────────────────────────────────────
// Hook: useKss
// Stellt alle KSS-Funktionen bereit: Konfig lesen/schreiben, testen, Log abrufen
// ──────────────────────────────────────────────────────────

export function useKss() {
  const [konfig, setKonfig] = useState<KssKonfig | null>(null);
  const [logs, setLogs] = useState<KssLogEintrag[]>([]);
  const [fehlerInFolge, setFehlerInFolge] = useState(0);
  const [laden, setLaden] = useState(true);
  const [speichern, setSpeichern] = useState(false);
  const [testen, setTesten] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  // Konfiguration vom Server laden
  const konfigLaden = useCallback(async () => {
    try {
      setLaden(true);
      const daten = await api.get<KssKonfig>('/kss/konfiguration');
      setKonfig(daten);
    } catch (e) {
      setFehler('Konfiguration konnte nicht geladen werden');
    } finally {
      setLaden(false);
    }
  }, []);

  // Log-Einträge laden
  const logLaden = useCallback(async () => {
    try {
      const daten = await api.get<{ logs: KssLogEintrag[]; fehler_in_folge: number }>('/kss/log');
      setLogs(daten.logs);
      setFehlerInFolge(daten.fehler_in_folge);
    } catch {
      // Log-Fehler stille ignorieren — nicht kritisch
    }
  }, []);

  // Beim ersten Laden
  useEffect(() => {
    konfigLaden();
    logLaden();
  }, [konfigLaden, logLaden]);

  // Konfiguration speichern
  const konfigSpeichern = async (daten: {
    anbieter: KssAnbieter;
    webhook_url?: string;
    api_key?: string;
    aktiv?: boolean;
  }): Promise<boolean> => {
    try {
      setSpeichern(true);
      setFehler(null);
      const aktualisiert = await api.post<KssKonfig>('/kss/konfiguration', daten);
      setKonfig(aktualisiert);
      return true;
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Speichern fehlgeschlagen');
      return false;
    } finally {
      setSpeichern(false);
    }
  };

  // Verbindung testen
  const verbindungTesten = async (): Promise<{
    erfolg: boolean;
    http_status?: number;
    fehler?: string;
  }> => {
    try {
      setTesten(true);
      setFehler(null);
      const ergebnis = await api.post<{ erfolg: boolean; http_status?: number; fehler?: string }>(
        '/kss/test',
        {}
      );
      await logLaden(); // Log nach Test aktualisieren
      return ergebnis;
    } catch (e) {
      return { erfolg: false, fehler: e instanceof Error ? e.message : 'Testfehler' };
    } finally {
      setTesten(false);
    }
  };

  return {
    konfig,
    logs,
    fehlerInFolge,
    laden,
    speichernLaeuft: speichern,
    testenLaeuft: testen,
    fehler,
    konfigSpeichern,
    verbindungTesten,
    logNeuLaden: logLaden,
  };
}
