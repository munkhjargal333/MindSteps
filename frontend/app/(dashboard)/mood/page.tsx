'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry, MoodCategory, Mood } from '@/lib/types';
import Link from 'next/link';

export default function MoodListPage() {
  const { token } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const loadMoodEntries = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiClient.getMoodEntries(page, 10, token);
      setMoodEntries(data.entries);
      setTotal(data.total);
      
      // Load statistics
      const stats = await apiClient.getMoodStatistics(30, token);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (token) {
      loadMoodEntries();
    }
  }, [token, loadMoodEntries]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    
    const confirmed = confirm('Энэ сэтгэл санааны бичлэгийг устгахдаа итгэлтэй байна уу?');
    if (!confirmed) return;
    
    setDeletingId(id);
    
    try {
      await apiClient.deleteMoodEntry(id, token);
      setMoodEntries(prev => prev.filter(e => e.id !== id));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      alert('Бичлэг устгахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-base sm:text-lg text-gray-600">Сэтгэл санаа ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          💜 Миний сэтгэл санаа
        </h1>
        <Link
          href="/mood/new"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 active:scale-95 transition text-center text-sm sm:text-base shadow-lg"
        >
          <span className="sm:hidden">+ Шинэ</span>
          <span className="hidden sm:inline">+ Сэтгэл санаа бичих</span>
        </Link>
      </div>

      {/* STATISTICS CARDS */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">
              {statistics.total_entries}
            </div>
            <div className="text-xs sm:text-sm text-purple-600 font-medium">Нийт бичлэг</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">
              {statistics.period_days}
            </div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium">Өдөр</div>
          </div>
          
          {statistics.average_intensity && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">
                {statistics.average_intensity.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-medium">Дундаж эрчим</div>
            </div>
          )}
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
            <div className="text-2xl sm:text-3xl font-bold text-pink-700 mb-1">
              {Object.keys(statistics.mood_distribution || {}).length}
            </div>
            <div className="text-xs sm:text-sm text-pink-600 font-medium">Төрөл</div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {moodEntries.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="text-5xl sm:text-6xl mb-4">💜</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
            Сэтгэл санааны бичлэг байхгүй байна
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Өнөөдрийн сэтгэл санаагаа бичиж эхлээрэй!
          </p>
          <Link
            href="/mood/new"
            className="inline-block px-6 sm:px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 active:scale-95 transition shadow-lg"
          >
            Сэтгэл санаа бичих
          </Link>
        </div>
      ) : (
        <>
          {/* MOOD ENTRIES LIST */}
          <div className="space-y-3 sm:space-y-4">
            {moodEntries.map((entry) => (
              <MoodCard 
                key={entry.id} 
                entry={entry}
                onDelete={handleDelete}
                isDeleting={deletingId === entry.id}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {total > 10 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
              >
                ← Өмнөх
              </button>
              
              <div className="px-4 py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg text-sm sm:text-base">
                {page} / {Math.ceil(total / 10)}
              </div>
              
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 10)}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
              >
                Дараах →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// MOOD CARD COMPONENT
function MoodCard({ 
  entry, 
  onDelete, 
  isDeleting 
}: { 
  entry: MoodEntry;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600 bg-red-50';
    if (intensity >= 6) return 'text-orange-600 bg-orange-50';
    if (intensity >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getIntensityEmoji = (intensity: number) => {
    if (intensity >= 8) return '🔥';
    if (intensity >= 6) return '😊';
    if (intensity >= 4) return '😐';
    return '😌';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all border border-transparent hover:border-purple-200 relative">
      
      {/* ACTION BUTTONS */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowActions(!showActions);
          }}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-xl"
        >
          ⋮
        </button>

        <div className={`
          ${showActions ? 'flex' : 'hidden sm:flex'} 
          ${showActions ? 'absolute top-10 right-0 bg-white shadow-xl rounded-lg p-2 flex-col gap-1 border border-gray-200' : 'flex-row gap-2'}
        `}>
          <Link
            href={`/mood/edit/${entry.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
            }}
            className="px-3 py-2 hover:bg-purple-50 text-purple-600 rounded-lg transition text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-base">✏️</span>
            <span>Засах</span>
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowActions(false);
              onDelete(entry.id);
            }}
            disabled={isDeleting}
            className="px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg transition text-sm font-medium flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Устгаж байна...</span>
              </>
            ) : (
              <>
                <span className="text-base">🗑️</span>
                <span>Устгах</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <Link href={`/mood/${entry.id}`} className="block group">
        <div className="pr-8 sm:pr-40">
        
        {/* DATE & INTENSITY */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            {formatDate(entry.when_felt || entry.created_at)}
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getIntensityColor(entry.intensity)}`}>
            {/* <span>{getIntensityEmoji(entry.intensity)}</span> */}
            <span>{entry.intensity}/10</span>
          </div>
        </div>
            {/* TODO mood id */}
        {/* MOOD NAME */}
        {/* <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
          {entry.mood?.name || 'Сэтгэл санаа'}
        </h3> */}
        
        {/* TRIGGER EVENT */}
        {entry.trigger_event && (
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Шалтгаан:</span> {entry.trigger_event}
          </p>
        )}
        
        {/* COPING STRATEGY */}
        {entry.coping_strategy && (
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Арга:</span> {entry.coping_strategy}
          </p>
        )}
        
        {/* NOTES */}
        {entry.notes && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-3 italic">
            "{entry.notes}"
          </p>
        )}
        
        {/* METADATA */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
          {entry.location && (
            <span className="flex items-center gap-1">
              📍 {entry.location}
            </span>
          )}
          {entry.weather && (
            <span className="flex items-center gap-1">
              🌤️ {entry.weather}
            </span>
          )}
        </div>
        </div>
      </Link>

    </div>
  );
}