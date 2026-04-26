import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Transformer, Line } from 'react-konva';
import type Konva from 'konva';
import { QRCodeSVG } from 'qrcode.react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import ReservierungsTimeline from '../components/tischplan/ReservierungsTimeline';
import { useTische } from '../hooks/useTische';
import { useBereiche } from '../hooks/useBereiche';
import { useReservierungen } from '../hooks/useReservierungen';
import { useDekorationen } from '../hooks/useDekorationen';
import { useAuthStore } from '../store/auth';
import { Tisch, TischStatus, TischForm, Reservierung, Dekoration, DekoTyp } from '../types';
import { TISCH_STATUS_LABEL, TISCH_STATUS_FARBE } from '../lib/utils';

// ─── Konstanten ──────────────────────────────────────────────────────────────

const GRID_SIZE = 20;
const CANVAS_W = 1200;
const CANVAS_H = 800;

/** Farben pro Tisch-Status (Canvas-Füllung + Rand) — DRVN Dark-Theme */
const STATUS_FILL: Record<TischStatus, string> = {
  frei: '#0e1726',                  // Slate-900
  besetzt: 'rgba(239, 68, 68, 0.2)', // Red transparent
  wartet_auf_zahlung: 'rgba(234, 179, 8, 0.2)', // Yellow transparent
};
const STATUS_STROKE: Record<TischStatus, string> = {
  frei: '#1e3a5f',                  // Subtle Blue-700
  besetzt: '#ef4444',
  wartet_auf_zahlung: '#eab308',
};
/** Stuhl-Farbe (umlaufende kleine Kreise um den Tisch) */
const STUHL_COLOR = '#334155'; // Slate-700

/** Vorlagen für neue Tische (Seitenleiste) */
const TISCH_VORLAGEN: { form: TischForm; label: string; breite: number; hoehe: number; kap: number }[] = [
  { form: 'rund',     label: 'Rund (2er)',     breite: 60,  hoehe: 60,  kap: 2 },
  { form: 'rund',     label: 'Rund (4er)',     breite: 80,  hoehe: 80,  kap: 4 },
  { form: 'quadrat',  label: 'Quadrat (4er)',  breite: 80,  hoehe: 80,  kap: 4 },
  { form: 'rechteck', label: 'Rechteck (6er)', breite: 120, hoehe: 70,  kap: 6 },
  { form: 'rechteck', label: 'Rechteck (8er)', breite: 150, hoehe: 80,  kap: 8 },
  { form: 'bar',      label: 'Bar/Theke (2er)',breite: 100, hoehe: 40,  kap: 2 },
];

/** Vorlagen für Deko-Elemente (Sidebar Edit-Modus) */
const DEKO_VORLAGEN: { typ: DekoTyp; label: string; breite: number; hoehe: number; icon: string }[] = [
  { typ: 'pflanze',         label: 'Pflanze',     breite: 30,  hoehe: 30, icon: '🌿' },
  { typ: 'theke',           label: 'Theke/Bar',   breite: 200, hoehe: 30, icon: '▭' },
  { typ: 'eingang',         label: 'Eingang',     breite: 80,  hoehe: 24, icon: '⌐' },
  { typ: 'servicestation',  label: 'Service',     breite: 80,  hoehe: 30, icon: '◌' },
  { typ: 'wand',            label: 'Wand',        breite: 200, hoehe: 8,  icon: '─' },
  { typ: 'tuer',            label: 'Tür',         breite: 50,  hoehe: 8,  icon: '┄' },
];

// ─── Snap Helper ─────────────────────────────────────────────────────────────

