'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Tier } from './types';

interface ThoughtContextValue {
  apiBase: string;
  token: string | null;
  tier: Tier;
}

const ThoughtContext = createContext<ThoughtContextValue | null>(null);

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  const value: ThoughtContextValue = {
    apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    token,
    tier: user?.user_metadata?.plan === 'pro' ? 'pro' : 'free',
  };

  return (
    <ThoughtContext.Provider value={value}>
      {children}
    </ThoughtContext.Provider>
  );
}

export function useThoughtContext() {
  const ctx = useContext(ThoughtContext);
  if (!ctx) throw new Error('useThoughtContext must be used within ThoughtProvider');
  return ctx;
}
