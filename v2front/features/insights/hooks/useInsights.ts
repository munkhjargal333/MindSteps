// ─────────────────────────────────────────────────────────────────────────────
// features/insights/hooks/useInsights.ts
// Maslow-aligned deep insights data hook
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import type { DeepInsight } from '@/types';
import { listDeepInsights } from '@/lib/services/journal.service';

export function useInsights(token: string | null) {
  const [insights, setInsights] = useState<DeepInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listDeepInsights(token)
      .then(setInsights)
      .catch((err) => setError(err instanceof Error ? err.message : 'Алдаа гарлаа'))
      .finally(() => setLoading(false));
  }, [token]);

  return { insights, loading, error } as const;
}
