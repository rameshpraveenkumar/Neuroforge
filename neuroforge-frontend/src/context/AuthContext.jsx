import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { DEMO_PERSONAS } from '../utils/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('neuroforge_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('neuroforge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [demoPersonas, setDemoPersonas] = useState(DEMO_PERSONAS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            const userData = {
              id: res.data.userId || res.data.id,
              username: res.data.username,
              email: res.data.email,
              fullName: res.data.fullName,
              role: res.data.role,
              roleDisplayName: res.data.roleDisplayName || (res.data.role ? res.data.role.replace(/_/g, ' ') : ''),
              avatarUrl: res.data.avatarUrl,
            };
            setUser(userData);
            localStorage.setItem('neuroforge_user', JSON.stringify(userData));
          } else {
            logout();
          }
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    const loadPersonas = async () => {
      try {
        const res = await authApi.getDemoPersonas();
        if (res.success && res.data && res.data.length > 0) {
          setDemoPersonas(res.data);
        }
      } catch (err) {
        setDemoPersonas(DEMO_PERSONAS);
      }
    };

    initAuth();
    loadPersonas();
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    setError(null);
    try {
      const res = await authApi.login(usernameOrEmail, password);
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.accessToken);
        localStorage.setItem('neuroforge_token', authData.accessToken);

        const userData = {
          id: authData.userId || authData.id,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
          roleDisplayName: authData.roleDisplayName || (authData.role ? authData.role.replace(/_/g, ' ') : ''),
          avatarUrl: authData.avatarUrl,
        };
        setUser(userData);
        localStorage.setItem('neuroforge_user', JSON.stringify(userData));

        return { success: true };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const demoSwitch = async (targetRole) => {
    setError(null);
    try {
      const res = await authApi.demoSwitch(targetRole);
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.accessToken);
        localStorage.setItem('neuroforge_token', authData.accessToken);

        const userData = {
          id: authData.userId || authData.id,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
          roleDisplayName: authData.roleDisplayName || (authData.role ? authData.role.replace(/_/g, ' ') : ''),
          avatarUrl: authData.avatarUrl,
        };
        setUser(userData);
        localStorage.setItem('neuroforge_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: res.message || 'Failed to switch persona' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not switch persona.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('neuroforge_token');
    localStorage.removeItem('neuroforge_user');
    localStorage.removeItem('neuroforge_demo_mode');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role,
        isAuthenticated: !!token,
        loading,
        error,
        demoPersonas,
        login,
        demoSwitch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
