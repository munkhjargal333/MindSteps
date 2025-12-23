'use client';

import Link from 'next/link';
import { Lesson } from '@/lib/types';

interface LessonCardProps {
  lesson: Lesson;
  userLevel?: number;
}

export default function LessonCard({ lesson, userLevel = 1 }: LessonCardProps) {
  const isLocked = lesson.required_level > userLevel;

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

  const difficulty = getDifficultyBadge(lesson.difficulty_level);

  return (
    <Link
      href={isLocked ? '#' : `/lessons/${lesson.slug}`}
      className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {lesson.thumbnail_url ? (
          <img
            src={lesson.thumbnail_url}
            alt={lesson.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            {getTypeIcon(lesson.lesson_type)}
          </div>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-sm font-semibold">
                Түвшин {lesson.required_level} шаардлагатай
              </div>
            </div>
          </div>
        )}

        {lesson.is_premium && !isLocked && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            ⭐ PREMIUM
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
            {lesson.title}
          </h3>
          <span className="text-xl flex-shrink-0">
            {getTypeIcon(lesson.lesson_type)}
          </span>
        </div>

        {lesson.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {lesson.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficulty.color}`}>
            {difficulty.text}
          </span>
          
          {lesson.estimated_duration && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              ⏱️ {lesson.estimated_duration} мин
            </span>
          )}

          {lesson.points_reward > 0 && (
            <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold">
              ⭐ +{lesson.points_reward}
            </span>
          )}
        </div>

        {lesson.view_count > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            👁️ {lesson.view_count.toLocaleString()} үзсэн
          </div>
        )}
      </div>
    </Link>
  );
}