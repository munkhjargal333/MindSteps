'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  Plus, Search, Edit2, Trash2, 
  FileText, BookOpen, Compass, Gamepad2, Flower2, HeartPulse,
  Filter, Image as ImageIcon,
  CheckCircle2, CircleDashed, Star, Eye, ChevronRight
} from 'lucide-react';

export default function AdminLessonsPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Шүүлтүүрийн state
  const [selectedParentId, setSelectedParentId] = useState<number | string>('all');
  const [selectedChildId, setSelectedChildId] = useState<number | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [lessonsData, categoriesData] = await Promise.all([
        apiClient.getLessons(1, 100, token), 
        apiClient.getLessonCategories(token)
      ]);
      setLessons(lessonsData.lessons || []);
      // Шинэ бүтэц: Backend-ээс ирсэн categories.lessons эсвэл шууд массив
      setCategories(categoriesData.lessons || categoriesData || []);
    } catch (error) {
      showToast('Өгөгдөл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  // Сонгогдсон Parent-ийн Child ангиллуудыг гаргаж авах
  const availableChildren = useMemo(() => {
    if (selectedParentId === 'all') return [];
    const parent = categories.find(c => c.id === Number(selectedParentId));
    return parent?.children || [];
  }, [categories, selectedParentId]);

  // Шүүлтүүрийн логик
  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      // 1. Хайлт
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Ангилал (Parent болон Child)
      let matchesCategory = true;
      if (selectedChildId !== 'all') {
        matchesCategory = lesson.category_id === Number(selectedChildId);
      } else if (selectedParentId !== 'all') {
        // Хэрэв зөвхөн Parent сонгосон бол тухайн Parent-ийн бүх Child-уудын хичээлийг харуулна
        const childIds = availableChildren.map(c => c.id);
        matchesCategory = lesson.category_id === Number(selectedParentId) || childIds.includes(lesson.category_id);
      }

      return matchesSearch && matchesCategory;
    });
  }, [lessons, searchQuery, selectedParentId, selectedChildId, availableChildren]);

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
      case 'theory_article': return <BookOpen size={18} className="text-blue-500" />;
      case 'guided_article': return <Compass size={18} className="text-emerald-500" />;
      case 'core_meditation': return <Flower2 size={18} className="text-purple-500" />;
      case 'healing_meditation': return <HeartPulse size={18} className="text-red-500" />;
      default: return <FileText size={18} />;
    }
  };

  // 2. Хүндрэлийн түвшинд тохирсон өнгө (Badge)
  const getDifficultyBadge = (level: string) => {
    const styles = {
      beginner: "bg-green-50 text-green-600 border-green-100",
      intermediate: "bg-orange-50 text-orange-600 border-orange-100",
      advanced: "bg-red-50 text-red-600 border-red-100"
    };
    
    const labels = {
      beginner: "Анхан",
      intermediate: "Дунд",
      advanced: "Гүнзгий"
    };

    return (
      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Нийт хичээл</p>
              <p className="text-2xl font-black text-blue-700">{stats.total}</p>
            </div>
            {/* Бусад статистикууд... */}
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
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm"
            />
          </div>
          
          {/* Parent Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedParentId}
              onChange={(e) => {
                setSelectedParentId(e.target.value);
                setSelectedChildId('all'); // Үндсэн бүлэг солигдоход дэд бүлгийг reset хийнэ
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm appearance-none"
            >
              <option value="all">Бүх үндсэн бүлэг</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name_mn}</option>
              ))}
            </select>
          </div>

          {/* Child Category Filter */}
          {selectedParentId !== 'all' && availableChildren.length > 0 && (
            <div className="relative min-w-[200px]">
              <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm text-blue-700 appearance-none"
              >
                <option value="all">Бүх дэд бүлэг</option>
                {availableChildren.map(child => (
                  <option key={child.id} value={child.id}>{child.emoji} {child.name_mn}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Хичээл</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Төрөл</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлөв</th>
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
                          <img src={lesson.thumbnail_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{lesson.title}</p>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">
                           ID: {lesson.category_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400 group-hover:text-blue-500">
                    {getIcon(lesson.lesson_type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {lesson.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                          <CheckCircle2 size={10} /> НИЙТЛЭГДСЭН
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full w-fit">
                          <CircleDashed size={10} /> НООРОГ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/lessons/${lesson.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(lesson.id, lesson.title)}
                        disabled={deletingId === lesson.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
            <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest text-xs">
              Хичээл олдсонгүй
            </div>
          )}
        </div>
      </div>
    </div>
  );
}