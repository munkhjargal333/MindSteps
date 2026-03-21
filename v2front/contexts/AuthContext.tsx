'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        
        // Гарах үед login руу шилжүүлэх
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Нэвтрэх боломжгүй');
      }
      
      router.push('/quick');
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
        console.error('Anonymous login error:', error);
        
        // Whitelist-д байхгүй anonymous user
        if (error.message.includes('not authorized') || 
            error.message.includes('Signup Error')) {
          router.push('/join');
          return;
        }
        
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Зочноор нэвтрэх боломжгүй');
      }
      
      console.log('Guest login success:', data.user.id);
      router.push('/quick');
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
          queryParams: { 
            access_type: 'offline', 
            prompt: 'consent' 
          }
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      
      if (error) {
        if (error.message.includes('not authorized') || 
            error.message.includes('Signup Error')) {
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
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}