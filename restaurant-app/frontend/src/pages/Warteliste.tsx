import { useState } from 'react';
import { useWarteliste, Wartelisteneintrag } from '../hooks/useWarteliste';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function heuteDatum(): string {
  return new Date().toISOString().slice(0, 10);
}

function zeitKurz(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(status: Wartelisteneintrag['status']) {
  const map: Record<Wartelisteneintrag['status'], { label: string; klasse: string }> = {
    wartend:        { label: 'Wartend',        klasse: 'bg-amber-100 text-amber-800' },
    benachrichtigt: { label: 'Benachrichtigt', klasse: 'bg-blue-100 text-blue-800' },
    bestaetigt:     { label: 'Bestätigt',      klasse: 'bg-emerald-100 text-emerald-800' },
    abgelaufen:     { label: 'Abgelaufen',     klasse: 'bg-gray-100 text-gray-600' },
    storniert:      { label: 'Storniert',      klasse: 'bg-red-100 text-red-700' },
  };
  const { label, klasse } = map[status] ?? map.wartend;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${klasse}`}>
      {label}
    </span>
  );
}

function quelleBadge(quelle: Wartelisteneintrag['quelle']) {
  return quelle === 'online'
    ? <span className="text-xs text-blue-600 font-medium">Online</span>
    : <span className="text-xs text-gray-500">Walk-in</span>;
}

// ─── Formular-Modal ───────────────────────────────────────────────────────────

interface FormDaten {
  gast_name: string;
  telefon: string;
  email: string;
  personen: string;
  anmerkung: string;
}

function HinzufuegenModal({
  onSpeichern,
  onAbbrechen,
  laden,
}: {
  onSpeichern: (d: FormDaten) => Promise<void>;
  onAbbrechen: () => void;
  laden: boolean;
}) {
  const [form, setForm] = useState<FormDaten>({
    gast_name: '', telefon: '', email: '', personen: '2', anmerkung: '',
  });
  const [fehler, setFehler] = useState('');

  const submit = async () => {
    if (!form.gast_name.trim()) { setFehler('Name ist erforderlich'); return; }
    if (!form.personen || parseInt(form.personen) < 1) { setFehler('Personenzahl eingeben'); return; }
    setFehler('');
    await onSpeichern(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Zur Warteliste hinzufügen</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.gast_name}
              onChange={(e) => setForm({ ...form, gast_name: e.target.value })}
              placeholder="Max Mustermann"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personen *</label>
            <input
              type="number" min={1} max={50}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.personen}
              onChange={(e) => setForm({ ...form, personen: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              placeholder="+49 ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="gast@email.de"
            />
            <p className="text-xs text-gray-400 mt-1">Wird benachrichtigt wenn ein Platz frei wird</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anmerkung</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form.anmerkung}
              onChange={(e) => setForm({ ...form, anmerkung: e.target.value })}
              placeholder="z.B. Kinderstuhl benötigt"
            />
          </div>
          {fehler && <p className="text-sm text-red-600">{fehler}</p>}
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onAbbrechen}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={submit}
            disabled={laden}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {laden ? 'Wird gespeichert...' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────

export default function Warteliste() {
  const [datum, setDatum] = useState(heuteDatum());
  const [modalOffen, setModalOffen] = useState(false);
  const [formLaden, setFormLaden] = useState(false);
  const [filter, setFilter] = useState<'alle' | 'wartend' | 'bestaetigt' | 'storniert'>('alle');

  const { eintraege, laden, fehler, hinzufuegen, bestaetigen, stornieren } = useWarteliste(datum);

  const gefiltertEintraege = filter === 'alle'
    ? eintraege
    : eintraege.filter((e) => e.status === filter);

  const wartendAnzahl = eintraege.filter((e) => e.status === 'wartend').length;
  const benachrichtigtAnzahl = eintraege.filter((e) => e.status === 'benachrichtigt').length;

  const handleHinzufuegen = async (daten: {
    gast_name: string; telefon: string; email: string; personen: string; anmerkung: string;
  }) => {
    setFormLaden(true);
    try {
      await hinzufuegen({
        gast_name: daten.gast_name,
        telefon: daten.telefon || undefined,
        email: daten.email || undefined,
        personen: parseInt(daten.personen),
        anmerkung: daten.anmerkung || undefined,
      });
      setModalOffen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Fehler beim Speichern');
    } finally {
      setFormLaden(false);
    }
  };

  const handleBestaetigen = async (id: string) => {
    if (!confirm('Gast bestätigen? Er erhält einen Tisch und wird von der Warteliste entfernt.')) return;
    await bestaetigen(id);
  };

  const handleStornieren = async (id: string) => {
    if (!confirm('Eintrag von der Warteliste entfernen?')) return;
    await stornieren(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warteliste</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gäste auf Tisch warten lassen — bei Stornierung automatisch benachrichtigen
          </p>
        </div>
        <button
          onClick={() => setModalOffen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Hinzufügen
        </button>
      </div>

      {/* Datum + Statistik */}
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm">
            <span className="font-semibold text-amber-700">{wartendAnzahl}</span>
            <span className="text-amber-600 ml-1">wartend</span>
          </div>
          {benachrichtigtAnzahl > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm">
              <span className="font-semibold text-blue-700">{benachrichtigtAnzahl}</span>
              <span className="text-blue-600 ml-1">benachrichtigt</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter-Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['alle', 'wartend', 'bestaetigt', 'storniert'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f === 'alle' ? 'Alle' : f === 'wartend' ? 'Wartend' : f === 'bestaetigt' ? 'Bestätigt' : 'Storniert'}
          </button>
        ))}
      </div>

      {/* Liste */}
      {laden ? (
        <div className="text-center py-16 text-gray-400">Lädt...</div>
      ) : fehler ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{fehler}</div>
      ) : gefiltertEintraege.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🕐</div>
          <p className="text-gray-500 font-medium">Keine Einträge</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === 'alle' ? 'Noch niemand auf der Warteliste für dieses Datum.' : `Keine ${filter === 'wartend' ? 'wartenden' : filter === 'bestaetigt' ? 'bestätigten' : 'stornierten'} Einträge.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {gefiltertEintraege.map((eintrag) => (
            <div
              key={eintrag.id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 ${
                eintrag.status === 'wartend' ? 'border-amber-200' :
                eintrag.status === 'benachrichtigt' ? 'border-blue-200' :
                'border-gray-200'
              }`}
            >
              {/* Position */}
              {eintrag.status === 'wartend' && (
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                  {eintrag.position}
                </div>
              )}
              {eintrag.status === 'benachrichtigt' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-lg">
                  📨
                </div>
              )}
              {(eintrag.status === 'bestaetigt' || eintrag.status === 'storniert') && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-lg">
                  {eintrag.status === 'bestaetigt' ? '✅' : '✕'}
                </div>
              )}

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{eintrag.gast_name}</span>
                  <span className="text-gray-500 text-sm">· {eintrag.personen} Personen</span>
                  {statusBadge(eintrag.status)}
                  {quelleBadge(eintrag.quelle)}
                </div>
                <div className="flex gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                  {eintrag.telefon && <span>📞 {eintrag.telefon}</span>}
                  {eintrag.email && <span>✉ {eintrag.email}</span>}
                  <span>Eingetragen: {zeitKurz(eintrag.eingetragen_am)}</span>
                </div>
                {eintrag.anmerkung && (
                  <p className="text-sm text-gray-500 mt-1 italic">„{eintrag.anmerkung}"</p>
                )}
                {eintrag.benachrichtigt_am && (
                  <p className="text-xs text-blue-600 mt-1">
                    Benachrichtigt um {zeitKurz(eintrag.benachrichtigt_am)}
                  </p>
                )}
              </div>

              {/* Aktionen */}
              {(eintrag.status === 'wartend' || eintrag.status === 'benachrichtigt') && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleBestaetigen(eintrag.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Bestätigen
                  </button>
                  <button
                    onClick={() => handleStornieren(eintrag.id)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Entfernen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hinweis-Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium mb-1">💡 Automatisches Nachrücken</p>
        <p className="text-sm text-blue-700">
          Wenn eine Reservierung storniert wird, benachrichtigt ServeFlow automatisch den nächsten
          Wartenden per E-Mail. Du siehst den Status dann als „Benachrichtigt".
        </p>
      </div>

      {/* Modal */}
      {modalOffen && (
        <HinzufuegenModal
          onSpeichern={handleHinzufuegen}
          onAbbrechen={() => setModalOffen(false)}
          laden={formLaden}
        />
      )}
    </div>
  );
}
