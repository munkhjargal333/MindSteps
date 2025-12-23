'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function LessonsListPage() {
  const { token, user } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [categoriesData, lessonsData] = await Promise.all([
        apiClient.getLessonCategories(token),
        apiClient.getLessons(token)
      ]);
      
      setCategories(categoriesData);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, loadData]);

  const handleParentClick = (parentId: number | null) => {
    setSelectedParent(parentId);
    setSelectedCategory(null);
  };

  const handleChildClick = (childId: number | null) => {
    setSelectedCategory(childId);
  };

  const getDifficultyBadge = (level: string) => {
    const badges = {
      beginner: { text: 'Анхан', color: 'bg-green-100 text-green-700' },
      intermediate: { text: 'Дунд', color: 'bg-yellow-100 text-yellow-700' },
      advanced: { text: 'Ахисан', color: 'bg-red-100 text-red-700' },
    };
    return badges[level as keyof typeof badges] || badges.beginner;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      article: '📝',
      video: '🎥',
      audio: '🎧',
      interactive: '🎮',
      meditation: '🧘',
    };
    return icons[type as keyof typeof icons] || '📚';
  };

  const filteredLessons = (() => {
    if (selectedCategory) {
      return lessons.filter(l => l.category_id === selectedCategory);
    }
    else if (selectedParent) {
      const parent = categories.find(c => c.id === selectedParent);
      const childIds = parent?.children?.map(c => c.id) || [];
      return lessons.filter(l => childIds.includes(l.category_id));
    }
    return lessons;
  })();

  const parentCategories = categories.filter(c => !c.parent_id);
  const selectedParentCategory = parentCategories.find(c => c.id === selectedParent);
  const childCategories = selectedParentCategory?.children || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-base text-gray-600">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <ToastContainer />

      {/* HEADER - Compact on mobile */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          📚 Хичээлүүд
        </h1>
        <p className="text-xs sm:text-base text-gray-600">
          Өөрийгөө хөгжүүлэх мэдлэг
        </p>
      </div>

      {/* PARENT CATEGORIES - Minimal chips on mobile */}
      <div className="mb-3 sm:mb-4">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {/* Бүгд */}
          <button
            onClick={() => handleParentClick(null)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
              selectedParent === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            Бүгд
          </button>

          {/* Parent Categories */}
          {parentCategories.map((parent) => {
            const isActive = selectedParent === parent.id;

            return (
              <button
                key={parent.id}
                onClick={() => handleParentClick(parent.id)}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline mr-1">{parent.emoji || '📖'}</span>
                {parent.name_mn}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHILD CATEGORIES - Minimal pills */}
      {selectedParent && childCategories.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {/* Бүгд */}
            <button
              onClick={() => handleChildClick(null)}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCategory === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-50 text-gray-600 active:bg-gray-100'
              }`}
            >
              Бүгд
            </button>

            {childCategories.map((child) => {
              const isActive = selectedCategory === child.id;

              return (
                <button
                  key={child.id}
                  onClick={() => handleChildClick(child.id)}
                  className={`flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                  }`}
                >
                  {child.name_mn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LESSONS GRID */}
      <div>
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-5xl mb-3">📚</div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">
              Хичээл байхгүй байна
            </h2>
            <p className="text-sm text-gray-500">
              Энэ категорид хичээл нэмэгдээгүй
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredLessons.map((lesson) => {
              const difficulty = getDifficultyBadge(lesson.difficulty_level);
              const isLocked = user && lesson.required_level > user.current_level;

              return (
                <Link
                  key={lesson.id}
                  href={isLocked ? '#' : `/lessons/${lesson.id}`}
                  className={`group bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden border border-gray-100 ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98] sm:hover:-translate-y-1'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    {lesson.thumbnail_url ? (
                      <img
                        src={lesson.thumbnail_url}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-5xl sm:text-6xl">
                        {getTypeIcon(lesson.lesson_type)}
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-3xl sm:text-4xl mb-1">🔒</div>
                          <div className="text-xs sm:text-sm font-semibold">Түвшин {lesson.required_level}</div>
                        </div>
                      </div>
                    )}

                    {lesson.is_premium && !isLocked && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                        ⭐ PRO
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition flex-1">
                        {lesson.title}
                      </h3>
                      <span className="text-lg sm:text-xl flex-shrink-0">
                        {getTypeIcon(lesson.lesson_type)}
                      </span>
                    </div>

                    {lesson.description && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                        {lesson.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficulty.color}`}>
                        {difficulty.text}
                      </span>
                      
                      {lesson.estimated_duration && (
                        <span className="text-xs text-gray-500">
                          {lesson.estimated_duration}мин
                        </span>
                      )}

                      {lesson.points_reward > 0 && (
                        <span className="text-xs text-blue-600 font-semibold">
                          +{lesson.points_reward}
                        </span>
                      )}
                    </div>

                    {lesson.view_count > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        {lesson.view_count.toLocaleString()} үзсэн
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}