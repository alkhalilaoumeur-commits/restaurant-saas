import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Topbar from '../components/layout/Topbar';
import Modal from '../components/layout/Modal';
import TischKarte from '../components/tischplan/TischKarte';
import TischFormular from '../components/tischplan/TischFormular';
import { useTische } from '../hooks/useTische';
import { useAuthStore } from '../store/auth';
import { Tisch, TischStatus } from '../types';
import { TISCH_STATUS_LABEL, TISCH_STATUS_FARBE } from '../lib/utils';

export default function Tischplan() {
  const { tische, laden, statusAendern, tischErstellen, tischAktualisieren, tischLoeschen } = useTische();
  const rolle = useAuthStore((s) => s.mitarbeiter?.rolle);
  const istAdmin = rolle === 'admin';

  const [formularOffen, setFormularOffen] = useState(false);
  const [bearbeiteTisch, setBearbeiteTisch] = useState<Tisch | null>(null);
  const [qrTisch, setQrTisch] = useState<Tisch | null>(null);
  const [kopiert, setKopiert] = useState(false);
  const [loeschenId, setLoeschenId] = useState<string | null>(null);
  const [alleDrucken, setAlleDrucken] = useState(false);
  const druckRef = useRef<HTMLDivElement>(null);

  // Zusammenfassung
  const anzahl: Record<TischStatus, number> = { frei: 0, besetzt: 0, wartet_auf_zahlung: 0 };
  for (const t of tische) anzahl[t.status]++;

  function formularSchliessen() {
    setFormularOffen(false);
    setBearbeiteTisch(null);
  }

  function bearbeiten(tisch: Tisch) {
    setBearbeiteTisch(tisch);
    setFormularOffen(true);
  }

  function loeschenBestaetigen(id: string) {
    setLoeschenId(id);
  }

  async function loeschenAusfuehren() {
    if (!loeschenId) return;
    await tischLoeschen(loeschenId);
    setLoeschenId(null);
  }

  function qrUrl(tisch: Tisch): string {
    return tisch.qr_url || `${window.location.origin}/bestellen-pro/${tisch.restaurant_id}/${tisch.id}`;
  }

  async function linkKopieren(url: string) {
    await navigator.clipboard.writeText(url);
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
        body { font-family: sans-serif; margin: 0; padding: 20px; }
        .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .qr-karte { text-align: center; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; break-inside: avoid; }
        .qr-karte h3 { margin: 12px 0 4px; font-size: 18px; }
        .qr-karte p { margin: 0; font-size: 11px; color: #6b7280; word-break: break-all; }
        @media print { .qr-grid { grid-template-columns: repeat(3, 1fr); } }
      </style></head><body>
      ${druckRef.current.innerHTML}
      <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    fenster.document.close();
  }

  return (
    <div className="animate-fade-in-up">
      <Topbar
        titel="Tischplan"
        aktion={
          <div className="flex gap-2">
            {tische.length > 0 && (
              <button
                onClick={() => setAlleDrucken(true)}
                className="border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                QR-Codes drucken
              </button>
            )}
            {istAdmin && (
              <button
                onClick={() => { setBearbeiteTisch(null); setFormularOffen(true); }}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-700"
              >
                + Tisch
              </button>
            )}
          </div>
        }
      />

      {/* Status-Zusammenfassung */}
      <div className="flex gap-3 mb-6">
        {(Object.keys(anzahl) as TischStatus[]).map((status) => (
          <div key={status} className={`px-3 py-1.5 rounded-full text-xs font-medium ${TISCH_STATUS_FARBE[status]}`}>
            {TISCH_STATUS_LABEL[status]}: {anzahl[status]}
          </div>
        ))}
        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">
          Gesamt: {tische.length}
        </div>
      </div>

      {/* Tisch-Formular Modal */}
      <Modal
        offen={formularOffen}
        onSchliessen={formularSchliessen}
        titel={bearbeiteTisch ? 'Tisch bearbeiten' : 'Neuer Tisch'}
      >
        <TischFormular
          tisch={bearbeiteTisch ?? undefined}
          onSpeichern={(nummer, kapazitaet) => { tischErstellen(nummer, kapazitaet); formularSchliessen(); }}
          onAktualisieren={(id, felder) => { tischAktualisieren(id, felder); formularSchliessen(); }}
          onAbbrechen={formularSchliessen}
        />
      </Modal>

      {laden && <p className="text-sm text-gray-400 dark:text-slate-500">Wird geladen...</p>}

      {!laden && tische.length === 0 && (
        <div className="bg-white dark:bg-white/[0.04] dark:border dark:border-white/[0.07] rounded-2xl shadow-sm p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Noch keine Tische vorhanden.</p>
          {istAdmin && (
            <button
              onClick={() => setFormularOffen(true)}
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              Ersten Tisch anlegen
            </button>
          )}
        </div>
      )}

      {/* Tisch-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tische.map((t) => (
          <TischKarte
            key={t.id}
            tisch={t}
            istAdmin={istAdmin}
            onStatusWechsel={statusAendern}
            onBearbeiten={bearbeiten}
            onLoeschen={loeschenBestaetigen}
            onQrAnzeigen={setQrTisch}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">Tisch anklicken um Status zu wechseln</p>

      {/* QR-Code Modal */}
      <Modal
        offen={!!qrTisch}
        onSchliessen={() => { setQrTisch(null); setKopiert(false); }}
        titel={`QR-Code – Tisch ${qrTisch?.nummer ?? ''}`}
      >
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
              <button
                onClick={() => linkKopieren(qrUrl(qrTisch))}
                className="flex-1 bg-[#dc2626] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c52222] transition-colors"
              >
                {kopiert ? 'Kopiert!' : 'Link kopieren'}
              </button>
              <button
                onClick={() => {
                  const fenster = window.open('', '_blank');
                  if (!fenster) return;
                  const svgEl = document.querySelector('.qr-single-print svg');
                  fenster.document.write(`
                    <html><head><title>QR-Code Tisch ${qrTisch.nummer}</title>
                    <style>body{font-family:sans-serif;text-align:center;padding:40px;}h2{margin-bottom:8px;}p{color:#6b7280;font-size:12px;}</style></head>
                    <body><h2>Tisch ${qrTisch.nummer}</h2><p>Zum Bestellen QR-Code scannen</p><div style="margin:24px auto;">${svgEl?.outerHTML || ''}</div>
                    <p style="font-size:10px;word-break:break-all;">${qrUrl(qrTisch)}</p>
                    <script>window.onload=function(){window.print();window.close();}<\/script></body></html>
                  `);
                  fenster.document.close();
                }}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Drucken
              </button>
            </div>
            <div className="qr-single-print hidden">
              <QRCodeSVG value={qrUrl(qrTisch)} size={300} level="H" />
            </div>
          </>
        )}
      </Modal>

      {/* Lösch-Bestätigung Modal */}
      <Modal
        offen={!!loeschenId}
        onSchliessen={() => setLoeschenId(null)}
        titel="Tisch löschen?"
      >
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
          Der Tisch wird unwiderruflich entfernt. Bestehende Bestellungen bleiben erhalten.
        </p>
        <div className="flex gap-2">
          <button
            onClick={loeschenAusfuehren}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Ja, löschen
          </button>
          <button
            onClick={() => setLoeschenId(null)}
            className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </Modal>

      {/* Alle QR-Codes drucken Modal */}
      <Modal
        offen={alleDrucken}
        onSchliessen={() => setAlleDrucken(false)}
        titel="Alle QR-Codes drucken"
      >
        <p className="text-xs text-gray-400 mb-4">
          Vorschau aller {tische.length} Tisch-QR-Codes. Klicke auf „Drucken" um alle auf einmal auszudrucken.
        </p>
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
          <button
            onClick={qrDrucken}
            className="flex-1 bg-[#dc2626] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#c52222] transition-colors"
          >
            Alle drucken
          </button>
          <button
            onClick={() => setAlleDrucken(false)}
            className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Schließen
          </button>
        </div>
      </Modal>

      {/* Versteckter Druckbereich für Sammel-Druck */}
      <div ref={druckRef} className="hidden">
        <div className="qr-grid">
          {tische.map((t) => (
            <div key={t.id} className="qr-karte">
              <QRCodeSVG value={qrUrl(t)} size={180} level="H" />
              <h3>Tisch {t.nummer}</h3>
              <p>Zum Bestellen QR-Code scannen</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
