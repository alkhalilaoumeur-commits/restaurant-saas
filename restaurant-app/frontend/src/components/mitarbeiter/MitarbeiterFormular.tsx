import { useState, FormEvent } from 'react';
import { MitarbeiterDetail, Rolle } from '../../types';

interface MitarbeiterFormularProps {
  /** Wenn gesetzt: Bearbeitungsmodus */
  mitarbeiter?: MitarbeiterDetail;
  onSpeichern: (daten: {
    name: string;
    email?: string;
    rolle: Rolle;
    stundenlohn?: number | null;
  }) => Promise<void>;
  onPasswortAendern?: (passwort: string) => Promise<void>;
  onAbbrechen: () => void;
}

export default function MitarbeiterFormular({ mitarbeiter, onSpeichern, onPasswortAendern, onAbbrechen }: MitarbeiterFormularProps) {
  const istNeu = !mitarbeiter;

  const [name, setName] = useState(mitarbeiter?.name || '');
  const [email, setEmail] = useState(mitarbeiter?.email || '');
  const [rolle, setRolle] = useState<Rolle>(mitarbeiter?.rolle || 'kellner');
  const [stundenlohn, setStundenlohn] = useState(
    mitarbeiter?.stundenlohn != null ? String(mitarbeiter.stundenlohn) : ''
  );
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  // Passwort-Änderung (nur Bearbeitungsmodus)
  const [neuesPasswort, setNeuesPasswort] = useState('');
  const [passwortLaden, setPasswortLaden] = useState(false);
  const [passwortErfolg, setPasswortErfolg] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFehler('');
    setLaden(true);
    try {
      if (istNeu) {
        await onSpeichern({ name, email, rolle });
      } else {
        const stundenlohnWert = stundenlohn.trim() === ''
          ? null
          : Number(stundenlohn.replace(',', '.'));
        await onSpeichern({ name, rolle, stundenlohn: stundenlohnWert });
      }
    } catch (e: any) {
      setFehler(e.data?.fehler || e.message || 'Fehler beim Speichern');
    } finally {
      setLaden(false);
    }
  }

  async function passwortSubmit(e: FormEvent) {
    e.preventDefault();
    if (!onPasswortAendern) return;
    setPasswortLaden(true);
    setPasswortErfolg(false);
    try {
      await onPasswortAendern(neuesPasswort);
      setNeuesPasswort('');
      setPasswortErfolg(true);
      setTimeout(() => setPasswortErfolg(false), 3000);
    } catch (e: any) {
      setFehler(e.data?.fehler || e.message || 'Fehler beim Passwort ändern');
    } finally {
      setPasswortLaden(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
            placeholder="Max Mustermann"
          />
        </div>

        {istNeu && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="max@restaurant.de"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Rolle</label>
          <select
            value={rolle}
            onChange={(e) => setRolle(e.target.value as Rolle)}
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="admin">Administrator</option>
            <option value="kellner">Kellner</option>
            <option value="kueche">Küche</option>
          </select>
        </div>

        {/* Stundenlohn — nur im Bearbeitungsmodus, nicht beim Einladen */}
        {!istNeu && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
              Stundenlohn (€)
              <span className="ml-1 text-gray-300 dark:text-slate-600 font-normal">— nur intern, für Dienstplan-Budget</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">€</span>
              <input
                type="number"
                value={stundenlohn}
                onChange={(e) => setStundenlohn(e.target.value)}
                min="0"
                step="0.50"
                placeholder="z.B. 14.00"
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
        )}

        {/* Hinweis: Einladung per Email */}
        {istNeu && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Der Mitarbeiter erhält eine <strong>Einladungs-Email</strong> und setzt sein eigenes Passwort.
              Der Link ist 48 Stunden gültig.
            </p>
          </div>
        )}

        {fehler && <p className="text-xs text-red-600">{fehler}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={laden}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {laden ? 'Wird gesendet...' : istNeu ? 'Einladung senden' : 'Änderungen speichern'}
          </button>
          <button type="button" onClick={onAbbrechen} className="flex-1 border border-gray-200 dark:border-white/10 rounded-lg py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            Abbrechen
          </button>
        </div>
      </form>

      {/* Passwort ändern (nur Bearbeitungsmodus, nur wenn MA Einladung angenommen hat) */}
      {!istNeu && onPasswortAendern && !mitarbeiter?.einladung_ausstehend && (
        <form onSubmit={passwortSubmit} className="border-t border-gray-100 dark:border-white/5 pt-4">
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Neues Passwort setzen</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={neuesPasswort}
              onChange={(e) => setNeuesPasswort(e.target.value)}
              minLength={8}
              required
              className="flex-1 border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="Mind. 8 Zeichen, 1 Großbuchstabe, 1 Zahl"
            />
            <button
              type="submit"
              disabled={passwortLaden}
              className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              {passwortLaden ? '...' : 'Setzen'}
            </button>
          </div>
          {passwortErfolg && <p className="text-xs text-green-600 mt-1">Passwort wurde geändert.</p>}
        </form>
      )}
    </div>
  );
}
