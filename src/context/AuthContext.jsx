import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('av_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('av_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() => {
    const raw = localStorage.getItem('av_progress');
    return raw ? JSON.parse(raw) : { completedIds: [], lastCompleteDate: null, streak: 0 };
  });

  useEffect(() => {
    if (token) localStorage.setItem('av_token', token);
    else localStorage.removeItem('av_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('av_user', JSON.stringify(user));
    else localStorage.removeItem('av_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('av_progress', JSON.stringify(progress));
  }, [progress]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise(r => setTimeout(r, 600));
      const fakeToken = 'fake-jwt-token';
      setToken(fakeToken);
      setUser({ email, name: email.split('@')[0], rank: 42 });
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise(r => setTimeout(r, 700));
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const hasCompleted = (id) => progress.completedIds.includes(id);

  const completeAlgorithm = (id) => {
    if (hasCompleted(id)) return;
    const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const alreadyCountedToday = progress.lastCompleteDate === today;
    setProgress(p => ({
      completedIds: [...p.completedIds, id],
      lastCompleteDate: today,
      streak: alreadyCountedToday ? p.streak : p.streak + 1
    }));
  };

  const value = useMemo(() => ({ token, user, loading, login, logout, register, isAuthenticated: Boolean(token), progress, hasCompleted, completeAlgorithm }), [token, user, loading, progress]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


