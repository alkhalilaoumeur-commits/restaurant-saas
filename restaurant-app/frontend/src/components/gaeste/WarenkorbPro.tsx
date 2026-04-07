import { useState, useEffect, useRef } from 'react';
import { WarenkorbPosition } from '../../types';
import { formatPreis } from '../../lib/utils';

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  positionen: WarenkorbPosition[];
  gesamtpreis: number;
  anmerkung: string;
  onAnmerkungAendern: (wert: string) => void;
  onBestellen: () => void;
  onMengeAendern: (gerichtId: string, delta: number) => void;
  laden: boolean;
}

// ─── Komponente ─────────────────────────────────────────────────────────────
// Professioneller Warenkorb mit zwei Zuständen:
//
//   1. MINIMIERT (Standard): Floating-Button unten rechts
//      → Zeigt Anzahl Artikel + Gesamtpreis
//      → Bounce-Animation wenn sich der Inhalt ändert
//
//   2. AUFGEKLAPPT: Sheet das von unten hochslided
//      → Vollständige Artikelliste mit +/− pro Position
//      → Anmerkungsfeld
//      → Großer "Jetzt bestellen"-Button
//      → Backdrop-Overlay (klick = schließen)
//
// Der Übergang zwischen beiden Zuständen ist animiert (CSS transition).
export default function WarenkorbPro({
  positionen,
  gesamtpreis,
  anmerkung,
  onAnmerkungAendern,
  onBestellen,
  onMengeAendern,
  laden,
}: Props) {
  const [offen, setOffen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const vorherigeAnzahl = useRef(0);
  const leer = positionen.length === 0;

  const anzahlArtikel = positionen.reduce((s, p) => s + p.menge, 0);

  // Bounce-Animation auslösen wenn sich die Artikelzahl ändert
  // → Gibt dem User visuelles Feedback dass etwas hinzugefügt wurde
  useEffect(() => {
    if (anzahlArtikel > vorherigeAnzahl.current && anzahlArtikel > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(timer);
    }
    vorherigeAnzahl.current = anzahlArtikel;
  }, [anzahlArtikel]);

  // Sheet schließen wenn Warenkorb geleert wird
  useEffect(() => {
    if (leer) setOffen(false);
  }, [leer]);

  // Leerer Warenkorb → nichts anzeigen
  if (leer) return null;

  return (
    <>
      {/* ── Backdrop-Overlay (nur wenn Sheet offen) ────────────────────── */}
      {/* Klick auf den dunklen Hintergrund schließt das Sheet */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          offen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOffen(false)}
      />

      {/* ── Floating-Button (minimierter Zustand) ─────────────────────── */}
      {/* Wird nur angezeigt wenn das Sheet NICHT offen ist */}
      <button
        onClick={() => setOffen(true)}
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          bg-gastro-primary text-gastro-on-primary
          rounded-full px-6 py-3.5
          shadow-xl shadow-gastro-primary/30
          flex items-center gap-3
          transition-all duration-300
          hover:shadow-2xl hover:scale-105 active:scale-95
          max-w-[calc(100vw-3rem)]
          ${offen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
          ${bounce ? 'scale-110' : ''}
        `}
      >
        {/* Warenkorb-Icon */}
        <div className="relative">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          {/* Anzahl-Badge */}
          <span className="absolute -top-2 -right-2 bg-gastro-surface text-gastro-primary text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm min-w-[18px] min-h-[18px]">
            {anzahlArtikel}
          </span>
        </div>

        <span className="font-semibold text-sm">Warenkorb</span>

        {/* Trennlinie */}
        <div className="w-px h-5 bg-gastro-on-primary/30" />

        <span className="font-bold text-sm">{formatPreis(gesamtpreis)}</span>
      </button>

      {/* ── Sheet (aufgeklappter Zustand) ──────────────────────────────── */}
      {/* Slided von unten rein, max 70% Bildschirmhöhe */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-gastro-surface rounded-t-[20px]
          shadow-2xl shadow-black/20
          transition-transform duration-300 ease-out
          max-h-[70vh] flex flex-col
          ${offen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle zum Ziehen (visueller Indikator) */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gastro-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gastro-border">
          <h2 className="font-semibold text-gastro-text font-theme-heading text-lg">
            Deine Bestellung
          </h2>
          <button
            onClick={() => setOffen(false)}
            className="w-8 h-8 rounded-full bg-gastro-border/50 text-gastro-muted flex items-center justify-center hover:bg-gastro-border transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Artikelliste (scrollbar) ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {positionen.map(({ gericht, menge }) => (
            <div key={gericht.id} className="flex items-center gap-3">
              {/* Kleines Bild */}
              {gericht.bild_url ? (
                <img
                  src={gericht.bild_url}
                  alt={gericht.name}
                  className="w-12 h-12 rounded-theme object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-theme bg-gastro-border/30 shrink-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gastro-muted/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3M18 22v-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Name + Preis */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gastro-text line-clamp-1">{gericht.name}</p>
                <p className="text-xs text-gastro-muted">{formatPreis(gericht.preis)} pro Stück</p>
              </div>

              {/* Mengen-Steuerung */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onMengeAendern(gericht.id, -1)}
                  className="w-7 h-7 rounded-full bg-gastro-border/50 text-gastro-muted text-sm font-medium
                             flex items-center justify-center transition-all hover:bg-gastro-border active:scale-90"
                >
                  {menge === 1 ? (
                    // Mülleimer-Icon wenn nur 1 übrig (= komplett entfernen)
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  ) : '−'}
                </button>
                <span className="w-5 text-center text-sm font-bold text-gastro-text tabular-nums">{menge}</span>
                <button
                  onClick={() => onMengeAendern(gericht.id, 1)}
                  className="w-7 h-7 rounded-full bg-gastro-primary text-gastro-on-primary text-sm font-medium
                             flex items-center justify-center transition-all hover:opacity-90 active:scale-90"
                >
                  +
                </button>
              </div>

              {/* Zeilenpreis */}
              <span className="text-sm font-semibold text-gastro-text w-16 text-right tabular-nums">
                {formatPreis(gericht.preis * menge)}
              </span>
            </div>
          ))}
        </div>

        {/* ── Footer: Anmerkung + Summe + Button ───────────────────────── */}
        <div className="border-t border-gastro-border px-5 pt-3 pb-5 space-y-3">
          {/* Anmerkung */}
          <textarea
            value={anmerkung}
            onChange={(e) => onAnmerkungAendern(e.target.value)}
            placeholder="Anmerkungen? (z.B. Allergien, ohne Zwiebeln...)"
            rows={1}
            className="w-full border border-gastro-border bg-gastro/50 text-gastro-text placeholder:text-gastro-muted
                       rounded-theme px-3 py-2 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-gastro-primary/30 focus:border-transparent transition-all"
          />

          {/* Summe */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gastro-muted">Gesamtsumme</span>
            <span className="text-xl font-bold text-gastro-text font-theme-heading tabular-nums">
              {formatPreis(gesamtpreis)}
            </span>
          </div>

          {/* Bestell-Button */}
          <button
            onClick={() => {
              onBestellen();
              setOffen(false);
            }}
            disabled={laden}
            className="w-full bg-gastro-primary text-gastro-on-primary rounded-theme py-4 font-semibold text-base
                       disabled:opacity-40 transition-all duration-200
                       hover:opacity-90 active:scale-[0.98]
                       shadow-lg shadow-gastro-primary/25"
          >
            {laden ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Wird gesendet...
              </span>
            ) : (
              `Jetzt bestellen · ${formatPreis(gesamtpreis)}`
            )}
          </button>
        </div>
      </div>
    </>
  );
}
