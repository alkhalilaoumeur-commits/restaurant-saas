import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import KategorieKarte from '../components/gaeste/KategorieKarte';
import KategorieKarteShowcase from '../components/gaeste/KategorieKarteShowcase';
import Tilt3DKarte from '../components/gaeste/Tilt3DKarte';
import KategorieZeile from '../components/gaeste/KategorieZeile';
import KategoriePills from '../components/gaeste/KategoriePills';
import KategorieZeileEditorial from '../components/gaeste/KategorieZeileEditorial';
import GerichtKartePro from '../components/gaeste/GerichtKartePro';
import GerichtKarteShowcase from '../components/gaeste/GerichtKarteShowcase';
import GerichtZeile from '../components/gaeste/GerichtZeile';
import GerichtKarteOsteria from '../components/gaeste/GerichtKarteOsteria';
import GerichtKarteEditorial from '../components/gaeste/GerichtKarteEditorial';
import WarenkorbPro from '../components/gaeste/WarenkorbPro';
import GerichtDetailModal from '../components/gaeste/GerichtDetailModal';
import { warenkorbKey } from '../components/gaeste/GerichtDetailModal';
import BestellStatusTracker from '../components/gaeste/BestellStatusTracker';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { useGaesteSocket } from '../hooks/useGaesteSocket';
import { useRestaurantDesign } from '../hooks/useRestaurantDesign';
import { useGastroTheme } from '../hooks/useGastroTheme';
import { getLayout } from '../lib/layouts';
import { Gericht, WarenkorbPosition, GewaehlteExtra, BestellungStatus, KategorieMitAnzahl } from '../types';
import { api } from '../lib/api';

