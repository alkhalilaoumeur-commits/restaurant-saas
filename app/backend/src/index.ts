import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurants';
import tischRoutes from './routes/tische';
import gerichtRoutes from './routes/gerichte';
import bestellungRoutes from './routes/bestellungen';
import reservierungRoutes from './routes/reservierungen';
import mitarbeiterRoutes from './routes/mitarbeiter';
import { initSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routen
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/tische', tischRoutes);
app.use('/api/gerichte', gerichtRoutes);
app.use('/api/bestellungen', bestellungRoutes);
app.use('/api/reservierungen', reservierungRoutes);
app.use('/api/mitarbeiter', mitarbeiterRoutes);

// Health-Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io
initSocket(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

export { io };
