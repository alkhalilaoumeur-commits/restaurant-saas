import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import KategorieKarte from '../components/gaeste/KategorieKarte';
import KategorieZeile from '../components/gaeste/KategorieZeile';
import KategoriePills from '../components/gaeste/KategoriePills';
import KategorieZeileEditorial from '../components/gaeste/KategorieZeileEditorial';
import GerichtKartePro from '../components/gaeste/GerichtKartePro';
import GerichtZeile from '../components/gaeste/GerichtZeile';
import GerichtKarteOsteria from '../components/gaeste/GerichtKarteOsteria';
import GerichtKarteEditorial from '../components/gaeste/GerichtKarteEditorial';
import WarenkorbPro from '../components/gaeste/WarenkorbPro';
import BestellStatusTracker from '../components/gaeste/BestellStatusTracker';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { useGaesteSocket } from '../hooks/useGaesteSocket';
import { useRestaurantDesign } from '../hooks/useRestaurantDesign';
import { useGastroTheme } from '../hooks/useGastroTheme';
import { getLayout } from '../lib/layouts';
import { WarenkorbPosition, BestellungStatus, KategorieMitAnzahl } from '../types';
import { api } from '../lib/api';

// ─── Seite ──────────────────────────────────────────────────────────────────
//
// Drei Layout-Modi:
//   Grid (Modern):       Schritt 1: Kategorie-Kacheln → Schritt 2: Gerichte-Grid
//   Liste (Elegant):     Schritt 1: Kategorie-Balken → Schritt 2: Gerichte-Zeilen
//   Pills (Osteria):     Single-Page — Pill-Navigation oben, alle Gerichte gruppiert
//   Editorial (Magazin): Schritt 1: Nummerierte Kategorie-Liste → Schritt 2: Dunkler Header + Gerichtkarten
//
// Das Layout wird aus der DB geladen:
//   design?.layout_id → getLayout() → bestimmt Theme + Anzeige-Modus
export default function BestellenPro() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const { gerichte, kategorien, laden } = useSpeisekarte(restaurantId);
  const design = useRestaurantDesign(restaurantId);

  // Layout aus DB laden → bestimmt Theme + Darstellung
  const layout = getLayout(design?.layout_id);
  useGastroTheme(layout.themeId);

  const istPills = layout.kategorienAnzeige === 'pills';
  const istEditorial = layout.kategorienAnzeige === 'editorial';

  // ── Navigation ────────────────────────────────────────────────────────────
  // Grid/Liste: gewaehlteKategorie = null → Übersicht, sonst → Detail
  // Pills: pillFilter = null → "Alle", sonst → gefilterte Kategorie-ID
  const [gewaehlteKategorie, setGewaehlteKategorie] = useState<KategorieMitAnzahl | null>(null);
  const [pillFilter, setPillFilter] = useState<string | null>(null);

  // Bestell-State
  const [mengen, setMengen] = useState<Record<string, number>>({});
  const [anmerkung, setAnmerkung] = useState('');
  const [bestellt, setBestellt] = useState(false);
  const [bestellungId, setBestellungId] = useState<string | null>(null);
  const [bestellStatus, setBestellStatus] = useState<BestellungStatus>('offen');
  const [gespeicherterPreis, setGespeicherterPreis] = useState(0);
  const [sendenLaden, setSendenLaden] = useState(false);
  const [fehler, setFehler] = useState('');

  // Socket: Live-Updates
  const onStatusUpdate = useCallback((daten: { id: string; status: string }) => {
    if (bestellungId && daten.id === bestellungId) {
      setBestellStatus(daten.status as BestellungStatus);
    }
  }, [bestellungId]);
  useGaesteSocket(restaurantId, tischId, onStatusUpdate);

  // Menge ändern (+ oder −)
  function mengeAendern(gerichtId: string, delta: number) {
    setMengen((prev) => {
      const neu = Math.max(0, (prev[gerichtId] || 0) + delta);
      if (neu === 0) {
        const { [gerichtId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [gerichtId]: neu };
    });
  }

  // Warenkorb-Positionen
  const positionen: WarenkorbPosition[] = gerichte
    .filter((g) => mengen[g.id])
    .map((g) => ({ gericht: g, menge: mengen[g.id] }));

  const gesamtpreis = positionen.reduce((s, p) => s + p.gericht.preis * p.menge, 0);

  // Bestellung absenden
  async function bestellen() {
    setFehler('');
    setSendenLaden(true);
    try {
      const data = await api.post<{ id: string; gesamtpreis: number }>('/bestellungen', {
        restaurant_id: restaurantId,
        tisch_id: tischId,
        anmerkung: anmerkung || null,
        positionen: positionen.map((p) => ({
          gericht_id: p.gericht.id,
          menge: p.menge,
        })),
      });

      setBestellungId(data.id);
      setGespeicherterPreis(data.gesamtpreis);
      setBestellStatus('offen');
      setBestellt(true);
    } catch (err) {
      setFehler((err as Error).message || 'Bestellung fehlgeschlagen');
    } finally {
      setSendenLaden(false);
    }
  }

  // Nach Bestellung → Status-Tracker
  if (bestellt) {
    return <BestellStatusTracker status={bestellStatus} gesamtpreis={gespeicherterPreis} />;
  }

  // Gerichte der gewählten Kategorie filtern (Grid/Liste Modus)
  const gerichteInKategorie = gewaehlteKategorie
    ? gerichte.filter((g) => g.kategorie_id === gewaehlteKategorie.id && g.verfuegbar)
    : [];

  // Gerichte gruppiert nach Kategorie (Pills Modus)
  const gruppierteSektionen = useMemo(() => {
    if (!istPills) return [];
    const katList = kategorien as KategorieMitAnzahl[];
    return katList
      .filter((kat) => !pillFilter || kat.id === pillFilter)
      .map((kat) => ({
        kategorie: kat,
        gerichte: gerichte.filter((g) => g.kategorie_id === kat.id && g.verfuegbar),
      }))
      .filter((s) => s.gerichte.length > 0);
  }, [istPills, kategorien, gerichte, pillFilter]);

  const restaurantName = design?.name || 'Restaurant';
  const anzahlImWarenkorb = positionen.reduce((s, p) => s + p.menge, 0);

  return (
    <div className="min-h-screen bg-gastro font-theme-body">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO-HEADER
       ═══════════════════════════════════════════════════════════════════ */}

      {/* ── Editorial: eigener Header-Stil ──────────────────────────────── */}
      {istEditorial && !gewaehlteKategorie && (
        <header className="bg-gastro">
          <div className="max-w-lg mx-auto px-6 pt-8 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-medium tracking-[2.5px] uppercase text-gastro-muted mb-2">
                  Willkommen bei
                </div>
                <h1 className="text-[36px] font-black text-gastro-text font-theme-heading leading-[0.95] tracking-tight">
                  {restaurantName}
                </h1>
              </div>
              {tischId && (
                <div className="bg-gastro-surface border border-gastro-border rounded-[20px] px-4 py-2 flex flex-col items-center gap-px">
                  <span className="text-[9px] font-semibold tracking-[1.5px] uppercase text-gastro-muted">Tisch</span>
                  <span className="text-[22px] font-bold text-gastro-text font-theme-heading leading-none">{tischId}</span>
                </div>
              )}
            </div>
            <div className="h-px bg-gastro-border mt-7" />
          </div>
        </header>
      )}

      {/* ── Editorial: Dunkler Kategorie-Header (wenn Kategorie gewählt) ── */}
      {istEditorial && gewaehlteKategorie && (
        <header className="bg-gastro-text relative overflow-hidden">
          {/* Ghost-Text im Hintergrund */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 font-theme-heading text-[72px] font-black opacity-[0.07] whitespace-nowrap pointer-events-none tracking-tight text-gastro-surface">
            {gewaehlteKategorie.name}
          </div>

          <div className="relative max-w-lg mx-auto px-6 py-5">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setGewaehlteKategorie(null)}
                className="bg-gastro-surface/10 border border-gastro-surface/15 rounded-[20px] px-3.5 py-1.5 text-xs text-gastro-surface/70 flex items-center gap-1.5 transition-colors hover:bg-gastro-surface/[0.18]"
              >
                ← Zurück
              </button>
              <span className="ml-auto text-xs italic text-gastro-primary font-theme-heading">
                {String((kategorien as KategorieMitAnzahl[]).findIndex(k => k.id === gewaehlteKategorie.id) + 1).padStart(2, '0')} / {String(kategorien.length).padStart(2, '0')}
              </span>
            </div>

            <h2 className="text-[32px] font-black text-gastro-surface font-theme-heading tracking-tight leading-none">
              {gewaehlteKategorie.name}
            </h2>
            <p className="text-[13px] text-gastro-surface/50 mt-1.5 font-light leading-relaxed">
              {gewaehlteKategorie.anzahl_gerichte} {gewaehlteKategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'} in dieser Kategorie
            </p>
          </div>
        </header>
      )}

      {/* ── Standard-Header (Grid/Liste/Pills) ─────────────────────────── */}
      {!istEditorial && (
        <header className="relative bg-gastro-surface overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gastro-primary/10 via-transparent to-gastro-secondary/10" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gastro-primary/5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gastro-secondary/5" />

          <div className="relative max-w-lg mx-auto px-5 pt-10 pb-6">

            {/* Pills-Layout: zentrierter Hero im Restaurant-Stil */}
            {istPills ? (
              <div className="text-center">
                {/* "Jetzt geöffnet"-Badge */}
                <div className="inline-flex items-center gap-1.5 bg-gastro-primary/10 border border-gastro-primary/30 text-gastro-primary text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Jetzt geöffnet
                </div>

                <h1 className="text-[28px] font-normal text-gastro-text font-theme-heading leading-tight tracking-tight">
                  {restaurantName}
                </h1>
                <p className="text-sm text-gastro-muted mt-1">Digitale Speisekarte</p>

                {/* Gold-Trennlinie */}
                <div className="w-10 h-px bg-gastro-primary/50 mx-auto my-4" />

                {/* Tisch-Badge */}
                {tischId && (
                  <div className="inline-flex items-center gap-2 bg-gastro-border/50 border border-gastro-border text-gastro-muted text-xs px-4 py-2 rounded-lg">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="5" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    Tisch&nbsp;<span className="text-base font-bold text-gastro-primary">{tischId}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Grid/Liste-Layout: Standard-Hero mit Icon links */
              <>
                <div className="flex items-center gap-3 mb-4">
                  {gewaehlteKategorie ? (
                    <button
                      onClick={() => setGewaehlteKategorie(null)}
                      className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gastro-border/50 text-gastro-text hover:bg-gastro-border transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gastro-primary text-gastro-on-primary shadow-lg shadow-gastro-primary/25">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                        <path d="M7 2v20" />
                        <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3" />
                        <path d="M18 22v-7" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-gastro-text font-theme-heading leading-tight">
                      {restaurantName}
                    </h1>
                    <p className="text-xs text-gastro-muted mt-0.5">
                      {gewaehlteKategorie ? gewaehlteKategorie.name : 'Digitale Speisekarte'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tischId && (
                    <span className="inline-flex items-center gap-1.5 bg-gastro-primary/10 text-gastro-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                      </svg>
                      Tisch {tischId}
                    </span>
                  )}
                  {anzahlImWarenkorb > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-gastro-primary text-gastro-on-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                      </svg>
                      {anzahlImWarenkorb}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </header>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PILLS-LEISTE (nur Osteria-Layout)
          Sticky horizontal scrollbar mit Kategorie-Buttons
       ═══════════════════════════════════════════════════════════════════ */}
      {istPills && !laden && (
        <KategoriePills
          kategorien={kategorien as KategorieMitAnzahl[]}
          aktiveKategorieId={pillFilter}
          onWaehlen={setPillFilter}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT
       ═══════════════════════════════════════════════════════════════════ */}
      <main className="max-w-lg mx-auto px-4 py-5 pb-32">

        {/* ═════════════════════════════════════════════════════════════
            EDITORIAL-MODUS: 2-Schritt-Flow mit Magazin-Stil
         ═════════════════════════════════════════════════════════════ */}

        {/* ── EDITORIAL Schritt 1: Nummerierte Kategorie-Liste ──────── */}
        {!laden && istEditorial && !gewaehlteKategorie && (
          <>
            <div className="mb-2">
              <p className="text-[11px] font-medium tracking-[1px] uppercase text-gastro-muted py-5">
                {kategorien.length} Kategorien — wähle dein Gericht
              </p>
            </div>

            <div>
              {(kategorien as KategorieMitAnzahl[]).map((kat, i) => (
                <KategorieZeileEditorial
                  key={kat.id}
                  kategorie={kat}
                  index={i}
                  gesamt={kategorien.length}
                  onClick={() => setGewaehlteKategorie(kat)}
                />
              ))}
            </div>

            {/* Footer mit Öffnungsinfo + Warenkorb-Button */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gastro-border">
              <div className="flex items-center gap-2 text-xs text-gastro-muted">
                <div className="w-[7px] h-[7px] rounded-full bg-green-500" />
                Küche geöffnet
              </div>
              {anzahlImWarenkorb > 0 && (
                <div className="bg-gastro-text text-gastro rounded-[20px] px-5 py-2.5 text-[13px] font-semibold flex items-center gap-2">
                  Warenkorb
                  <span className="bg-gastro-primary text-gastro-on-primary rounded-[10px] px-[7px] py-px text-[11px] font-bold">
                    {anzahlImWarenkorb}
                  </span>
                </div>
              )}
            </div>

            {kategorien.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">Die Speisekarte wird gerade aktualisiert.</p>
              </div>
            )}
          </>
        )}

        {/* ── EDITORIAL Schritt 2: Gerichte in gewählter Kategorie ──── */}
        {!laden && istEditorial && gewaehlteKategorie && (
          <>
            {/* Kategorie-Bild (wenn vorhanden) */}
            {gewaehlteKategorie.bild_url && (
              <div className="relative h-44 -mx-4 -mt-5 mb-5 overflow-hidden">
                <img
                  src={gewaehlteKategorie.bild_url}
                  alt={gewaehlteKategorie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gastro via-gastro/40 to-transparent" />
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              {gerichteInKategorie.map((g, i) => (
                <GerichtKarteEditorial
                  key={g.id}
                  gericht={g}
                  index={i}
                  menge={mengen[g.id] || 0}
                  onAendern={(delta) => mengeAendern(g.id, delta)}
                />
              ))}
            </div>

            {gerichteInKategorie.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">Aktuell keine Gerichte in dieser Kategorie verfügbar.</p>
              </div>
            )}
          </>
        )}

        {/* ── Ladeindikator ─────────────────────────────────────────── */}
        {laden && layout.kategorienAnzeige === 'grid' && (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gastro-surface rounded-theme overflow-hidden">
                <div className="w-full h-full bg-gastro-border/30 animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {laden && (layout.kategorienAnzeige === 'liste' || layout.kategorienAnzeige === 'pills' || layout.kategorienAnzeige === 'editorial') && (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[72px] bg-gastro-surface rounded-theme overflow-hidden">
                <div className="w-full h-full bg-gastro-border/30 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PILLS-MODUS (Osteria): Single-Page mit Sektionen
         ═════════════════════════════════════════════════════════════ */}
        {!laden && istPills && (
          <>
            {gruppierteSektionen.map(({ kategorie, gerichte: sektionGerichte }) => (
              <section key={kategorie.id} className="mb-6">
                {/* Sektions-Überschrift */}
                <div className="py-4 px-1">
                  <h2 className="text-[11px] font-bold tracking-[1.2px] uppercase text-gastro-muted/60">
                    {kategorie.name}
                  </h2>
                </div>

                {/* Gerichte als Osteria-Karten */}
                <div className="flex flex-col gap-[3px]">
                  {sektionGerichte.map((g) => (
                    <GerichtKarteOsteria
                      key={g.id}
                      gericht={g}
                      menge={mengen[g.id] || 0}
                      onAendern={(delta) => mengeAendern(g.id, delta)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {gruppierteSektionen.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">
                  {pillFilter ? 'Keine Gerichte in dieser Kategorie.' : 'Die Speisekarte wird gerade aktualisiert.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* ═════════════════════════════════════════════════════════════
            GRID/LISTE-MODUS: 2-Schritt-Flow (wie bisher)
         ═════════════════════════════════════════════════════════════ */}

        {/* ── SCHRITT 1: Kategorie-Übersicht ────────────────────────── */}
        {!laden && !istPills && !istEditorial && !gewaehlteKategorie && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gastro-text font-theme-heading">
                Was darf es sein?
              </h2>
              <p className="text-sm text-gastro-muted mt-1">
                Wähle eine Kategorie
              </p>
            </div>

            {layout.kategorienAnzeige === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {(kategorien as KategorieMitAnzahl[]).map((kat, i) => (
                  <KategorieKarte
                    key={kat.id}
                    kategorie={kat}
                    index={i}
                    onClick={() => setGewaehlteKategorie(kat)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {(kategorien as KategorieMitAnzahl[]).map((kat, i) => (
                  <KategorieZeile
                    key={kat.id}
                    kategorie={kat}
                    index={i}
                    onClick={() => setGewaehlteKategorie(kat)}
                  />
                ))}
              </div>
            )}

            {kategorien.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">Die Speisekarte wird gerade aktualisiert.</p>
              </div>
            )}
          </>
        )}

        {/* ── SCHRITT 2: Gerichte einer Kategorie ───────────────────── */}
        {!laden && !istPills && !istEditorial && gewaehlteKategorie && (
          <>
            {gewaehlteKategorie.bild_url && (
              <div className="relative h-40 -mx-4 -mt-5 mb-5 overflow-hidden">
                <img
                  src={gewaehlteKategorie.bild_url}
                  alt={gewaehlteKategorie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gastro via-gastro/50 to-transparent" />
              </div>
            )}

            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-bold text-gastro-text font-theme-heading">
                  {gewaehlteKategorie.name}
                </h2>
                <p className="text-sm text-gastro-muted mt-0.5">
                  {gerichteInKategorie.length} {gerichteInKategorie.length === 1 ? 'Gericht' : 'Gerichte'}
                </p>
              </div>
              <button
                onClick={() => setGewaehlteKategorie(null)}
                className="text-sm text-gastro-primary font-medium hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Alle Kategorien
              </button>
            </div>

            {layout.gerichteAnzeige === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {gerichteInKategorie.map((g) => (
                  <GerichtKartePro
                    key={g.id}
                    gericht={g}
                    menge={mengen[g.id] || 0}
                    onAendern={(delta) => mengeAendern(g.id, delta)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {gerichteInKategorie.map((g) => (
                  <GerichtZeile
                    key={g.id}
                    gericht={g}
                    menge={mengen[g.id] || 0}
                    onAendern={(delta) => mengeAendern(g.id, delta)}
                  />
                ))}
              </div>
            )}

            {gerichteInKategorie.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">Aktuell keine Gerichte in dieser Kategorie verfügbar.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FEHLER-MELDUNG
       ═══════════════════════════════════════════════════════════════════ */}
      {fehler && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-theme px-4 py-3 text-sm flex items-center gap-2 shadow-lg">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span className="flex-1">{fehler}</span>
            <button onClick={() => setFehler('')} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WARENKORB
       ═══════════════════════════════════════════════════════════════════ */}
      <WarenkorbPro
        positionen={positionen}
        gesamtpreis={gesamtpreis}
        anmerkung={anmerkung}
        onAnmerkungAendern={setAnmerkung}
        onBestellen={bestellen}
        onMengeAendern={mengeAendern}
        laden={sendenLaden}
      />
    </div>
  );
}
