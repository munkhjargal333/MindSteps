'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Tier } from '@/lib/permissions';

export interface ThoughtContextValue {
  apiBase: string;
  token: string | null;
  tier: Tier;
  tierExpiresAt: string | null;
  loading: boolean;
  refreshTier: () => Promise<void>; // Эрх шинэчлэх функц нэмэв
}

const ThoughtContext = createContext<ThoughtContextValue | null>(null);

export function ThoughtProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const supabase = createClient();
  
  const [tier, setTier] = useState<Tier>('demo');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserSubscription = async () => {
    if (!user) {
      setTier('demo');
      setExpiresAt(null);
      setLoading(false);
      return;
    }

    try {
      // 1. Эхлээд JWT (Metadata)-аас Tier-ийг шууд авах (Маш хурдан)
      const jwtTier = (user.app_metadata?.tier as Tier) || 'demo';
      setTier(jwtTier);

      // 2. Database-аас Expiry болон сүүлийн үеийн Tier-ийг баталгаажуулж унших
      const { data, error } = await supabase
        .from('users')
        .select('tier, tier_expires_at')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const now = new Date();
        const dbExpire = data.tier_expires_at ? new Date(data.tier_expires_at) : null;

        // Хэрэв хугацаа нь дууссан бол 'free' болгох
        if (dbExpire && dbExpire < now) {
          setTier('free');
        } else {
          setTier(data.tier as Tier);
        }
        setExpiresAt(data.tier_expires_at);
      }
    } catch (err) {
      console.error('Tier fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSubscription();
  }, [user]);

  // Төлбөр төлсний дараа дуудах функц
  const refreshTier = async () => {
    setLoading(true);
    // JWT-г шинэчлэх (Refresh session)
    await supabase.auth.refreshSession();
    // Дахин датагаа татах
    await fetchUserSubscription();
  };

  const value: ThoughtContextValue = {
    apiBase: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    token,
    tier,
    tierExpiresAt: expiresAt,
    loading,
    refreshTier,
  };

  return (
    <ThoughtContext.Provider value={value}>
      {/* Loading үед UI-ыг бүхэлд нь гацаахгүй байж болно, эсвэл скелетон харуулж болно */}
      {children}
    </ThoughtContext.Provider>
  );
}

export function useThoughtContext() {
  const ctx = useContext(ThoughtContext);
  if (!ctx) throw new Error('useThoughtContext must be used within ThoughtProvider');
  return ctx;
}