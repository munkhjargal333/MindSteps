'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function AdminLessonsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [lessonsData, categoriesData] = await Promise.all([
        apiClient.getLessons(token),
        apiClient.getLessonCategories(token)
      ]);
      
      setLessons(lessonsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Өгөгдөл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" хичээлийг устгах уу?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await apiClient.deleteLesson(id, token ?? undefined);
      showToast('✅ Хичээл амжилттай устгагдлаа', 'success');
      setLessons(lessons.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      showToast('❌ Хичээл устгахад алдаа гарлаа', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteThumbnail = async (id: number) => {
    if (!confirm('Зургийг устгах уу?')) return;

    try {
      await apiClient.deleteLessonThumbnail(id, token?? undefined);
      showToast('✅ Зураг устгагдлаа', 'success');
      loadData();
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      showToast('❌ Зураг устгахад алдаа гарлаа', 'error');
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm('Медиа файлыг устгах уу?')) return;

    try {
      await apiClient.deleteLessonMedia(id, token ?? undefined );
      showToast('✅ Медиа файл устгагдлаа', 'success');
      loadData();
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('❌ Медиа файл устгахад алдаа гарлаа', 'error');
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesCategory = selectedCategory === 0 || lesson.category_id === selectedCategory;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📝';
      case 'video': return '🎥';
      case 'audio': return '🎧';
      case 'interactive': return '🎮';
      case 'meditation': return '🧘';
      default: return '📄';
    }
  };

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">🟢 Анхан</span>;
      case 'intermediate':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">🟡 Дунд</span>;
      case 'advanced':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">🔴 Ахисан</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📚 Хичээлүүд</h1>
            <p className="text-gray-600 mt-1">Нийт {filteredLessons.length} хичээл</p>
          </div>
          <Link
            href="/admin/lessons/new"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            ➕ Шинэ хичээл
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Хайх..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>📂 Бүх категори</option>
                {categories.map(cat => (
                  <optgroup key={cat.id} label={cat.name_mn}>
                    {cat.children?.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.emoji ? `${child.emoji} ` : ''}
                        {child.name_mn}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">📭 Хичээл олдсонгүй</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {lesson.thumbnail_url ? (
                      <div className="relative group">
                        <img
                          src={lesson.thumbnail_url}
                          alt={lesson.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteThumbnail(lesson.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                          title="Зураг устгах"
                        >
                          🗑️
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                        {getLessonTypeIcon(lesson.lesson_type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900">
                            {getLessonTypeIcon(lesson.lesson_type)} {lesson.title}
                          </h3>
                          {lesson.is_premium && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                              ⭐ Premium
                            </span>
                          )}
                          {lesson.is_published ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                              ✅ Нийтлэгдсэн
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                              📝 Ноорог
                            </span>
                          )}
                          {getDifficultyBadge(lesson.difficulty_level)}
                        </div>

                        {lesson.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                          <span>⏱️ {lesson.estimated_duration} мин</span>
                          <span>🏆 {lesson.points_reward} оноо</span>
                          <span>👁️ {lesson.view_count} үзэлт</span>
                          <span>📅 {new Date(lesson.created_at).toLocaleDateString('mn-MN')}</span>
                        </div>

                        {lesson.media_url && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600">
                              🎬 Медиа файл хавсаргасан
                            </span>
                            <button
                              onClick={() => handleDeleteMedia(lesson.id)}
                              className="text-red-600 hover:text-red-700 underline"
                            >
                              Устгах
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/admin/lessons/${lesson.id}/edit`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          ✏️ Засах
                        </Link>
                        <button
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          disabled={deletingId === lesson.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
                        >
                          {deletingId === lesson.id ? '⏳' : '🗑️'} Устгах
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}