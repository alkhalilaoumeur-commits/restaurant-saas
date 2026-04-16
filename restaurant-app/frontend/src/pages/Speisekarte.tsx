import { useState, useMemo } from 'react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import GerichtKarte from '../components/speisekarte/GerichtKarte';
import GerichtFormular from '../components/speisekarte/GerichtFormular';
import KategorieVerwaltung from '../components/speisekarte/KategorieVerwaltung';
import ExtrasVerwaltung from '../components/speisekarte/ExtrasVerwaltung';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { Gericht } from '../types';

export default function Speisekarte() {
  const {
    gerichte, kategorien, laden, laden_,
    verfuegbarkeitToggle, gerichtAktualisieren, gerichtLoeschen,
    kategorieErstellen, kategorieAktualisieren, kategorieLoeschen,
  } = useSpeisekarte();

  const [formularOffen, setFormularOffen] = useState(false);
  const [bearbeiteGericht, setBearbeiteGericht] = useState<Gericht | null>(null);
  const [kategorienOffen, setKategorienOffen] = useState(false);
  const [extrasGericht, setExtrasGericht] = useState<Gericht | null>(null);

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
          onBildAktualisieren={(id, bild_url) => kategorieAktualisieren(id, { bild_url })}
          onLoeschen={kategorieLoeschen}
          onReihenfolgeAendern={(id, reihenfolge) => kategorieAktualisieren(id, { reihenfolge })}
        />
      </Modal>

      {/* Extras Modal */}
      <Modal
        offen={!!extrasGericht}
        onSchliessen={() => setExtrasGericht(null)}
        titel={`Extras: ${extrasGericht?.name ?? ''}`}
        breit
      >
        {extrasGericht && (
          <ExtrasVerwaltung
            gerichtId={extrasGericht.id}
            gerichtName={extrasGericht.name}
          />
        )}
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

      {gruppiertNachKategorie
        .filter(({ gerichte: g }) => g.length > 0)
        .map(({ kategorie, gerichte: g }) => (
          <section key={kategorie.id} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">{kategorie.name}</h2>
            <div className="space-y-3">
              {g.map((gericht, idx) => (
                <div key={gericht.id} className="flex gap-2 items-start">
                  {/* Reihenfolge-Buttons für Gerichte */}
                  <div className="flex flex-col gap-0.5 pt-3 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const nachbar = g[idx - 1];
                        Promise.all([
                          gerichtAktualisieren(gericht.id, { reihenfolge: nachbar.reihenfolge }),
                          gerichtAktualisieren(nachbar.id, { reihenfolge: gericht.reihenfolge }),
                        ]).then(laden_);
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Nach oben"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <button
                      disabled={idx === g.length - 1}
                      onClick={() => {
                        const nachbar = g[idx + 1];
                        Promise.all([
                          gerichtAktualisieren(gericht.id, { reihenfolge: nachbar.reihenfolge }),
                          gerichtAktualisieren(nachbar.id, { reihenfolge: gericht.reihenfolge }),
                        ]).then(laden_);
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Nach unten"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                  </div>
                  <div className="flex-1">
                    <GerichtKarte
                      gericht={gericht}
                      onToggle={verfuegbarkeitToggle}
                      onBearbeiten={gerichtBearbeiten}
                      onLoeschen={gerichtLoeschen}
                      onExtras={setExtrasGericht}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
