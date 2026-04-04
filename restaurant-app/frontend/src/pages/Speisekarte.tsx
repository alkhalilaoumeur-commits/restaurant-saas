import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import GerichtKarte from '../components/speisekarte/GerichtKarte';
import GerichtFormular from '../components/speisekarte/GerichtFormular';
import { useSpeisekarte } from '../hooks/useSpeisekarte';

export default function Speisekarte() {
  const { gerichte, kategorien, laden, laden_, verfuegbarkeitToggle, gerichtLoeschen } = useSpeisekarte();
  const [formularOffen, setFormularOffen] = useState(false);

  const gruppiertNachKategorie = kategorien.map((k) => ({
    kategorie: k,
    gerichte: gerichte.filter((g) => g.kategorie_id === k.id),
  }));

  return (
    <div>
      <Topbar
        titel="Speisekarte"
        aktion={
          <button
            onClick={() => setFormularOffen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700"
          >
            + Gericht
          </button>
        }
      />

      {formularOffen && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 max-w-md">
          <h3 className="font-medium text-sm text-gray-700 mb-3">Neues Gericht</h3>
          <GerichtFormular
            kategorien={kategorien}
            onErfolg={() => { setFormularOffen(false); laden_(); }}
            onAbbrechen={() => setFormularOffen(false)}
          />
        </div>
      )}

      {laden && <p className="text-sm text-gray-400">Wird geladen...</p>}

      {gruppiertNachKategorie.map(({ kategorie, gerichte: g }) =>
        g.length > 0 ? (
          <section key={kategorie.id} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">{kategorie.name}</h2>
            <div className="space-y-3">
              {g.map((gericht) => (
                <GerichtKarte
                  key={gericht.id}
                  gericht={gericht}
                  onToggle={verfuegbarkeitToggle}
                  onLoeschen={gerichtLoeschen}
                />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
