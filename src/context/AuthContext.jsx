import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('av_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('av_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [completedAlgorithms, setCompletedAlgorithms] = useState([]);

  useEffect(() => {
    if (token) localStorage.setItem('av_token', token);
    else localStorage.removeItem('av_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('av_user', JSON.stringify(user));
    else localStorage.removeItem('av_user');
  }, [user]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      console.log('Logging in user:', email);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          return { success: false, message: 'Server error. Invalid response format.' };
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return { success: false, message: text || 'Server error. Please check if the backend is running.' };
      }

      console.log('Login response:', { status: response.status, hasToken: !!data.token, error: data.error });

      if (response.ok && data.token) {
        setToken(data.token);
        const newUser = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          name: data.user.username,
          role: data.user.role || 'student'
        };
        setUser(newUser);

        await fetchUserStats(data.token);

        return { success: true, role: newUser.role };
      } else {
        return { success: false, message: data.error || data.message || 'Login failed' };
      }
    } catch (e) {
      console.error('Login error:', e);
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        return { success: false, message: 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000' };
      }
      return { success: false, message: e.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role = 'student' }) => {
    setLoading(true);
    try {
      console.log('Registering user:', { name, email });
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password, role }),
      });

      const data = await response.json();
      console.log('Registration response:', { status: response.status, data });

      if (response.ok) {
        return { success: true, message: data.message || 'Registration successful' };
      } else {
        return { success: false, message: data.error || 'Registration failed' };
      }
    } catch (e) {
      console.error('Registration error:', e);
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserStats(null);
    setCompletedAlgorithms([]);
  };

  const fetchUserStats = async (authToken) => {
    if (!authToken) return;

    try {
      const response = await fetch('http://localhost:5000/api/progress/stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user stats:', data.stats);
        setUserStats(data.stats);

        const historyResponse = await fetch('http://localhost:5000/api/progress/history', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (historyResponse.ok) {
          const history = await historyResponse.json();
          const completed = history
            .filter(p => p.activityType === 'completed')
            .map(p => p.Algorithm?.slug || p.algorithmId)
            .filter(Boolean);
          setCompletedAlgorithms([...new Set(completed)]);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch stats:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const hasCompleted = (slug) => completedAlgorithms.includes(slug);

  const completeAlgorithm = async (slug) => {
    if (!token) {
      console.warn('Cannot complete algorithm: not logged in');
      return;
    }

    if (hasCompleted(slug)) return;

    try {

      const algoResponse = await fetch(`http://localhost:5000/api/algorithms/${slug}`);
      if (!algoResponse.ok) {
        console.error('Algorithm not found');
        return;
      }
      const algorithm = await algoResponse.json();

      const response = await fetch('http://localhost:5000/api/progress/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithmId: algorithm.id,
          activityType: 'completed',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCompletedAlgorithms(prev => [...prev, slug]);

        // Immediately update user stats with the response data if available
        if (data.user) {
          setUserStats(prev => ({
            ...prev,
            streak: data.user.streak,
            totalEngagement: data.user.totalEngagement,
          }));
        }

        // Also fetch fresh stats to ensure everything is up to date
        await fetchUserStats(token);
      }
    } catch (error) {
      console.error('Error completing algorithm:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserStats(token);
    }
  }, [token, user?.id]);

  // Refresh stats periodically to keep streak updated
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchUserStats(token);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: Boolean(token),
    userStats,
    hasCompleted,
    completeAlgorithm
  }), [token, user, loading, userStats, completedAlgorithms]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

