// ─────────────────────────────────────────────────────────────────────────────
// features/emotions/hooks/useEmotionStats.ts
// Plutchik's Wheel of Emotions — data hook
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import type { EmotionStat } from '@/types';
import { getEmotionStats } from '@/lib/services/journal.service';

export function useEmotionStats(token: string | null, days = 30) {
  const [stats, setStats] = useState<EmotionStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getEmotionStats(token, days)
      .then((data) => setStats(Array.isArray(data) ? data : []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Алдаа гарлаа'))
      .finally(() => setLoading(false));
  }, [token, days]);

  return { stats, loading, error } as const;
}
