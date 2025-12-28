'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { 
  BookOpen, Clock, Award, Lock, Sparkles, 
  ChevronDown, LayoutGrid, Layers, Check 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LessonsListPage() {
  const { token, user } = useAuth();
  const { showToast, ToastContainer } = useToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Dropdown states
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isChildOpen, setIsChildOpen] = useState(false);

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
      showToast('Мэдээлэл авахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  const selectedParentObj = categories.find(c => c.id === selectedParent);
  const selectedChildObj = selectedParentObj?.children?.find(c => c.id === selectedCategory);

  const filteredLessons = (() => {
    if (selectedCategory) return lessons.filter(l => l.category_id === selectedCategory);
    if (selectedParent) {
      const childIds = selectedParentObj?.children?.map(c => c.id) || [];
      return lessons.filter(l => childIds.includes(l.category_id));
    }
    return lessons;
  })();

  const getDifficultyStyles = (level: string) => {
    const styles = {
      beginner: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      intermediate: 'bg-amber-50 text-amber-600 border-amber-100',
      advanced: 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return styles[level as keyof typeof styles] || styles.beginner;
  };

  const getTypeIcon = (type: string) => {
    const icons = { article: '📝', video: '🎥', audio: '🎧', interactive: '🎮', meditation: '🧘' };
    return icons[type as keyof typeof icons] || '📚';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <ToastContainer />

      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        {/* HEADER */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 italic">
              Мэдлэгийн <span className="text-blue-600 not-italic">Сан</span>
            </h1>
          </div>
        </header>

        {/* --- CUSTOM DROPDOWNS --- */}
        <div className="flex flex-col gap-4 mb-10">
          {/* PARENT SELECTION */}
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 flex items-center gap-1.5">
              <LayoutGrid size={12} /> Үндсэн бүлэг
            </label>
            <button
              onClick={() => { setIsParentOpen(!isParentOpen); setIsChildOpen(false); }}
              className="w-full bg-white border border-gray-100 p-4 px-6 rounded-[1.5rem] text-sm font-bold text-gray-700 shadow-sm flex items-center justify-between transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2 truncate">
                {selectedParentObj ? `${selectedParentObj.emoji} ${selectedParentObj.name_mn}` : '📚 Бүх хичээлүүд'}
              </span>
              <ChevronDown size={20} className={`transition-transform duration-300 text-blue-500 ${isParentOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isParentOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 5 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-[100] top-full left-0 w-full bg-white border border-gray-100 rounded-[1.8rem] shadow-2xl p-2 overflow-hidden"
                >
                  <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                    <button
                      onClick={() => { setSelectedParent(null); setSelectedCategory(null); setIsParentOpen(false); }}
                      className="w-full p-4 text-left text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl flex items-center justify-between"
                    >
                      Бүх хичээлүүд {!selectedParent && <Check size={16} className="text-blue-600" />}
                    </button>
                    {categories.filter(c => !c.parent_id).map((parent) => (
                      <button
                        key={parent.id}
                        onClick={() => { setSelectedParent(parent.id); setSelectedCategory(null); setIsParentOpen(false); }}
                        className={`w-full p-4 text-left text-sm font-bold rounded-2xl flex items-center justify-between transition-colors ${
                          selectedParent === parent.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">{parent.emoji} {parent.name_mn}</span>
                        {selectedParent === parent.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CHILD SELECTION */}
          {selectedParent && selectedParentObj?.children && selectedParentObj.children.length > 0 && (
            <div className="relative animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 ml-1 flex items-center gap-1.5">
                <Layers size={12} /> Дэд бүлэг
              </label>
              <button
                onClick={() => { setIsChildOpen(!isChildOpen); setIsParentOpen(false); }}
                className="w-full bg-blue-50/50 border border-blue-100 p-4 px-6 rounded-[1.5rem] text-sm font-bold text-blue-700 shadow-sm flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <span className="truncate">{selectedChildObj ? `📖 ${selectedChildObj.name_mn}` : `Бүх ${selectedParentObj.name_mn}`}</span>
                <ChevronDown size={18} className={`transition-transform duration-300 text-blue-400 ${isChildOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isChildOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-[90] top-full left-0 w-full bg-white border border-blue-100 rounded-[1.8rem] shadow-2xl p-2"
                  >
                    <button
                      onClick={() => { setSelectedCategory(null); setIsChildOpen(false); }}
                      className="w-full p-4 text-left text-sm font-bold text-blue-400 hover:bg-blue-50 rounded-2xl"
                    >
                      Бүх {selectedParentObj.name_mn}
                    </button>
                    {selectedParentObj.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => { setSelectedCategory(child.id); setIsChildOpen(false); }}
                        className={`w-full p-4 text-left text-sm font-bold rounded-2xl flex items-center justify-between ${
                          selectedCategory === child.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">{child.emoji} {child.name_mn}</span>

                        {selectedCategory === child.id && <Check size={16} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* --- LESSONS GRID (Mobile: Row, Desktop: Card) --- */}
        {filteredLessons.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📚</div>
            <h3 className="font-black text-gray-900 mb-1 italic">Хоосон байна</h3>
            <p className="text-gray-400 text-sm font-medium text-center">Энэ ангилалд хичээл байхгүй байна.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredLessons.map((lesson) => {
              const difficulty = getDifficultyStyles(lesson.difficulty_level);
              const isLocked = user && lesson.required_level > user.current_level;

              return (
                <Link
                  key={lesson.id}
                  href={isLocked ? '#' : `/lessons/${lesson.id}`}
                  className={`group bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm flex md:flex-col overflow-hidden transition-all h-auto md:h-full ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 hover:shadow-xl hover:shadow-blue-100/30'
                  }`}
                >
                  {/* Thumbnail: Mobile-д жижиг дөрвөлжин, Desktop-д том */}
                  <div className="relative w-24 h-24 sm:w-full sm:h-52 shrink-0 overflow-hidden m-2 sm:m-0 rounded-[1rem] sm:rounded-none">
                    {lesson.thumbnail_url ? (
                      <img 
                        src={lesson.thumbnail_url} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-slate-50 text-3xl sm:text-5xl opacity-30">
                        {getTypeIcon(lesson.lesson_type)}
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <Lock size={18} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-7 flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] sm:text-lg font-black text-gray-900 leading-tight italic line-clamp-2">
                        {lesson.title}
                      </h3>
                      <span className="hidden sm:block">{getTypeIcon(lesson.lesson_type)}</span>
                    </div>
                    
                    <p className="text-gray-400 text-[10px] sm:text-xs font-bold line-clamp-1 sm:line-clamp-2 mt-1 sm:mt-3">
                      {lesson.description || 'Хичээлийн тайлбар ороогүй байна.'}
                    </p>

                    <div className="mt-auto pt-3 sm:pt-5 flex items-center gap-2">
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${difficulty}`}>
                        {lesson.difficulty_level === 'beginner' ? 'Анхан' : 'Дунд'}
                      </span>
                      <div className="flex items-center gap-1 text-gray-300 text-[9px] sm:text-[10px] font-black uppercase">
                        <Clock size={12} strokeWidth={3} /> {lesson.estimated_duration}м
                      </div>
                      {lesson.points_reward > 0 && (
                        <div className="ml-auto bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[9px] font-black sm:flex items-center gap-1">
                          <Award size={10} strokeWidth={3} className="hidden sm:block" /> +{lesson.points_reward}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}