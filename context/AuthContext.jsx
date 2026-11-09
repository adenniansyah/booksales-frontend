import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authApi.me();
          setUser(response.data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const data = response.data;
    
    const authToken = data.token;
    if (!authToken) throw new Error('Token tidak ditemukan');

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(data.user);
  };

  const register = async (name, email, password, username) => {
    const response = await authApi.register({ name, email, password, username });
    const data = response.data;
    
    const authToken = data.token;
    if (!authToken) throw new Error('Token tidak ditemukan');

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(data.user);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'customer';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, 
      isAdmin, isUser, isAuthenticated, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
};