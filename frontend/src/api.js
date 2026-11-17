const API_URL = import.meta.env.VITE_API_URL || '';
const SESSION_KEY = 'neevcraft-session';
let refreshPromise;

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

const saveSession = (session) => {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('neevcraft:session', { detail: session }));
};

const refreshAccessToken = async () => {
  const session = readSession();
  if (!session?.refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then(async (response) => {
        const tokens = await response.json();
        if (!response.ok) throw new Error(tokens.message || 'Please sign in again');
        const updatedSession = { ...session, ...tokens };
        saveSession(updatedSession);
        return updatedSession.accessToken;
      })
      .catch(() => {
        saveSession(null);
        return null;
      })
      .finally(() => {
        refreshPromise = undefined;
      });
  }
  return refreshPromise;
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = async (path, options = {}) => {
  const session = readSession();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;
  let body = options.body;

  if (hasBody && !(body instanceof FormData) && typeof body !== 'string') {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }
  if (session?.accessToken) headers.set('Authorization', `Bearer ${session.accessToken}`);

  const request = () => fetch(`${API_URL}/api${path}`, { ...options, headers, body });
  let response = await request();

  if (response.status === 401 && path !== '/auth/refresh' && session?.refreshToken) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      headers.set('Authorization', `Bearer ${refreshedToken}`);
      response = await request();
    }
  }

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      const message = response.status >= 500
        ? 'The NeevCraft API is unavailable. Check that the backend is running and connected to MongoDB.'
        : `The server returned an unexpected response (${response.status}).`;
      throw new ApiError(message, response.status);
    }
  }
  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', response.status);
  }
  return data;
};

export const persistSession = saveSession;
export const getSession = readSession;
