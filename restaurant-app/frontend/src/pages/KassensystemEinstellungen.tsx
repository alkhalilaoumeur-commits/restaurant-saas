import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import { useKss, KssAnbieter } from '../hooks/useKss';

// ──────────────────────────────────────────────────────────
// Anbieter-Definitionen mit Labels und Beschreibungen
// ──────────────────────────────────────────────────────────

const ANBIETER_INFO: Record<KssAnbieter, {
  label: string;
  beschreibung: string;
  brauchtWebhookUrl: boolean;
  brauchtApiKey: boolean;
  apiKeyLabel: string;
}> = {
  deaktiviert: {
    label: 'Deaktiviert',
    beschreibung: 'Keine Kassensystem-Integration. Bestellungen müssen manuell eingetippt werden.',
    brauchtWebhookUrl: false,
    brauchtApiKey: false,
    apiKeyLabel: '',
  },
  generic_webhook: {
    label: 'Generic Webhook',
    beschreibung: 'Sendet jede neue Bestellung als JSON-POST an eine beliebige URL. Funktioniert mit jedem System das Webhooks empfangen kann.',
    brauchtWebhookUrl: true,
    brauchtApiKey: false,
    apiKeyLabel: 'API-Key (optional)',
  },
  orderbird: {
    label: 'orderbird',
    beschreibung: 'Verbindung zu orderbird iPad-Kassensystem. Bestellungen erscheinen direkt auf dem Tablet. API-Key aus dem orderbird Developer-Portal erforderlich.',
    brauchtWebhookUrl: false,
    brauchtApiKey: true,
    apiKeyLabel: 'orderbird API-Key',
  },
  ready2order: {
    label: 'ready2order',
    beschreibung: 'Verbindung zu ready2order Kassensystem. Günstiger Einstieg, gute API. API-Key aus dem ready2order Backend erforderlich.',
    brauchtWebhookUrl: false,
    brauchtApiKey: true,
    apiKeyLabel: 'ready2order API-Key',
  },
  sumup: {
    label: 'SumUp POS',
    beschreibung: 'Verbindung zu SumUp Point-of-Sale. Weit verbreitet bei kleinen Restaurants. API-Key aus dem SumUp Developer-Portal erforderlich.',
    brauchtWebhookUrl: false,
    brauchtApiKey: true,
    apiKeyLabel: 'SumUp API-Key',
  },
};

// ──────────────────────────────────────────────────────────
// Status-Badge für Log-Einträge
// ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'success' | 'failed' | 'retrying' }) {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    retrying: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  const labels = { success: 'Erfolg', failed: 'Fehler', retrying: 'Retry' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// Haupt-Komponente
// ──────────────────────────────────────────────────────────

