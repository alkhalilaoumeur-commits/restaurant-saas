import { useState, useMemo } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import GerichtKarte from '../components/speisekarte/GerichtKarte';
import GerichtFormular from '../components/speisekarte/GerichtFormular';
import KategorieVerwaltung from '../components/speisekarte/KategorieVerwaltung';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { Gericht } from '../types';

export default function Speisekarte() {
  const {
    gerichte, kategorien, laden, laden_,
    verfuegbarkeitToggle, gerichtLoeschen,
    kategorieErstellen, kategorieAktualisieren, kategorieLoeschen,
  } = useSpeisekarte();

  const [formularOffen, setFormularOffen] = useState(false);
  const [bearbeiteGericht, setBearbeiteGericht] = useState<Gericht | null>(null);
  const [kategorienOffen, setKategorienOffen] = useState(false);

  const gruppiertNachKategorie = kategorien.map((k) => ({
    kategorie: k,
    gerichte: gerichte.filter((g) => g.kategorie_id === k.id),
  }));

  const gerichteProKategorie = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of gerichte) {
      map[g.kategorie_id] = (map[g.kategorie_id] || 0) + 1;
    }
    return map;
  }, [gerichte]);

  function formularSchliessen() {
    setFormularOffen(false);
    setBearbeiteGericht(null);
  }

  function gerichtBearbeiten(gericht: Gericht) {
    setBearbeiteGericht(gericht);
    setFormularOffen(true);
  }

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Speisekarte"
        aktion={
          <div className="flex gap-2">
            <button
              onClick={() => setKategorienOffen(true)}
              className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Kategorien
            </button>
            <button
              onClick={() => { setBearbeiteGericht(null); setFormularOffen(true); }}
              className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700"
            >
              + Gericht
            </button>
          </div>
        }
      />

      {/* Gericht-Formular Modal */}
      <Modal
        offen={formularOffen}
        onSchliessen={formularSchliessen}
        titel={bearbeiteGericht ? 'Gericht bearbeiten' : 'Neues Gericht'}
        breit
      >
        <GerichtFormular
          kategorien={kategorien}
          gericht={bearbeiteGericht ?? undefined}
          onErfolg={() => { formularSchliessen(); laden_(); }}
          onAbbrechen={formularSchliessen}
        />
      </Modal>

      {/* Kategorien Modal */}
      <Modal
        offen={kategorienOffen}
        onSchliessen={() => setKategorienOffen(false)}
        titel="Kategorien verwalten"
        breit
      >
        <KategorieVerwaltung
          kategorien={kategorien}
          gerichteProKategorie={gerichteProKategorie}
          onErstellen={kategorieErstellen}
          onUmbenennen={(id, name) => kategorieAktualisieren(id, { name })}
          onLoeschen={kategorieLoeschen}
        />
      </Modal>

      {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}

      {!laden && kategorien.length === 0 && (
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Noch keine Kategorien vorhanden.</p>
          <button
            onClick={() => setKategorienOffen(true)}
            className="text-sm text-orange-600 font-medium hover:underline"
          >
            Erste Kategorie anlegen
          </button>
        </div>
      )}

      {gruppiertNachKategorie.map(({ kategorie, gerichte: g }) => (
        <section key={kategorie.id} className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">{kategorie.name}</h2>
          {g.length > 0 ? (
            <div className="space-y-3">
              {g.map((gericht) => (
                <GerichtKarte
                  key={gericht.id}
                  gericht={gericht}
                  onToggle={verfuegbarkeitToggle}
                  onBearbeiten={gerichtBearbeiten}
                  onLoeschen={gerichtLoeschen}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-300 dark:text-slate-600 italic">Keine Gerichte in dieser Kategorie.</p>
          )}
        </section>
      ))}
    </div>
  );
}
