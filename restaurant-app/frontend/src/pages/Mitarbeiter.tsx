import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import MitarbeiterZeile from '../components/mitarbeiter/MitarbeiterZeile';
import MitarbeiterFormular from '../components/mitarbeiter/MitarbeiterFormular';
import { useMitarbeiter } from '../hooks/useMitarbeiter';
import { useRestaurant } from '../hooks/useRestaurant';
import { useAuthStore } from '../store/auth';
import { MitarbeiterDetail } from '../types';

export default function Mitarbeiter() {
  const auth = useAuthStore((s) => s.mitarbeiter);
  const { mitarbeiter, laden, einladen, erneutEinladen, aktualisieren, passwortAendern, fotoAktualisieren } = useMitarbeiter();
  const { restaurant } = useRestaurant();

  const [formularOffen, setFormularOffen] = useState(false);
  const [bearbeitung, setBearbeitung] = useState<MitarbeiterDetail | null>(null);
  const [filter, setFilter] = useState<'alle' | 'aktiv' | 'inaktiv'>('aktiv');

  const gefiltert = mitarbeiter.filter((m) => {
    if (filter === 'aktiv') return m.aktiv;
    if (filter === 'inaktiv') return !m.aktiv;
    return true;
  });

  const anzahlAktiv = mitarbeiter.filter((m) => m.aktiv).length;
  const anzahlInaktiv = mitarbeiter.filter((m) => !m.aktiv).length;
  const limitErreicht = restaurant ? anzahlAktiv >= restaurant.max_mitarbeiter : false;

  function formularSchliessen() {
    setFormularOffen(false);
    setBearbeitung(null);
  }

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Mitarbeiter"
        aktion={
          <div className="flex items-center gap-3">
            {restaurant && (
              <span className="text-xs text-gray-400">
                {anzahlAktiv} / {restaurant.max_mitarbeiter}
              </span>
            )}
            <button
              onClick={() => { setBearbeitung(null); setFormularOffen(true); }}
              disabled={limitErreicht}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                limitErreicht
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              + Einladen
            </button>
          </div>
        }
      />

      {/* Limit-Warnung */}
      {limitErreicht && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-sm text-blue-700 dark:text-blue-400">
          Mitarbeiter-Limit erreicht ({restaurant?.max_mitarbeiter}). Um weitere Mitarbeiter einzuladen, deaktiviere einen bestehenden oder upgrade deine Lizenz.
        </div>
      )}

      {/* Filter-Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          ['aktiv', `Aktiv (${anzahlAktiv})`],
          ['inaktiv', `Deaktiviert (${anzahlInaktiv})`],
          ['alle', `Alle (${mitarbeiter.length})`],
        ] as [typeof filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === key
                ? 'bg-gray-900 dark:bg-white/15 text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Neuer Mitarbeiter einladen — Modal */}
      <Modal
        offen={formularOffen && !bearbeitung}
        onSchliessen={formularSchliessen}
        titel="Mitarbeiter einladen"
      >
        <MitarbeiterFormular
          onSpeichern={async (daten) => {
            await einladen({
              name: daten.name,
              email: daten.email!,
              rolle: daten.rolle,
            });
            formularSchliessen();
          }}
          onAbbrechen={formularSchliessen}
        />
      </Modal>

      {/* Mitarbeiter bearbeiten Modal */}
      <Modal
        offen={!!bearbeitung}
        onSchliessen={formularSchliessen}
        titel={bearbeitung ? `${bearbeitung.name} bearbeiten` : ''}
      >
        {bearbeitung && (
          <MitarbeiterFormular
            mitarbeiter={bearbeitung}
            onSpeichern={async (daten) => {
              await aktualisieren(bearbeitung.id, { name: daten.name, rolle: daten.rolle, stundenlohn: daten.stundenlohn, telefon: daten.telefon });
              formularSchliessen();
            }}
            onPasswortAendern={async (pw) => {
              await passwortAendern(bearbeitung.id, pw);
            }}
            onAbbrechen={formularSchliessen}
          />
        )}
      </Modal>

      {/* Liste */}
      {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}

      {!laden && gefiltert.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-slate-500">
          {filter === 'inaktiv' ? 'Keine deaktivierten Mitarbeiter.' : 'Keine Mitarbeiter vorhanden.'}
        </p>
      )}

      <div className="space-y-3">
        {gefiltert.map((m) => (
          <MitarbeiterZeile
            key={m.id}
            mitarbeiter={m}
            istEigenerAccount={m.id === auth?.id}
            onBearbeiten={(m) => { setFormularOffen(false); setBearbeitung(m); }}
            onToggleAktiv={(id, aktiv) => aktualisieren(id, { aktiv })}
            onErneutEinladen={erneutEinladen}
            onFotoAktualisieren={fotoAktualisieren}
          />
        ))}
      </div>
    </div>
  );
}
