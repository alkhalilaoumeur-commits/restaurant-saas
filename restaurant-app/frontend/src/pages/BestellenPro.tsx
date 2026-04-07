import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import KategorieKarte from '../components/gaeste/KategorieKarte';
import GerichtKartePro from '../components/gaeste/GerichtKartePro';
import WarenkorbPro from '../components/gaeste/WarenkorbPro';
import BestellStatusTracker from '../components/gaeste/BestellStatusTracker';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { useGaesteSocket } from '../hooks/useGaesteSocket';
import { useRestaurantDesign } from '../hooks/useRestaurantDesign';
import { useGastroTheme } from '../hooks/useGastroTheme';
import { WarenkorbPosition, BestellungStatus, ThemePresetId, KategorieMitAnzahl } from '../types';

// ─── Theme-Auswahl (Demo) ──────────────────────────────────────────────────
// In Produktion kommt die Theme-ID aus der DB (design?.theme_preset_id).
// Für die Demo kann man das Theme oben auf der Seite wechseln.
const DEMO_THEMES: { id: ThemePresetId; emoji: string; name: string }[] = [
  { id: 'modern', emoji: '✨', name: 'Modern' },
  { id: 'eleganz', emoji: '🥂', name: 'Eleganz' },
  { id: 'trattoria', emoji: '🍝', name: 'Trattoria' },
  { id: 'fresh', emoji: '🥗', name: 'Fresh' },
  { id: 'street', emoji: '🍔', name: 'Street' },
  { id: 'rustikal', emoji: '🍺', name: 'Rustikal' },
];

// ─── Seite ──────────────────────────────────────────────────────────────────
//
// Zwei-Schritt-Flow:
//   Schritt 1: Kategorie-Übersicht → große Kacheln mit Hintergrundbildern
//   Schritt 2: Gerichte einer Kategorie → Grid mit GerichtKartePro
//
// Datenfluss:
//   URL-Params (restaurantId, tischId)
//     → useSpeisekarte() lädt Gerichte + Kategorien
//     → useRestaurantDesign() lädt Name/Logo
//     → useGastroTheme() setzt CSS-Variablen
//     → gewaehlteKategorie steuert welche Ansicht sichtbar ist
//     → mengen-State trackt Auswahl des Gastes
//     → POST /api/bestellungen sendet Bestellung
//     → useGaesteSocket() empfängt Live-Updates
export default function BestellenPro() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const { gerichte, kategorien, laden } = useSpeisekarte(restaurantId);
  const design = useRestaurantDesign(restaurantId);

  // Theme-State für Demo-Switcher
  const [themeId, setThemeId] = useState<ThemePresetId>('modern');
  useGastroTheme(themeId);

  // ── Navigation: welche Kategorie ist gewählt? ─────────────────────────────
  // null = Kategorie-Übersicht (Schritt 1)
  // KategorieMitAnzahl = Gerichte-Ansicht (Schritt 2)
  const [gewaehlteKategorie, setGewaehlteKategorie] = useState<KategorieMitAnzahl | null>(null);

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
      const res = await fetch('/api/bestellungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          tisch_id: tischId,
          anmerkung: anmerkung || null,
          positionen: positionen.map((p) => ({
            gericht_id: p.gericht.id,
            menge: p.menge,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fehler || 'Bestellung fehlgeschlagen');

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

  // Gerichte der gewählten Kategorie filtern
  const gerichteInKategorie = gewaehlteKategorie
    ? gerichte.filter((g) => g.kategorie_id === gewaehlteKategorie.id && g.verfuegbar)
    : [];

  const restaurantName = design?.name || 'Restaurant';

  // Anzahl Artikel im Warenkorb (für Badge)
  const anzahlImWarenkorb = positionen.reduce((s, p) => s + p.menge, 0);

  return (
    <div className="min-h-screen bg-gastro font-theme-body">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO-HEADER
          Immer sichtbar — Restaurant-Name + Tisch-Badge.
          Wenn in Kategorie-Detail: Zurück-Button statt Deko.
       ═══════════════════════════════════════════════════════════════════ */}
      <header className="relative bg-gastro-surface overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gastro-primary/10 via-transparent to-gastro-secondary/10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gastro-primary/5" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gastro-secondary/5" />

        <div className="relative max-w-lg mx-auto px-5 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-4">
            {/* Zurück-Button wenn in Kategorie-Detail */}
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
            {/* Warenkorb-Badge im Header wenn Artikel drin sind */}
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
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO: Theme-Switcher (in Produktion entfernen)
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-gastro-surface/80 backdrop-blur-sm border-b border-gastro-border">
        <div className="max-w-lg mx-auto px-5 py-2.5">
          <p className="text-[10px] text-gastro-muted uppercase tracking-wider font-medium mb-1.5">Design wechseln</p>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {DEMO_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium ${
                  themeId === t.id
                    ? 'bg-gastro-primary text-gastro-on-primary shadow-sm'
                    : 'bg-gastro-border/40 text-gastro-muted hover:bg-gastro-border/70'
                }`}
              >
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT: Kategorie-Übersicht ODER Gerichte-Grid
       ═══════════════════════════════════════════════════════════════════ */}
      <main className="max-w-lg mx-auto px-4 py-5 pb-32">

        {/* ── Ladeindikator ─────────────────────────────────────────── */}
        {laden && (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gastro-surface rounded-theme overflow-hidden">
                <div className="w-full h-full bg-gastro-border/30 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* ── SCHRITT 1: Kategorie-Übersicht ────────────────────────── */}
        {/* Große Kacheln im 2-Spalten-Grid. Jede Kachel hat ein
            Hintergrundbild (oder Gradient-Fallback) mit dem Kategorie-
            namen darüber. Klick → zu Schritt 2. */}
        {!laden && !gewaehlteKategorie && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gastro-text font-theme-heading">
                Was darf es sein?
              </h2>
              <p className="text-sm text-gastro-muted mt-1">
                Wähle eine Kategorie
              </p>
            </div>

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

            {/* Leere Speisekarte */}
            {kategorien.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gastro-muted text-sm">Die Speisekarte wird gerade aktualisiert.</p>
              </div>
            )}
          </>
        )}

        {/* ── SCHRITT 2: Gerichte einer Kategorie ───────────────────── */}
        {/* Wird angezeigt wenn eine Kategorie gewählt wurde.
            Zeigt alle verfügbaren Gerichte als Grid.
            Zurück-Button ist im Header. */}
        {!laden && gewaehlteKategorie && (
          <>
            {/* Kategorie-Header mit Bild */}
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
              {/* Zurück-Link */}
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

            {/* 2-Spalten Grid */}
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

            {/* Keine Gerichte */}
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
          WARENKORB (Floating Button + Sheet)
          Immer sichtbar — egal ob in Kategorie-Übersicht oder Detail.
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
