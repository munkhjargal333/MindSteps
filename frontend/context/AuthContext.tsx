'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from "../lib/types";
import { apiClient } from '../lib/api/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        try {
          const userData = await apiClient.getMe(savedToken);
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.register(name, email, password);
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}