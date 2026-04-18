// BestellenQR.tsx
// QR-Menu Layout — Violet-Design mit linker Kategorie-Sidebar + 2-Spalten-Grid
// Inspiriert von: Dribbble "QR Menu UI Kit" (Webnum)

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GerichtDetailModal from '../components/gaeste/GerichtDetailModal';
import { warenkorbKey } from '../components/gaeste/GerichtDetailModal';
import BestellStatusTracker from '../components/gaeste/BestellStatusTracker';
import { useSpeisekarte } from '../hooks/useSpeisekarte';
import { useGaesteSocket } from '../hooks/useGaesteSocket';
import { useRestaurantDesign } from '../hooks/useRestaurantDesign';
import { Gericht, WarenkorbPosition, GewaehlteExtra, BestellungStatus, KategorieMitAnzahl } from '../types';
import { api } from '../lib/api';
import { formatPreis } from '../lib/utils';

// ── Farben (fest, kein Theme-System) ─────────────────────────────────────────
const V = {
  primary:    '#7B61FF',
  primaryLt:  '#F0EDFF',
  primaryMid: '#EDE8FF',
  bg:         '#F7F6FF',
  card:       '#FFFFFF',
  text:       '#1A1A2E',
  muted:      '#9CA3AF',
  border:     '#EEECFA',
} as const;

