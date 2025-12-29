'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, LessonCategory } from '@/lib/types';
import Link from 'next/link';
import { useGlobalToast } from '@/context/ToastContext';


import { 
  BookOpen, Clock, Award, Lock, ChevronDown, 
  Check, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LessonsListPage() {
  const { token, user } = useAuth();
  const { showToast } = useGlobalToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isChildOpen, setIsChildOpen] = useState(false);

  // Ангилал ачаалах
  const loadCategories = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient.getLessonCategories(token);
      setCategories(data);
    } catch (err) {
      showToast('Ангилал авахад алдаа гарлаа', 'error');
    }
  }, [token, showToast]);

  const loadLessons = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Дэд бүлэг байвал түүнийг ашиглана, байхгүй бол Үндсэн бүлгийг ашиглана
      const categoryId = selectedCategory || selectedParent || undefined;
      
      // Хэрэв Үндсэн бүлэг сонгогдсон БӨГӨӨД Дэд бүлэг сонгогдоогүй бол isParent = true
      const isParent = !!(selectedParent && !selectedCategory);

      const response = await apiClient.getLessons(
        currentPage, 
        itemsPerPage, 
        token,
        categoryId,
        isParent
      );
      
      setLessons(response.lessons || []);
      setTotalItems(response.total || 0); 
    } catch (error) {
      showToast('Хичээл авахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, selectedCategory, selectedParent]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadLessons(); }, [loadLessons]);

  const selectedParentObj = categories.find(c => c.id === selectedParent);
  const selectedChildObj = selectedParentObj?.children?.find(c => c.id === selectedCategory);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-gray-900">
      
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight">
            Мэдлэгийн <span className="text-blue-600 not-italic">Сан</span>
          </h1>
        </header>

        {/* Dropdowns */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Main Category */}
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Үндсэн бүлэг</label>
            <button onClick={() => { setIsParentOpen(!isParentOpen); setIsChildOpen(false); }} className="w-full bg-white border border-gray-100 p-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
              <span className="truncate">{selectedParentObj ? `${selectedParentObj.emoji} ${selectedParentObj.name_mn}` : '📚 Бүх хичээлүүд'}</span>
              <ChevronDown size={20} className={`text-blue-500 transition-transform ${isParentOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isParentOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute z-50 top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl mt-2 p-2 max-h-60 overflow-y-auto">
                  <button onClick={() => { setSelectedParent(null); setSelectedCategory(null); setCurrentPage(1); setIsParentOpen(false); }} className="w-full p-3 text-left text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-xl">Бүх хичээлүүд</button>
                  {categories.filter(c => !c.parent_id).map((parent) => (
                    <button key={parent.id} onClick={() => { setSelectedParent(parent.id); setSelectedCategory(null); setCurrentPage(1); setIsParentOpen(false); }} className={`w-full p-3 text-left text-sm font-bold rounded-xl flex items-center justify-between ${selectedParent === parent.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
                      <span>{parent.emoji} {parent.name_mn}</span>
                      {selectedParent === parent.id && <Check size={16} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sub Category */}
          {selectedParent && selectedParentObj?.children && (
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 ml-1 block">Дэд бүлэг</label>
              <button onClick={() => { setIsChildOpen(!isChildOpen); setIsParentOpen(false); }} className="w-full bg-blue-50/50 border border-blue-100 p-4 px-6 rounded-2xl text-sm font-bold text-blue-700 flex items-center justify-between active:scale-[0.98] transition-all">
                <span className="truncate">
                  {/* Сонгогдсон үед emoji-г нь харуулна */}
                  {selectedChildObj ? `${selectedChildObj.emoji} ${selectedChildObj.name_mn}` : `📖 Бүх ${selectedParentObj.name_mn}`}
                </span>
                <ChevronDown size={18} className={`transition-transform ${isChildOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isChildOpen && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute z-40 top-full left-0 w-full bg-white border border-blue-100 rounded-2xl shadow-2xl mt-2 p-2">
                    <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); setIsChildOpen(false); }} className="w-full p-3 text-left text-sm font-bold text-blue-400 hover:bg-blue-50 rounded-xl italic">
                      📖 Бүх {selectedParentObj.name_mn}
                    </button>
                    {selectedParentObj.children.map((child) => (
                      <button 
                        key={child.id} 
                        onClick={() => { setSelectedCategory(child.id); setCurrentPage(1); setIsChildOpen(false); }} 
                        className={`w-full p-3 text-left text-sm font-bold rounded-xl flex items-center justify-between ${selectedCategory === child.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                      >
                        {/* Жагсаалт дотор emoji-г нь харуулна */}
                        <span>{child.emoji} {child.name_mn}</span>
                        {selectedCategory === child.id && <Check size={16} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Grid Area */}
        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-[10px] font-black uppercase tracking-[1em] text-gray-300">Ачаалж байна</div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-gray-100 font-black text-gray-300 uppercase tracking-widest">Хичээл олдсонгүй</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const isLocked = user && lesson.required_level > user.current_level;
                return (
                  <Link key={lesson.id} href={isLocked ? '#' : `/lessons/${lesson.id}`} className={`group bg-white rounded-[2rem] border border-gray-100 shadow-sm flex md:flex-col overflow-hidden transition-all ${isLocked ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 hover:shadow-xl hover:shadow-blue-100/30'}`}>
                    <div className="relative w-24 h-24 sm:w-full sm:h-48 shrink-0 overflow-hidden m-2 sm:m-0 rounded-xl sm:rounded-none">
                      {lesson.thumbnail_url ? <img src={lesson.thumbnail_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" /> : <div className="h-full bg-slate-50 flex items-center justify-center text-4xl opacity-20">📚</div>}
                      {isLocked && <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center text-white"><Lock size={18} /></div>}
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <h3 className="text-[13px] sm:text-base font-black line-clamp-2 uppercase tracking-tight leading-tight">{lesson.title}</h3>
                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${lesson.difficulty_level === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{lesson.difficulty_level}</span>
                        <div className="flex items-center gap-1 text-gray-300 text-[9px] font-black uppercase"><Clock size={12} /> {lesson.estimated_duration}м</div>
                        {lesson.points_reward > 0 && <div className="ml-auto bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[9px] font-black">+{lesson.points_reward}</div>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-20 shadow-sm transition-all active:scale-90"><ChevronLeft size={18} /></button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-20 shadow-sm transition-all active:scale-90"><ChevronRight size={18} /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}