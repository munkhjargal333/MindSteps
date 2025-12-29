'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson, CompleteLessonPayload } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';
import { 
  ArrowLeft, Clock, Award, Star, CheckCircle2, 
  Lock, Share2, PlayCircle, Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonDetailPage() {
  const { token, user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { showToast } = useGlobalToast();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const id = params?.id as string;

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadLesson = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const data = await apiClient.getLesson(parseInt(id, 10), token);
      setLesson(data);
    } catch (error) {
      showToast('Хичээл олдсонгүй 😞', 'error');
      router.push('/lessons');
    } finally {
      setLoading(false);
    }
  }, [token, id, router, showToast]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  // Энэ функц зөвхөн Modal-ыг нээнэ
  const handleOpenRating = () => {
    setShowRatingForm(true);
  };

  // ЭНД ХАМГИЙН ЧУХАЛ НЭГДСЭН ЛОГИК:
  const handleFinalSubmit = async (isSkipping: boolean = false) => {
    if (!token || !lesson) return;
    setCompleting(true);
    
    try {
      const payload: CompleteLessonPayload = {
        lesson_id: lesson.id,
        points_reward: lesson.points_reward,
        time_spent: timeSpent,
        // Хэрэв skip хийж байвал undefined, эсвэл утга байвал илгээнэ
        rating: isSkipping ? undefined : (rating > 0 ? rating : undefined),
        comment: isSkipping ? undefined : review,
      };

      await apiClient.completeLesson(payload, token);

      showToast(`✅ Баяр хүргэе! +${lesson.points_reward} оноо авлаа 🎉`, 'success');
      
      // Амжилттай болсны дараа жагсаалт руу буцна
      router.push('/lessons');
      router.refresh();
      
    } catch (error: any) {
      showToast(error.message || 'Алдаа гарлаа. Дахин оролдоно уу.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) return null;

  const isLocked = user && lesson.required_level > user.current_level;

return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">
      

      {/* 🚀 TOP NAVIGATION (Mobile-friendly) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <button onClick={() => router.push('/lessons')} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 active:scale-90 transition-transform">
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex-1 px-3 flex flex-col items-center overflow-hidden">
             <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate w-full text-center">
                {lesson.title}
             </div>
             <div className="w-16 sm:w-32 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${scrollProgress}%` }} className="h-full bg-blue-600" />
             </div>
          </div>

          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
            <Share2 size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-20 sm:pt-24">
        {!showRatingForm ? (
          <>
            {/* 🖼️ HERO IMAGE (Responsive Height) */}
            {lesson.thumbnail_url && (
              <div className="relative h-48 sm:h-80 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-blue-100">
                <img src={lesson.thumbnail_url} alt={lesson.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{lesson.estimated_duration} мин</span>
                  </div>
                  <div className="bg-amber-400 text-amber-950 px-3 py-1.5 rounded-xl font-black text-[10px] shadow-lg flex items-center gap-1">
                    <Trophy size={14} /> +{lesson.points_reward}
                  </div>
                </div>
              </div>
            )}

            {/* 📝 CONTENT BOX (Reduced Padding for Mobile) */}
            <article className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-gray-50 p-5 sm:p-10 shadow-sm mb-6">
              <header className="mb-6">
                <h1 className="text-xl sm:text-4xl font-black text-gray-900 leading-tight italic mb-5">
                  {lesson.title}
                </h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Clock size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Хугацаа</p>
                      <p className="text-xs font-black text-gray-900 truncate">{formatTime(timeSpent)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="text-right min-w-0">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Уншсан</p>
                      <p className="text-xs font-black text-blue-600">{scrollProgress}%</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                </div>
              </header>

              {/* Prose (Optimized for Mobile) */}
              <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-gray-700 font-medium leading-relaxed mb-8">
                <div dangerouslySetInnerHTML={{ __html: lesson.content?.replace(/\n/g, '<br />') }} />
              </div>

              <button
                onClick={handleOpenRating}
                className="w-full py-4 sm:py-5 bg-blue-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Хичээл дуусгах <CheckCircle2 size={16} />
              </button>
            </article>
          </>
        ) : (
          /* ⭐ RATING MODAL (Compact for Mobile) */
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-900 rounded-[2rem] p-6 sm:p-12 text-center text-white shadow-2xl mt-4 sm:mt-10"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="fill-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black mb-1 italic">Хичээл таалагдсан уу?</h2>
            <p className="text-gray-400 font-bold text-[9px] sm:text-sm mb-6 uppercase tracking-[0.2em]">Бидэнд туслаарай</p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className={`text-3xl sm:text-4xl transition-transform active:scale-125 ${s <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐</button>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Санал бодлоо энд бичээрэй..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:ring-1 focus:ring-blue-500 mb-6"
              rows={3}
            />

            <div className="space-y-3">
              <button 
                onClick={() => handleFinalSubmit(false)} 
                disabled={completing}
                className="w-full py-4 bg-white text-gray-900 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-xl flex items-center justify-center"
              >
                {completing ? <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : "Илгээх & Дуусгах"}
              </button>
              <button 
                onClick={() => handleFinalSubmit(true)} 
                disabled={completing}
                className="w-full py-2 bg-transparent text-gray-500 font-black text-[9px] uppercase tracking-widest"
              >
                Алгасах
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}