'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

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

const PUBLIC_PATHS = ['/login', '/unauthorized', '/terms', '/privacy', '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
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
        
        // SIGNED_OUT event дээр login руу шилжүүлэх
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  // Route protection
  useEffect(() => {
    if (loading) return;
    
    const isPublicPath = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth/');

    if (!session && !isPublicPath) {
      router.push('/login');
      return;
    }

    if (session && pathname === '/login') {
      router.push('/dashboard');
      return;
    }
  }, [session, loading, pathname, router]);

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
      
      router.push('/dashboard');
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
          router.push('/unauthorized');
          return;
        }
        
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Зочноор нэвтрэх боломжгүй');
      }
      
      console.log('Guest login success:', data.user.id);
      router.push('/dashboard');
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
          redirectTo: `${window.location.origin}/auth/callback`,
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        // Whitelist-д байхгүй email
        if (error.message.includes('not authorized') || 
            error.message.includes('Signup Error')) {
          router.push('/unauthorized');
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