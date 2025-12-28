'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Journal } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { 
  ChevronLeft, 
  Edit2, 
  Trash2, 
  Calendar, 
  FileText, 
  BarChart3, 
  Clock 
} from 'lucide-react';
import DeleteConfirmModal from '@/components/ui/DeleteModal';

export default function JournalDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const journalId = params?.id ? Number(params.id) : undefined;

  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadJournal = useCallback(async () => {
    if (!token || !journalId) return;
    try {
      const data = await apiClient.getJournal(journalId, token);
      setJournal(data);
    } catch (error) {
      showToast('Тэмдэглэл ачаалахад алдаа гарлаа', 'error');
      router.push('/journal');
    } finally {
      setLoading(false);
    }
  }, [token, router, showToast]);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const handleConfirmDelete = async () => {
    if (!token || !journalId) return;
    setDeleting(true);
    try {
      await apiClient.deleteJournal(journalId, token);
      showToast('Тэмдэглэл амжилттай устгагдлаа', 'success');
      router.push('/journal');
    } catch (error) {
      showToast('Устгахад алдаа гарлаа', "error");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!journal) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <ToastContainer />
      
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={journal.title || 'Энэхүү бичвэр'}
        isDeleting={deleting}
      />

      <div className="max-w-4xl mx-auto px-5 py-8">
        
        {/* BACK BUTTON */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs tracking-widest mb-8 transition-colors group"
        >
          <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          <span>БУЦАХ</span>
        </Link>

        {/* CONTENT CARD */}
        <article className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-50/50 overflow-hidden">
          
          {/* TOP HEADER SECTION */}
          <div className="p-8 sm:p-12 border-b border-gray-50 bg-gradient-to-b from-blue-50/30 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  <Calendar size={14} />
                  {formatDate(journal.created_at)}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6 italic">
                  {journal.title || 'Гарчиггүй бичвэр'}
                </h1>
                
                {journal.tags && (
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-black rounded-xl border border-gray-100 uppercase tracking-wider">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <Link
                  href={`/journal/edit/${journal.id}`}
                  className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all active:scale-95"
                >
                  <Edit2 size={20} />
                </Link>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN TEXT CONTENT */}
          <div className="p-8 sm:p-12">
            <div className="text-lg sm:text-xl text-gray-700 leading-[1.8] whitespace-pre-wrap font-medium">
              {journal.content}
            </div>
          </div>

          {/* STATS FOOTER */}
          <div className="p-8 bg-gray-50/50 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Үгс</div>
                <div className="text-lg font-black text-gray-900 leading-none mt-1">{journal.word_count}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Үүсгэсэн</div>
                <div className="text-sm font-black text-gray-900 leading-none mt-1">
                  {new Date(journal.created_at).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                {journal.sentiment_score ? (journal.sentiment_score > 0.5 ? '😊' : journal.sentiment_score > 0 ? '😐' : '😔') : '📝'}
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI шинжилгээ</div>
                <div className="text-sm font-black text-gray-900 leading-none mt-1 uppercase italic">
                  {journal.sentiment_score ? (journal.sentiment_score > 0.5 ? 'Эерэг' : journal.sentiment_score > 0 ? 'Төвийг сахисан' : 'Сөрөг') : 'Бичиж байна'}
                </div>
              </div>
            </div> */}
          </div>
        </article>
      </div>
    </div>
  );
}