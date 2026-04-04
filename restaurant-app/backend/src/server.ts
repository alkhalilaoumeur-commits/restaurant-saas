import express from 'express';
import cors from 'cors';
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
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bestellungen', bestellungenRoutes);
app.use('/api/speisekarte', speisekarteRoutes);
app.use('/api/reservierungen', reservierungenRoutes);
app.use('/api/tische', tischeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', zeit: new Date().toISOString() });
});

app.use(errorHandler);

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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
