import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('token'); } catch (e) { return null; }
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
    setUser(null);
    setToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/api/v1/auth/profile');
      const profile = res?.data?.data || res?.data;
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      setToken(t);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // On mount, try refresh profile with stored token
    refreshProfile();

    const onAuthInvalid = () => {
      logout();
    };
    window.addEventListener('auth:invalid', onAuthInvalid);
    return () => window.removeEventListener('auth:invalid', onAuthInvalid);
  }, [refreshProfile, logout]);

  const login = useCallback(async (credentials) => {
    // credentials: { emailOrUsername, password }
    try {
      const res = await api.post('/api/v1/auth/login', credentials);
      const tokenFromResp = res?.data?.data?.token || res?.data?.token;
      const userFromResp = res?.data?.data?.user || res?.data?.user;
      if (tokenFromResp) {
        localStorage.setItem('token', tokenFromResp);
        setToken(tokenFromResp);
      }
      if (userFromResp) {
        localStorage.setItem('user', JSON.stringify(userFromResp));
        setUser(userFromResp);
      }
      toast.success('Login successful!');
      return { ok: true, user: userFromResp };
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.msg || 'Login failed';
      toast.error(message);
      return { ok: false, message };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await api.post('/api/v1/auth/register', payload);
      const tokenFromResp = res?.data?.data?.token || res?.data?.token;
      const userFromResp = res?.data?.data?.user || res?.data?.user;
      if (tokenFromResp) {
        localStorage.setItem('token', tokenFromResp);
        setToken(tokenFromResp);
      }
      if (userFromResp) {
        localStorage.setItem('user', JSON.stringify(userFromResp));
        setUser(userFromResp);
      }
      toast.success('Account created successfully');
      return { ok: true, user: userFromResp };
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.msg || 'Registration failed';
      toast.error(message);
      return { ok: false, message };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;