'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Journal } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Edit2, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import DeleteConfirmModal from '@/components/ui/DeleteModal';

export default function JournalListPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; title: string }>({
    open: false, id: null, title: ''
  });

  const loadJournals = useCallback(async (tokenToUse: string, pageToUse: number) => {
    setLoading(true);
    try {
      const data = await apiClient.getJournals(pageToUse, 10, tokenToUse);
      setJournals(data.journals);
      setTotal(data.total);
    } catch (error) {
      showToast('Мэдээлэл авахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (token) {
      loadJournals(token, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]); // Зөвхөн таны хүссэн 2 хамаарал

  const openDeleteModal = (e: React.MouseEvent, id: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ open: true, id, title: title || 'Гарчиггүй' });
  };

  const handleConfirmDelete = async () => {
    if (!token || !deleteModal.id) return;
    setDeletingId(deleteModal.id);
    try {
      await apiClient.deleteJournal(deleteModal.id, token);
      setJournals(prev => prev.filter(j => j.id !== deleteModal.id));
      setTotal(prev => prev - 1);
      showToast('Амжилттай устгалаа', 'success');
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    } finally {
      setDeletingId(null);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && journals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[5px] border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <ToastContainer />
      <DeleteConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        isDeleting={deletingId === deleteModal.id}
      />

      <div className="max-w-4xl mx-auto px-5 py-10">
        <header className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Бичвэрүүд</h1>
            <p className="text-gray-400 font-bold mt-2 ml-1 tracking-widest text-xs uppercase">Нийт {total}</p>
          </div>
          <Link href="/journal/new" className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-[1.8rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            <Plus size={22} strokeWidth={3} /> <span className="hidden sm:inline">Шинэ</span>
          </Link>
        </header>

        <div className="grid gap-4"> {/* Зайг gap-5-аас gap-3 болгож багасгав */}
          {journals.map((journal) => (
            <Link key={journal.id} href={`/journal/${journal.id}`} className="group block">
              <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] border border-gray-100 border-l-[6px] border-l-blue-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Icon хэмжээг бага зэрэг жижигсгэв */}
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <FileText size={22} strokeWidth={2.5} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors leading-tight">
                        {journal.title || 'Гарчиггүй'}
                      </h4>
                      {/* Огноог гарчгийн ард жижгээр байрлуулж зай хэмнэв */}
                      <span className="text-[10px] text-gray-300 font-bold shrink-0">
                        • {new Date(journal.created_at).toLocaleDateString('mn-MN')}
                      </span>
                    </div>
                    
                    {/* Description - Маш богино, зөвхөн эхний хэдэн үг */}
                    <p className="text-gray-400 text-xs truncate font-medium mt-0.5 max-w-[250px] sm:max-w-md">
                      {journal.content}
                    </p>
                  </div>
                </div>

                {/* Үйлдлийн товчнуудыг жижигсгэв */}
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/journal/edit/${journal.id}`); }}
                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => openDeleteModal(e, journal.id, journal.title)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        {total > 10 && (
          <div className="mt-16 flex justify-center items-center gap-5">
            <button 
              disabled={page === 1} 
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-[1.2rem] shadow-sm border border-gray-100 disabled:opacity-20 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <span className="text-lg font-black text-gray-900">
              {page} <span className="text-gray-200 mx-1">/</span> {Math.ceil(total / 10)}
            </span>
            <button 
              disabled={page >= Math.ceil(total / 10)} 
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-[1.2rem] shadow-sm border border-gray-100 disabled:opacity-20 hover:text-blue-600 transition-all"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}