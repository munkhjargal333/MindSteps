'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import JournalForm from '@/components/journal/JournalForm';
import { useToast } from '@/components/ui/toast';

export default function NewJournalPage() {
  const { token } = useAuth();
    const { showToast, ToastContainer } = useToast();
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
         // word_count: data.content.split(/\s+/).filter(Boolean).length,
         // entry_date: new Date().toISOString().split('T')[0],
        },
        token
      );
      router.push('/journal');
      showToast("Тэмдэглэл амжилттай хадгалагдлаа", 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'тэмдэглэл хадгалахад алдаа гарлаа';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Шинэ тэмдэглэл</h1>

        <JournalForm
          initialTitle=""
          initialContent=""
          initialTags=""
          initialIsPrivate={true}
          onSubmit={handleCreate}
          loading={saving}
        />

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Зөвлөмж:</strong> тэмдэглэл бичсэнээр AI таны сэтгэл санааг шинжилж, хувийн зөвлөмж өгч, оноо авах боломжтой.
          </p>
        </div>
      </div>
    </div>
  );
}
