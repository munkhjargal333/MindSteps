// ─────────────────────────────────────────────────────────────────────────────
// contexts/TierContext.tsx
// Global Context — Subscription tier state only.
// Reads from Supabase DB + JWT. Exposes refreshTier for post-payment use.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import type { Tier } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TierContextValue {
  tier: Tier;
  tierExpiresAt: string | null;
  loading: boolean;
  token: string | null; // Exposed so services can access it via context
  apiBase: string;
  refreshTier: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TierContext = createContext<TierContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TierProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const supabase = createClient();

  const [tier, setTier] = useState<Tier>('demo');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setTier('demo');
      setExpiresAt(null);
      setLoading(false);
      return;
    }

    try {
      // 1. Optimistic: read from JWT metadata (fast, no network)
      const jwtTier = (user.app_metadata?.tier as Tier) || 'demo';
      setTier(jwtTier);

      // 2. Authoritative: verify expiry against DB
      const { data, error } = await supabase
        .from('users')
        .select('tier, tier_expires_at')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const dbExpire = data.tier_expires_at ? new Date(data.tier_expires_at) : null;
        // Downgrade if subscription expired
        setTier(dbExpire && dbExpire < new Date() ? 'free' : (data.tier as Tier));
        setExpiresAt(data.tier_expires_at);
      }
    } catch (err) {
      console.error('Tier fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refreshTier = async () => {
    setLoading(true);
    await supabase.auth.refreshSession();
    await fetchSubscription();
  };

  return (
    <TierContext.Provider
      value={{
        tier,
        tierExpiresAt: expiresAt,
        loading,
        token,
        apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
        refreshTier,
      }}
    >
      {children}
    </TierContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useThoughtContext(): TierContextValue {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useThoughtContext must be used within TierProvider');
  return ctx;
}
