import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Singleton-Verbindung – bleibt über Seitennavigation erhalten
let socket: Socket | null = null;

export function useSocket(): Socket | null {
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    const token = (() => {
      try { return JSON.parse(localStorage.getItem('restaurant-auth') || '{}')?.state?.token; }
      catch { return null; }
    })();
    if (!token) return;

    if (!socket) {
      socket = io('/', { auth: { token }, transports: ['websocket'] });
    }
    ref.current = socket;
    return () => { ref.current = null; };
  }, []);

  return ref.current;
}
