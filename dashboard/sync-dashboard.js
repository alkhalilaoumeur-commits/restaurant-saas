#!/opt/homebrew/bin/node
/**
 * sync-dashboard.js
 *
 * Liest die echten Projektdateien (Schema, API-Endpunkte, Todos, Frontend-Seiten)
 * und generiert daraus dashboard-data.js — die das Dashboard automatisch laedt.
 *
 * Ausfuehren: node dashboard/sync-dashboard.js
 *
 * Was passiert:
 * 1. schema.sql wird gelesen → Data Types + Felder + Option Sets werden extrahiert
 * 2. api-endpunkte.md wird gelesen → Integrationen/API-Routen werden extrahiert
 * 3. project/todos.md wird gelesen → Issues/Todos werden extrahiert
 * 4. Frontend-Dateien werden gescannt → Seiten werden extrahiert
 * 5. Alles wird als dashboard-data.js geschrieben
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'dashboard-data.js');

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  try { return fs.readFileSync(full, 'utf-8'); } catch { return ''; }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ─── 1. Schema parsen → Data Types ─────────────────────────────────────────

function parseSchema(sql) {
  const dataTypes = [];
  const optionSets = [];

  // Finde alle CREATE TABLE
  const tableRegex = /CREATE TABLE IF NOT EXISTS (\w+)\s*\(([\s\S]*?)\);/g;
  let match;

  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const body = match[2];

    // Tabellenname auf Deutsch (Singular, Grossbuchstabe)
    const displayName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

    const fields = [];
    const relationships = [];

    // Parse Felder
    const lines = body.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('--') && !l.startsWith('CHECK') && !l.startsWith('UNIQUE') && !l.startsWith('CREATE') && !l.startsWith('CONSTRAINT'));

    for (const line of lines) {
      // Ueberspringe CHECK-Constraints und UNIQUE
      if (line.match(/^\s*(CHECK|UNIQUE|CREATE|CONSTRAINT)/i)) continue;

      const fieldMatch = line.match(/^(\w+)\s+([\w().,]+)/);
      if (!fieldMatch) continue;

      const fname = fieldMatch[1];
      const rawType = fieldMatch[2].toUpperCase();

      let type = 'Text';
      if (rawType.includes('UUID') && fname === 'id') type = 'ID';
      else if (rawType.includes('UUID')) type = 'Beziehung';
      else if (rawType.includes('TEXT')) type = 'Text';
      else if (rawType.includes('INTEGER') || rawType.includes('DECIMAL')) type = 'Zahl';
      else if (rawType.includes('BOOLEAN')) type = 'Ja/Nein';
      else if (rawType.includes('TIMESTAMP') || rawType.includes('DATE') || rawType.includes('TIME')) type = 'Datum';

      const required = line.includes('NOT NULL');

      // Beschreibung aus Kontext ableiten
      let desc = '';
      if (fname === 'id') desc = 'Eindeutige ID (UUID, automatisch)';
      else if (fname === 'restaurant_id') desc = 'Gehoert zu Restaurant (Multi-Tenant)';
      else if (fname === 'erstellt_am') desc = 'Erstellungszeitpunkt';
      else if (fname === 'aktualisiert_am') desc = 'Letzte Aenderung';
      else if (line.includes('REFERENCES')) {
        const refMatch = line.match(/REFERENCES (\w+)/);
        if (refMatch) {
          const refTable = refMatch[1].charAt(0).toUpperCase() + refMatch[1].slice(1);
          desc = `Verknuepft mit ${refTable}`;
          if (!relationships.includes(refTable)) relationships.push(refTable);
        }
      }

      // CHECK-Werte als Option Set erkennen
      const checkMatch = body.match(new RegExp(fname + `[^)]*CHECK\\s*\\(${fname}\\s+IN\\s*\\('([^)]+)'\\)`, 'i'));
      if (checkMatch) {
        const values = checkMatch[1].split("','").map(v => v.replace(/'/g, '').trim());
        const osName = displayName + '_' + fname.charAt(0).toUpperCase() + fname.slice(1);
        optionSets.push({ id: generateId(), name: osName, values });
        type = 'Option Set';
        desc = `Moegliche Werte: ${values.join(', ')}`;
      }

      fields.push({
        id: generateId(),
        name: fname,
        type,
        description: desc || fname,
        required
      });
    }

    dataTypes.push({
      id: 'dt-' + generateId(),
      name: displayName,
      fields,
      relationships
    });
  }

  // Dedupliziere Option Sets nach Name
  const seen = new Set();
  const uniqueOS = optionSets.filter(os => {
    if (seen.has(os.name)) return false;
    seen.add(os.name);
    return true;
  });

  return { dataTypes, optionSets: uniqueOS };
}

// ─── 2. API-Endpunkte parsen ────────────────────────────────────────────────

function parseAPI(md) {
  const integrations = [];

  // Zaehle Routen pro Bereich
  const sections = md.split('## ').filter(s => s.trim());

  for (const section of sections) {
    const titleMatch = section.match(/^(\w[\w\s&()-]*)/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();
    if (title === 'Stand:' || title.includes('---')) continue;

    const routes = (section.match(/\| (GET|POST|PUT|PATCH|DELETE) \|/g) || []).length;
    if (routes === 0) continue;

    integrations.push({
      id: generateId(),
      name: `API: ${title}`,
      typ: 'REST API',
      status: 'Verbunden',
      desc: `${routes} Endpunkte fuer ${title}`,
      url: `/api/${title.toLowerCase().replace(/[^a-z]/g, '')}`
    });
  }

  return integrations;
}

// ─── 3. Todos parsen → Issues + Roadmap ────────────────────────────────────

function parseTodos(md) {
  const issues = [];
  const roadmap = []; // Phasen mit allen Todos (erledigt + offen)

  const lines = md.split('\n');
  let currentPhase = '';
  let currentPhaseObj = null;

  for (const line of lines) {
    // Phase erkennen (## Phase X – Name oder ## Jetzt dran / ## Irgendwann / ## Nächstes Todo)
    const phaseMatch = line.match(/^## (.+)$/);
    if (phaseMatch) {
      const phaseName = phaseMatch[1].trim();
      // Neue Phase speichern
      if (currentPhaseObj) roadmap.push(currentPhaseObj);
      currentPhase = phaseName;
      currentPhaseObj = {
        id: generateId(),
        name: phaseName,
        todos: [],
        done: 0,
        total: 0
      };
      continue;
    }

    // Sub-Phasen (### Phase A, ### Phase B etc.)
    const subPhaseMatch = line.match(/^### (.+)$/);
    if (subPhaseMatch && currentPhaseObj) {
      // Sub-Phase als eigene Phase in die Roadmap
      if (currentPhaseObj.todos.length > 0 || currentPhaseObj.total === 0) {
        // Behalte aktuelle Phase, fuege Sub-Phase-Header als Marker ein
      }
    }

    // Erledigte Todos
    const doneMatch = line.match(/^- \[x\] (.+)$/);
    if (doneMatch) {
      const title = doneMatch[1].replace(/✅.*$/, '').trim();
      if (currentPhaseObj) {
        currentPhaseObj.todos.push({ id: generateId(), title, done: true });
        currentPhaseObj.total++;
        currentPhaseObj.done++;
      }
      continue;
    }

    // Offene Todos
    const todoMatch = line.match(/^- \[ \] (.+)$/);
    if (todoMatch) {
      const title = todoMatch[1].trim();
      if (currentPhaseObj) {
        currentPhaseObj.todos.push({ id: generateId(), title, done: false });
        currentPhaseObj.total++;
      }

      // Auch als Issue fuer Kanban-Board
      issues.push({
        id: generateId(),
        title: title,
        desc: `Aus ${currentPhase || 'Todos'}`,
        priority: title.toLowerCase().includes('whatsapp') || title.toLowerCase().includes('mobile') ? 'Normal' : 'Hoch',
        area: 'Allgemein',
        status: 'Backlog',
        created: new Date().toISOString().split('T')[0]
      });
      continue;
    }
  }

  // Letzte Phase speichern
  if (currentPhaseObj) roadmap.push(currentPhaseObj);

  return { issues, roadmap };
}

// ─── 3b. Entscheidungen parsen ─────────────────────────────────────────────

function parseDecisions(md) {
  const decisions = [];
  const sections = md.split(/^## /m).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0].trim();
    if (!title || title.startsWith('#')) continue;

    // Datum extrahieren
    const dateMatch = section.match(/\*\*Entschieden:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : '';

    // Inhalt: alles nach der ersten Zeile
    const content = lines.slice(1)
      .filter(l => !l.match(/^\*\*Entschieden/))
      .map(l => l.trim())
      .filter(l => l)
      .join('\n');

    decisions.push({
      id: generateId(),
      title,
      date,
      content
    });
  }

  return decisions;
}

// ─── 3c. DSGVO-Log parsen ──────────────────────────────────────────────────

function parseDSGVO(md) {
  const entries = [];

  // Technische Massnahmen Status extrahieren
  const tomDone = (md.match(/✅/g) || []).length;
  const tomOpen = (md.match(/⬜/g) || []).length;
  const tomPartial = (md.match(/⚠️/g) || []).length;

  // Offene Punkte zaehlen
  const openCritical = [];
  const openImportant = [];
  let inCritical = false;
  let inImportant = false;

  for (const line of md.split('\n')) {
    if (line.includes('Kritisch (vor Produktivbetrieb)')) { inCritical = true; inImportant = false; continue; }
    if (line.includes('Wichtig (zeitnah)')) { inCritical = false; inImportant = true; continue; }
    if (line.match(/^### Spaeter/)) { inCritical = false; inImportant = false; continue; }

    const todoMatch = line.match(/^- \[ \] (.+)$/);
    if (todoMatch) {
      if (inCritical) openCritical.push(todoMatch[1].trim());
      else if (inImportant) openImportant.push(todoMatch[1].trim());
    }
  }

  // Pruefungs-Eintraege extrahieren
  const sections = md.split(/^## \d{4}/m);
  const dateHeaders = md.match(/^## (\d{4}-\d{2}-\d{2})\s*[–-]\s*(.+)$/gm) || [];

  for (const header of dateHeaders) {
    const m = header.match(/^## (\d{4}-\d{2}-\d{2})\s*[–-]\s*(.+)$/);
    if (m) {
      entries.push({ id: generateId(), date: m[1], title: m[2].trim() });
    }
  }

  return {
    entries,
    tomDone,
    tomOpen,
    tomPartial,
    openCritical,
    openImportant
  };
}

// ─── 4. Frontend-Seiten scannen ─────────────────────────────────────────────

function scanPages() {
  const pagesDir = path.join(ROOT, 'restaurant-app/frontend/src/pages');
  const componentsDir = path.join(ROOT, 'restaurant-app/frontend/src/components');
  const pages = [];

  try {
    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

    for (const file of files) {
      const name = file.replace('.tsx', '');
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');

      // Finde importierte Komponenten
      const imports = [];
      const importRegex = /import\s+.*?from\s+['"]\.\.\/components\/(\w+)\//g;
      let im;
      while ((im = importRegex.exec(content)) !== null) {
        if (!imports.includes(im[1])) imports.push(im[1]);
      }

      // Finde verwendete API-Hooks
      const hooks = [];
      const hookRegex = /use(\w+)\(/g;
      let hm;
      while ((hm = hookRegex.exec(content)) !== null) {
        const hookName = hm[1];
        if (['State', 'Effect', 'Ref', 'Memo', 'Callback', 'Context', 'Navigate', 'Params', 'Location'].includes(hookName)) continue;
        if (!hooks.includes(hookName)) hooks.push(hookName);
      }

      // Komponenten-Ordner pruefen
      const reusables = [];
      const compDir = path.join(componentsDir, name.toLowerCase());
      if (fs.existsSync(compDir)) {
        const comps = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx')).map(f => f.replace('.tsx', ''));
        reusables.push(...comps);
      }

      pages.push({
        id: generateId(),
        name: name,
        desc: `Seite: ${name} — Nutzt ${hooks.length} Hooks, ${reusables.length} Komponenten`,
        status: 'Fertig',
        dataTypes: hooks.map(h => h.replace('use', '')),
        reusables: reusables,
        responsive: { desktop: true, tablet: true, mobile: false }
      });
    }
  } catch (e) {
    console.error('Fehler beim Scannen der Seiten:', e.message);
  }

  return pages;
}

// ─── 5. Backend-Routes zaehlen ──────────────────────────────────────────────

function countWorkflows() {
  const routesDir = path.join(ROOT, 'restaurant-app/backend/src/routes');
  const workflows = [];

  try {
    const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

    for (const file of files) {
      const name = file.replace('.ts', '');
      const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);

      // Zaehle Route-Handler
      const gets = (content.match(/router\.(get|GET)/g) || []).length;
      const posts = (content.match(/router\.(post|POST)/g) || []).length;
      const patches = (content.match(/router\.(patch|put|PATCH|PUT)/g) || []).length;
      const deletes = (content.match(/router\.(delete|DELETE)/g) || []).length;

      const total = gets + posts + patches + deletes;

      // Einen Workflow pro Route-Datei
      if (gets > 0) workflows.push({ id: generateId(), name: `${displayName} abrufen`, folder: displayName, trigger: 'Seiten-Load', status: 'Fertig', triggerDesc: `Wenn: ${displayName}-Seite geladen wird`, steps: [{ id: generateId(), type: 'api', desc: `GET /api/${name} aufrufen` }, { id: generateId(), type: 'database', desc: `${displayName}-Daten aus DB laden (gefiltert nach restaurant_id)` }, { id: generateId(), type: 'navigation', desc: 'Daten in der UI anzeigen' }] });
      if (posts > 0) workflows.push({ id: generateId(), name: `${displayName} erstellen`, folder: displayName, trigger: 'Button-Klick', status: 'Fertig', triggerDesc: `Wenn: Formular fuer neuen ${displayName} abgeschickt wird`, steps: [{ id: generateId(), type: 'condition', desc: 'Eingaben validieren' }, { id: generateId(), type: 'api', desc: `POST /api/${name} aufrufen` }, { id: generateId(), type: 'database', desc: `Neuen ${displayName}-Datensatz in DB speichern` }, { id: generateId(), type: 'confirm', desc: 'Erfolgsmeldung anzeigen + Liste aktualisieren' }] });
      if (patches > 0) workflows.push({ id: generateId(), name: `${displayName} bearbeiten`, folder: displayName, trigger: 'Button-Klick', status: 'Fertig', triggerDesc: `Wenn: ${displayName} bearbeitet und gespeichert wird`, steps: [{ id: generateId(), type: 'condition', desc: 'Aenderungen validieren' }, { id: generateId(), type: 'api', desc: `PATCH /api/${name}/:id aufrufen` }, { id: generateId(), type: 'database', desc: `${displayName}-Datensatz in DB aktualisieren` }, { id: generateId(), type: 'confirm', desc: 'Erfolgsmeldung anzeigen' }] });
      if (deletes > 0) workflows.push({ id: generateId(), name: `${displayName} loeschen`, folder: displayName, trigger: 'Button-Klick', status: 'Fertig', triggerDesc: `Wenn: Loeschen-Button geklickt und bestaetigt`, steps: [{ id: generateId(), type: 'condition', desc: 'Bestaetigung vom Benutzer einholen' }, { id: generateId(), type: 'api', desc: `DELETE /api/${name}/:id aufrufen` }, { id: generateId(), type: 'database', desc: `${displayName}-Datensatz aus DB entfernen` }, { id: generateId(), type: 'confirm', desc: 'Erfolgsmeldung + Liste aktualisieren' }] });
    }
  } catch (e) {
    console.error('Fehler beim Scannen der Routes:', e.message);
  }

  return workflows;
}

// ─── 6. Status-Infos lesen ──────────────────────────────────────────────────

function parseStatus(md) {
  const phaseMatch = md.match(/Aktuelle Phase:\*\*\s*(.+)/);
  const phase = phaseMatch ? phaseMatch[1].trim() : 'In Entwicklung';
  return phase.includes('KOMPLETT') || phase.includes('Live') ? 'Beta' : 'In Entwicklung';
}

// ─── HAUPTPROGRAMM ──────────────────────────────────────────────────────────

console.log('Dashboard-Sync gestartet...');
console.log('Projektverzeichnis:', ROOT);

// Dateien lesen
const schemaSql = readFile('restaurant-app/database/schema.sql');
const apiMd = readFile('datenstruktur/api-endpunkte.md');
const todosMd = readFile('project/todos.md');
const statusMd = readFile('project/status.md');
const decisionsMd = readFile('project/entscheidungen.md');
const dsgvoMd = readFile('project/dsgvo-log.md');

// Parsen
const { dataTypes, optionSets } = parseSchema(schemaSql);
const apiIntegrations = parseAPI(apiMd);
const { issues, roadmap } = parseTodos(todosMd);
const decisions = parseDecisions(decisionsMd);
const dsgvo = parseDSGVO(dsgvoMd);
const pages = scanPages();
const workflows = countWorkflows();
const projectStatus = parseStatus(statusMd);

// Externe Integrationen (manuell, da nicht aus Code ableitbar)
const externalIntegrations = [
  { id: 'ext-1', name: 'QR-Code API', typ: 'REST API', status: 'Verbunden', desc: 'Generiert QR-Codes fuer Tische (qrserver.com)', url: 'api.qrserver.com' },
  { id: 'ext-2', name: 'Stripe / Mollie', typ: 'REST API', status: 'Nicht eingerichtet', desc: 'Online-Zahlungen (noch offen: Phase 4)', url: '' },
  { id: 'ext-3', name: 'WhatsApp Business', typ: 'REST API', status: 'Nicht eingerichtet', desc: 'Reservierungsbestaetigungen (noch offen: Phase 5)', url: '' },
  { id: 'ext-4', name: 'Socket.io', typ: 'WebSocket', status: 'Verbunden', desc: 'Echtzeit-Updates fuer Bestellungen und Tischstatus', url: 'ws://localhost:3001' },
];

// Rollen aus Schema ableiten
const roles = [
  { id: 'r-1', name: 'Admin', perms: {} },
  { id: 'r-2', name: 'Kellner', perms: {} },
  { id: 'r-3', name: 'Kueche', perms: {} },
  { id: 'r-4', name: 'Gast (nicht eingeloggt)', perms: {} },
];

// Berechtigungen fuer jede Rolle und jeden Data Type setzen
for (const dt of dataTypes) {
  roles[0].perms[dt.name] = { read: true, create: true, update: true, delete: true }; // Admin
  roles[1].perms[dt.name] = { read: true, create: dt.name.includes('bestellung') || dt.name.includes('reservierung'), update: dt.name.includes('tisch') || dt.name.includes('bestellung'), delete: false }; // Kellner
  roles[2].perms[dt.name] = { read: dt.name.includes('bestellung') || dt.name.includes('gericht'), create: false, update: dt.name.includes('bestellung'), delete: false }; // Kueche
  roles[3].perms[dt.name] = { read: dt.name.includes('gericht') || dt.name.includes('kategori') || dt.name.includes('restaurant'), create: dt.name.includes('bestellung') || dt.name.includes('reservierung'), update: false, delete: false }; // Gast
}

// Changelog aus Git
let changelog = [];
try {
  const { execSync } = require('child_process');
  const gitLog = execSync('git log --oneline -10 --format="%s|||%as"', { cwd: ROOT, encoding: 'utf-8' });
  changelog = gitLog.trim().split('\n').filter(Boolean).map(line => {
    const [text, date] = line.split('|||');
    return { id: generateId(), text: text.trim(), date: date || new Date().toISOString().split('T')[0] };
  });
} catch {
  changelog = [{ id: generateId(), text: 'Dashboard synchronisiert', date: new Date().toISOString().split('T')[0] }];
}

// Dashboard-Daten zusammenbauen
const dashboardData = {
  project: {
    name: 'Restaurant SaaS',
    status: projectStatus,
    techStack: 'Node.js + Express + TypeScript, React + Tailwind + Vite, PostgreSQL, Socket.io',
    team: [{ id: generateId(), name: 'Ilias', rolle: 'Entwickler & Gruender' }]
  },
  dataTypes,
  optionSets,
  workflows,
  pages,
  integrations: [...externalIntegrations, ...apiIntegrations],
  roles,
  issues,
  roadmap,
  decisions,
  dsgvo,
  changelog
};

// Als JS-Datei schreiben (wird vom Dashboard geladen)
const output = `// AUTO-GENERIERT von sync-dashboard.js — ${new Date().toISOString()}
// Nicht manuell bearbeiten! Aenderungen werden beim naechsten Sync ueberschrieben.
window.SYNCED_DATA = ${JSON.stringify(dashboardData, null, 2)};
`;

fs.writeFileSync(OUT, output, 'utf-8');

// Statistik ausgeben
console.log('');
console.log('Sync erfolgreich!');
console.log(`  Data Types:    ${dataTypes.length}`);
console.log(`  Option Sets:   ${optionSets.length}`);
console.log(`  Workflows:     ${workflows.length}`);
console.log(`  Seiten:        ${pages.length}`);
console.log(`  Integrationen: ${externalIntegrations.length + apiIntegrations.length}`);
console.log(`  Issues:        ${issues.length}`);
console.log(`  Roadmap:       ${roadmap.length} Phasen`);
console.log(`  Entscheid.:    ${decisions.length}`);
console.log(`  DSGVO:         ${dsgvo.entries.length} Pruefungen`);
console.log(`  Changelog:     ${changelog.length}`);
console.log('');
console.log('Geschrieben nach:', OUT);