export default function KassensystemEinstellungen() {
  const { konfig, logs, fehlerInFolge, laden, speichernLaeuft, testenLaeuft, fehler, konfigSpeichern, verbindungTesten, logNeuLaden } = useKss();

  const [gewaehlterAnbieter, setGewaehlterAnbieter] = useState<KssAnbieter>('deaktiviert');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testErgebnis, setTestErgebnis] = useState<{ erfolg: boolean; http_status?: number; fehler?: string } | null>(null);
  const [formularAktiv, setFormularAktiv] = useState(false);

  // Wenn Konfig geladen → Formular befüllen
  if (konfig && !formularAktiv && !laden) {
    setGewaehlterAnbieter(konfig.anbieter);
    setWebhookUrl(konfig.webhook_url ?? '');
    setFormularAktiv(true);
  }

  const anbieterInfo = ANBIETER_INFO[gewaehlterAnbieter];

  const handleSpeichern = async () => {
    const erfolg = await konfigSpeichern({
      anbieter: gewaehlterAnbieter,
      webhook_url: anbieterInfo.brauchtWebhookUrl ? webhookUrl : undefined,
      api_key: apiKey || undefined,
    });
    if (erfolg) setApiKey(''); // API-Key nach Speichern aus Formular löschen
  };

  const handleTesten = async () => {
    setTestErgebnis(null);
    const ergebnis = await verbindungTesten();
    setTestErgebnis(ergebnis);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      <Topbar titel="Kassensystem" />

      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {/* Alert: Fehler in Folge */}
        {fehlerInFolge >= 3 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-red-400 font-semibold text-sm">Kassensystem nicht erreichbar</p>
              <p className="text-red-300/80 text-xs mt-1">{fehlerInFolge} Übertragungen hintereinander fehlgeschlagen. Bestellungen gehen in ServeFlow weiterhin ein — müssen aber manuell eingetippt werden.</p>
            </div>
          </div>
        )}

        {/* Konfiguration */}
        <div className="bg-[#0F1724] border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-white font-bold text-lg">Kassensystem konfigurieren</h2>
            <p className="text-slate-400 text-sm mt-1">Neue Bestellungen werden automatisch an das ausgewählte Kassensystem übertragen.</p>
          </div>

          {laden ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              Lade Konfiguration...
            </div>
          ) : (
            <div className="space-y-4">

              {/* Anbieter wählen */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kassensystem</label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.entries(ANBIETER_INFO) as [KssAnbieter, typeof ANBIETER_INFO[KssAnbieter]][]).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => { setGewaehlterAnbieter(key); setTestErgebnis(null); }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        gewaehlterAnbieter === key
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-white/5 bg-white/2 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-sm ${gewaehlterAnbieter === key ? 'text-blue-400' : 'text-slate-200'}`}>
                          {info.label}
                        </span>
                        {gewaehlterAnbieter === key && (
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{info.beschreibung}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Webhook-URL (nur für generic_webhook) */}
              {anbieterInfo.brauchtWebhookUrl && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Webhook-URL</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    placeholder="https://dein-kassensystem.de/api/bestellungen"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">ServeFlow sendet einen HTTP-POST mit der Bestellung als JSON an diese URL.</p>
                </div>
              )}

              {/* API-Key */}
              {(anbieterInfo.brauchtApiKey || gewaehlterAnbieter === 'generic_webhook') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{anbieterInfo.apiKeyLabel}</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder={konfig?.hat_api_key ? '••••••••••••••• (bereits gespeichert)' : 'API-Key eingeben'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                  />
                  {konfig?.hat_api_key && !apiKey && (
                    <p className="text-xs text-emerald-400/80 mt-1.5">Ein API-Key ist bereits gespeichert. Nur ausfüllen wenn du ihn ändern möchtest.</p>
                  )}
                </div>
              )}

              {/* Fehler-Anzeige */}
              {fehler && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{fehler}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSpeichern}
                  disabled={speichernLaeuft}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {speichernLaeuft ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Speichern...</>
                  ) : 'Speichern'}
                </button>

                {gewaehlterAnbieter !== 'deaktiviert' && (
                  <button
                    onClick={handleTesten}
                    disabled={testenLaeuft}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-xl border border-white/10 transition-all disabled:opacity-50"
                  >
                    {testenLaeuft ? (
                      <><div className="w-4 h-4 border-2 border-white/20 border-t-slate-300 rounded-full animate-spin" /> Teste Verbindung...</>
                    ) : 'Verbindung testen'}
                  </button>
                )}
              </div>

              {/* Test-Ergebnis */}
              {testErgebnis && (
                <div className={`rounded-xl p-4 border ${testErgebnis.erfolg ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center gap-2">
                    {testErgebnis.erfolg ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`font-semibold text-sm ${testErgebnis.erfolg ? 'text-emerald-400' : 'text-red-400'}`}>
                      {testErgebnis.erfolg ? 'Verbindung erfolgreich!' : 'Verbindung fehlgeschlagen'}
                    </span>
                    {testErgebnis.http_status && (
                      <span className="text-xs text-slate-400 ml-auto">HTTP {testErgebnis.http_status}</span>
                    )}
                  </div>
                  {testErgebnis.fehler && (
                    <p className="text-xs text-red-300/80 mt-2">{testErgebnis.fehler}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verbindungs-Log */}
        <div className="bg-[#0F1724] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Übertragungsprotokoll</h2>
              <p className="text-slate-400 text-sm mt-1">Letzte Versuche Bestellungen ans Kassensystem zu senden.</p>
            </div>
            <button
              onClick={logNeuLaden}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Aktualisieren"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Noch keine Übertragungen. Bestellungen werden hier aufgezeichnet sobald das Kassensystem aktiviert ist.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                  <StatusBadge status={log.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-300 text-xs font-mono truncate">{log.bestellung_id.slice(0, 8)}…</span>
                      <span className="text-slate-500 text-xs">{log.anbieter}</span>
                      {log.http_status && (
                        <span className="text-slate-500 text-xs">HTTP {log.http_status}</span>
                      )}
                      {log.versuche > 1 && (
                        <span className="text-amber-400/70 text-xs">{log.versuche}. Versuch</span>
                      )}
                    </div>
                    {log.fehler_meldung && (
                      <p className="text-red-400/70 text-xs mt-1 truncate">{log.fehler_meldung}</p>
                    )}
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">
                    {new Date(log.erstellt_am).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
