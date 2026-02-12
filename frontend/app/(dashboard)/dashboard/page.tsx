'use client';

import { useAuth } from '@/context/AuthContext';
import { useStats } from '@/lib/hooks/userStat';
import { useGamification } from '@/lib/hooks/useGamification';
import { useAutoTour } from '@/lib/hooks/useAutoTour';
import { TourButton } from '@/components/ui/TourButton';

import { BookOpen, Activity, Flame, TrendingUp, ArrowRight, Target, Sparkles, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  useAutoTour('dashboard'); // Автоматаар эхлүүлэх

  const { dashboard, loading: statsLoading, error: statsError } = useStats(user?.id);
  const { gamification, loading: gamiLoading } = useGamification(user?.id);

  // Аль нэг нь ачаалж байвал Skeleton харуулна
  const isLoading = statsLoading || gamiLoading;

  if (isLoading) return <LoadingSkeleton />;
  
  // Алдаа болон өгөгдөлгүй үеийн шалгалт
  if (statsError) return <div className="p-10 text-center text-red-500">Алдаа гарлаа</div>;
  if (!dashboard || !gamification) return <div className="flex ...">Өгөгдөл олдсонгүй</div>;
  if (!gamification) return <div className="flex items-center justify-center min-h-screen text-gray-600">Өгөгдөл олдсонгүй</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-3 sm:p-6">
{/* <TourButton tourType="dashboard" className="ml-1" /> */}

      {/* 1. PREMIUM GAMIFIED HERO */}
      <div className="gamification-hero relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 mb-6 shadow-2xl shadow-indigo-200/50">
        
        {/* Арын фон (Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
            
            {/* Icon Holder - Emoji харуулах хэсэг */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 blur-lg rounded-xl md:rounded-2xl"></div>
              <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-xl">
                
                {/* Энд Emoji-г текст хэлбэрээр гаргана */}
                <span className="text-2xl md:text-4xl drop-shadow-md select-none">
                  {gamification?.level?.icon || "🌱"}
                </span>
                
                {/* Level Number Badge */}
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-white text-indigo-600 text-[9px] md:text-[11px] font-black w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center shadow-lg border border-indigo-50">
                  {gamification?.level?.level_number || 1}
                </div>
              </div>
            </div>

            {/* Нэр болон Level Name */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-black text-white leading-tight drop-shadow-sm truncate">
                {user?.user_metadata.full_name || user?.email || 'Сайн байна уу!'}
              </h1>
              <div className="inline-flex items-center gap-1.5 mt-0.5 md:mt-1 bg-black/20 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  {gamification?.level?.level_name || 'Legendary'}
                </span>
              </div>
            </div>

            {/* Streak Badge */}
            <div className="bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/20 flex flex-col items-center min-w-[50px]">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400" />
              <span className="text-xs md:text-sm font-black text-white mt-0.5">
                {gamification?.current_streak || 0}
              </span>
            </div>
          </div>

          {/* Progress Card (Glassmorphism) */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-3 md:p-5 border border-white/20 shadow-inner">
            <div className="flex justify-between items-end mb-2 px-1">
              <div className="space-y-0.5">
                <p className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Нийт оноо</p>
                <p className="text-base md:text-xl font-black text-white leading-none">
                  {gamification?.total_score?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] md:text-xs font-bold text-white mb-0.5">
                  {gamification?.level_progress || 0}%
                </p>
                <div className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Дараагийн түвшин</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 md:h-3 w-full bg-black/20 rounded-full overflow-hidden p-[1px]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-white transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ width: `${gamification?.level_progress || 0}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-shimmer"></div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* 1. Миний идэвх - Compact & Side-by-Side on Mobile */}
        <div data-tour="activity-card" className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-7 shadow-xl shadow-gray-200/40 border border-gray-50">
          <div className="flex items-center justify-between mb-5 md:mb-8">
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Миний идэвх</span>
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
          </div>
          
          {/* Зэрэгцээ байрлал (Mobile: Row, Desktop: Column болон бага зэрэг өөрчилж болно) */}
          <div className="flex flex-row md:flex-col gap-3 md:gap-6">
            
            {/* Тэмдэглэлийн хэсэг */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-gray-50/50 md:bg-transparent p-2 md:p-0 rounded-2xl">
              <div className="bg-blue-50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm shrink-0">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg md:text-2xl font-black text-gray-900 leading-none truncate">
                  {dashboard?.stats.total_journals || 0}
                </span>
                <span className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase mt-1 truncate">Тэмдэглэл</span>
              </div>
            </div>

            {/* Босоо хуваагч (Зөвхөн Mobile-д харагдана) */}
            <div className="w-px bg-gray-100 md:hidden"></div>
            {/* Хэвтээ хуваагч (Зөвхөн Desktop-д харагдана) */}
            <div className="hidden md:block h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

            {/* Сэтгэл санааны хэсэг */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 bg-gray-50/50 md:bg-transparent p-2 md:p-0 rounded-2xl">
              <div className="bg-rose-50 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm shrink-0">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg md:text-2xl font-black text-gray-900 leading-none truncate">
                  {dashboard?.stats.total_moods || 0}
                </span>
                <span className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase mt-1 truncate">Сэтгэл санаа</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Хичээлийн явц - Хэвээрээ боловч mobile дээр padding-г нь багасгав */}
        <div data-tour="progress-card" className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-xl shadow-gray-200/40 border border-gray-50 md:col-span-2">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200 blur-lg opacity-40 rounded-full"></div>
                <div className="relative bg-purple-600 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl shadow-lg shadow-purple-200">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black text-gray-900 leading-none">Мэдлэгийн явц</h3>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 md:mt-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
                  {dashboard?.stats.total_lessons_completed} хичээл дуусгасан
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 md:gap-y-6">
            {dashboard?.category_progress.map(cat => (
              <div key={cat.category_id} className="group">
                <div className="flex items-center justify-between mb-1.5 md:mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl leading-none">{cat.emoji}</span>
                    <span className="text-[12px] md:text-[13px] font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                      {cat.category_name}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                    {Math.round(cat.progress_percent)}%
                  </span>
                </div>
                <div className="relative h-1.5 md:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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