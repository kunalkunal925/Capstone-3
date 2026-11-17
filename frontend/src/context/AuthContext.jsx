import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getSession, persistSession } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const syncSession = (event) => setSession(event.detail);
    window.addEventListener('neevcraft:session', syncSession);
    return () => window.removeEventListener('neevcraft:session', syncSession);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      login: async (credentials) => {
        const result = await api('/auth/login', { method: 'POST', body: credentials });
        persistSession(result);
        return result.user;
      },
      register: async (details) => {
        const result = await api('/auth/register', { method: 'POST', body: details });
        persistSession(result);
        return result.user;
      },
      logout: () => persistSession(null),
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
