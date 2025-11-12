'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import StatCard from '@/components/dashboard/StatCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';

interface UserStats {
  total_journals?: number;
  total_mood_entries?: number;
  total_meditation_minutes?: number;
  streaks?: Array<{ current_streak?: number }>;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient.getUserStats(token);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-base sm:text-lg text-gray-600">Ачаалж байна...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

      {/* USER HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8 shadow-xl">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
          Сайн байна уу, {user?.name}!
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5 sm:py-3">
            <span className="text-xs sm:text-sm opacity-90 block">Түвшин</span>
            <div className="text-xl sm:text-2xl font-bold">{user?.current_level}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5 sm:py-3">
            <span className="text-xs sm:text-sm opacity-90 block">Нийт оноо</span>
            <div className="text-xl sm:text-2xl font-bold">{user?.total_score}</div>
          </div>
          <div className="flex-1">
            <div className="text-xs sm:text-sm opacity-90 mb-1.5 sm:mb-2">Түвшин явц</div>
            <div className="bg-white/30 rounded-full h-2.5 sm:h-3">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${user?.level_progress || 0}%` }}
              />
            </div>
            <div className="text-xs opacity-75 mt-1 text-right">{user?.level_progress}%</div>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">📊 Таны статистик</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard label="Тэмдэглэл" value={stats?.total_journals || 0} icon="📔" colorClass="bg-blue-500" />
          <StatCard label="Сэтгэл" value={stats?.total_mood_entries || 0} icon="😊" colorClass="bg-green-500" />
          <StatCard label="Бясалгал" value={`${stats?.total_meditation_minutes || 0}м`} icon="🧘" colorClass="bg-purple-500" />
          <StatCard label="Streak" value={stats?.streaks?.[0]?.current_streak || 0} icon="🔥" colorClass="bg-orange-500" />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">🚀 Хурдан үйлдэл</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <QuickActionCard href="/journal/new" icon="✏️" title="Өдрийн тэмдэглэл бичих" description="Өнөөдрийн сэтгэгдлээ бичээрэй" gradient="bg-gradient-to-br from-blue-400 to-blue-600" />
          <QuickActionCard href="/mood/track" icon="💭" title="Сэтгэл санаа" description="Өнөөдрийн сэтгэлээ тэмдэглэх" gradient="bg-gradient-to-br from-green-400 to-green-600" />
          <QuickActionCard href="/meditation/session" icon="🧘‍♀️" title="Бясалгал" description="Бясалгал эхлүүлэх" gradient="bg-gradient-to-br from-purple-400 to-purple-600" />
        </div>
      </div>

    </div>
  );
}
