import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import { useGaeste } from '../hooks/useGaeste';
import { useAuthStore } from '../store/auth';
import { Gast, GastMitReservierungen, GAST_TAGS } from '../types';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function datumFormatieren(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function zeitFormatieren(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function initialien(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join('');
}

const TAG_FARBEN: Record<string, string> = {
  VIP:               'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700/50',
  Stammgast:         'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700/50',
  Vegetarisch:       'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/50',
  Vegan:             'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/50',
  Laktoseintoleranz: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700/50',
  Glutenfrei:        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50',
  Allergie:          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700/50',
  'No-Show':         'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700/50',
  Geburtstagsgast:   'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-700/50',
  Geschäftsgast:     'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600/50',
};

function TagBadge({ tag, klein }: { tag: string; klein?: boolean }) {
  const farbe = TAG_FARBEN[tag] || 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-white/10';
  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${klein ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'} ${farbe}`}>
      {tag}
    </span>
  );
}

const STATUS_FARBEN: Record<string, string> = {
  bestaetigt:    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  ausstehend:    'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  abgeschlossen: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400',
  storniert:     'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  no_show:       'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};
const STATUS_LABELS: Record<string, string> = {
  bestaetigt: 'Bestätigt', ausstehend: 'Ausstehend',
  abgeschlossen: 'Abgeschlossen', storniert: 'Storniert', no_show: 'No-Show',
};

const ANLASS_LABELS: Record<string, string> = {
  geburtstag: 'Geburtstag', jubilaeum: 'Jubiläum', date_night: 'Date Night',
  geschaeft: 'Geschäftlich', feier: 'Feier', sonstiges: 'Sonstiges',
};

// ─── Gast-Formular ───────────────────────────────────────────────────────────

function GastFormular({
  gast,
  onSpeichern,
  onAbbrechen,
}: {
  gast?: Gast;
  onSpeichern: (daten: { name: string; email?: string | null; telefon?: string | null; notizen?: string | null; tags?: string[] }) => Promise<void>;
  onAbbrechen: () => void;
}) {
  const istNeu = !gast;
  const [name, setName] = useState(gast?.name || '');
  const [email, setEmail] = useState(gast?.email || '');
  const [telefon, setTelefon] = useState(gast?.telefon || '');
  const [notizen, setNotizen] = useState(gast?.notizen || '');
  const [tags, setTags] = useState<string[]>(gast?.tags || []);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  function tagToggle(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFehler('');
    if (!name.trim()) { setFehler('Name ist erforderlich.'); return; }
    setLaden(true);
    try {
      await onSpeichern({
        name: name.trim(),
        email: email.trim() || null,
        telefon: telefon.trim() || null,
        notizen: notizen.trim() || null,
        tags,
      });
    } catch (e: any) {
      setFehler(e.data?.fehler || e.message || 'Fehler beim Speichern');
    } finally {
      setLaden(false);
    }
  }

  const inputKlasse = 'w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400';
  const labelKlasse = 'block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelKlasse}>Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Max Mustermann" className={inputKlasse} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelKlasse}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@example.de" className={inputKlasse} />
        </div>
        <div>
          <label className={labelKlasse}>Telefon</label>
          <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="0711 123456" className={inputKlasse} />
        </div>
      </div>
      <div>
        <label className={labelKlasse}>Notizen</label>
        <textarea
          value={notizen}
          onChange={(e) => setNotizen(e.target.value)}
          rows={3}
          placeholder="Präferenzen, Allergien, besondere Wünsche..."
          className={`${inputKlasse} resize-none`}
        />
      </div>
      <div>
        <label className={labelKlasse}>Tags</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {GAST_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => tagToggle(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                tags.includes(tag)
                  ? (TAG_FARBEN[tag] || 'bg-blue-100 text-blue-700 border-blue-200')
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {fehler && <p className="text-xs text-red-600">{fehler}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={laden}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {laden ? 'Wird gespeichert…' : istNeu ? 'Gast anlegen' : 'Änderungen speichern'}
        </button>
        <button type="button" onClick={onAbbrechen} className="flex-1 border border-gray-200 dark:border-white/10 rounded-lg py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

// ─── Gast-Profil Modal ────────────────────────────────────────────────────────

function GastProfilModal({
  profil,
  onSchliessen,
  onBearbeiten,
  onLoeschen,
}: {
  profil: GastMitReservierungen;
  onSchliessen: () => void;
  onBearbeiten: () => void;
  onLoeschen: () => void;
}) {
  const [loeschenBestaetigen, setLoeschenBestaetigen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Kopfzeile */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {initialien(profil.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{profil.name}</h2>
          <div className="flex flex-wrap gap-1 mt-1">
            {profil.tags.map((t) => <TagBadge key={t} tag={t} klein />)}
            {profil.tags.length === 0 && <span className="text-xs text-gray-400 dark:text-slate-600">Keine Tags</span>}
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3">
          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm text-gray-700 dark:text-slate-200 truncate">{profil.email || '—'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3">
          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Telefon</p>
          <p className="text-sm text-gray-700 dark:text-slate-200">{profil.telefon || '—'}</p>
        </div>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{profil.besuche}</p>
          <p className="text-[10px] text-blue-600 dark:text-blue-500 font-medium mt-0.5">Besuche</p>
        </div>
        <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3 text-center col-span-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{datumFormatieren(profil.letzter_besuch)}</p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Letzter Besuch</p>
        </div>
      </div>

      {/* Notizen */}
      {profil.notizen && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-700/20 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Notizen</p>
          <p className="text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap">{profil.notizen}</p>
        </div>
      )}

      {/* Reservierungshistorie */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Besuchshistorie</p>
        {profil.reservierungen.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-600 italic">Noch keine Reservierungen verknüpft.</p>
        ) : (
          <div className="space-y-2">
            {profil.reservierungen.map((r) => (
              <div key={r.id} className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl px-3 py-2.5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                      {datumFormatieren(r.datum.slice(0, 10))} · {zeitFormatieren(r.datum)}
                    </p>
                    {r.tisch_nummer && (
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">Tisch {r.tisch_nummer}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-slate-400">{r.personen} Personen</span>
                    {r.anlass && (
                      <span className="text-xs text-gray-400 dark:text-slate-500">· {ANLASS_LABELS[r.anlass] || r.anlass}</span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_FARBEN[r.status] || ''}`}>
                  {STATUS_LABELS[r.status] || r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aktionen */}
      <div className="flex gap-2 border-t border-gray-100 dark:border-white/10 pt-4">
        <button
          onClick={onBearbeiten}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Bearbeiten
        </button>
        {!loeschenBestaetigen ? (
          <button
            onClick={() => setLoeschenBestaetigen(true)}
            className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-700/50 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Löschen
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button onClick={onLoeschen} className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors">
              Bestätigen
            </button>
            <button onClick={() => setLoeschenBestaetigen(false)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Abbruch
            </button>
          </div>
        )}
        <button onClick={onSchliessen} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Schließen
        </button>
      </div>

      {/* DSGVO-Hinweis beim Löschen */}
      {loeschenBestaetigen && (
        <p className="text-xs text-gray-400 dark:text-slate-500 -mt-3">
          Das Gast-Profil wird gelöscht. Reservierungen bleiben erhalten, aber der CRM-Link wird entfernt (DSGVO).
        </p>
      )}
    </div>
  );
}

// ─── Gast-Karte (Listenelement) ───────────────────────────────────────────────

function GastKarte({ gast, onClick }: { gast: Gast; onClick: () => void }) {
  const hatNoShow = gast.tags.includes('No-Show');
  const istVip = gast.tags.includes('VIP');

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${
          istVip ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
          hatNoShow ? 'bg-gradient-to-br from-red-400 to-red-500' :
          'bg-gradient-to-br from-blue-400 to-blue-600'
        }`}>
          {initialien(gast.name)}
        </div>

        {/* Name + Tags */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {gast.name}
            </p>
            {istVip && <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">★ VIP</span>}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {gast.tags.filter((t) => t !== 'VIP').slice(0, 3).map((t) => (
              <TagBadge key={t} tag={t} klein />
            ))}
            {gast.tags.length > 4 && (
              <span className="text-[10px] text-gray-400 dark:text-slate-600">+{gast.tags.length - 3}</span>
            )}
          </div>
        </div>

        {/* Statistiken */}
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-700 dark:text-slate-200">{gast.besuche}×</p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500">
            {gast.letzter_besuch ? datumFormatieren(gast.letzter_besuch) : 'Kein Besuch'}
          </p>
        </div>
      </div>

      {/* Kontakt */}
      {(gast.email || gast.telefon) && (
        <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
          {gast.email && (
            <span className="flex items-center gap-1 truncate">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {gast.email}
            </span>
          )}
          {gast.telefon && (
            <span className="flex items-center gap-1 shrink-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
              </svg>
              {gast.telefon}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────

export default function Gaeste() {
  const { gaeste, laden, erstellen, aktualisieren, loeschen, profil } = useGaeste();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const demo = useAuthStore((s) => s.demo);

  const [suche, setSuche] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [exportLaden, setExportLaden] = useState(false);

  const [formularOffen, setFormularOffen] = useState(false);
  const [gewaehlterGast, setGewaehlterGast] = useState<GastMitReservierungen | null>(null);
  const [profilLaden, setProfilLaden] = useState(false);
  const [bearbeitungGast, setBearbeitungGast] = useState<Gast | null>(null);

  // Automatisch Profil öffnen wenn via navigate(..., { state: { openGastId } }) navigiert
  useEffect(() => {
    const openId = (location.state as { openGastId?: string } | null)?.openGastId;
    if (!openId || laden) return;
    const gast = gaeste.find((g) => g.id === openId);
    if (gast) gastOeffnen(gast);
  }, [location.state, laden, gaeste]);

  // Suche + Tag-Filter
  const gefiltert = useMemo(() => {
    let liste = gaeste;
    if (suche.trim()) {
      const s = suche.toLowerCase();
      liste = liste.filter(
        (g) =>
          g.name.toLowerCase().includes(s) ||
          g.email?.toLowerCase().includes(s) ||
          g.telefon?.includes(s) ||
          g.notizen?.toLowerCase().includes(s)
      );
    }
    if (tagFilter) {
      liste = liste.filter((g) => g.tags.includes(tagFilter));
    }
    return liste;
  }, [gaeste, suche, tagFilter]);

  // Alle verwendeten Tags aus dem Bestand sammeln (für Filter-Chips)
  const vorhandenesTags = useMemo(() => {
    const set = new Set<string>();
    gaeste.forEach((g) => g.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [gaeste]);

  async function gastOeffnen(g: Gast) {
    setProfilLaden(true);
    try {
      const p = await profil(g.id);
      setGewaehlterGast(p);
    } finally {
      setProfilLaden(false);
    }
  }

  function profilSchliessen() {
    setGewaehlterGast(null);
    setBearbeitungGast(null);
  }

  async function csvExportieren() {
    if (demo) {
      // Im Demo-Modus: CSV direkt aus den Demo-Daten generieren
      const kopf = 'Name;Email;Telefon;Besuche;Letzter Besuch;Tags;Notizen\r\n';
      const zeilen = gaeste.map((g) =>
        [
          `"${g.name}"`,
          g.email || '',
          g.telefon || '',
          g.besuche,
          g.letzter_besuch ? new Date(g.letzter_besuch).toLocaleDateString('de-DE') : '',
          `"${g.tags.join(', ')}"`,
          g.notizen ? `"${g.notizen.replace(/"/g, '""')}"` : '',
        ].join(';')
      ).join('\r\n');
      const blob = new Blob(['\uFEFF' + kopf + zeilen], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gaeste-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    setExportLaden(true);
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiBase}/gaeste/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export fehlgeschlagen');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gaeste-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setExportLaden(false);
    }
  }

  const stammgaeste = gaeste.filter((g) => g.besuche >= 3).length;
  const vips = gaeste.filter((g) => g.tags.includes('VIP')).length;
  const noShows = gaeste.filter((g) => g.tags.includes('No-Show')).length;

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Gäste-CRM"
        untertitel={`${gaeste.length} Gäste`}
        aktion={
          <div className="flex items-center gap-2">
            <button
              onClick={csvExportieren}
              disabled={exportLaden || gaeste.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
              title="CSV-Export (DSGVO Auskunftsrecht)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exportLaden ? 'Wird exportiert…' : 'CSV Export'}
            </button>
            <button
              onClick={() => setFormularOffen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Gast anlegen
            </button>
          </div>
        }
      />

      {/* Statistik-Karten */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{gaeste.length}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Gäste gesamt</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-700/30 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stammgaeste}</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">Stammgäste (3+)</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-700/30 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{vips}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">VIP-Gäste</p>
        </div>
      </div>

      {/* Suche + Tag-Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Name, Email, Telefon oder Notiz suchen…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Tag-Filter Chips */}
      {vorhandenesTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          <button
            onClick={() => setTagFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              tagFilter === null
                ? 'bg-gray-900 dark:bg-white/15 text-white border-transparent'
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
            }`}
          >
            Alle
          </button>
          {vorhandenesTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                tagFilter === tag
                  ? (TAG_FARBEN[tag] || 'bg-blue-100 text-blue-700 border-blue-200')
                  : 'bg-white dark:bg-white/5 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
          {noShows > 0 && !vorhandenesTags.includes('No-Show') && null}
        </div>
      )}

      {/* Laden */}
      {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen…</p>}

      {/* Leer-Zustand */}
      {!laden && gaeste.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Noch keine Gäste vorhanden</p>
          <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">Gäste werden automatisch aus Online-Buchungen angelegt oder können manuell hinzugefügt werden.</p>
          <button onClick={() => setFormularOffen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            Ersten Gast anlegen
          </button>
        </div>
      )}

      {/* Kein Ergebnis bei Suche */}
      {!laden && gaeste.length > 0 && gefiltert.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-8">
          Kein Gast gefunden für „{suche || tagFilter}".
        </p>
      )}

      {/* Gäste-Liste */}
      {profilLaden && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 dark:bg-black/40">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl px-8 py-6 shadow-xl text-sm text-gray-600 dark:text-slate-300">
            Profil wird geladen…
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {gefiltert.map((g) => (
          <GastKarte key={g.id} gast={g} onClick={() => gastOeffnen(g)} />
        ))}
      </div>

      {/* Gast anlegen Modal */}
      <Modal offen={formularOffen} onSchliessen={() => setFormularOffen(false)} titel="Neuen Gast anlegen">
        <GastFormular
          onSpeichern={async (daten) => {
            await erstellen(daten);
            setFormularOffen(false);
          }}
          onAbbrechen={() => setFormularOffen(false)}
        />
      </Modal>

      {/* Gast bearbeiten Modal */}
      <Modal
        offen={!!bearbeitungGast}
        onSchliessen={() => setBearbeitungGast(null)}
        titel={bearbeitungGast ? `${bearbeitungGast.name} bearbeiten` : ''}
      >
        {bearbeitungGast && (
          <GastFormular
            gast={bearbeitungGast}
            onSpeichern={async (daten) => {
              await aktualisieren(bearbeitungGast.id, daten);
              // Lokales Profil aktualisieren
              if (gewaehlterGast && gewaehlterGast.id === bearbeitungGast.id) {
                setGewaehlterGast((prev) => prev ? { ...prev, ...daten } : null);
              }
              setBearbeitungGast(null);
            }}
            onAbbrechen={() => setBearbeitungGast(null)}
          />
        )}
      </Modal>

      {/* Gast-Profil Modal */}
      <Modal
        offen={!!gewaehlterGast && !bearbeitungGast}
        onSchliessen={profilSchliessen}
        titel=""
      >
        {gewaehlterGast && (
          <GastProfilModal
            profil={gewaehlterGast}
            onSchliessen={profilSchliessen}
            onBearbeiten={() => setBearbeitungGast(gewaehlterGast)}
            onLoeschen={async () => {
              await loeschen(gewaehlterGast.id);
              profilSchliessen();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
