'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { DashboardStats } from '@/lib/types';
import { BookOpen, Activity, Flame, TrendingUp, ArrowRight, Target, Sparkles, Plus } from 'lucide-react';
import { EmotionWheel } from '@/components/mood/EmotionWheel';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await apiClient.getUserStats(token);
      setData(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <div className="flex items-center justify-center min-h-screen text-gray-600">Өгөгдөл олдсонгүй</div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-3 sm:p-6">

      {/* 1. PREMIUM GAMIFIED HERO */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-6 mb-8 shadow-2xl shadow-indigo-200/50">
        
        {/* Хөдөлгөөнтэй өнгөлөг арын фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-[60px]"></div>

        <div className="relative z-10">
          {/* Дээд хэсэг: Level Icon & Name Profile */}
          <div className="flex items-center gap-4 mb-8">
            {/* Icon Holder - Шилэн эффекттэй */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 blur-lg rounded-2xl"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-xl">
                <Sparkles className="w-9 h-9 text-yellow-300 drop-shadow-glow" />
                {/* Жижиг Badge - Level Number */}
                <div className="absolute -bottom-2 -right-2 bg-white text-indigo-600 text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shadow-lg border border-indigo-50">
                  {user?.gamification?.Level?.level_number || 1}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-black text-white leading-tight drop-shadow-sm">
                {user?.name}
              </h1>
              {/* Level Name - Өнгөлөг Badge */}
              <div className="inline-flex items-center gap-1.5 mt-1 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300">
                  {user?.gamification?.Level?.level_name || 'Legendary'}
                </span>
              </div>
            </div>

            {/* Streak Badge - Хөвөгч загвар */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col items-center min-w-[60px]">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span className="text-sm font-black text-white mt-0.5">{user?.gamification?.current_streak || 0}</span>
            </div>
          </div>

          {/* Доод хэсэг: Progress Card (Glassmorphism) */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-inner">
            <div className="flex justify-between items-end mb-3 px-1">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Нийт оноо</p>
                <p className="text-xl font-black text-white leading-none">
                  {user?.gamification?.total_score?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-right font-mono">
                  {user?.gamification?.level_progress || 0}%
                </p>
                <p className="text-xs font-bold text-white">Дараагийн түвшин</p>
              </div>
            </div>

            {/* Progress Bar - Glow effect */}
            <div className="relative h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-white shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out"
                style={{ width: `${user?.gamification?.level_progress || 0}%` }}
              >
                {/* Гялбаа - Scanning effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EMOTION WHEEL */}
      {/* <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Миний сэтгэл хөдлөлүүд</h2>
        <EmotionWheel data={data.plutchik_wheel} />
      </div> */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-gray-200/40 border border-gray-50">
    <div className="flex items-center justify-between mb-8">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Миний идэвх</span>
      <TrendingUp className="w-4 h-4 text-green-500" />
    </div>
    
    <div className="space-y-6">
      {/* Тэмдэглэлийн хэсэг */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-2xl shadow-sm">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 leading-none">
            {data?.stats.total_journals || 0}
          </span>
          <span className="text-[11px] font-bold text-gray-400 uppercase mt-1">Нийт тэмдэглэл</span>
        </div>
      </div>

      {/* Хуваагч зураас (маш бүдэг) */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

      {/* Сэтгэл санааны хэсэг */}
      <div className="flex items-center gap-4">
        <div className="bg-rose-50 p-3 rounded-2xl shadow-sm">
          <Activity className="w-6 h-6 text-rose-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 leading-none">
            {data?.stats.total_moods || 0}
          </span>
          <span className="text-[11px] font-bold text-gray-400 uppercase mt-1">Сэтгэл санаа</span>
        </div>
      </div>
    </div>
  </div>

  {/* 2. Хичээлийн явц - BookOpen Image & Progress */}
  <div className="bg-white rounded-[2rem] p-7 shadow-xl shadow-gray-200/40 border border-gray-50 md:col-span-2">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-200 blur-lg opacity-40 rounded-full"></div>
          <div className="relative bg-purple-600 p-3.5 rounded-2xl shadow-lg shadow-purple-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 leading-none">Хичээлийн явц</h3>
          <p className="text-xs font-bold text-gray-400 mt-1.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            Нийт {data?.stats.total_lessons_completed} хичээл дуусгасан
          </p>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
      {data?.category_progress.map(cat => (
        <div key={cat.category_id} className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none filter drop-shadow-sm">{cat.emoji}</span>
              <span className="text-[13px] font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                {cat.category_name}
              </span>
            </div>
            <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              {Math.round(cat.progress_percent)}%
            </span>
          </div>
          <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${cat.progress_percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-3 sm:p-6">
      <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-48 sm:h-64 mb-4 sm:mb-8 animate-pulse"></div>
      <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-64 sm:h-96 mb-4 sm:mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-32 sm:h-40 animate-pulse"></div>
        <div className="bg-gray-200 rounded-2xl sm:rounded-3xl h-32 sm:h-40 sm:col-span-2 animate-pulse"></div>
      </div>
    </div>
  );
}