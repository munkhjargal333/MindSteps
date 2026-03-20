'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import JournalForm from '@/components/journal/JournalForm';
import { useRouter, useParams } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';
import { ChevronLeft, Edit3, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function JournalEditPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  const router = useRouter();
  const params = useParams();
  const journalId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [journalData, setJournalData] = useState({
    title: '',
    content: '',
    tags: '',
    is_private: true,
  });

  const loadJournal = useCallback(async () => {
    if (!token || !journalId) return;
    try {
      const journal = await apiClient.getJournal(journalId, token);
      setJournalData({
        title: journal.title,
        content: journal.content,
        tags: journal.tags || '',
        is_private: journal.is_private ?? true,
      });
    } catch (err) {
      showToast('Тэмдэглэл ачаалахад алдаа гарлаа', 'error');
      router.push('/journal');
    } finally {
      setLoading(false);
    }
  }, [token, journalId, router, showToast]);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const handleSubmit = async (data: { title: string; content: string; tags?: string; is_private?: boolean }) => {
    if (!token || !journalId) return;
    setSaving(true);
    try {
      await apiClient.updateJournal(journalId, data, token);
      showToast('Амжилттай шинэчлэгдлээ!', 'success');
      // Хэрэглэгч шинэчлэгдсэнээ харахад зориулж бага зэрэг хүлээлт үүсгэнэ
      setTimeout(() => router.push(`/journal/${journalId}`), 800);
    } catch (err) {
      showToast('Шинэчлэхэд алдаа гарлаа', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* БУЦАХ ТОВЧ */}
        <Link 
          href={`/journal/${journalId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs tracking-widest mb-8 transition-colors group"
        >
          <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          <span>БУЦАХ</span>
        </Link>

        {/* ҮНДСЭН CARD */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/50 overflow-hidden">
          
          {/* HEADER ХЭСЭГ */}
          <div className="bg-gradient-to-r from-blue-50/50 to-transparent p-8 sm:p-10 border-b border-gray-50">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Edit3 size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">
                Бичвэр <span className="text-blue-600 font-black not-italic">Засах</span>
              </h1>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Засварлаж дуусаад хадгалахаа мартуузай</p>
          </div>

          {/* FORM ХЭСЭГ */}
          <div className="p-8 sm:p-10">
            <JournalForm
              initialTitle={journalData.title}
              initialContent={journalData.content}
              initialTags={journalData.tags}
              initialIsPrivate={journalData.is_private}
              onSubmit={handleSubmit}
              loading={saving}
            />
          </div>

          {/* INFO ХЭСЭГ */}
          <div className="mx-8 mb-10 p-5 bg-blue-50/40 rounded-[2rem] border border-blue-100/50 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <Sparkles size={18} />
            </div>
            <p className="text-xs text-blue-700/70 leading-relaxed font-bold italic">
              Таны оруулсан өөрчлөлт AI анализ болон оноонд нөлөөлөх боломжтой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}