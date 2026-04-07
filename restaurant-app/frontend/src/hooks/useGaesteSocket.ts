import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Socket-Verbindung für Gäste (kein Auth-Token nötig).
 * Tritt automatisch dem Tisch-Raum bei und ruft onStatusUpdate
 * auf, sobald sich der Bestellstatus ändert.
 */
export function useGaesteSocket(
  restaurantId: string | undefined,
  tischId: string | undefined,
  onStatusUpdate: (daten: { id: string; status: string }) => void,
) {
  const socketRef = useRef<Socket | null>(null);
  const callbackRef = useRef(onStatusUpdate);
  callbackRef.current = onStatusUpdate;

  useEffect(() => {
    if (!restaurantId || !tischId) return;

    const socket = io('/', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('tisch_beitreten', { restaurantId, tischId });
    });

    socket.on('bestellung_aktualisiert', (daten: { id: string; status: string }) => {
      callbackRef.current(daten);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [restaurantId, tischId]);

  return socketRef.current;
}
