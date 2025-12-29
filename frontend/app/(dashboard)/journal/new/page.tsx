'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import JournalForm from '@/components/journal/JournalForm';
import { useGlobalToast } from '@/context/ToastContext';
import { ChevronLeft, Sparkles, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function NewJournalPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleCreate = async (data: { title: string; content: string; tags?: string; is_private?: boolean }) => {
    if (!token) return;
    setSaving(true);
    try {
      await apiClient.createJournal(
        {
          title: data.title,
          content: data.content,
          tags: data.tags,
          is_private: data.is_private ?? true,
        },
        token
      );
      showToast("Тэмдэглэл амжилттай хадгалагдлаа", 'success');
      // Хадгалагдсаны дараа түр хүлээж байгаад шилжих нь Toast-ыг харуулахад тусална
      setTimeout(() => router.push('/journal'), 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'тэмдэглэл хадгалахад алдаа гарлаа';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* БУЦАХ ТОВЧ */}
        <Link 
          href="/journal" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-6 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>БУЦАХ</span>
        </Link>

        {/* ҮНДСЭН CARD */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/50 overflow-hidden">
          
          {/* HEADER ХЭСЭГ */}
          <div className="bg-gradient-to-r from-blue-50 to-transparent p-8 sm:p-10 border-b border-gray-50">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <PenTool size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Шинэ <span className="text-blue-600">Бичвэр</span>
              </h1>
            </div>
            <p className="text-gray-500 font-medium ml-1">Өнөөдөр таны дотор юу болж байна?</p>
          </div>

          {/* FORM ХЭСЭГ */}
          <div className="p-8 sm:p-10">
            <JournalForm
              initialTitle=""
              initialContent=""
              initialTags=""
              initialIsPrivate={true}
              onSubmit={handleCreate}
              loading={saving}
            />
          </div>

          {/* AI TIP ХЭСЭГ - Дизайныг нь Mood-тэй ижилхэн зөөлөн болгов */}
          <div className="mx-8 mb-10 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 text-sm mb-1">AI Зөвлөмж</h4>
              <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                Таны бичсэн тэмдэглэлийг AI шинжилгээ хийж системээс таньд үзүүлэх хамгийн тохиромжтой зөвлөмжүүдийг санал болгоно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}