'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function LessonDetailPage() {
  const { token, user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const id = params?.id as string;

  useEffect(() => {
    if (token && id) {
      loadLesson();
    }
  }, [token, id]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const totalScroll = documentHeight - windowHeight;
      const currentProgress = Math.min(Math.round((scrollTop / totalScroll) * 100), 100);
      
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadLesson = async () => {
    if (!token || !id) return;

    setLoading(true);
    try {
      // Use getLesson with ID instead of slug
      const data = await apiClient.getLesson(parseInt(id, 10), token);
      setLesson(data);
    } catch (error) {
      console.error('Error loading lesson:', error);
      showToast('Хичээл олдсонгүй 😞', 'error');
      router.push('/lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!token || !lesson) return;

    setCompleting(true);
    try {
      await apiClient.completeLesson(lesson.id, token);
      showToast(`✅ Баяр хүргэе! +${lesson.points_reward} оноо авлаа 🎉`, 'success');
      setShowRatingForm(true);
      
      // Update progress
      if (lesson.id) {
        await apiClient.markLessonProgress(lesson.id, {
          progress_percentage: 100,
          status: 'completed',
          time_spent: timeSpent
        }, token);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      showToast('❌ Алдаа гарлаа. Дахин оролдоно уу.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!token || !lesson || rating === 0) return;

    try {
      await apiClient.rateLesson(lesson.id, rating, review || undefined, token);
      showToast('✅ Үнэлгээ илгээгдлээ. Баярлалаа! 💖', 'success');
      setShowRatingForm(false);
      router.push('/lessons');
    } catch (error) {
      console.error('Error rating lesson:', error);
      showToast('❌ Үнэлгээ илгээхэд алдаа гарлаа', 'error');
    }
  };

  const getDifficultyBadge = (level: string) => {
    const badges = {
      beginner: { text: 'Анхан', color: 'bg-green-100 text-green-700 border-green-200' },
      intermediate: { text: 'Дунд', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      advanced: { text: 'Ахисан', color: 'bg-red-100 text-red-700 border-red-200' },
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Хичээл олдсонгүй
          </h2>
          <Link
            href="/lessons"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = getDifficultyBadge(lesson.difficulty_level);
  const isLocked = user && lesson.required_level > user.current_level;

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        {scrollProgress > 0 && (
          <div className="absolute top-2 right-4 bg-white shadow-lg rounded-full px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200">
            {scrollProgress}%
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pt-12">
        <ToastContainer />

        {/* HEADER */}
        <div className="mb-6">
          <Link href="/lessons" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Буцах
          </Link>
        </div>

        {/* LOCKED STATE */}
        {isLocked ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Энэ хичээл түгжээтэй байна
            </h2>
            <p className="text-gray-600 mb-4">
              Түвшин {lesson.required_level} хүрэх шаардлагатай
            </p>
            <div className="text-sm text-gray-500 mb-6">
              Таны одоогийн түвшин: {user?.current_level}
            </div>
            <Link
              href="/lessons"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Бусад хичээл үзэх
            </Link>
          </div>
        ) : (
          <>
            {/* MAIN CONTENT */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              {/* Thumbnail */}
              {lesson.thumbnail_url && (
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-100 to-purple-100">
                  <img
                    src={lesson.thumbnail_url}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-3xl">{getTypeIcon(lesson.lesson_type)}</span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium border-2 ${difficulty.color}`}>
                    {difficulty.text}
                  </span>
                  {lesson.estimated_duration && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      ⏱️ {lesson.estimated_duration} минут
                    </span>
                  )}
                  {lesson.points_reward > 0 && (
                    <span className="text-sm text-blue-600 flex items-center gap-1 font-semibold">
                      ⭐ +{lesson.points_reward} оноо
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {lesson.title}
                </h1>

                {/* Description */}
                {lesson.description && (
                  <p className="text-lg text-gray-600 mb-6">
                    {lesson.description}
                  </p>
                )}

                {/* Time Tracker */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      ⏱️ Зарцуулсан цаг:
                    </span>
                    <span className="text-lg font-bold text-blue-900">
                      {formatTime(timeSpent)}
                    </span>
                  </div>
                </div>

                {/* Content - Markdown rendered */}
                {lesson.content && (
                  <div className="prose prose-lg max-w-none mb-8">
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }}
                    />
                  </div>
                )}

                {/* Media */}
                {lesson.media_url && (
                  <div className="mb-8">
                    {lesson.lesson_type === 'video' && (
                      <video
                        controls
                        className="w-full rounded-lg shadow-md"
                        src={lesson.media_url}
                      >
                        Таны вэб хөтөч видео дэмжихгүй байна.
                      </video>
                    )}
                    {lesson.lesson_type === 'audio' && (
                      <audio
                        controls
                        className="w-full"
                        src={lesson.media_url}
                      >
                        Таны вэб хөтөч аудио дэмжихгүй байна.
                      </audio>
                    )}
                  </div>
                )}

                {/* Tags */}
                {lesson.tags && Array.isArray(lesson.tags) && lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {lesson.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Complete Button */}
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                >
                  {completing ? 'Хадгалж байна...' : '✅ Хичээл дуусгах'}
                </button>
              </div>
            </div>

            {/* RATING FORM */}
            {showRatingForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ⭐ Хичээлийг үнэлэх
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Үнэлгээ
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-3xl transition hover:scale-110"
                      >
                        {star <= rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Санал (заавал биш)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    placeholder="Хичээлийн талаар таны санал бодол..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Илгээх
                  </button>
                  <button
                    onClick={() => router.push('/lessons')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:scale-95 transition"
                  >
                    Алгасах
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}