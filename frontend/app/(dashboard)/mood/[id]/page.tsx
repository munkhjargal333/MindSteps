'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import DeleteConfirmModal from '@/components/ui/DeleteModal';
import { ChevronLeft, Edit3, Trash2, Calendar, Clock, MapPin, Cloud, Lightbulb, Zap, MessageSquare } from 'lucide-react';

export default function MoodDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const id = params?.id as string;

  // useRef ашиглаж dependency hell-ээс зайлсхийх
  const showToastRef = useRef(showToast);
  const routerRef = useRef(router);
  
  useEffect(() => {
    showToastRef.current = showToast;
    routerRef.current = router;
  }, [showToast, router]);

  useEffect(() => {
    if (!token || !id) return;

    let isMounted = true;

    async function loadMoodEntry() {
      setLoading(true);
      try {
        const data = await apiClient.getMoodEntry(Number(id), token ?? undefined);
        if (isMounted) {
          setEntry(data);
        }
      } catch (error) {
        if (isMounted) {
          showToastRef.current('Бичлэг олдсонгүй', 'error');
          routerRef.current.push('/mood');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMoodEntry();

    return () => {
      isMounted = false;
    };
  }, [token, id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!token || !entry) return;

    setDeleting(true);
    try {
      await apiClient.deleteMoodEntry(entry.id, token);
      showToast('Амжилттай устгагдлаа', 'success');
      
      // Жижиг delay-тэйгээр /mood руу шилжих
      setTimeout(() => {
        router.push('/mood');
      }, 500);
    } catch (error) {
      showToast('Устгахад алдаа гарлаа', 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) return null;

  // Динамик өнгө (default нь purple-600)
  const themeColor = entry.MoodUnit?.display_color || '#9333ea';

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={entry.MoodUnit?.display_name_mn || 'Сэтгэл санаа'}
        isDeleting={deleting}
      />

      {/* TOP NAVIGATION */}
      <div className="max-w-3xl mx-auto px-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => router.push('/mood')}
          className="p-2 hover:bg-white rounded-full transition-colors group"
        >
          <ChevronLeft className="text-gray-500 group-hover:text-gray-900" size={24} />
        </button>
        
        <div className="flex gap-2">
          <Link
            href={`/mood/edit/${entry.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-bold text-sm shadow-sm"
          >
            <Edit3 size={16} />
            Засах
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition font-bold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {deleting ? 'Устгаж байна...' : 'Устгах'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          
          {/* BANNER / HEADER SECTION */}
          <div 
            className="h-32 sm:h-40 w-full opacity-20 relative"
            style={{ backgroundColor: themeColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
          </div>

          <div className="px-6 sm:px-12 pb-12 -mt-16 sm:-mt-20 relative">
            {/* EMOJI & TITLE */}
            <div className="flex flex-col items-center text-center mb-10">
              <div 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] shadow-2xl flex items-center justify-center text-5xl sm:text-6xl bg-white mb-6 border-4 border-white"
                style={{ boxShadow: `0 20px 40px -12px ${themeColor}40` }}
              >
                {entry.MoodUnit?.display_emoji}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                {entry.MoodUnit?.display_name_mn}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                <Calendar size={16} />
                <span>
                  {new Date(entry.created_at).toLocaleDateString('mn-MN', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* INTENSITY & VALUE GRID */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Эрчим
                </div>
                <div className="text-2xl font-black" style={{ color: themeColor }}>
                  {entry.intensity}<span className="text-gray-300 text-lg">/10</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Төрөл
                </div>
                <div className="text-sm font-bold text-gray-700 truncate">
                  {entry.MoodUnit?.type === 'primary' ? 'Үндсэн' : 'Хослосон'}
                </div>
              </div>
            </div>

            {/* CORE VALUE CARD */}
            {entry.CoreValues && (
              <div 
                className="mb-10 p-5 rounded-3xl border flex items-center gap-4 transition-all hover:shadow-md"
                style={{ 
                  borderColor: `${themeColor}30`, 
                  backgroundColor: `${themeColor}05` 
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                  {entry.CoreValues?.MaslowLevel?.icon || '💎'}
                </div>
                <div>
                  <p 
                    className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60" 
                    style={{ color: themeColor }}
                  >
                    Үнэт зүйл
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {entry.CoreValues.name}
                  </p>
                </div>
              </div>
            )}

            {/* DETAILED INFO */}
            <div className="space-y-8">
              <DetailSection 
                icon={<Clock size={20} className="text-blue-500" />} 
                title="Хэзээ мэдэрсэн" 
                content={entry.when_felt} 
              />
              <DetailSection 
                icon={<Zap size={20} className="text-yellow-500" />} 
                title="Шалтгаан / Trigger" 
                content={entry.trigger_event} 
              />
              <DetailSection 
                icon={<Lightbulb size={20} className="text-emerald-500" />} 
                title="Авсан арга хэмжээ" 
                content={entry.coping_strategy} 
              />
              <DetailSection 
                icon={<MessageSquare size={20} className="text-purple-500" />} 
                title="Дэлгэрэнгүй тэмдэглэл" 
                content={entry.notes} 
                isLongText
              />
            </div>

            {/* FOOTER METADATA */}
            {(entry.location || entry.weather) && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-6 justify-center">
                {entry.location && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <MapPin size={16} />
                    {entry.location}
                  </div>
                )}
                {entry.weather && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <Cloud size={16} />
                    {entry.weather}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Туслах компонент: Мэдээллийн хэсэг
function DetailSection({ 
  icon, 
  title, 
  content, 
  isLongText = false 
}: { 
  icon: React.ReactNode;
  title: string;
  content?: string;
  isLongText?: boolean;
}) {
  if (!content) return null;
  
  return (
    <div className="group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
          {icon}
        </div>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div 
        className={`text-gray-700 leading-relaxed ${
          isLongText 
            ? 'bg-gray-50/50 p-5 rounded-2xl border border-dashed border-gray-200' 
            : 'pl-12 font-bold text-lg'
        }`}
      >
        {content}
      </div>
    </div>
  );
}