import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AuthPayload } from './middleware/auth';

import bestellungenRoutes from './routes/bestellungen';
import speisekarteRoutes from './routes/speisekarte';
import reservierungenRoutes from './routes/reservierungen';
import tischeRoutes from './routes/tische';
import authRoutes from './routes/auth';
import mitarbeiterRoutes from './routes/mitarbeiter';
import restaurantRoutes from './routes/restaurant';
import statistikenRoutes from './routes/statistiken';
import dienstplanRoutes from './routes/dienstplan';
import buchungRoutes from './routes/buchung';
import uploadsRoutes from './routes/uploads';
import bereicheRoutes from './routes/bereiche';
import verfuegbarkeitRoutes from './routes/verfuegbarkeit';
import abwesenheitenRoutes from './routes/abwesenheiten';
import walkInsRoutes from './routes/walk-ins';
import gaesteRoutes from './routes/gaeste';
import googleReserveRoutes from './routes/google-reserve';
import oeffnungszeitenRoutes from './routes/oeffnungszeiten';
import bewertungenRoutes from './routes/bewertungen';
import aboRoutes from './routes/abo';
import inventurRoutes from './routes/inventur';
import wartelisteRoutes from './routes/warteliste';
import erlebnisseRoutes from './routes/erlebnisse';
import { errorHandler } from './middleware/errorHandler';
import { starteErinnerungen } from './services/erinnerungen';
import { starteNoShowCron } from './services/no-show';
import { starteAboCron } from './services/abo-cron';
import { q } from './models/db';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Traefik/nginx Reverse Proxy
const httpServer = createServer(app);

const socketOrigins = [process.env.FRONTEND_URL, process.env.NGROK_URL].filter(Boolean) as string[];
export const io = new Server(httpServer, {
  cors: { origin: socketOrigins.length ? socketOrigins : '*', methods: ['GET', 'POST'] },
});

// CORS: Im Development localhost erlauben, zusätzlich ngrok-Domain wenn gesetzt
const allowedOrigins = [process.env.FRONTEND_URL, process.env.NGROK_URL].filter(Boolean) as string[];
app.use(cors({
  origin: (origin, callback) => {
    // Kein Origin (z.B. Server-zu-Server oder gleicher Origin) → erlauben
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true); // Im Dev alles erlauben — in Produktion einschränken
    }
  },
}));
// Stripe Webhook braucht den raw (ungeparsten) Body für die Signatur-Verifizierung.
// MUSS vor express.json() stehen — sonst ist der Body bereits als JSON geparst
// und die Signaturprüfung schlägt fehl.
app.use('/api/abo/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Hochgeladene Bilder öffentlich bereitstellen unter /uploads/
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/bestellungen', bestellungenRoutes);
app.use('/api/speisekarte', speisekarteRoutes);
app.use('/api/reservierungen', reservierungenRoutes);
app.use('/api/tische', tischeRoutes);
app.use('/api/mitarbeiter', mitarbeiterRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/statistiken', statistikenRoutes);
app.use('/api/dienstplan', dienstplanRoutes);
app.use('/api/buchung', buchungRoutes);
app.use('/api/bereiche', bereicheRoutes);
app.use('/api/verfuegbarkeit', verfuegbarkeitRoutes);
app.use('/api/abwesenheiten', abwesenheitenRoutes);
app.use('/api/walk-ins', walkInsRoutes);
app.use('/api/gaeste', gaesteRoutes);
app.use('/api/google-reserve', googleReserveRoutes);
app.use('/api/oeffnungszeiten', oeffnungszeitenRoutes);
app.use('/api/bewertungen', bewertungenRoutes);
app.use('/api/abo', aboRoutes);
app.use('/api/inventur', inventurRoutes);
app.use('/api/warteliste', wartelisteRoutes);
app.use('/api/erlebnisse', erlebnisseRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', zeit: new Date().toISOString() });
});

app.use(errorHandler);

// ─── Frontend (Production Build) servieren ──────────────────────────────────
// Wenn das Frontend gebaut wurde (npm run build im frontend/), werden die
// statischen Dateien (HTML, JS, CSS) hier bereitgestellt.
// Der Catch-All (*) sorgt dafür, dass React Router funktioniert —
// egal welche URL der Nutzer aufruft, es wird immer index.html geladen.
const frontendBuild = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Socket.io: Token optional dekodieren (Mitarbeiter haben Token, Gäste nicht)
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    try {
      socket.data.auth = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    } catch {
      // Ungültiger Token → Socket bleibt unauthentifiziert
    }
  }
  next();
});

io.on('connection', (socket) => {
  // Nur Mitarbeiter dürfen dem eigenen Restaurant-Raum beitreten
  socket.on('raum_beitreten', (restaurantId: string) => {
    if (socket.data.auth?.restaurantId === restaurantId) {
      socket.join(`restaurant:${restaurantId}`);
    }
  });
  // Gäste treten ihrem Tisch-Raum bei (kein Auth erforderlich)
  socket.on('tisch_beitreten', (data: { restaurantId: string; tischId: string }) => {
    socket.join(`tisch:${data.restaurantId}:${data.tischId}`);
  });
});

async function startServer() {
  // Stripe-Spalten
  await q(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`, []);
  await q(`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT`, []);
  await q(`CREATE INDEX IF NOT EXISTS idx_restaurants_stripe_subscription ON restaurants (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL`, []);

  // abo_status: 'trial' abschaffen — alle auf 'inactive' setzen, Constraint aktualisieren
  await q(`ALTER TABLE restaurants DROP CONSTRAINT IF EXISTS restaurants_abo_status_check`, []);
  await q(`UPDATE restaurants SET abo_status = 'inactive' WHERE abo_status = 'trial'`, []);
  await q(`ALTER TABLE restaurants ALTER COLUMN abo_status SET DEFAULT 'inactive'`, []);
  await q(
    `ALTER TABLE restaurants ADD CONSTRAINT restaurants_abo_status_check
     CHECK (abo_status IN ('inactive', 'active', 'expired', 'cancelled', 'payment_failed'))`,
    [],
  );

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
    starteErinnerungen();
    starteNoShowCron();
    starteAboCron();
  });
}

startServer().catch(err => {
  console.error('Server-Start fehlgeschlagen:', err);
  process.exit(1);
});