function snap(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

// ─── Zeit-Helfer (deutsche Uhrzeit) ─────────────────────────────────────────

/** Minuten bis zur Reservierung (negativ = Startzeit schon vorbei) */
function minutenBis(res: Reservierung, jetztMs: number): number {
  return (new Date(res.datum).getTime() - jetztMs) / 60000;
}

// ─── Haupt-Komponente ────────────────────────────────────────────────────────

export default function Tischplan() {
  const { tische, laden, statusAendern, tischErstellen, tischAktualisieren, tischLoeschen } = useTische();
  const { bereiche, erstellen: bereichErstellen, loeschen: bereichLoeschen } = useBereiche();
  const { dekorationen, erstellen: dekoErstellen, aktualisieren: dekoAktualisieren, loeschen: dekoLoeschen } = useDekorationen();
  const rolle = useAuthStore((s) => s.mitarbeiter?.rolle);
  const istAdmin = rolle === 'admin';

  // Heutige Reservierungen laden
  const heute = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { reservierungen, tischZuweisen, statusAendern: resStatusAendern, tagsAendern: resTagsAendern } = useReservierungen(heute);

  // Tags-Bearbeiten Modal-State
  const [tagsBearbeitenRes, setTagsBearbeitenRes] = useState<Reservierung | null>(null);

  // Aktive Reservierungen — storniert/abgeschlossen/no_show werden nicht mehr angezeigt
  // (Gast weg oder erschienen nicht → Tisch ist wieder frei)
  const aktiveReservierungen = useMemo(
    () => reservierungen.filter(
      r => r.status !== 'storniert' && r.status !== 'abgeschlossen' && r.status !== 'no_show'
    ),
    [reservierungen]
  );

  // Map: tisch_id → Reservierungen (für schnelle Anzeige auf Canvas)
  const reservierungenProTisch = useMemo(() => {
    const map = new Map<string, Reservierung[]>();
    for (const r of aktiveReservierungen) {
      if (r.tisch_id) {
        const arr = map.get(r.tisch_id) || [];
        arr.push(r);
        map.set(r.tisch_id, arr);
      }
    }
    return map;
  }, [aktiveReservierungen]);

  // Unzugewiesene Reservierungen (kein tisch_id)
  const offeneReservierungen = useMemo(
    () => aktiveReservierungen.filter(r => !r.tisch_id),
    [aktiveReservierungen]
  );

  // Ansicht: 'editor' (Canvas) oder 'liste' (alte Grid-Ansicht)
  const [ansicht, setAnsicht] = useState<'editor' | 'liste'>('editor');

  // Zuweisungs-Panel: welcher Tisch wurde im Live-Modus angeklickt?
  const [zuweisungTisch, setZuweisungTisch] = useState<Tisch | null>(null);

  // Select-to-Assign: Reservierung in Sidebar auswählen → passenden Tisch anklicken
  const [ausgewaehlteRes, setAusgewaehlteRes] = useState<string | null>(null);

  // ─── Zeitbasierte Logik ──────────────────────────────────────────────────
  // Aktuelle Uhrzeit — aktualisiert sich jede Minute für Live-Anzeige
  const [jetzt, setJetzt] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setJetzt(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Counter — bei jedem Tick scrollt die Timeline auf "jetzt".
  // Wird vom Header-Button "Auf jetzt wechseln" inkrementiert.
  const [scrollAufJetztTick, setScrollAufJetztTick] = useState(0);

  // Warnung wenn Tisch mit baldiger Reservierung belegt werden soll
  const [warnungTisch, setWarnungTisch] = useState<{ tisch: Tisch; reservierungen: Reservierung[] } | null>(null);

  // "Gast ist da"-Handler: Tisch → besetzt + Reservierung → bestätigt
  const gastIstDa = useCallback(async (reservierung: Reservierung) => {
    if (!reservierung.tisch_id) return;
    await statusAendern(reservierung.tisch_id, 'besetzt');
    if (reservierung.status === 'ausstehend') {
      await resStatusAendern(reservierung.id, 'bestaetigt');
    }
  }, [statusAendern, resStatusAendern]);

  // Editor State
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null);
  const [editModus, setEditModus] = useState(false);
  // null = noch nicht initialisiert (vor erstem Bereich-Laden) oder keine Bereiche vorhanden
  const [aktiverBereich, setAktiverBereich] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Beim ersten Laden der Bereiche: ersten Bereich auswählen.
  // Wenn der aktuell ausgewählte Bereich gelöscht wurde → fallback auf ersten.
  useEffect(() => {
    if (bereiche.length === 0) {
      if (aktiverBereich !== null) setAktiverBereich(null);
      return;
    }
    const stillVorhanden = aktiverBereich && bereiche.some(b => b.id === aktiverBereich);
    if (!stillVorhanden) setAktiverBereich(bereiche[0].id);
  }, [bereiche, aktiverBereich]);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Modals
  const [detailTisch, setDetailTisch] = useState<Tisch | null>(null);
  const [qrTisch, setQrTisch] = useState<Tisch | null>(null);
  const [kopiert, setKopiert] = useState(false);
  const [loeschenId, setLoeschenId] = useState<string | null>(null);
  const [alleDrucken, setAlleDrucken] = useState(false);
  const [neuerBereichName, setNeuerBereichName] = useState('');
  const druckRef = useRef<HTMLDivElement>(null);

  // Canvas Container für responsive Größe
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: CANVAS_W, h: CANVAS_H });

  useEffect(() => {
    function resize() {
      if (!canvasContainerRef.current) return;
      const rect = canvasContainerRef.current.getBoundingClientRect();
      setCanvasSize({ w: rect.width, h: Math.max(500, rect.height) });
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [ansicht]);

  // Transformer auf selektierten Tisch anwenden
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (!ausgewaehlt || !editModus || !istAdmin) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current.findOne(`#tisch-${ausgewaehlt}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [ausgewaehlt, editModus, istAdmin]);

  // Strikte Bereich-Filter: jeder Bereich ist sein eigener Floor Plan.
  // Tische/Deko ohne bereich_id (Legacy-Daten) sind unsichtbar bis sie zugewiesen werden.
  const gefilterteTische = aktiverBereich
    ? tische.filter(t => t.bereich_id === aktiverBereich)
    : [];

  const gefilterteDeko = aktiverBereich
    ? dekorationen.filter(d => d.bereich_id === aktiverBereich)
    : [];

  // Anzahl Tische/Deko OHNE Bereich-Zuweisung (Legacy) — Hinweis im Edit-Modus
  const tischeOhneBereich = tische.filter(t => !t.bereich_id).length;

  // Ausgewählte Deko (Edit-Modus, getrennt von Tisch-Selektion)
  const [ausgewaehlteDeko, setAusgewaehlteDeko] = useState<string | null>(null);

  // Status-Zusammenfassung
  const anzahl: Record<TischStatus, number> = { frei: 0, besetzt: 0, wartet_auf_zahlung: 0 };
  for (const t of gefilterteTische) anzahl[t.status]++;

  // ─── Event Handlers ──────────────────────────────────────────────────────

  const handleDragEnd = useCallback((tisch: Tisch, e: Konva.KonvaEventObject<DragEvent>) => {
    const x = snap(e.target.x());
    const y = snap(e.target.y());
    tischAktualisieren(tisch.id, { pos_x: x, pos_y: y });
  }, [tischAktualisieren]);

  const handleTransformEnd = useCallback((tisch: Tisch, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Skalierung zurücksetzen und stattdessen die tatsächliche Größe speichern
    node.scaleX(1);
    node.scaleY(1);
    tischAktualisieren(tisch.id, {
      pos_x: snap(node.x()),
      pos_y: snap(node.y()),
      breite: Math.max(40, snap(tisch.breite * scaleX)),
      hoehe: Math.max(40, snap(tisch.hoehe * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  }, [tischAktualisieren]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Klick auf leere Fläche → Selektion aufheben
    if (e.target === e.target.getStage()) {
      setAusgewaehlt(null);
    }
  }, []);

  const handleTischDoppelklick = useCallback((tisch: Tisch) => {
    if (editModus && istAdmin) {
      setDetailTisch(tisch);
    }
  }, [editModus, istAdmin]);

  // Neuen Tisch über Seitenleiste erstellen
  const handleNeuerTisch = useCallback(async (vorlage: typeof TISCH_VORLAGEN[0]) => {
    const maxNummer = tische.length > 0 ? Math.max(...tische.map(t => t.nummer)) : 0;
    // Platzierung: zufällig im sichtbaren Bereich
    const x = snap(100 + Math.random() * 400);
    const y = snap(100 + Math.random() * 300);
    await tischErstellen({
      nummer: maxNummer + 1,
      kapazitaet: vorlage.kap,
      form: vorlage.form,
      pos_x: x,
      pos_y: y,
      breite: vorlage.breite,
      hoehe: vorlage.hoehe,
      bereich_id: aktiverBereich,
    });
  }, [tische, tischErstellen, aktiverBereich]);

  // QR-URL Helper
  function qrUrl(tisch: Tisch): string {
    return tisch.qr_url || `${window.location.origin}/bestellen-pro/${tisch.restaurant_id}/${tisch.id}`;
  }

  async function linkKopieren(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  }

  function qrDrucken() {
    if (!druckRef.current) return;
    const fenster = window.open('', '_blank');
    if (!fenster) return;
    fenster.document.write(`
      <html><head><title>QR-Codes drucken</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #fff; }
        .qr-seite {
          width: 210mm;
          height: 297mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          page-break-after: always;
          padding: 20mm;
        }
        .qr-seite:last-child { page-break-after: avoid; }
        .qr-seite h3 { font-size: 32px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; }
        .qr-seite p { font-size: 13px; color: #6b7280; word-break: break-all; text-align: center; max-width: 140mm; }
        .qr-seite svg, .qr-seite img, .qr-seite canvas {
          width: 140mm !important;
          height: 140mm !important;
        }
        @media print {
          .qr-seite { width: 100vw; height: 100vh; padding: 15mm; }
        }
      </style></head><body>
      ${druckRef.current.innerHTML}
      <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    fenster.document.close();
  }

  // ─── Tisch auf Canvas zeichnen ───────────────────────────────────────────

  function renderTisch(tisch: Tisch) {
    const tischRes = reservierungenProTisch.get(tisch.id);

    // ─── Zeitbasierte Reservierungs-Logik ──────────────────────────────────
    // bestaetigt = Gast ist da → bleibt sichtbar bis jemand "Abschließen" klickt
    // ausstehend = zeigen im 2h-Fenster vor Beginn
    const baldeRes = !editModus && tischRes
      ? tischRes.filter(r => {
          if (r.status === 'bestaetigt') return true; // bleibt am Tisch bis abgeschlossen
          const diff = minutenBis(r, jetzt);
          const verweildauer = r.verweilzeit_min || 90;
          return diff <= 120 && diff > -(verweildauer);
        }).sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
      : [];
    const hatBaldeRes = baldeRes.length > 0;

    // Farb-Logik: Zeitbasiert — Dark-Theme (DRVN)
    let fill = STATUS_FILL[tisch.status];
    let stroke = STATUS_STROKE[tisch.status];

    if (hatBaldeRes && tisch.status === 'frei') {
      const naechste = baldeRes[0];
      const minBis = minutenBis(naechste, jetzt);

      if (minBis <= 0) {
        // Startzeit vorbei, Gast noch nicht da → Orange (überfällig)
        fill = 'rgba(249, 115, 22, 0.18)';
        stroke = '#f97316';
      } else if (minBis <= 60) {
        // Innerhalb 1 Stunde → kräftiges Cyan
        fill = 'rgba(6, 182, 212, 0.22)';
        stroke = '#06b6d4';
      } else {
        // 1–2 Stunden → leichtes Cyan
        fill = 'rgba(6, 182, 212, 0.10)';
        stroke = 'rgba(6, 182, 212, 0.6)';
      }
    }

    // Select-to-Assign Highlight (überschreibt Reservierungs-Farben)
    const ausgewRes = ausgewaehlteRes ? offeneReservierungen.find(r => r.id === ausgewaehlteRes) : null;
    const istPassend = !editModus && ausgewRes && tisch.status === 'frei'
      && (tisch.kapazitaet == null || tisch.kapazitaet >= ausgewRes.personen);
    const istZuKlein = !editModus && ausgewRes && tisch.status === 'frei'
      && tisch.kapazitaet != null && tisch.kapazitaet < ausgewRes.personen;

    if (istPassend) {
      fill = 'rgba(59, 130, 246, 0.25)';
      stroke = '#3b82f6';
    } else if (istZuKlein) {
      fill = 'rgba(245, 158, 11, 0.18)';
      stroke = '#f59e0b';
    }

    // ─── Stuhl-Positionen berechnen (Resmio-Look) ───────────────────────────
    const stuhlRadius = 5;
    const stuhlAbstand = 7;
    const kap = tisch.kapazitaet || 0;
    const stuehle: Array<{ x: number; y: number }> = [];

    if (tisch.form === 'rund') {
      const r = Math.min(tisch.breite, tisch.hoehe) / 2 + stuhlAbstand + stuhlRadius;
      const cx = tisch.breite / 2, cy = tisch.hoehe / 2;
      for (let i = 0; i < kap; i++) {
        const winkel = (2 * Math.PI * i) / kap - Math.PI / 2;
        stuehle.push({ x: cx + r * Math.cos(winkel), y: cy + r * Math.sin(winkel) });
      }
    } else if (tisch.form === 'bar') {
      // Bar/Theke: nur eine Reihe oben
      for (let i = 0; i < kap; i++) {
        const x = (tisch.breite / (kap + 1)) * (i + 1);
        stuehle.push({ x, y: -(stuhlAbstand + stuhlRadius) });
      }
    } else {
      // Quadrat / Rechteck: auf 4 Kanten verteilen
      const oben = Math.ceil(kap / 4);
      const unten = Math.ceil(kap / 4);
      const seitlich = Math.max(0, kap - oben - unten);
      const links = Math.ceil(seitlich / 2);
      const rechts = seitlich - links;

      for (let i = 0; i < oben; i++) {
        const x = (tisch.breite / (oben + 1)) * (i + 1);
        stuehle.push({ x, y: -(stuhlAbstand + stuhlRadius) });
      }
      for (let i = 0; i < unten; i++) {
        const x = (tisch.breite / (unten + 1)) * (i + 1);
        stuehle.push({ x, y: tisch.hoehe + stuhlAbstand + stuhlRadius });
      }
      for (let i = 0; i < links; i++) {
        const y = (tisch.hoehe / (links + 1)) * (i + 1);
        stuehle.push({ x: -(stuhlAbstand + stuhlRadius), y });
      }
      for (let i = 0; i < rechts; i++) {
        const y = (tisch.hoehe / (rechts + 1)) * (i + 1);
        stuehle.push({ x: tisch.breite + stuhlAbstand + stuhlRadius, y });
      }
    }

    const istGewaehlt = ausgewaehlt === tisch.id;
    const draggable = editModus && istAdmin;

    return (
      <Group
        key={tisch.id}
        id={`tisch-${tisch.id}`}
        x={tisch.pos_x}
        y={tisch.pos_y}
        rotation={tisch.rotation}
        draggable={draggable}
        onClick={() => {
          if (editModus && istAdmin) {
            // Edit-Modus: Tisch selektieren (für Drag/Resize)
            setAusgewaehlt(tisch.id);
          }
          // Immer: Verwaltungs-Panel öffnen (außer wenn Select-to-Assign aktiv)
          if (!editModus && ausgewaehlteRes && tisch.status === 'frei') {
            tischZuweisen(ausgewaehlteRes, tisch.id);
            setAusgewaehlteRes(null);
          } else {
            setZuweisungTisch(tisch);
          }
        }}
        onDblClick={() => handleTischDoppelklick(tisch)}
        onDragEnd={(e) => handleDragEnd(tisch, e)}
        onTransformEnd={(e) => handleTransformEnd(tisch, e)}
        dragBoundFunc={(pos) => ({
          x: snap(Math.max(0, Math.min(pos.x, CANVAS_W - tisch.breite))),
          y: snap(Math.max(0, Math.min(pos.y, CANVAS_H - tisch.hoehe))),
        })}
      >
        {/* Stühle (kleine Kreise rund um Tisch) */}
        {stuehle.map((s, i) => (
          <Circle
            key={`stuhl-${i}`}
            x={s.x}
            y={s.y}
            radius={stuhlRadius}
            fill={STUHL_COLOR}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={0.5}
            listening={false}
          />
        ))}

        {/* Tisch-Form */}
        {tisch.form === 'rund' ? (
          <Circle
            x={tisch.breite / 2}
            y={tisch.hoehe / 2}
            radius={Math.min(tisch.breite, tisch.hoehe) / 2}
            fill={fill}
            stroke={istGewaehlt ? '#3b82f6' : stroke}
            strokeWidth={istGewaehlt ? 3 : 1.5}
            shadowColor="rgba(0,0,0,0.4)"
            shadowBlur={istGewaehlt ? 12 : 6}
            shadowOffsetY={2}
          />
        ) : (
          <Rect
            width={tisch.breite}
            height={tisch.hoehe}
            fill={fill}
            stroke={istGewaehlt ? '#3b82f6' : stroke}
            strokeWidth={istGewaehlt ? 3 : 1.5}
            cornerRadius={tisch.form === 'bar' ? 4 : 6}
            shadowColor="rgba(0,0,0,0.4)"
            shadowBlur={istGewaehlt ? 12 : 6}
            shadowOffsetY={2}
          />
        )}

        {/* Tischnummer */}
        <Text
          x={0}
          y={tisch.hoehe / 2 - 14}
          width={tisch.breite}
          align="center"
          text={`T${tisch.nummer}`}
          fontSize={14}
          fontStyle="bold"
          fill="#e2e8f0"
        />

        {/* Kapazität */}
        <Text
          x={0}
          y={tisch.hoehe / 2 + 2}
          width={tisch.breite}
          align="center"
          text={tisch.kapazitaet ? `${tisch.kapazitaet}P` : ''}
          fontSize={10}
          fill="#94a3b8"
        />

        {/* Resmio-Style Live-Badge oben rechts (Uhrzeit oder Countdown) */}
        {!editModus && baldeRes.length > 0 && !istPassend && !istZuKlein && (() => {
          const naechste = baldeRes[0];
          const minBis = minutenBis(naechste, jetzt);
          const uhrzeit = new Date(naechste.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

          // Badge-Inhalt: bei <60min Countdown, sonst Uhrzeit
          let badgeText = uhrzeit;
          if (minBis <= 0) badgeText = 'JETZT';
          else if (minBis < 60) badgeText = `${Math.round(minBis)}m`;

          const badgeFill = minBis <= 0 ? '#f97316' : '#06b6d4';
          const badgeWidth = badgeText.length * 6 + 12;

          return (
            <Group x={tisch.breite - badgeWidth + 4} y={-8}>
              <Rect width={badgeWidth} height={16} cornerRadius={3} fill={badgeFill} shadowColor="rgba(0,0,0,0.5)" shadowBlur={3} shadowOffsetY={1} />
              <Text x={0} y={3} width={badgeWidth} align="center" text={badgeText} fontSize={10} fontStyle="bold" fill="#ffffff" />
            </Group>
          );
        })()}

        {/* Reservierungs-Info unter dem Tisch */}
        {!editModus && (() => {
          // Select-to-Assign Hinweise
          if (istPassend) {
            return (
              <Text x={0} y={tisch.hoehe + 8} width={tisch.breite} align="center"
                text="✓ Passt" fontSize={10} fill="#3b82f6" fontStyle="bold" />
            );
          }
          if (istZuKlein) {
            return (
              <Text x={0} y={tisch.hoehe + 8} width={tisch.breite} align="center"
                text={`Nur ${tisch.kapazitaet}P`} fontSize={9} fill="#f59e0b" />
            );
          }

          if (baldeRes.length === 0) return null;

          const naechste = baldeRes[0];
          const name = naechste.gast_name.length > 10 ? naechste.gast_name.slice(0, 9) + '…' : naechste.gast_name;
          const minBis = minutenBis(naechste, jetzt);
          const farbe = minBis <= 0 ? '#fb923c' : '#67e8f9';

          return (
            <>
              <Text x={0} y={tisch.hoehe + 8} width={tisch.breite} align="center"
                text={name} fontSize={10} fill={farbe} fontStyle="bold" />
              <Text x={0} y={tisch.hoehe + 21} width={tisch.breite} align="center"
                text={`${naechste.personen}P${baldeRes.length > 1 ? ` · +${baldeRes.length - 1}` : ''}`} fontSize={9} fill="#94a3b8" />
            </>
          );
        })()}
      </Group>
    );
  }

  // ─── Deko-Element auf Canvas zeichnen ───────────────────────────────────

  function renderDeko(deko: Dekoration) {
    const istGewaehlt = ausgewaehlteDeko === deko.id;
    const draggable = editModus && istAdmin;

    // Stilvorgaben pro Typ — DRVN-konform (gedeckte Slate-Töne)
    const styleByType: Record<DekoTyp, { fill: string; stroke: string; corner: number }> = {
      pflanze:        { fill: 'rgba(34, 197, 94, 0.18)',  stroke: 'rgba(34, 197, 94, 0.55)',  corner: 99 }, // grün-Kreis
      theke:          { fill: 'rgba(217, 119, 6, 0.20)',  stroke: 'rgba(217, 119, 6, 0.7)',   corner: 4 },  // amber, holzig
      eingang:        { fill: 'rgba(56, 189, 248, 0.18)', stroke: 'rgba(56, 189, 248, 0.7)',  corner: 2 },  // sky
      servicestation: { fill: 'rgba(168, 85, 247, 0.18)', stroke: 'rgba(168, 85, 247, 0.6)',  corner: 4 },  // purple
      wand:           { fill: 'rgba(100, 116, 139, 0.5)', stroke: 'rgba(100, 116, 139, 0.85)', corner: 0 }, // slate-500
      tuer:           { fill: 'rgba(100, 116, 139, 0.0)', stroke: 'rgba(56, 189, 248, 0.85)', corner: 0 }, // dashed-look (wir zeichnen Linie)
    };
    const s = styleByType[deko.typ];

    return (
      <Group
        key={deko.id}
        id={`deko-${deko.id}`}
        x={deko.pos_x}
        y={deko.pos_y}
        rotation={deko.rotation}
        draggable={draggable}
        onClick={() => {
          if (editModus && istAdmin) setAusgewaehlteDeko(deko.id);
        }}
        onDragEnd={(e) => {
          const x = snap(e.target.x());
          const y = snap(e.target.y());
          dekoAktualisieren(deko.id, { pos_x: x, pos_y: y });
        }}
        listening={editModus && istAdmin}
      >
        {deko.typ === 'pflanze' ? (
          // Pflanze als Kreis mit "Blatt"-Pattern
          <Circle
            x={deko.breite / 2}
            y={deko.hoehe / 2}
            radius={Math.min(deko.breite, deko.hoehe) / 2}
            fill={s.fill}
            stroke={istGewaehlt ? '#3b82f6' : s.stroke}
            strokeWidth={istGewaehlt ? 2.5 : 1.5}
            dash={[2, 2]}
          />
        ) : deko.typ === 'tuer' ? (
          // Tür als gestrichelte Linie
          <Line
            points={[0, deko.hoehe / 2, deko.breite, deko.hoehe / 2]}
            stroke={istGewaehlt ? '#3b82f6' : s.stroke}
            strokeWidth={2}
            dash={[6, 4]}
          />
        ) : (
          <Rect
            width={deko.breite}
            height={deko.hoehe}
            fill={s.fill}
            stroke={istGewaehlt ? '#3b82f6' : s.stroke}
            strokeWidth={istGewaehlt ? 2.5 : 1.2}
            cornerRadius={s.corner}
          />
        )}

        {/* Optionales Label */}
        {deko.label && (
          <Text
            x={0}
            y={deko.hoehe / 2 - 6}
            width={deko.breite}
            align="center"
            text={deko.label}
            fontSize={10}
            fontStyle="bold"
            fill="#cbd5e1"
            listening={false}
          />
        )}
      </Group>
    );
  }

  // ─── Grid-Linien ─────────────────────────────────────────────────────────

  function renderGrid() {
    const lines: React.ReactNode[] = [];
    for (let x = 0; x <= CANVAS_W; x += GRID_SIZE) {
      lines.push(
        <Line key={`v${x}`} points={[x, 0, x, CANVAS_H]} stroke="#f3f4f6" strokeWidth={1} />
      );
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_SIZE) {
      lines.push(
        <Line key={`h${y}`} points={[0, y, CANVAS_W, y]} stroke="#f3f4f6" strokeWidth={1} />
      );
    }
    return lines;
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (laden) {
    return (
      <div className="animate-fade-in-up">
        <Topbar titel="Tischplan" />
        <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Tischplan"
        aktion={
          <div className="flex gap-2 items-center">
            {/* Live-Uhr + 'Auf jetzt wechseln' */}
            {ansicht === 'editor' && !editModus && (
              <button
                onClick={() => setScrollAufJetztTick(t => t + 1)}
                title="Liste auf aktuelle Zeit scrollen"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="tabular-nums">{new Date(jetzt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="hidden sm:inline opacity-70">Auf jetzt</span>
              </button>
            )}
            {/* Ansicht: Grundriss / Liste */}
            <div className="flex bg-gray-100 dark:bg-white/10 rounded-xl p-0.5">
              <button
                onClick={() => setAnsicht('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  ansicht === 'editor' ? 'bg-white dark:bg-white/20 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                Grundriss
              </button>
              <button
                onClick={() => setAnsicht('liste')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  ansicht === 'liste' ? 'bg-white dark:bg-white/20 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                Liste
              </button>
            </div>
            {tische.length > 0 && (
              <button onClick={() => setAlleDrucken(true)} className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                QR-Codes
              </button>
            )}
            {/* Admin: Bearbeiten / Fertig */}
            {istAdmin && (
              editModus ? (
                <button
                  onClick={() => { setEditModus(false); setAusgewaehlt(null); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Fertig
                </button>
              ) : (
                <button
                  onClick={() => setEditModus(true)}
                  className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Bearbeiten
                </button>
              )
            )}
          </div>
        }
      />

      {/* Status-Zusammenfassung */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {(Object.keys(anzahl) as TischStatus[]).filter(s => anzahl[s] > 0).map((status) => (
          <div key={status} className={`px-3 py-1.5 rounded-full text-xs font-medium ${TISCH_STATUS_FARBE[status]}`}>
            {TISCH_STATUS_LABEL[status]}: {anzahl[status]}
          </div>
        ))}
        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">
          {gefilterteTische.length} Tische
        </div>
        {aktiveReservierungen.length > 0 && (
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">
            {aktiveReservierungen.length} Res. heute
            {offeneReservierungen.length > 0 && (
              <span className="ml-1 text-orange-600 dark:text-orange-400">· {offeneReservierungen.length} ohne Tisch</span>
            )}
          </div>
        )}
        {editModus && (
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
            Bearbeitungs-Modus
          </div>
        )}
      </div>

      {/* ═══════════ GRUNDRISS-ANSICHT ═══════════ */}
      {ansicht === 'editor' && (
        <div className={`flex gap-4 ${editModus ? 'h-[calc(100vh-240px)]' : 'h-[calc(100vh-200px)]'}`}>

          {/* RESERVIERUNGS-TIMELINE — nur im Live-Modus, links neben Canvas */}
          {!editModus && (
            <div className="w-[340px] shrink-0 bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.07] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">Reservierungen heute</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{aktiveReservierungen.length} aktiv</p>
                </div>
                {offeneReservierungen.length > 0 && (
                  <span className="text-[10px] px-2 py-1 rounded-md bg-orange-500/15 text-orange-600 dark:text-orange-400 font-medium">
                    {offeneReservierungen.length} ohne Tisch
                  </span>
                )}
              </div>
              <ReservierungsTimeline
                reservierungen={aktiveReservierungen}
                tische={tische}
                jetzt={jetzt}
                ausgewaehlteRes={ausgewaehlteRes}
                onResAuswaehlen={setAusgewaehlteRes}
                onTagsBearbeiten={setTagsBearbeitenRes}
                scrollAufJetzt={scrollAufJetztTick}
              />
            </div>
          )}

          {/* SIDEBAR — nur im Bearbeitungs-Modus (Admin) */}
          {editModus && istAdmin && (
            <div className="w-56 shrink-0 bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-4 overflow-y-auto flex flex-col gap-5">

              {/* Hinweis: Legacy-Tische ohne Bereich */}
              {tischeOhneBereich > 0 && aktiverBereich && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-orange-700 dark:text-orange-400 mb-1.5">
                    {tischeOhneBereich} Tisch{tischeOhneBereich === 1 ? '' : 'e'} ohne Bereich
                  </p>
                  <p className="text-[10px] text-orange-600/80 dark:text-orange-300/70 mb-2 leading-snug">
                    Diese Tische sind aktuell unsichtbar. Alle dem aktuellen Bereich „{bereiche.find(b => b.id === aktiverBereich)?.name}" zuweisen?
                  </p>
                  <button
                    onClick={async () => {
                      const ohneBereich = tische.filter(t => !t.bereich_id);
                      for (const t of ohneBereich) {
                        await tischAktualisieren(t.id, { bereich_id: aktiverBereich });
                      }
                    }}
                    className="w-full text-[10px] px-2 py-1.5 rounded bg-orange-500/20 text-orange-700 dark:text-orange-300 font-semibold hover:bg-orange-500/30"
                  >
                    Alle zuweisen
                  </button>
                </div>
              )}

              {/* Tisch hinzufügen */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Tisch hinzufügen</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {TISCH_VORLAGEN.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => handleNeuerTisch(v)}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all text-center group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {v.form === 'rund' ? (
                          <div className="rounded-full bg-green-100 dark:bg-green-500/15 border-2 border-green-400 group-hover:border-blue-400 transition-colors" style={{ width: 24, height: 24 }} />
                        ) : v.form === 'bar' ? (
                          <div className="rounded bg-green-100 dark:bg-green-500/15 border-2 border-green-400 group-hover:border-blue-400 transition-colors" style={{ width: 28, height: 14 }} />
                        ) : v.form === 'rechteck' ? (
                          <div className="rounded-md bg-green-100 dark:bg-green-500/15 border-2 border-green-400 group-hover:border-blue-400 transition-colors" style={{ width: 28, height: 18 }} />
                        ) : (
                          <div className="rounded-md bg-green-100 dark:bg-green-500/15 border-2 border-green-400 group-hover:border-blue-400 transition-colors" style={{ width: 22, height: 22 }} />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-slate-400 leading-tight">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deko hinzufügen */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Deko hinzufügen</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DEKO_VORLAGEN.map((v) => (
                    <button
                      key={v.typ}
                      onClick={() => dekoErstellen({
                        typ: v.typ,
                        breite: v.breite, hoehe: v.hoehe,
                        pos_x: snap(80 + Math.random() * 300),
                        pos_y: snap(80 + Math.random() * 300),
                        bereich_id: aktiverBereich,
                        label: ['eingang', 'theke', 'servicestation'].includes(v.typ) ? v.label : null,
                      })}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all text-center"
                      title={`${v.label} platzieren`}
                    >
                      <span className="text-base leading-none">{v.icon}</span>
                      <span className="text-[10px] text-gray-600 dark:text-slate-400 leading-tight">{v.label}</span>
                    </button>
                  ))}
                </div>
                {dekorationen.length > 0 && (
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2">
                    {dekorationen.length} Element{dekorationen.length === 1 ? '' : 'e'} platziert
                  </p>
                )}
              </div>

              {/* Selektierte Deko: Aktionen */}
              {ausgewaehlteDeko && (() => {
                const deko = dekorationen.find(d => d.id === ausgewaehlteDeko);
                if (!deko) return null;
                return (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">
                      Deko: {deko.label || deko.typ}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder="Label (z.B. 'Eingang')"
                        defaultValue={deko.label ?? ''}
                        onBlur={(e) => dekoAktualisieren(deko.id, { label: e.target.value.trim() || null })}
                        className="text-xs px-2.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-slate-300"
                      />
                      <div className="flex items-center gap-2">
                        <button onClick={() => dekoAktualisieren(deko.id, { rotation: (deko.rotation - 15) % 360 })} className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10">↺ -15°</button>
                        <button onClick={() => dekoAktualisieren(deko.id, { rotation: (deko.rotation + 15) % 360 })} className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10">↻ +15°</button>
                      </div>
                      <button
                        onClick={() => { dekoLoeschen(deko.id); setAusgewaehlteDeko(null); }}
                        className="text-xs px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-left flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Deko löschen
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Bereiche verwalten */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Bereiche</p>
                <div className="flex flex-col gap-1">
                  {bereiche.map((b) => (
                    <div key={b.id} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5">
                      <span className="flex-1 text-xs text-gray-700 dark:text-slate-300 truncate">{b.name}</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 mr-1">{tische.filter(t => t.bereich_id === b.id).length}</span>
                      <button onClick={() => bereichLoeschen(b.id)} className="text-gray-300 dark:text-slate-600 hover:text-red-400 transition-colors p-0.5 rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-1 mt-1">
                    <input
                      value={neuerBereichName}
                      onChange={(e) => setNeuerBereichName(e.target.value)}
                      placeholder="+ Neuer Bereich"
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-slate-300 placeholder:text-gray-300 dark:placeholder:text-slate-600"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && neuerBereichName.trim()) {
                          bereichErstellen(neuerBereichName.trim());
                          setNeuerBereichName('');
                        }
                      }}
                    />
                    <button
                      onClick={() => { if (neuerBereichName.trim()) { bereichErstellen(neuerBereichName.trim()); setNeuerBereichName(''); } }}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Zoom */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Zoom</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400 text-sm font-bold flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20">−</button>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium flex-1 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400 text-sm font-bold flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20">+</button>
                </div>
              </div>

              {/* Selektierter Tisch: Aktionen */}
              {ausgewaehlt && (() => {
                const tisch = tische.find(t => t.id === ausgewaehlt);
                if (!tisch) return null;
                return (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Tisch {tisch.nummer}</p>
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => setDetailTisch(tisch)} className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Details bearbeiten
                      </button>
                      <button onClick={() => setQrTisch(tisch)} className="text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16.01 20h.99m-4.99-4h-.01M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z" /></svg>
                        QR-Code
                      </button>
                      <select
                        value={tisch.bereich_id ?? ''}
                        onChange={(e) => tischAktualisieren(tisch.id, { bereich_id: e.target.value || null })}
                        className="text-xs px-2.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-slate-300"
                      >
                        <option value="">Kein Bereich</option>
                        {bereiche.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <button onClick={() => setLoeschenId(tisch.id)} className="text-xs px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-left flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Tisch löschen
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Hinweis unten */}
              <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/10">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-relaxed">
                  Tische ziehen zum Platzieren. Doppelklick zum Bearbeiten. Klick auf "Fertig" speichert automatisch.
                </p>
              </div>
            </div>
          )}

          {/* Canvas-Bereich (mit Bereich-Tabs darüber) */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">

            {/* Bereich-Tabs (Resmio-Style: Gastraum / Terrasse / ...) */}
            {bereiche.length > 0 && (
              <div className="flex gap-1 overflow-x-auto pb-1 shrink-0">
                {bereiche.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setAktiverBereich(b.id)}
                    className={`px-4 py-2 rounded-t-xl text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      aktiverBereich === b.id
                        ? 'border-cyan-400 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-500/5'
                        : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {b.name} <span className="text-xs opacity-60 ml-1">({tische.filter(t => t.bereich_id === b.id).length})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Canvas */}
            <div
              ref={canvasContainerRef}
              className="flex-1 bg-white dark:bg-slate-950/40 dark:border dark:border-white/[0.07] rounded-2xl shadow-sm overflow-hidden relative"
              style={!editModus ? {
                // DRVN Floor-Background: feines Punkt-Raster + leichter Vignette
                backgroundImage: `
                  radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.05), transparent 60%),
                  radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: 'auto, 22px 22px',
                backgroundPosition: 'center top, 0 0',
              } : undefined}
            >

            {/* Select-to-Assign Banner */}
            {ausgewaehlteRes && (() => {
              const res = offeneReservierungen.find(r => r.id === ausgewaehlteRes);
              if (!res) return null;
              const uhrzeit = new Date(res.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
              return (
                <div className="absolute top-0 left-0 right-0 z-20 bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{res.gast_name} · {uhrzeit} · {res.personen} Personen</p>
                      <p className="text-[11px] text-indigo-200">Klicke auf einen freien Tisch zum Zuweisen</p>
                    </div>
                  </div>
                  <button onClick={() => setAusgewaehlteRes(null)} className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
                    Abbrechen
                  </button>
                </div>
              );
            })()}

            {/* Empty State 1: Noch kein Bereich angelegt */}
            {bereiche.length === 0 && istAdmin ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-base text-gray-700 dark:text-slate-200 font-semibold">Noch kein Bereich angelegt</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
                  Jeder Bereich (z.B. <span className="text-cyan-500">Innenraum</span>, <span className="text-cyan-500">Terrasse</span>, <span className="text-cyan-500">Bar</span>) hat seinen eigenen Tischplan.
                </p>
                {!editModus && (
                  <button onClick={() => setEditModus(true)} className="mt-2 text-sm bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                    Ersten Bereich anlegen
                  </button>
                )}
                {editModus && <p className="text-xs text-gray-400 dark:text-slate-500">Lege links unten in der Sidebar deinen ersten Bereich an</p>}
              </div>
            ) : /* Empty State 2: Bereich aktiv, aber keine Tische darin */
            aktiverBereich && gefilterteTische.length === 0 && istAdmin ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                  Keine Tische in „{bereiche.find(b => b.id === aktiverBereich)?.name}"
                </p>
                {!editModus && (
                  <button onClick={() => setEditModus(true)} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline pointer-events-auto">
                    Bearbeiten → Tische platzieren
                  </button>
                )}
                {editModus && <p className="text-xs text-gray-400 dark:text-slate-500">Wähle links eine Vorlage, um Tische in diesem Bereich zu platzieren</p>}
              </div>
            ) : (
              <Stage
                ref={stageRef}
                width={canvasSize.w}
                height={canvasSize.h}
                scaleX={zoom}
                scaleY={zoom}
                onClick={handleStageClick}
              >
                {editModus && (
                  <Layer listening={false}>
                    {renderGrid()}
                  </Layer>
                )}
                {/* Deko-Layer (unter Tischen) */}
                <Layer>
                  {gefilterteDeko.map(renderDeko)}
                </Layer>
                <Layer>
                  {gefilterteTische.map(renderTisch)}
                  {editModus && istAdmin && (
                    <Transformer
                      ref={transformerRef}
                      rotateEnabled={true}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 40 || newBox.height < 40) return oldBox;
                        return newBox;
                      }}
                    />
                  )}
                </Layer>
              </Stage>
            )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ LISTEN-ANSICHT ═══════════ */}
      {ansicht === 'liste' && (
        <>
          {tische.length === 0 && (
            <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Noch keine Tische vorhanden.</p>
              {istAdmin && (
                <button onClick={() => setAnsicht('editor')} className="text-sm text-orange-600 font-medium hover:underline">
                  Zum Grundriss-Editor wechseln
                </button>
              )}
            </div>
          )}
          {/* Offene Reservierungen — Banner über der Liste */}
          {offeneReservierungen.length > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{offeneReservierungen.length}</span>
                </div>
                <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Reservierungen ohne Tisch</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {offeneReservierungen.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()).map((r) => {
                  const uhrzeit = new Date(r.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <span key={r.id} className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-white/10 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 text-gray-700 dark:text-slate-300">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{uhrzeit}</span>
                      <span>{r.gast_name}</span>
                      <span className="text-gray-400 dark:text-slate-500">·</span>
                      <span>{r.personen}P</span>
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/60 mt-2">Freien Tisch anklicken um zuzuweisen</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tische.map((t) => {
              const tischRes = reservierungenProTisch.get(t.id);
              // Zeitbasiert: Nur baldige Reservierungen für visuelle Anzeige
              const baldeResListe = tischRes
                ? tischRes.filter(r => {
                    const diff = minutenBis(r, jetzt);
                    return diff <= 120 && diff > -(r.verweilzeit_min || 90);
                  }).sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
                : [];
              const hatBaldeRes = baldeResListe.length > 0;
              const naechsteRes = baldeResListe[0];
              const naechsteMinBis = naechsteRes ? minutenBis(naechsteRes, jetzt) : Infinity;
              const istUeberfaellig = naechsteMinBis <= 0 && t.status === 'frei';

              // Linker Rand: zeitbasiert
              const borderLeft = istUeberfaellig
                ? 'border-l-4 border-l-orange-400'
                : hatBaldeRes && t.status === 'frei'
                ? 'border-l-4 border-l-indigo-400'
                : t.status === 'besetzt'
                ? 'border-l-4 border-l-red-400'
                : t.status === 'wartet_auf_zahlung'
                ? 'border-l-4 border-l-yellow-400'
                : 'border-l-4 border-l-green-400';

              return (
                <div
                  key={t.id}
                  className={`bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${borderLeft}`}
                  onClick={() => {
                    if (istAdmin || rolle === 'kellner') {
                      setZuweisungTisch(t);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-800 dark:text-slate-200">#{t.nummer}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      istUeberfaellig
                        ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400'
                        : hatBaldeRes && t.status === 'frei'
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                        : TISCH_STATUS_FARBE[t.status]
                    }`}>
                      {istUeberfaellig ? 'Überfällig' : hatBaldeRes && t.status === 'frei'
                        ? naechsteMinBis <= 60 ? `Res. in ${Math.round(naechsteMinBis)} Min` : 'Reserviert'
                        : TISCH_STATUS_LABEL[t.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {t.kapazitaet ? `${t.kapazitaet} Plätze` : 'Kapazität offen'}
                    {' · '}
                    {t.form === 'rund' ? 'Rund' : t.form === 'quadrat' ? 'Quadrat' : t.form === 'bar' ? 'Bar' : 'Rechteck'}
                  </p>
                  {/* Zeitbasierte Reservierungsinfo in der Liste */}
                  {hatBaldeRes && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 space-y-1">
                      {baldeResListe.map((r) => {
                        const uhrzeit = new Date(r.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                        const mBis = minutenBis(r, jetzt);
                        return (
                          <div key={r.id} className="flex items-center justify-between">
                            <p className={`text-[11px] font-medium ${mBis <= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                              {uhrzeit} — {r.gast_name}
                            </p>
                            <span className={`text-[10px] ${mBis <= 0 ? 'text-orange-500 font-medium' : 'text-gray-400 dark:text-slate-500'}`}>
                              {mBis <= 0 ? 'Jetzt!' : mBis <= 60 ? `in ${Math.round(mBis)}m` : `${r.personen}P`}
                            </span>
                          </div>
                        );
                      })}
                      {/* Gast ist da-Button in der Listenansicht */}
                      {t.status === 'frei' && naechsteRes && naechsteMinBis <= 30 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); gastIstDa(naechsteRes); }}
                          className="w-full text-[10px] px-2 py-1.5 mt-1 rounded-lg bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 font-semibold hover:bg-green-200 dark:hover:bg-green-500/25 transition-colors"
                        >
                          ✓ Gast ist da
                        </button>
                      )}
                    </div>
                  )}
                  {istAdmin && (
                    <div className="flex gap-1.5 mt-3 pt-2 border-t border-gray-50 dark:border-white/5">
                      <button onClick={(e) => { e.stopPropagation(); setDetailTisch(t); }} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-100">Bearbeiten</button>
                      <button onClick={(e) => { e.stopPropagation(); setQrTisch(t); }} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-100">QR</button>
                      <button onClick={(e) => { e.stopPropagation(); setLoeschenId(t.id); }} className="text-[10px] px-2 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100">Löschen</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══════════ MODALS ═══════════ */}

      {/* Tisch-Detail bearbeiten (Doppelklick im Editor) */}
      <Modal offen={!!detailTisch} onSchliessen={() => setDetailTisch(null)} titel={detailTisch ? `Tisch ${detailTisch.nummer} bearbeiten` : ''}>
        {detailTisch && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Tischnummer</label>
              <input
                type="number"
                value={detailTisch.nummer}
                onChange={(e) => setDetailTisch({ ...detailTisch, nummer: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Kapazität</label>
              <input
                type="number"
                value={detailTisch.kapazitaet ?? ''}
                onChange={(e) => setDetailTisch({ ...detailTisch, kapazitaet: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Form</label>
              <select
                value={detailTisch.form}
                onChange={(e) => setDetailTisch({ ...detailTisch, form: e.target.value as TischForm })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm dark:text-slate-200"
              >
                <option value="rechteck">Rechteck</option>
                <option value="quadrat">Quadrat</option>
                <option value="rund">Rund</option>
                <option value="bar">Bar/Theke</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 mb-1 block">Bereich</label>
              <select
                value={detailTisch.bereich_id ?? ''}
                onChange={(e) => setDetailTisch({ ...detailTisch, bereich_id: e.target.value || null })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm dark:text-slate-200"
              >
                <option value="">Kein Bereich</option>
                {bereiche.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  tischAktualisieren(detailTisch.id, {
                    nummer: detailTisch.nummer,
                    kapazitaet: detailTisch.kapazitaet,
                    form: detailTisch.form,
                    bereich_id: detailTisch.bereich_id,
                  });
                  setDetailTisch(null);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Speichern
              </button>
              <button onClick={() => setDetailTisch(null)} className="text-gray-500 dark:text-slate-400 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* QR-Code Modal */}
      <Modal offen={!!qrTisch} onSchliessen={() => { setQrTisch(null); setKopiert(false); }} titel={`QR-Code – Tisch ${qrTisch?.nummer ?? ''}`}>
        {qrTisch && (
          <>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">Gäste scannen diesen Code und können direkt bestellen.</p>
            <div className="flex justify-center mb-4">
              <div className="bg-white dark:bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-200">
                <QRCodeSVG value={qrUrl(qrTisch)} size={200} level="H" />
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 dark:text-slate-400 break-all font-mono">{qrUrl(qrTisch)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => linkKopieren(qrUrl(qrTisch))} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                {kopiert ? 'Kopiert!' : 'Link kopieren'}
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Lösch-Bestätigung */}
      <Modal offen={!!loeschenId} onSchliessen={() => setLoeschenId(null)} titel="Tisch löschen?">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Der Tisch wird unwiderruflich entfernt. Bestehende Bestellungen bleiben erhalten.</p>
        <div className="flex gap-2">
          <button onClick={async () => { if (loeschenId) { await tischLoeschen(loeschenId); setLoeschenId(null); setAusgewaehlt(null); } }} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Ja, löschen
          </button>
          <button onClick={() => setLoeschenId(null)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
        </div>
      </Modal>

      {/* Alle QR-Codes drucken */}
      <Modal offen={alleDrucken} onSchliessen={() => setAlleDrucken(false)} titel="Alle QR-Codes drucken">
        <p className="text-xs text-gray-400 mb-4">Vorschau aller {tische.length} Tisch-QR-Codes.</p>
        <div className="max-h-80 overflow-y-auto mb-4">
          <div className="grid grid-cols-2 gap-3">
            {tische.map((t) => (
              <div key={t.id} className="text-center border border-gray-100 rounded-xl p-3">
                <QRCodeSVG value={qrUrl(t)} size={100} level="H" />
                <p className="text-sm font-semibold mt-2">Tisch {t.nummer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={qrDrucken} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Alle drucken</button>
          <button onClick={() => setAlleDrucken(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">Schließen</button>
        </div>
      </Modal>

      {/* ═══════════ TISCH-VERWALTUNGS-MODAL ═══════════ */}
      <Modal
        offen={!!zuweisungTisch}
        onSchliessen={() => setZuweisungTisch(null)}
        titel={zuweisungTisch ? `Tisch ${zuweisungTisch.nummer} verwalten` : ''}
      >
        {zuweisungTisch && (() => {
          // Live-Lookup: aktuellen Tisch aus dem tische-Array holen (Status ändert sich)
          const liveTisch = tische.find(t => t.id === zuweisungTisch.id) ?? zuweisungTisch;
          const bestehende = reservierungenProTisch.get(liveTisch.id) ?? [];

          return (
            <div className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">
                  Status{liveTisch.kapazitaet ? ` · ${liveTisch.kapazitaet} Plätze` : ''}
                </p>
                <div className="flex gap-2">
                  {(['frei', 'besetzt', 'wartet_auf_zahlung'] as TischStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={async () => {
                        statusAendern(liveTisch.id, s);
                        // Bei "Zahlung": Reservierungen automatisch vom Tisch entfernen
                        // → Gast ist abgerechnet, Tisch wird danach wieder frei
                        if (s === 'wartet_auf_zahlung') {
                          for (const r of bestehende) {
                            await tischZuweisen(r.id, null);
                          }
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                        liveTisch.status === s
                          ? s === 'frei' ? 'bg-green-500 text-white'
                          : s === 'besetzt' ? 'bg-red-500 text-white'
                          : 'bg-yellow-400 text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/15'
                      }`}
                    >
                      {TISCH_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bereits zugewiesene Reservierungen */}
              {bestehende.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">
                    Zugewiesen ({bestehende.length})
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {bestehende.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()).map((r) => {
                      const uhrzeit = new Date(r.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                      const minBis = minutenBis(r, jetzt);
                      return (
                        <div key={r.id} className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">{r.gast_name}</span>
                              <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-2">{uhrzeit} · {r.personen}P</span>
                            </div>
                            {minBis <= 0
                              ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-500/15 text-orange-600 font-medium">Jetzt!</span>
                              : minBis <= 60
                              ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">in {Math.round(minBis)} Min</span>
                              : null
                            }
                          </div>
                          {r.anmerkung && <p className="text-[10px] text-gray-400 dark:text-slate-500 italic mb-1.5">{r.anmerkung}</p>}
                          <div className="flex gap-1.5">
                            {liveTisch.status === 'frei' && (
                              <button
                                onClick={() => { gastIstDa(r); setZuweisungTisch(null); }}
                                className="flex-1 text-[10px] px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 font-semibold hover:bg-green-200 transition-colors"
                              >
                                ✓ Gast ist da
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                await tischZuweisen(r.id, null);
                                setAusgewaehlteRes(r.id);
                                setZuweisungTisch(null);
                              }}
                              className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                            >
                              Umbuchen
                            </button>
                            <button
                              onClick={() => tischZuweisen(r.id, null)}
                              className="text-[10px] px-2 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 transition-colors"
                            >
                              Entfernen
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Offene Reservierungen hinzufügen */}
              <div className="pt-1 border-t border-gray-100 dark:border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">
                  Reservierung hinzufügen {offeneReservierungen.length === 0 ? '(keine offen)' : `(${offeneReservierungen.length} ohne Tisch)`}
                </p>
                {offeneReservierungen.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">Alle Reservierungen sind bereits zugewiesen.</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                    {offeneReservierungen
                      .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
                      .map((r) => {
                        const uhrzeit = new Date(r.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                        const passtNicht = liveTisch.kapazitaet != null && r.personen > liveTisch.kapazitaet;
                        return (
                          <button
                            key={r.id}
                            onClick={async () => {
                              await tischZuweisen(r.id, liveTisch.id);
                              setZuweisungTisch(null);
                            }}
                            className={`text-left p-2.5 rounded-xl border transition-colors ${
                              passtNicht
                                ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 hover:bg-amber-50'
                                : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-800 dark:text-slate-200">{r.gast_name}</span>
                              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{uhrzeit}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gray-500 dark:text-slate-400">{r.personen} Personen</span>
                              {r.anlass && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">{r.anlass}</span>}
                              {passtNicht && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400">
                                  {r.personen}P &gt; {liveTisch.kapazitaet}P
                                </span>
                              )}
                            </div>
                            {r.anmerkung && <p className="text-[10px] text-gray-400 italic mt-0.5">{r.anmerkung}</p>}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ═══════════ WARNUNG: TISCH HAT BALD RESERVIERUNG ═══════════ */}
      <Modal
        offen={!!warnungTisch}
        onSchliessen={() => setWarnungTisch(null)}
        titel="Achtung — Reservierung steht bevor!"
      >
        {warnungTisch && (
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                  Tisch {warnungTisch.tisch.nummer} hat bald eine Reservierung:
                </p>
              </div>
              {warnungTisch.reservierungen.map((r) => {
                const uhrzeit = new Date(r.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                const minBis = minutenBis(r, jetzt);
                return (
                  <div key={r.id} className="flex items-center justify-between mt-2 p-2 bg-white dark:bg-white/5 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{r.gast_name}</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{r.personen} Personen</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{uhrzeit}</p>
                      <p className="text-[10px] text-orange-500 dark:text-orange-400/70">in {Math.round(minBis)} Min</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Möchtest du diesen Tisch trotzdem jetzt belegen? Der Gast muss dann möglicherweise umgesetzt werden, wenn die Reservierung beginnt.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  statusAendern(warnungTisch.tisch.id, 'besetzt');
                  setWarnungTisch(null);
                }}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Trotzdem belegen
              </button>
              <button
                onClick={() => setWarnungTisch(null)}
                className="text-gray-500 dark:text-slate-400 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Versteckter Druckbereich — jeder Tisch bekommt eine eigene A4-Seite */}
      <div ref={druckRef} className="hidden">
        {tische.map((t) => (
          <div key={t.id} className="qr-seite">
            <QRCodeSVG value={qrUrl(t)} size={530} level="H" />
            <h3>Tisch {t.nummer}</h3>
            <p>Zum Bestellen QR-Code scannen</p>
          </div>
        ))}
      </div>

      {/* Tags bearbeiten Modal */}
      <TagsBearbeitenModal
        res={tagsBearbeitenRes}
        onSchliessen={() => setTagsBearbeitenRes(null)}
        onSpeichern={async (tags) => {
          if (!tagsBearbeitenRes) return;
          await resTagsAendern(tagsBearbeitenRes.id, tags);
          setTagsBearbeitenRes(null);
        }}
      />
    </div>
  );
}

// ─── Tags-Bearbeiten Modal ───────────────────────────────────────────────────

import { RESERVIERUNG_TAGS } from '../types';

function TagsBearbeitenModal({
  res,
  onSchliessen,
  onSpeichern,
}: {
  res: Reservierung | null;
  onSchliessen: () => void;
  onSpeichern: (tags: string[]) => Promise<void>;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Bei jedem Modal-Open die Tags aus der Reservierung übernehmen
  useEffect(() => {
    if (res) {
      setTags(res.tags ?? []);
      setCustomInput('');
    }
  }, [res]);

  if (!res) return null;

  const toggle = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const customHinzufuegen = () => {
    const t = customInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setCustomInput('');
    }
  };

  const uhrzeit = new Date(res.datum).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <Modal offen={!!res} onSchliessen={onSchliessen} titel={`Tags · ${res.gast_name} · ${uhrzeit}`}>
      <div className="space-y-4">
        {/* Vordefinierte Tags */}
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Vordefiniert</p>
          <div className="flex flex-wrap gap-1.5">
            {RESERVIERUNG_TAGS.map((tag) => {
              const aktiv = tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                    aktiv
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300'
                      : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:border-cyan-300 dark:hover:border-cyan-500/30'
                  }`}
                >
                  {aktiv && <span className="mr-1">✓</span>}{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom-Tag */}
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Eigener Tag</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); customHinzufuegen(); } }}
              placeholder="z.B. Hund erlaubt"
              maxLength={50}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
            <button
              onClick={customHinzufuegen}
              disabled={!customInput.trim() || tags.length >= 10}
              className="text-sm px-3 py-2 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-medium hover:bg-cyan-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hinzufügen
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{tags.length}/10 Tags</p>
        </div>

        {/* Aktive Tags */}
        {tags.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-2">Aktiv ({tags.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                  {t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Aktionen */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
          <button onClick={onSchliessen} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5">
            Abbrechen
          </button>
          <button
            onClick={() => onSpeichern(tags)}
            className="flex-1 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700"
          >
            Speichern
          </button>
        </div>
      </div>
    </Modal>
  );
}
