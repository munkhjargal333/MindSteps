import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DashboardStats } from '@/lib/types';

export function useStats(userId: string | undefined) {
  const [dashboard, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    // SQL Editor дээр үүсгэсэн 'get_dashboard_stats' функцийг дуудах
    const { data: stats, error: rpcError } = await supabase
      .rpc('get_dashboard_stats', {
        p_user_id: userId,
      });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      setError(rpcError);
    } else {
      setData(stats as DashboardStats);
    }

    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { dashboard, loading, error, refresh: fetchStats };
}