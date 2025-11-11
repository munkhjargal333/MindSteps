'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useRouter, useParams } from 'next/navigation';

export default function JournalEditPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const journalId = params?.id as number | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const loadJournal = useCallback(async () => {
    if (!token || !journalId) return;
    
    try {
      const journal = await apiClient.getJournal(journalId, token);
      setTitle(journal.title);
      setContent(journal.content);
      setTags(journal.tags || '');
    } catch (error) {
      console.error('Error loading journal:', error);
      alert('Журнал ачаалахад алдаа гарлаа');
      router.push('/journal');
    } finally {
      setLoading(false);
    }
  }, [token, journalId, router]);

  useEffect(() => {
    if (token && journalId) {
      loadJournal();
    }
  }, [token, journalId, loadJournal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !journalId) return;
    if (!title.trim() || !content.trim()) {
      alert('Гарчиг болон агуулга оруулна уу');
      return;
    }

    setSaving(true);
    
    try {
      await apiClient.updateJournal(journalId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim() || undefined,
      }, token);
      
      alert('Журнал амжилттай шинэчлэгдлээ! ✅');
      router.push(`/journal/${journalId}`);
    } catch (error) {
      console.error('Error updating journal:', error);
      alert('Журнал шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Өөрчлөлтүүдийг хадгалахгүй гарах уу?')) {
      router.push(`/journal/${journalId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-base sm:text-lg text-gray-600">Журнал ачаалж байна...</div>
      </div>
    );
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          ✏️ Журнал засах
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Журналын агуулгаа өөрчилж шинэчилнэ үү
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        
        {/* TITLE INPUT */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Гарчиг <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Журналын гарчиг оруулна уу"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-base sm:text-lg"
            required
          />
        </div>

        {/* CONTENT TEXTAREA */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700">
              Агуулга <span className="text-red-500">*</span>
            </label>
            <span className="text-xs sm:text-sm text-gray-500">
              {wordCount} үг
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Өнөөдрийн сэтгэгдлээ бичээрэй..."
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none text-sm sm:text-base"
            required
          />
        </div>

        {/* TAGS INPUT */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Таагнууд (заавал биш)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Жишээ: сэтгэл санаа, өдрийн тэмдэглэл, санаа"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Таагуудыг таслалаар тусгаарлана уу
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition disabled:opacity-50 text-sm sm:text-base"
          >
            Болих
          </button>
          
          <button
            type="submit"
            disabled={saving || !title.trim() || !content.trim()}
            className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg"
          >
            {saving ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Хадгалж байна...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Хадгалах</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* TIPS */}
      <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>Зөвлөмж</span>
        </h3>
        <ul className="text-xs sm:text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Өдөр бүр тогтмол журнал бичих нь сэтгэлийн эрүүл мэндэд тустай</li>
          <li>Үнэн сэтгэлээсээ, ил тод бичээрэй</li>
          <li>Өөрийн мэдрэмж, сэтгэл хөдлөлийг тэмдэглээрэй</li>
        </ul>
      </div>
    </div>
  );
}