'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  Plus, Search, Edit2, Trash2, Eye, 
  FileText, Video, Headphones, Gamepad2, 
  Filter, MoreVertical, Image as ImageIcon,
  CheckCircle2, CircleDashed, Star
} from 'lucide-react';

export default function AdminLessonsPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonsData, categoriesData] = await Promise.all([
        apiClient.getLessons(1, 100, token!), // Admin дээр ихээр нь татаж байна
        apiClient.getLessonCategories(token!)
      ]);
      setLessons(lessonsData.lessons || []);
      setCategories(categoriesData);
    } catch (error) {
      showToast('Өгөгдөл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const matchesCategory = selectedCategory === 0 || lesson.category_id === selectedCategory;
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [lessons, selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: lessons.length,
    published: lessons.filter(l => l.is_published).length,
    premium: lessons.filter(l => l.is_premium).length
  }), [lessons]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" хичээлийг устгах уу?`)) return;
    setDeletingId(id);
    try {
      await apiClient.deleteLesson(id, token!);
      showToast('Амжилттай устгагдлаа', 'success');
      setLessons(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      showToast('Устгахад алдаа гарлаа', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={18} />;
      case 'audio': return <Headphones size={18} />;
      case 'interactive': return <Gamepad2 size={18} />;
      default: return <FileText size={18} />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Ачаалж байна...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Хичээлийн удирдлага</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Системд байгаа бүх контентыг хянах</p>
            </div>
            <Link
              href="/admin/lessons/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              <Plus size={20} /> Шинэ хичээл нэмэх
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Нийт хичээл</p>
              <p className="text-2xl font-black text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Нийтлэгдсэн</p>
              <p className="text-2xl font-black text-emerald-700">{stats.published}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Premium</p>
              <p className="text-2xl font-black text-amber-700">{stats.premium}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Гарчиг болон тайлбараас хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm"
            />
          </div>
          <div className="relative min-w-[240px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm appearance-none"
            >
              <option value={0}>Бүх ангилал</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name_mn} className="font-bold">
                  {cat.children?.map(child => (
                    <option key={child.id} value={child.id}>{child.emoji} {child.name_mn}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Хичээл</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Төрөл</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлөв</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Стат</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                        {lesson.thumbnail_url ? (
                          <img src={lesson.thumbnail_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{lesson.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(lesson.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      {getIcon(lesson.lesson_type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {lesson.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                          <CheckCircle2 size={10} /> НИЙТЛЭГДСЭН
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full w-fit">
                          <CircleDashed size={10} /> НООРОГ
                        </span>
                      )}
                      {lesson.is_premium && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                          <Star size={10} fill="currentColor" /> PREMIUM
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1"><Eye size={12} className="text-gray-300"/> {lesson.view_count}</span>
                      <span className="text-[10px] text-gray-400">{lesson.estimated_duration} мин</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/lessons/${lesson.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Засах"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(lesson.id, lesson.title)}
                        disabled={deletingId === lesson.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                        title="Устгах"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLessons.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Хичээл олдсонгүй</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}