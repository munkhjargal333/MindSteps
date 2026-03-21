'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Tier } from '@/lib/permissions';

export interface ThoughtContextValue {
  apiBase: string;
  token: string | null;
  tier: Tier;
}

const ThoughtContext = createContext<ThoughtContextValue | null>(null);

function resolveTier(plan: string | undefined, role: string | undefined): Tier {
  if (role === 'admin') return 'admin';
  if (plan === 'premium') return 'premium';
  if (plan === 'pro') return 'pro';
  return 'free';
}

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  const tier = resolveTier(
    user?.user_metadata?.plan,
    user?.user_metadata?.role,
  );

  const value: ThoughtContextValue = {
    apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    token,
    tier,
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