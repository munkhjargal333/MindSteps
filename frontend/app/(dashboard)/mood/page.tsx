'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import DeleteConfirmModal from '@/components/ui/DeleteModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MoodListPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast } = useGlobalToast();
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal-ийн state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; title: string }>({
    open: false,
    id: null,
    title: ''
  });

  // useRef ашиглаж dependency-с зайлсхийх
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // API дуудлага - ЗӨВХӨН token болон page өөрчлөгдөхөд
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    
    async function fetchData() {
      try {
        const data = await apiClient.getMoodEntries(page, 20, token ?? undefined);
        if (isMounted) {
          setMoodEntries(data.entries);
          setTotal(data.total);
        }
      } catch (error) {
        if (isMounted) {
          showToastRef.current('Мэдээлэл авахад алдаа гарлаа', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token, page]); // ЗӨВХӨН token, page

  // Устгах модалыг нээх
  const openDeleteModal = (e: React.MouseEvent, id: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ open: true, id, title });
  };

  // Баталгаажуулсны дараа устгах
  const handleConfirmDelete = async () => {
    if (!token || !deleteModal.id) return;
    
    setDeletingId(deleteModal.id);
    try {
      await apiClient.deleteMoodEntry(deleteModal.id, token);
      setMoodEntries(prev => prev.filter(item => item.id !== deleteModal.id));
      setTotal(prev => prev - 1);
      showToast('Амжилттай устгагдлаа', 'success');
      
      // Хэрэв хуудасны сүүлийн бичлэг байсан бол өмнөх хуудас руу шилжих
      if (moodEntries.length === 1 && page > 1) {
        setPage(p => p - 1);
      }
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    } finally {
      setDeletingId(null);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && moodEntries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      
      {/* Custom Delete Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        isDeleting={deletingId === deleteModal.id}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Миний <span className="text-purple-600">Түүх</span>
          </h1>
          <Link 
            href="/mood/new" 
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
          >
            <Plus size={20} /> <span>Шинэ</span>
          </Link>
        </div>

        {moodEntries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">Одоогоор бичлэг алга байна</p>
            <Link 
              href="/mood/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all"
            >
              <Plus size={20} /> Эхний бичлэг үүсгэх
            </Link>
          </div>
        ) : (

          <div className="space-y-3">
            {moodEntries.map((entry) => (
              <Link key={entry.id} href={`/mood/${entry.id}`} className="block group">
                <div 
                  style={{ borderLeftColor: entry.MoodUnit.display_color }}
                  className="bg-white p-3.5 sm:p-4 rounded-[1.5rem] border border-gray-100 border-l-[6px] shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Mood Emoji хэсэг */}
                    <div 
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                      style={{ backgroundColor: `${entry.MoodUnit.display_color}10` }}
                    >
                      {entry.MoodUnit.display_emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                          {entry.MoodUnit.display_name_mn}
                        </h4>
                        <span className="text-[10px] text-gray-300 font-bold shrink-0 uppercase tracking-tighter">
                          • {new Date(entry.entry_date).toLocaleDateString('mn-MN')}
                        </span>
                      </div>

                      {/* ШАЛТГААН (TRIGGER_EVENT) ХЭСЭГ - Жижигхэн бас нэг мөрөнд */}
                      {entry.trigger_event && (
                        <p className="text-gray-400 text-[11px] truncate font-medium mt-0.5 pr-4 leading-normal">
                          {entry.trigger_event}
                        </p>
                      )}
                      
                      {/* Эрчим болон бусад жижиг мэдээлэл (хэрэв.trigger_event байхгүй бол илүү цэвэрхэн харагдана) */}
                      {!entry.trigger_event && (
                        <div className="text-[10px] text-gray-300 font-bold uppercase mt-0.5">
                          Эрчим: {entry.intensity}/10
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Үйлдлийн товчнууд */}
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        router.push(`/mood/edit/${entry.id}`);
                      }}
                      className="p-2 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => openDeleteModal(e, entry.id, entry.MoodUnit.display_name_mn)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {total > 10 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button 
              type="button" disabled={page === 1} 
              onClick={() => setPage(p => p - 1)} 
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={10} />
            </button>
            <span className="font-bold text-gray-500">
              {page} / {Math.ceil(total / 10)}
            </span>
            <button 
              type="button" disabled={page >= Math.ceil(total / 10)} 
              onClick={() => setPage(p => p + 1)} 
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}