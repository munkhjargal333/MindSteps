'use client';

import { useAuth } from '@/contexts/AuthContext';
import type { Tier } from '../../types/types';

export function useTier(): Tier {
  const { user } = useAuth();
  return user?.user_metadata?.plan === 'pro' ? 'pro' : 'free';
}