export default function BestellenQR() {
  const { restaurantId, tischId } = useParams<{ restaurantId: string; tischId: string }>();
  const { gerichte, kategorien, laden } = useSpeisekarte(restaurantId);
  const design = useRestaurantDesign(restaurantId);

  const [aktiveKategorieId, setAktiveKategorieId] = useState<string | null>(null);
  const [warenkorb, setWarenkorb]   = useState<WarenkorbPosition[]>([]);
  const [detailGericht, setDetailGericht] = useState<Gericht | null>(null);
  const [checkoutOffen, setCheckoutOffen] = useState(false);
  const [bestellt, setBestellt]     = useState(false);
  const [bestellungId, setBestellungId] = useState<string | null>(null);
  const [bestellStatus, setBestellStatus] = useState<BestellungStatus>('offen');
  const [gespeicherterPreis, setGespeicherterPreis] = useState(0);
  const [sendenLaden, setSendenLaden] = useState(false);
  const [fehler, setFehler]         = useState('');

  // Socket: Live-Status-Updates
  const onStatusUpdate = useCallback((daten: { id: string; status: string }) => {
    if (bestellungId && daten.id === bestellungId) {
      setBestellStatus(daten.status as BestellungStatus);
    }
  }, [bestellungId]);
  useGaesteSocket(restaurantId, tischId, onStatusUpdate);

  // Aktive Kategorie — erste als Default
  const kats = kategorien as KategorieMitAnzahl[];
  const aktiveKategorie = useMemo(
    () => kats.find(k => k.id === aktiveKategorieId) ?? kats[0] ?? null,
    [kats, aktiveKategorieId]
  );

  const aktiveGerichte = useMemo(
    () => (!aktiveKategorie ? [] : gerichte.filter(g => g.kategorie_id === aktiveKategorie.id && g.verfuegbar)),
    [gerichte, aktiveKategorie]
  );

  // ── Warenkorb-Logik ────────────────────────────────────────────────────────

  function mengeFuerGericht(gerichtId: string): number {
    return warenkorb.filter(p => p.gericht.id === gerichtId).reduce((s, p) => s + p.menge, 0);
  }

  // Direkt +/− (kein Modal — für Gerichte ohne Extras oder als Schnell-Add)
  function gerichtAendern(gericht: Gericht, delta: number) {
    if (delta > 0 && gericht.hat_extras) {
      setDetailGericht(gericht);
      return;
    }
    const key = warenkorbKey(gericht.id, []);
    if (delta > 0) {
      setWarenkorb(prev => {
        const ex = prev.find(p => p.key === key);
        return ex
          ? prev.map(p => p.key === key ? { ...p, menge: p.menge + 1 } : p)
          : [...prev, { key, gericht, menge: 1, extras: [] }];
      });
    } else {
      setWarenkorb(prev =>
        prev.map(p => p.key === key ? { ...p, menge: Math.max(0, p.menge - 1) } : p)
            .filter(p => p.menge > 0)
      );
    }
  }

  // Aus dem Detail-Modal (mit Extras)
  function inWarenkorb(gericht: Gericht, menge: number, extras: GewaehlteExtra[]) {
    const key = warenkorbKey(gericht.id, extras);
    setWarenkorb(prev => {
      const ex = prev.find(p => p.key === key);
      return ex
        ? prev.map(p => p.key === key ? { ...p, menge: p.menge + menge } : p)
        : [...prev, { key, gericht, menge, extras }];
    });
  }

  const gesamtpreis = warenkorb.reduce((s, p) => {
    const extrasAufpreis = p.extras.reduce((es, e) => es + Number(e.aufpreis), 0);
    return s + (Number(p.gericht.preis) + extrasAufpreis) * p.menge;
  }, 0);
  const anzahlImWarenkorb = warenkorb.reduce((s, p) => s + p.menge, 0);

  // ── Bestellung absenden ────────────────────────────────────────────────────

  async function bestellen() {
    setFehler('');
    setSendenLaden(true);
    try {
      const data = await api.post<{ id: string; gesamtpreis: number }>('/bestellungen', {
        restaurant_id: restaurantId,
        tisch_id:      tischId,
        anmerkung:     null,
        positionen:    warenkorb.map(p => ({
          gericht_id: p.gericht.id,
          menge:      p.menge,
          extras:     p.extras.map(e => ({ extra_id: e.extra_id })),
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

  const restaurantName = design?.name || 'Restaurant';

  // ── Nach Bestellung: Status-Screen ────────────────────────────────────────
  if (bestellt) {
    return (
      <BestellStatusTracker status={bestellStatus} gesamtpreis={gespeicherterPreis} />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ background: V.bg, minHeight: '100dvh', fontFamily: "'system-ui', '-apple-system', sans-serif" }}
    >

      {/* ════════════════════════════════
          HEADER
      ════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#fff', borderBottom: `1px solid ${V.border}`,
      }}>
        {/* Top-Zeile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
          {/* Logo oder Icon */}
          {design?.logo_url ? (
            <img src={design.logo_url} alt={restaurantName}
              style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: V.primaryLt,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <IconGabel color={V.primary} size={18} />
            </div>
          )}

          {/* Name + Tisch */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: V.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {restaurantName}
            </div>
            {tischId && (
              <div style={{ fontSize: 11, color: V.muted, marginTop: 1 }}>Tisch {tischId}</div>
            )}
          </div>

          {/* Icons rechts */}
          <HeaderIconBtn><IconSuche color={V.text} size={16} /></HeaderIconBtn>
          <HeaderIconBtn><IconInfo color={V.text} size={16} /></HeaderIconBtn>
        </div>

        {/* Kategorie-Tags (Chips) */}
        {!laden && kats.length > 0 && (
          <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {kats.map((kat, i) => {
              const chipColors = [
                { bg: '#FFF3E0', text: '#E65100' },
                { bg: '#E3F2FD', text: '#1565C0' },
                { bg: '#E8F5E9', text: '#2E7D32' },
                { bg: V.primaryLt, text: V.primary },
                { bg: '#FCE4EC', text: '#880E4F' },
                { bg: '#F3E5F5', text: '#6A1B9A' },
              ];
              const chip = chipColors[i % chipColors.length];
              const isActive = aktiveKategorie?.id === kat.id;
              return (
                <button
                  key={kat.id}
                  onClick={() => setAktiveKategorieId(kat.id)}
                  style={{
                    flexShrink: 0, padding: '5px 12px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: isActive ? V.primary : chip.bg,
                    color:      isActive ? '#fff'     : chip.text,
                  }}
                >
                  {kat.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ════════════════════════════════
          BODY: Sidebar + Gerichte-Grid
      ════════════════════════════════ */}
      <div style={{ display: 'flex', minHeight: 'calc(100dvh - 90px)' }}>

        {/* Linke Kategorie-Sidebar */}
        <aside style={{
          width: 68, flexShrink: 0,
          background: '#fff', borderRight: `1px solid ${V.border}`,
          position: 'sticky', top: 90, alignSelf: 'flex-start',
          height: 'calc(100dvh - 90px)', overflowY: 'auto',
          scrollbarWidth: 'none', paddingTop: 8, paddingBottom: 80,
        }}>
          {laden
            ? [...Array(6)].map((_, i) => (
                <div key={i} style={{
                  margin: '4px 8px 8px', height: 56, borderRadius: 12,
                  background: '#F0F0F0', animation: 'pulse 1.5s infinite',
                }} />
              ))
            : kats.map((kat) => {
                const isActive = aktiveKategorie?.id === kat.id;
                return (
                  <button
                    key={kat.id}
                    onClick={() => setAktiveKategorieId(kat.id)}
                    style={{
                      width: '100%', padding: '10px 6px', border: 'none', cursor: 'pointer',
                      background: 'transparent',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      borderLeft: `3px solid ${isActive ? V.primary : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Icon / Kategoriebild */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, overflow: 'hidden',
                      background: isActive ? V.primaryLt : '#F5F5F5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}>
                      {kat.bild_url ? (
                        <img src={kat.bild_url} alt={kat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 15, fontWeight: 700,
                          color: isActive ? V.primary : '#9CA3AF' }}>
                          {kat.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Label */}
                    <span style={{
                      fontSize: 9, fontWeight: isActive ? 700 : 500,
                      color: isActive ? V.primary : V.muted,
                      textAlign: 'center', lineHeight: 1.2,
                      maxWidth: 54, wordBreak: 'break-word',
                    }}>
                      {kat.name}
                    </span>
                  </button>
                );
              })
          }
        </aside>

        {/* Gerichte-Grid */}
        <main style={{ flex: 1, minWidth: 0, padding: '14px 12px 120px 12px' }}>

          {/* Kategorie-Titel */}
          {aktiveKategorie && !laden && (
            <div style={{ marginBottom: 12, paddingLeft: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: V.text }}>
                {aktiveKategorie.name}
              </span>
              <span style={{ fontSize: 12, color: V.muted, marginLeft: 6 }}>
                {aktiveGerichte.length} Gerichte
              </span>
            </div>
          )}

          {/* Skeleton Loader */}
          {laden && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  borderRadius: 16, overflow: 'hidden',
                  background: '#E8E6F8',
                  aspectRatio: '0.75',
                  animation: 'pulse 1.5s infinite',
                }} />
              ))}
            </div>
          )}

          {/* Gerichte-Grid */}
          {!laden && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {aktiveGerichte.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22, ease: 'easeOut' }}
                >
                  <GerichtKarteQR
                    gericht={g}
                    menge={mengeFuerGericht(g.id)}
                    onAendern={(delta) => gerichtAendern(g, delta)}
                    onTippen={() => setDetailGericht(g)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Leer-Zustand */}
          {!laden && aktiveGerichte.length === 0 && aktiveKategorie && (
            <div style={{ textAlign: 'center', paddingTop: 60, color: V.muted }}>
              <div style={{ fontSize: 44, opacity: 0.3, marginBottom: 10 }}>🍽️</div>
              <p style={{ fontSize: 13 }}>Aktuell keine Gerichte verfügbar.</p>
            </div>
          )}
        </main>
      </div>

      {/* ════════════════════════════════
          FOOTER: Zum Warenkorb Button
      ════════════════════════════════ */}
      <AnimatePresence>
        {anzahlImWarenkorb > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
              background: '#fff', borderTop: `1px solid ${V.border}`,
              padding: '12px 16px',
              paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            }}
          >
            <button
              onClick={() => setCheckoutOffen(true)}
              style={{
                width: '100%', padding: '14px 18px',
                borderRadius: 16, background: V.primary,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: '#fff',
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.22)', borderRadius: 8,
                padding: '2px 9px', fontSize: 13, fontWeight: 700, minWidth: 24, textAlign: 'center',
              }}>
                {anzahlImWarenkorb}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Zum Warenkorb</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{formatPreis(gesamtpreis)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          CHECKOUT SHEET
      ════════════════════════════════ */}
      <AnimatePresence>
        {checkoutOffen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCheckoutOffen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 51,
                background: '#fff', borderRadius: '24px 24px 0 0',
                maxHeight: '82dvh', display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>

              {/* Header */}
              <div style={{ padding: '4px 20px 16px', borderBottom: `1px solid ${V.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: V.text }}>Bestellung bestätigen</div>
                {tischId && (
                  <div style={{ fontSize: 12, color: V.muted, marginTop: 3 }}>Tisch {tischId}</div>
                )}
              </div>

              {/* Positions */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {warenkorb.map((pos, i) => (
                  <div key={pos.key} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    paddingBottom: 14, marginBottom: i < warenkorb.length - 1 ? 14 : 0,
                    borderBottom: i < warenkorb.length - 1 ? `1px solid ${V.border}` : 'none',
                  }}>
                    {/* Bild */}
                    {pos.gericht.bild_url ? (
                      <img src={pos.gericht.bild_url} alt={pos.gericht.name}
                        style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 48, height: 48, borderRadius: 10, background: V.primaryLt,
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconGabel color={V.primary} size={20} />
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: V.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pos.gericht.name}
                      </div>
                      {pos.extras.length > 0 && (
                        <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>
                          {pos.extras.map(e => e.name).join(', ')}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>× {pos.menge}</div>
                    </div>

                    {/* Preis */}
                    <div style={{ fontSize: 14, fontWeight: 700, color: V.text, flexShrink: 0 }}>
                      {formatPreis((Number(pos.gericht.preis) + pos.extras.reduce((s, e) => s + Number(e.aufpreis), 0)) * pos.menge)}
                    </div>
                  </div>
                ))}

                {/* Divider + Total */}
                <div style={{
                  marginTop: 20, paddingTop: 16, borderTop: `1px solid ${V.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: V.text }}>Gesamt</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: V.primary }}>{formatPreis(gesamtpreis)}</span>
                </div>

                {/* Status-Chip */}
                <div style={{
                  marginTop: 14, padding: '10px 14px', borderRadius: 12, background: V.primaryLt,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 12, color: V.muted }}>Status</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: V.primary }}>Bereit zur Bestellung</span>
                </div>
              </div>

              {/* Fehler */}
              {fehler && (
                <div style={{
                  margin: '0 20px 12px', padding: '10px 14px', borderRadius: 10,
                  background: '#FEF2F2', color: '#DC2626', fontSize: 13,
                }}>
                  {fehler}
                </div>
              )}

              {/* CTA */}
              <div style={{
                padding: '14px 20px', borderTop: `1px solid ${V.border}`,
                paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
              }}>
                <button
                  onClick={bestellen}
                  disabled={sendenLaden}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 16,
                    background: sendenLaden ? '#C4B8FF' : V.primary,
                    border: 'none', cursor: sendenLaden ? 'not-allowed' : 'pointer',
                    color: '#fff', fontSize: 16, fontWeight: 700,
                    transition: 'background 0.15s',
                  }}
                >
                  {sendenLaden ? 'Wird bestellt…' : 'Jetzt bestellen'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          DETAIL MODAL (Extras)
      ════════════════════════════════ */}
      {detailGericht && (
        <GerichtDetailModal
          gericht={detailGericht}
          onSchliessen={() => setDetailGericht(null)}
          onInWarenkorb={inWarenkorb}
        />
      )}
    </div>
  );
}

// ── Gerichtkarte ──────────────────────────────────────────────────────────────
// Weißes Card mit quadratischem Bild, Name, Preis (violet), +/− Controls

interface GerichtKarteQRProps {
  gericht:   Gericht;
  menge:     number;
  onAendern: (delta: number) => void;
  onTippen:  () => void;
}

function GerichtKarteQR({ gericht, menge, onAendern, onTippen }: GerichtKarteQRProps) {
  return (
    <div style={{
      background: V.card, borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(123,97,255,0.07), 0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${V.border}`,
    }}>
      {/* Bild */}
      <button
        onClick={onTippen}
        style={{
          display: 'block', width: '100%', aspectRatio: '1/1',
          background: V.primaryLt, border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden',
        }}
      >
        {gericht.bild_url ? (
          <img src={gericht.bild_url} alt={gericht.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.2s ease' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}>
            <IconGabel color={V.primary} size={30} />
          </div>
        )}
      </button>

      {/* Info */}
      <div style={{ padding: '10px 10px 10px' }}>
        {/* Name */}
        <div
          onClick={onTippen}
          style={{
            fontSize: 12, fontWeight: 600, color: V.text, lineHeight: 1.35,
            cursor: 'pointer', minHeight: 32,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {gericht.name}
        </div>

        {/* Preis + Controls */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: V.primary }}>
            {formatPreis(gericht.preis)}
          </span>

          {menge === 0 ? (
            /* Erster Klick: einfacher + Button */
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onAendern(1)}
              style={{
                width: 30, height: 30, borderRadius: 9, background: V.primary,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 20, lineHeight: 1, fontWeight: 400,
              }}
            >
              +
            </motion.button>
          ) : (
            /* Menge > 0: −/menge/+ */
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => onAendern(-1)}
                style={{
                  width: 26, height: 26, borderRadius: 7, background: '#F0F0F8',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color: V.text, fontWeight: 700, lineHeight: 1,
                }}
              >
                −
              </motion.button>
              <span style={{ fontSize: 13, fontWeight: 700, color: V.text,
                minWidth: 16, textAlign: 'center' }}>
                {menge}
              </span>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => onAendern(1)}
                style={{
                  width: 26, height: 26, borderRadius: 7, background: V.primary,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color: '#fff', fontWeight: 700, lineHeight: 1,
                }}
              >
                +
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helfer-Komponenten ─────────────────────────────────────────────────────────

function HeaderIconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
      width: 36, height: 36, borderRadius: 10, background: '#F5F5F5',
      border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {children}
    </button>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function IconGabel({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function IconSuche({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconInfo({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
