import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';

let socketInstance: Socket | null = null;

export function useSocket(): Socket | null {
  const token = useAuthStore((s) => s.token);
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    if (!socketInstance) {
      socketInstance = io('/', {
        auth: { token },
        transports: ['websocket'],
      });
    }
    ref.current = socketInstance;

    return () => {
      // Verbindung bleibt offen (Singleton), nur Ref leeren
      ref.current = null;
    };
  }, [token]);

  return ref.current;
}