// ─── Seite ──────────────────────────────────────────────────────────────────
//
// Drei Layout-Modi:
//   Grid (Modern):       Schritt 1: Kategorie-Kacheln → Schritt 2: Gerichte-Grid
//   Liste (Elegant):     Schritt 1: Kategorie-Balken → Schritt 2: Gerichte-Zeilen
//   Pills (Osteria):     Single-Page — Pill-Navigation oben, alle Gerichte gruppiert
//   Editorial (Magazin): Schritt 1: Nummerierte Kategorie-Liste → Schritt 2: Dunkler Header + Gerichtkarten
//   Showcase (3D):       Schritt 1: 3D-Glass-Kacheln → Schritt 2: Premium-Gerichtkarten mit Tilt + Spotlight
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

  const istPills     = layout.kategorienAnzeige === 'pills';
  const istEditorial = layout.kategorienAnzeige === 'editorial';
  const istShowcase  = layout.kategorienAnzeige === 'showcase';

  // ── Navigation ────────────────────────────────────────────────────────────
  // Grid/Liste: gewaehlteKategorie = null → Übersicht, sonst → Detail
  // Pills: pillFilter = null → "Alle", sonst → gefilterte Kategorie-ID
  const [gewaehlteKategorie, setGewaehlteKategorie] = useState<KategorieMitAnzahl | null>(null);
  const [pillFilter, setPillFilter] = useState<string | null>(null);
  const [unterkategorieFilter, setUnterkategorieFilter] = useState<string | null>(null);

  // Unterkategorie-Filter zurücksetzen wenn Kategorie wechselt
  useEffect(() => { setUnterkategorieFilter(null); }, [gewaehlteKategorie?.id]);

  // Bestell-State — key-basierter Warenkorb (gleiches Gericht mit versch. Extras = separate Zeilen)
  const [warenkorb, setWarenkorb] = useState<WarenkorbPosition[]>([]);
  const [detailGericht, setDetailGericht] = useState<Gericht | null>(null);
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

  // Gericht antippen → Detail-Modal öffnen
  function gerichtAntippen(gericht: Gericht) {
    setDetailGericht(gericht);
  }

  // Smart +/− Handler für Gerichtkarten:
  //   + bei Gericht MIT Extras → Modal öffnen (User wählt Extras)
  //   + bei Gericht OHNE Extras → direkt zum Warenkorb
  //   − → direkt aus dem Warenkorb entfernen
  function gerichtAendern(gericht: Gericht, delta: number) {
    if (delta > 0) {
      if (gericht.hat_extras) {
        gerichtAntippen(gericht);
      } else {
        inWarenkorb(gericht, 1, []);
      }
    } else {
      // Entfernen: letzte Variante im Warenkorb finden und -1
      const pos = warenkorb.filter((p) => p.gericht.id === gericht.id);
      if (pos.length > 0) {
        mengeAendern(pos[pos.length - 1].key, -1);
      }
    }
  }

  // Aus dem Detail-Modal: Gericht + gewählte Extras in den Warenkorb
  function inWarenkorb(gericht: Gericht, menge: number, extras: GewaehlteExtra[]) {
    const key = warenkorbKey(gericht.id, extras);
    setWarenkorb((prev) => {
      const existierend = prev.find((p) => p.key === key);
      if (existierend) {
        // Gleiche Kombination schon im Warenkorb → Menge addieren
        return prev.map((p) => p.key === key ? { ...p, menge: p.menge + menge } : p);
      }
      return [...prev, { key, gericht, menge, extras }];
    });
  }

  // Menge ändern (key-basiert, vom Warenkorb-Sheet)
  function mengeAendern(key: string, delta: number) {
    setWarenkorb((prev) => {
      return prev
        .map((p) => p.key === key ? { ...p, menge: p.menge + delta } : p)
        .filter((p) => p.menge > 0);
    });
  }

  // Warenkorb-Daten
  const positionen = warenkorb;

  const gesamtpreis = positionen.reduce((s, p) => {
    const extrasAufpreis = p.extras.reduce((es, e) => es + Number(e.aufpreis), 0);
    return s + (Number(p.gericht.preis) + extrasAufpreis) * p.menge;
  }, 0);

  // Bestellung absenden — mit Extras pro Position
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
          extras: p.extras.map((e) => ({ extra_id: e.extra_id })),
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

  // Summierte Menge eines Gerichts im Warenkorb (über alle Extras-Varianten)
  function mengeFuerGericht(gerichtId: string): number {
    return warenkorb.filter((p) => p.gericht.id === gerichtId).reduce((s, p) => s + p.menge, 0);
  }

  // Nach Bestellung → Status-Tracker
  if (bestellt) {
    return <BestellStatusTracker status={bestellStatus} gesamtpreis={gespeicherterPreis} />;
  }

  // Gerichte der gewählten Kategorie filtern (Grid/Liste Modus)
  const alleGerichteInKategorie = gewaehlteKategorie
    ? gerichte.filter((g) => g.kategorie_id === gewaehlteKategorie.id && g.verfuegbar)
    : [];

  // Unterkategorien aus den geladenen Gerichten extrahieren (kein extra API-Call)
  const unterkategorien = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of alleGerichteInKategorie) {
      if (g.unterkategorie_id && g.unterkategorie_name) {
        map.set(g.unterkategorie_id, g.unterkategorie_name);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [alleGerichteInKategorie]);

  // Optional nach Unterkategorie filtern
  const gerichteInKategorie = unterkategorieFilter
    ? alleGerichteInKategorie.filter((g) => g.unterkategorie_id === unterkategorieFilter)
    : alleGerichteInKategorie;

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

  // ── Unterkategorie-Filter-Pills (wird in allen Layouts verwendet) ─────
  const unterkategoriePills = unterkategorien.length > 0 ? (
    <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
      {/* "Alle" Pill */}
      <button
        onClick={() => setUnterkategorieFilter(null)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
          ${!unterkategorieFilter
            ? 'bg-gastro-primary text-gastro-on-primary shadow-sm'
            : 'bg-gastro-border/30 text-gastro-muted hover:bg-gastro-border/50'
          }`}
      >
        Alle
      </button>
      {unterkategorien.map((uk) => (
        <button
          key={uk.id}
          onClick={() => setUnterkategorieFilter(uk.id === unterkategorieFilter ? null : uk.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
            ${unterkategorieFilter === uk.id
              ? 'bg-gastro-primary text-gastro-on-primary shadow-sm'
              : 'bg-gastro-border/30 text-gastro-muted hover:bg-gastro-border/50'
            }`}
        >
          {uk.name}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gastro font-theme-body">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO-HEADER
       ═══════════════════════════════════════════════════════════════════ */}

      {/* ── Editorial: eigener Header-Stil ──────────────────────────────── */}
      {istEditorial && !gewaehlteKategorie && (
        <header className="bg-gastro border-b border-gastro-border/20">
          <motion.div
            className="max-w-lg mx-auto px-5 pt-14 pb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tisch-Badge */}
            {tischId && (
              <div className="flex justify-end mb-8">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-gastro-muted/70
                                border border-gastro-border/40 rounded-full px-3 py-1">
                  Tisch <span className="font-semibold text-gastro-text">{tischId}</span>
                </div>
              </div>
            )}

            {/* Restaurant-Name — größer, mehr Weißraum, editorial Charakter */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px bg-gastro-primary/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-gastro-primary/40" />
                <div className="w-8 h-px bg-gastro-primary/30" />
              </div>
              {/* Logo */}
              {design?.logo_url && (
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gastro-primary/20 mx-auto mb-4">
                  <img src={design.logo_url} alt={restaurantName} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gastro-muted/50 mb-3">
                Speisekarte
              </p>
              <h1 className="text-[32px] font-bold text-gastro-text font-theme-heading leading-tight tracking-tight">
                {restaurantName}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-8 h-px bg-gastro-primary/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-gastro-primary/40" />
                <div className="w-8 h-px bg-gastro-primary/30" />
              </div>
            </div>
          </motion.div>
        </header>
      )}

      {/* ── Editorial: Kategorie-Header (sticky beim Scrollen) ── */}
      {istEditorial && gewaehlteKategorie && (
        <header className="sticky top-0 z-20 bg-gastro/95 backdrop-blur-sm border-b border-gastro-border/20">
          <div className="max-w-lg mx-auto px-5 pt-4 pb-5">
            {/* Zurück-Button */}
            <button
              onClick={() => setGewaehlteKategorie(null)}
              className="flex items-center gap-1 text-[13px] text-gastro-muted/70 hover:text-gastro-primary transition-colors mb-4"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Alle Kategorien
            </button>

            {/* Kategorie-Info */}
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xl italic text-gastro-primary/40 font-theme-heading tabular-nums leading-none">
                  {String((kategorien as KategorieMitAnzahl[]).findIndex(k => k.id === gewaehlteKategorie.id) + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl font-bold text-gastro-text font-theme-heading tracking-tight leading-tight mt-1">
                  {gewaehlteKategorie.name}
                </h2>
              </div>
              <span className="text-xs text-gastro-muted/50 italic pb-0.5">
                {gewaehlteKategorie.anzahl_gerichte} {gewaehlteKategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
              </span>
            </div>
          </div>
        </header>
      )}

      {/* ── Showcase: Premium-Header mit Glasmorphismus ────────────────── */}
      {istShowcase && (
        <header className="relative overflow-hidden">
          {/* Animierter Gradient-Hintergrund */}
          <div className="absolute inset-0 bg-gastro" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(129,140,248,0.12)_0%,_transparent_60%)]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gastro-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gastro-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <motion.div
            className="relative max-w-lg mx-auto px-5 pt-12 pb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              {/* Logo */}
              {design?.logo_url && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-5
                                ring-1 ring-gastro-primary/20 shadow-lg shadow-gastro-primary/10">
                  <img src={design.logo_url} alt={restaurantName} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Tagline */}
              <p className="text-[10px] font-semibold tracking-[4px] uppercase text-gastro-primary/60 mb-3">
                Speisekarte
              </p>

              {/* Restaurant-Name */}
              <h1 className="text-3xl font-bold text-gastro-text font-theme-heading leading-tight tracking-tight">
                {restaurantName}
              </h1>

              {/* Dekorative Linie */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gastro-primary/40 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-gastro-primary/30" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gastro-primary/40 to-transparent" />
              </div>

              {/* Tisch-Badge */}
              {tischId && (
                <div className="inline-flex items-center gap-2 mt-5
                                bg-gastro-surface/50 backdrop-blur-sm border border-gastro-border/30
                                text-gastro-muted text-xs px-4 py-2 rounded-full">
                  <svg className="w-3.5 h-3.5 text-gastro-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                  Tisch <span className="font-semibold text-gastro-text">{tischId}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Unterer Gradient-Übergang */}
          <div className="h-px bg-gradient-to-r from-transparent via-gastro-primary/20 to-transparent" />
        </header>
      )}

      {/* ── Showcase: Sticky Kategorie-Header (Schritt 2) ────────────── */}
      {istShowcase && gewaehlteKategorie && (
        <div className="sticky top-0 z-20 bg-gastro/90 backdrop-blur-md border-b border-gastro-border/20">
          <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
            <button
              onClick={() => setGewaehlteKategorie(null)}
              className="flex items-center gap-1.5 text-sm text-gastro-muted hover:text-gastro-primary transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Zurück
            </button>
            <h2 className="text-sm font-semibold text-gastro-text font-theme-heading">{gewaehlteKategorie.name}</h2>
            <span className="text-xs text-gastro-muted">
              {gewaehlteKategorie.anzahl_gerichte} {gewaehlteKategorie.anzahl_gerichte === 1 ? 'Gericht' : 'Gerichte'}
            </span>
          </div>
        </div>
      )}

      {/* ── Standard-Header (Grid/Liste/Pills) ─────────────────────────── */}
      {!istEditorial && !istShowcase && (
        <header className="relative bg-gastro-surface overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gastro-primary/10 via-transparent to-gastro-secondary/10" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gastro-primary/5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gastro-secondary/5" />

          <div className="relative max-w-lg mx-auto px-5 pt-10 pb-6">

            {/* Pills-Layout: zentrierter Hero im Restaurant-Stil */}
            {istPills ? (
              <div className="text-center">
                {/* Logo */}
                {design?.logo_url && (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-gastro-border/30 mx-auto mb-4 shadow-lg shadow-black/10">
                    <img src={design.logo_url} alt={restaurantName} className="w-full h-full object-cover" />
                  </div>
                )}
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
                  ) : design?.logo_url ? (
                    <div className="w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-gastro-border/30 shadow-lg shadow-gastro-primary/15">
                      <img src={design.logo_url} alt={restaurantName} className="w-full h-full object-cover" />
                    </div>
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

        {/* ── EDITORIAL Schritt 1: Nummerierte Kategorie-Liste mit Staggered Animation ── */}
        {!laden && istEditorial && !gewaehlteKategorie && (
          <>
            {(kategorien as KategorieMitAnzahl[]).length > 0 && (
              <div className="pt-1">
                {(kategorien as KategorieMitAnzahl[]).map((kat, i) => (
                  <motion.div
                    key={kat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
                  >
                    <KategorieZeileEditorial
                      kategorie={kat}
                      index={i}
                      gesamt={kategorien.length}
                      onClick={() => setGewaehlteKategorie(kat)}
                    />
                  </motion.div>
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

        {/* ── EDITORIAL Schritt 2: Gerichte mit Staggered Entry ──── */}
        {!laden && istEditorial && gewaehlteKategorie && (
          <>
            {/* Kategorie-Bild (aspect-ratio 21:9 für cinematic Look) */}
            {gewaehlteKategorie.bild_url && (
              <motion.div
                className="relative aspect-[21/9] -mx-4 -mt-5 mb-5 overflow-hidden"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={gewaehlteKategorie.bild_url}
                  alt={gewaehlteKategorie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gastro via-gastro/30 to-transparent" />
              </motion.div>
            )}

            {unterkategoriePills}

            <div className="flex flex-col gap-3">
              {gerichteInKategorie.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                  <GerichtKarteEditorial
                    gericht={g}
                    index={i}
                    menge={mengeFuerGericht(g.id)}
                    onAendern={(delta) => gerichtAendern(g, delta)}
                  />
                </motion.div>
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

        {/* ═════════════════════════════════════════════════════════════
            SHOWCASE-MODUS: 3D-Karten mit Glasmorphismus
         ═════════════════════════════════════════════════════════════ */}

        {/* ── SHOWCASE Schritt 1: 3D-Kategorie-Kacheln ──────────────── */}
        {!laden && istShowcase && !gewaehlteKategorie && (
          <>
            {(kategorien as KategorieMitAnzahl[]).length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {(kategorien as KategorieMitAnzahl[]).map((kat, i) => (
                  <motion.div
                    key={kat.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                  >
                    <Tilt3DKarte glowColor="rgba(129,140,248,0.5)">
                      <KategorieKarteShowcase
                        kategorie={kat}
                        index={i}
                        onClick={() => setGewaehlteKategorie(kat)}
                      />
                    </Tilt3DKarte>
                  </motion.div>
                ))}
              </div>
            )}

            {kategorien.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3 opacity-50">🍽️</div>
                <p className="text-gastro-muted text-sm">Die Speisekarte wird gerade aktualisiert.</p>
              </div>
            )}
          </>
        )}

        {/* ── SHOWCASE Schritt 2: Premium-Gerichtkarten ─────────────── */}
        {!laden && istShowcase && gewaehlteKategorie && (
          <>
            {/* Kategorie-Bild (cinematic 21:9) */}
            {gewaehlteKategorie.bild_url && (
              <motion.div
                className="relative aspect-[21/9] -mx-4 -mt-5 mb-5 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={gewaehlteKategorie.bild_url}
                  alt={gewaehlteKategorie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gastro via-gastro/40 to-transparent" />
              </motion.div>
            )}

            {unterkategoriePills}

            <div className="flex flex-col gap-3">
              {gerichteInKategorie.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
                >
                  <Tilt3DKarte tiltMax={6} hoverScale={1.02} glowColor="rgba(129,140,248,0.4)">
                    <GerichtKarteShowcase
                      gericht={g}
                      menge={mengeFuerGericht(g.id)}
                      onAendern={(delta) => gerichtAendern(g, delta)}
                    />
                  </Tilt3DKarte>
                </motion.div>
              ))}
            </div>

            {gerichteInKategorie.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3 opacity-50">🍽️</div>
                <p className="text-gastro-muted text-sm">Aktuell keine Gerichte in dieser Kategorie verfügbar.</p>
              </div>
            )}
          </>
        )}

        {/* ── Ladeindikator ─────────────────────────────────────────── */}
        {laden && (layout.kategorienAnzeige === 'grid' || layout.kategorienAnzeige === 'showcase') && (
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
                      menge={mengeFuerGericht(g.id)}
                      onAendern={(delta) => gerichtAendern(g, delta)}
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
        {!laden && !istPills && !istEditorial && !istShowcase && !gewaehlteKategorie && (
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
        {!laden && !istPills && !istEditorial && !istShowcase && gewaehlteKategorie && (
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

            {unterkategoriePills}

            {layout.gerichteAnzeige === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {gerichteInKategorie.map((g) => (
                  <GerichtKartePro
                    key={g.id}
                    gericht={g}
                    menge={mengeFuerGericht(g.id)}
                    onAendern={(delta) => gerichtAendern(g, delta)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {gerichteInKategorie.map((g) => (
                  <GerichtZeile
                    key={g.id}
                    gericht={g}
                    menge={mengeFuerGericht(g.id)}
                    onAendern={(delta) => gerichtAendern(g, delta)}
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
          GERICHT-DETAIL-MODAL (Extras-Auswahl)
       ═══════════════════════════════════════════════════════════════════ */}
      {detailGericht && (
        <GerichtDetailModal
          gericht={detailGericht}
          onSchliessen={() => setDetailGericht(null)}
          onInWarenkorb={inWarenkorb}
        />
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
