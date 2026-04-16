import { useRef, useState } from 'react';
import { MitarbeiterDetail, Rolle } from '../../types';
import { formatDatum } from '../../lib/utils';
import { api } from '../../lib/api';

const ROLLEN_LABEL: Record<Rolle, string> = {
  admin: 'Administrator',
  kellner: 'Kellner',
  kueche: 'Küche',
};

const ROLLEN_FARBE: Record<Rolle, string> = {
  admin: 'bg-violet-100 text-violet-700',
  kellner: 'bg-sky-100 text-sky-700',
  kueche: 'bg-amber-100 text-amber-700',
};

// Avatar-Gradient pro Rolle
const AVATAR_GRADIENT: Record<Rolle, string> = {
  admin: 'from-violet-100 to-violet-50 text-violet-600',
  kellner: 'from-sky-100 to-sky-50 text-sky-600',
  kueche: 'from-amber-100 to-amber-50 text-amber-600',
};

interface MitarbeiterZeileProps {
  mitarbeiter: MitarbeiterDetail;
  istEigenerAccount: boolean;
  onBearbeiten: (m: MitarbeiterDetail) => void;
  onToggleAktiv: (id: string, aktiv: boolean) => void;
  onErneutEinladen: (id: string) => Promise<void>;
  /** Wenn gesetzt, wird der Avatar klickbar und lädt ein neues Foto hoch */
  onFotoAktualisieren?: (id: string, foto_url: string | null) => Promise<void>;
}

export default function MitarbeiterZeile({ mitarbeiter, istEigenerAccount, onBearbeiten, onToggleAktiv, onErneutEinladen, onFotoAktualisieren }: MitarbeiterZeileProps) {
  const [einladungLaden, setEinladungLaden] = useState(false);
  const [einladungGesendet, setEinladungGesendet] = useState(false);
  const [fotoLaden, setFotoLaden] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  async function fotoHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onFotoAktualisieren) return;
    setFotoLaden(true);
    try {
      const url = await api.upload(file);
      await onFotoAktualisieren(mitarbeiter.id, url);
    } catch {
      // Fehler ignorieren – Hook zeigt ggf. Fehler an
    } finally {
      setFotoLaden(false);
      // Input zurücksetzen damit dieselbe Datei nochmal wählbar ist
      if (fotoInputRef.current) fotoInputRef.current.value = '';
    }
  }

  async function erneutEinladenKlick() {
    setEinladungLaden(true);
    try {
      await onErneutEinladen(mitarbeiter.id);
      setEinladungGesendet(true);
      setTimeout(() => setEinladungGesendet(false), 4000);
    } catch {
      // Fehler wird ggf. im Hook behandelt
    } finally {
      setEinladungLaden(false);
    }
  }

  return (
    <div className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-xl p-4 shadow-sm flex items-center gap-4 card-hover ${!mitarbeiter.aktiv ? 'opacity-60' : ''}`}>
      {/* Avatar — klickbar für Foto-Upload wenn Admin */}
      <div
        className={`w-10 h-10 rounded-xl shrink-0 relative overflow-hidden ${onFotoAktualisieren ? 'cursor-pointer group' : ''}`}
        onClick={() => onFotoAktualisieren && fotoInputRef.current?.click()}
        title={onFotoAktualisieren ? 'Profilbild ändern' : undefined}
      >
        {mitarbeiter.foto_url ? (
          <img src={mitarbeiter.foto_url} alt={mitarbeiter.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${AVATAR_GRADIENT[mitarbeiter.rolle]} flex items-center justify-center text-sm font-bold ring-1 ring-black/5`}>
            {fotoLaden ? (
              <svg className="w-4 h-4 animate-spin opacity-60" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              mitarbeiter.name.charAt(0).toUpperCase()
            )}
          </div>
        )}
        {/* Hover-Overlay für Upload-Hinweis */}
        {onFotoAktualisieren && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {fotoLaden ? (
              <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        )}
        <input
          ref={fotoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={fotoHochladen}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{mitarbeiter.name}</p>
          {istEigenerAccount && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-slate-400 font-medium">Du</span>
          )}
          {!mitarbeiter.aktiv && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-50 text-red-500 font-medium">Deaktiviert</span>
          )}
          {mitarbeiter.einladung_ausstehend && mitarbeiter.aktiv && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
              Einladung ausstehend
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{mitarbeiter.email}</p>
      </div>

      {/* Rolle */}
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${ROLLEN_FARBE[mitarbeiter.rolle]}`}>
        {ROLLEN_LABEL[mitarbeiter.rolle]}
      </span>

      {/* Datum */}
      <p className="text-xs text-gray-400 dark:text-slate-500 shrink-0 hidden sm:block">seit {formatDatum(mitarbeiter.erstellt_am).split(' ')[0]}</p>

      {/* Aktionen */}
      <div className="flex gap-1.5 shrink-0">
        {/* Erneut einladen — nur wenn Einladung ausstehend */}
        {mitarbeiter.einladung_ausstehend && mitarbeiter.aktiv && (
          <button
            onClick={erneutEinladenKlick}
            disabled={einladungLaden || einladungGesendet}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              einladungGesendet
                ? 'bg-green-50 text-green-600'
                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'
            } disabled:opacity-60`}
          >
            {einladungLaden ? '...' : einladungGesendet ? 'Gesendet!' : 'Erneut einladen'}
          </button>
        )}

        <button
          onClick={() => onBearbeiten(mitarbeiter)}
          className="text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-medium"
        >
          Bearbeiten
        </button>
        {!istEigenerAccount && (
          <button
            onClick={() => onToggleAktiv(mitarbeiter.id, !mitarbeiter.aktiv)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              mitarbeiter.aktiv
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {mitarbeiter.aktiv ? 'Deaktivieren' : 'Aktivieren'}
          </button>
        )}
      </div>
    </div>
  );
}
