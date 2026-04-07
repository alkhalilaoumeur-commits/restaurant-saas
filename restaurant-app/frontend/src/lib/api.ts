const BASE = '/api';

/** Erweiterter Fehler mit zusätzlichen Daten aus der API-Response */
export class ApiError extends Error {
  data: Record<string, unknown>;
  constructor(message: string, data: Record<string, unknown> = {}) {
    super(message);
    this.data = data;
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('restaurant-auth');
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('restaurant-auth');
    window.location.href = '/login';
    throw new Error('Sitzung abgelaufen');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.fehler || `HTTP ${res.status}`, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};
