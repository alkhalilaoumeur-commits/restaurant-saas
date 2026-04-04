import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../middleware/auth';

export function initSocket(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      // Gäste dürfen sich auch verbinden (für Bestellstatus)
      next();
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      (socket as Socket & { auth?: AuthPayload }).auth = payload;
      next();
    } catch {
      next(new Error('Token ungültig'));
    }
  });

  io.on('connection', (socket) => {
    const auth = (socket as Socket & { auth?: AuthPayload }).auth;

    if (auth) {
      // Mitarbeiter treten ihrem Restaurant-Raum bei
      socket.join(`restaurant:${auth.restaurantId}`);
      console.log(`Mitarbeiter ${auth.mitarbeiterId} verbunden (${auth.rolle})`);
    }

    // Gäste können einem Tisch-Raum beitreten, um Bestellstatus zu sehen
    socket.on('tisch_beitreten', (data: { restaurantId: string; tischId: string }) => {
      socket.join(`tisch:${data.restaurantId}:${data.tischId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} getrennt`);
    });
  });
}
