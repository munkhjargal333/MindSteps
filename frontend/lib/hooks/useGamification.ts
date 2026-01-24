// hooks/useGamification.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserGamification } from '@/lib/types';

export function useGamification(userId: string | undefined) {
  const [gamification, setData] = useState<UserGamification | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchGamification = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
    .from('user_gamification')
    .select(`
        *,
        level:current_level_id (
        *
        )
    `)
    .eq('user_id', userId)
    .single();

    if (!error) setData(data);
    // console.log("data",data);
    if (error) console.error("error",error);

    setLoading(false);
  };

  useEffect(() => {
    fetchGamification();
  }, [userId]);

  return { gamification, loading, refresh: fetchGamification };
}