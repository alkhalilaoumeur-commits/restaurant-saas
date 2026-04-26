import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';

interface Status {
  aktuelle_version: string;
  agb_version: string | null;
  avv_version: string | null;
  akzeptanz_noetig: boolean;
}

/**
 * Banner für Bestandskunden: erscheint, wenn AGB/AVV in einer neuen Version vorliegen
 * und der Restaurant-Admin sie noch nicht akzeptiert hat. Nur Admin sieht den Banner —
 * Kellner/Küche können den Vertrag nicht abschließen.
 */
export default function RechtsdokumenteBanner() {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const demo = useAuthStore((s) => s.demo);
  const [status, setStatus] = useState<Status | null>(null);
  const [akzeptiert, setAkzeptiert] = useState(false);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  useEffect(() => {
    // Nur Admin, kein Demo-Modus
    if (!mitarbeiter || mitarbeiter.rolle !== 'admin' || demo) return;
    api
      .get<Status>('/restaurant/rechtsdokumente-status')
      .then(setStatus)
      .catch(() => {
        // Stiller Fehler — Banner einfach nicht zeigen, App nicht blockieren
      });
  }, [mitarbeiter, demo]);

  if (!status?.akzeptanz_noetig) return null;

  const istErstkunde = status.agb_version === null && status.avv_version === null;

  async function akzeptieren() {
    if (!akzeptiert) {
      setFehler('Bitte den Hinweis bestätigen, um fortzufahren.');
      return;
    }
    setLaden(true);
    setFehler('');
    try {
      await api.post('/restaurant/rechtsdokumente-akzeptieren', {});
      setStatus(null);
    } catch (err) {
      setFehler((err as Error).message);
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <p className="font-medium mb-1">
            {istErstkunde
              ? 'Bitte AGB und Auftragsverarbeitungsvertrag akzeptieren'
              : 'Aktualisierte AGB und Auftragsverarbeitungsvertrag — Zustimmung erforderlich'}
          </p>
          <label className="flex items-start gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={akzeptiert}
              onChange={(e) => setAkzeptiert(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded shrink-0"
            />
            <span className="text-xs">
              Ich akzeptiere die{' '}
              <Link to="/agb" target="_blank" className="underline font-medium">AGB</Link>
              {' '}und den{' '}
              <a href="/legal/avv-vertrag.md" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                Auftragsverarbeitungsvertrag
              </a>{' '}
              (Stand {status.aktuelle_version}).
            </span>
          </label>
          {fehler && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{fehler}</p>}
        </div>
        <button
          onClick={akzeptieren}
          disabled={laden || !akzeptiert}
          className="h-9 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {laden ? 'Wird gespeichert…' : 'Akzeptieren'}
        </button>
      </div>
    </div>
  );
}
