// ─────────────────────────────────────────────────────────────────────────────
// contexts/AuthContext.tsx
// Global Context — Auth state only. No business logic.
// Business logic (session analysis, tier check) lives in feature hooks/services.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      if (event === 'SIGNED_OUT') router.push('/login');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Нэвтрэх боломжгүй');
      router.push('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Нэвтрэх үед алдаа гарлаа';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymously = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        if (error.message.includes('not authorized') || error.message.includes('Signup Error')) {
          router.push('/join');
          return;
        }
        throw error;
      }
      if (!data.user) throw new Error('Зочноор нэвтрэх боломжгүй');
      router.push('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Зочноор нэвтрэх үед алдаа гарлаа';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google нэвтрэлт амжилтгүй';
      setError(message);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      if (error) {
        if (error.message.includes('not authorized') || error.message.includes('Signup Error')) {
          router.push('/login');
          return;
        }
        throw error;
      }
      setError('И-мэйл хаяг руугаа илгээсэн холбоосыг дарж баталгаажуулна уу');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Бүртгэл амжилтгүй';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setToken(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        token,
        login,
        loginWithGoogle,
        loginAnonymously,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
