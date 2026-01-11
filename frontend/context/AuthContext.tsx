'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from "../lib/types";
import { apiClient } from '../lib/api/client';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public paths that don't require authentication '/register',
const PUBLIC_PATHS = ['/login',"/terms", "/privacy",  '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // apiClient automatically loads token from localStorage
        const savedToken = apiClient.getToken();
        
        if (savedToken) {
          console.log('🔄 Initializing auth with saved token...');
          const userData = await apiClient.getMe();
          setUser(userData);
          setToken(savedToken);
          console.log('✅ Auth initialized:', userData.email);
        } else {
          console.log('ℹ️ No saved token found');
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        apiClient.clearToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto redirect based on auth state
  useEffect(() => {
    // Wait for initial loading to complete
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Redirect to login if not authenticated and trying to access protected route
    if (!token && !user && !isPublicPath) {
      console.warn('🚫 Unauthorized access, redirecting to login');
      router.push('/login');
      return;
    }

    // Redirect to dashboard if authenticated and trying to access login/register
    if (token && user && (pathname === '/login' || pathname === '/register')) {
      console.log('✅ Already authenticated, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
  }, [token, user, loading, pathname, router]);

  // Listen for unauthorized events (from API client)
  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn('⚠️ Unauthorized event detected');
      setUser(null);
      setToken(null);
      setError('Your session has expired. Please login again.');
      router.push('/login');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unauthorized', handleUnauthorized);
      return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Attempting login for:', email);
      const response = await apiClient.login(email, password);
      
      // apiClient automatically saves token
      setToken(response.token);
      
      // Fetch user data
      const userData = await apiClient.getMe();
      setUser(userData);
      
      console.log('✅ Login successful:', userData.email);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.error('❌ Login error:', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('📝 Attempting registration for:', email);
      const response = await apiClient.register(name, email, password, confirmPassword);
      
      // apiClient automatically saves token
      setToken(response.token);
      
      // Fetch user data
      const userData = await apiClient.getMe();
      setUser(userData);
      
      console.log('✅ Registration successful:', userData.email);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ Registration error:', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('👋 Logging out...');
      
      // Call logout endpoint
      await apiClient.logout();
      
      // Clear state
      setUser(null);
      setToken(null);
      setError(null);
      
      console.log('✅ Logout successful');
      router.push('/login');
    } catch (err) {
      console.error('❌ Logout error:', err);
      // Clear state even if logout fails
      apiClient.clearToken();
      setUser(null);
      setToken(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Protected route HOC (optional, now handled by AuthProvider)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (!user) {
      // AuthProvider will handle redirect
      return null;
    }

    return <Component {...props} />;
  };
}