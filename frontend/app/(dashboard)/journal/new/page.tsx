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
          <div className="bg-gradient-to-b from-blue-50/40 to-transparent p-8 sm:p-12 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              
              <div className="flex-1 space-y-6">
                {/* Icon & Title */}

                {/* Таны өгсөн Hook - Илүү "Deep" дизайнтай */}
                <div className="relative max-w-2xl group">
                  {/* Чимэглэлийн босоо шугам */}
                  <div className="absolute -left-5 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-600 via-blue-200 to-transparent rounded-full"></div>
                  
                  <div className="pl-6 space-y-4">
                    <div className="space-y-3">
                      <p className="text-[15px] md:text-[16px] leading-relaxed text-gray-600 font-medium">
                        Та магадгүй бусдад сайн зөвлөгч байдаг байх. Гэхдээ өөртөө чаддаггүй. 
                        Чадахгүй гэхээс илүү <span className="text-blue-600 font-bold italic"> өөрийгөө сонсож үзээгүй</span> гэсэн үг.
                      </p>
                      <p className="text-[15px] md:text-[16px] leading-relaxed text-gray-800 font-bold italic">
                        Яг л бусдын яриа шиг өөрийгөө сонсож эхэлвэл та өөртөө ч бас тусалж чадна.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
}