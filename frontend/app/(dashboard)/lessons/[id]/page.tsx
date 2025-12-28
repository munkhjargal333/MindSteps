'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { 
  ArrowLeft, Clock, Award, Star, CheckCircle2, 
  Lock, Share2, MessageCircle, PlayCircle, Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleComplete = async () => {
    if (!token || !lesson) return;
    setCompleting(true);
    try {
      await apiClient.completeLesson(lesson.id, token);
      showToast(`✅ Баяр хүргэе! +${lesson.points_reward} оноо авлаа 🎉`, 'success');
      setShowRatingForm(true);
      
      await apiClient.markLessonProgress(lesson.id, {
        progress_percentage: 100,
        status: 'completed',
        time_spent: timeSpent
      }, token);
    } catch (error) {
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
      showToast('❌ Үнэлгээ илгээхэд алдаа гарлаа', 'error');
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
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <ToastContainer />

      {/* 🚀 TOP PROGRESS & NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/lessons')}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 px-4 flex flex-col items-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate w-full text-center">
                {lesson.title}
             </div>
             <div className="w-full max-w-[120px] h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${scrollProgress}%` }}
                  className="h-full bg-blue-600"
                />
             </div>
          </div>

          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-24">
        {isLocked ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center shadow-xl shadow-gray-100/50">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 italic">Түгжээтэй хичээл</h2>
            <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed">
              Энэ хичээлийг үзэхийн тулд та <span className="text-blue-600">Түвшин {lesson.required_level}</span> хүрсэн байх шаардлагатай.
            </p>
            <Link href="/lessons" className="inline-block px-10 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg">
              Буцах
            </Link>
          </div>
        ) : (
          <>
            {/* 🖼️ HERO IMAGE */}
            {lesson.thumbnail_url && (
              <div className="relative h-56 sm:h-96 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-blue-100">
                <img src={lesson.thumbnail_url} alt={lesson.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <Clock size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">{lesson.estimated_duration} мин</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl font-black text-xs shadow-lg border border-amber-300">
                    <Trophy size={16} /> +{lesson.points_reward}
                  </div>
                </div>
              </div>
            )}

            {/* 📝 CONTENT BOX */}
            <article className="bg-white rounded-[2.5rem] border border-gray-50 p-6 sm:p-10 shadow-sm mb-8">
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                    {lesson.lesson_type}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-opacity-50 ${
                    lesson.difficulty_level === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {lesson.difficulty_level}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight italic mb-6">
                  {lesson.title}
                </h1>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Clock size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Зарцуулсан цаг</p>
                      <p className="text-sm font-black text-gray-900 leading-none">{formatTime(timeSpent)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Уншсан</p>
                    <p className="text-sm font-black text-blue-600 leading-none">{scrollProgress}%</p>
                  </div>
                </div>
              </header>

              {/* Main Content Render */}
              <div className="prose prose-blue max-w-none text-gray-700 font-medium leading-relaxed mb-10">
                <div 
                  className="whitespace-pre-wrap selection:bg-blue-100"
                  dangerouslySetInnerHTML={{ __html: lesson.content?.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Media URL Rendering */}
              {lesson.media_url && (
                 <div className="mb-10 rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-50 p-4">
                    {lesson.lesson_type === 'video' ? (
                      <video controls className="w-full rounded-xl shadow-lg" src={lesson.media_url} />
                    ) : lesson.lesson_type === 'audio' ? (
                      <div className="flex items-center gap-4">
                         <PlayCircle size={40} className="text-blue-600 shrink-0" />
                         <audio controls className="w-full h-10" src={lesson.media_url} />
                      </div>
                    ) : null}
                 </div>
              )}

              {/* Complete Button */}
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {completing ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Хичээл дуусгах <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </article>

            {/* ⭐ RATING MODAL (AnimatePresence) */}
            <AnimatePresence>
              {showRatingForm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 text-center text-white shadow-2xl"
                >
                  <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
                    <Star size={40} className="fill-white" />
                  </div>
                  <h2 className="text-2xl font-black mb-2 italic">Хичээл таалагдсан уу?</h2>
                  <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest">Үнэлгээ өгч бидэнд туслаарай</p>

                  <div className="flex justify-center gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setRating(s)}
                        className={`text-4xl transition-all hover:scale-125 ${s <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Санал бодлоо хуваалцана уу..."
                    className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    rows={3}
                  />

                  <div className="flex gap-4">
                    <button onClick={handleRatingSubmit} className="flex-1 py-4 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl">
                       Илгээх
                    </button>
                    <button onClick={() => router.push('/lessons')} className="px-6 py-4 bg-white/5 font-black text-xs uppercase tracking-widest rounded-2xl">
                       Алгасах
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}