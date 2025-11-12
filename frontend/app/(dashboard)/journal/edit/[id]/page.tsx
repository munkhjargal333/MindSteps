'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import JournalForm from '@/components/journal/JournalForm';
import { useRouter, useParams } from 'next/navigation';

export default function JournalEditPage() {
  const { token } = useAuth();
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
      console.error(err);
      alert('тэмдэглэл ачаалахад алдаа гарлаа');
      router.push('/journal');
    } finally {
      setLoading(false);
    }
  }, [token, journalId, router]);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const handleSubmit = async (data: { title: string; content: string; tags?: string; is_private?: boolean }) => {
    if (!token || !journalId) return;
    setSaving(true);
    try {
      await apiClient.updateJournal(journalId, data, token);
      alert('тэмдэглэл амжилттай шинэчлэгдлээ!');
      router.push(`/journal/${journalId}`);
    } catch (err) {
      console.error(err);
      alert('тэмдэглэл шинэчлэхэд алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>тэмдэглэл ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">✏️ тэмдэглэл засах</h1>
      <JournalForm
        initialTitle={journalData.title}
        initialContent={journalData.content}
        initialTags={journalData.tags}
        initialIsPrivate={journalData.is_private}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
