import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Journal, JournalListResponse } from '@/lib/types'; 

export function useJournals(userId: string | undefined, page: number = 1, limit: number = 10) {

  const [data, setData] = useState<JournalListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const supabase = createClient();

  const fetchJournals = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Supabase-ээс өгөгдөл татах
    const { data: journals, count, error: supabaseError } = await supabase
      .from('journals')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (supabaseError) {
      console.error("Fetch Error:", supabaseError);
      setError(supabaseError);
    } else {
      // Таны тодорхойлсон JournalListResponse бүтэц рүү хөрвүүлэх
      setData({
        journals: journals as Journal[],
        total: count || 0,
        page: page,
        limit: limit
      });
    }

    setLoading(false);
  }, [userId, page, limit, supabase]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  return { data, loading, error, refresh: fetchJournals };
}