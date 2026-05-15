import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { extractError } from '../api/client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared session persistence — used by both login and register.
  const _persist = (t, u) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: t, user: u } = await authApi.login(email, password);
      _persist(t, u);
      return u;
    } catch (e) {
      const msg = extractError(e, 'Login failed');
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { token: t, user: u } = await authApi.register({ name, email, password });
      _persist(t, u);
      return u;
    } catch (e) {
      const msg = extractError(e, 'Registration failed');
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Auto-logout on 401 from axios interceptor
  useEffect(() => {
    const onUnauth = () => logout();
    window.addEventListener('auth:unauthorized', onUnauth);
    return () => window.removeEventListener('auth:unauthorized', onUnauth);
  }, [logout]);

  const value = useMemo(
    () => ({ token, user, loading, error, isAuthenticated: !!token, login, register, logout }),
    [token, user, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
