'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function MoodDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (token && id) {
      loadMoodEntry();
    }
  }, [token, id]);

  const loadMoodEntry = async () => {
    if (!token || !id) return;

    setLoading(true);
    try {
      const data = await apiClient.getMoodEntry(Number(id), token);
      setEntry(data);
    } catch (error) {
      console.error('Error loading mood entry:', error);
      showToast('Бичлэг олдсонгүй', 'error');
      router.push('/mood');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !entry) return;

    const confirmed = confirm('Энэ бичлэгийг устгахдаа итгэлтэй байна уу?');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await apiClient.deleteMoodEntry(entry.id, token);
      showToast('✅ Бичлэг устгагдлаа', 'success');
      router.push('/mood');
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      showToast('❌ Устгахад алдаа гарлаа', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (intensity >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (intensity >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Бичлэг олдсонгүй
          </h2>
          <Link
            href="/mood"
            className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ToastContainer />

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/mood" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
        
        <div className="flex gap-2">
          <Link
            href={`/mood/edit/${entry.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
          >
            ✏️ Засах
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm disabled:opacity-50"
          >
            {deleting ? '...' : '🗑️ Устгах'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        
        {/* DATE */}
        <div className="text-sm text-gray-500 mb-4">
          {formatDate(entry.created_at)}
        </div>

        {/* MOOD & INTENSITY */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div>
            <div className="text-5xl mb-2">
              {entry.MoodUnit?.display_emoji}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {entry.MoodUnit?.display_name_mn}
            </h1>
          </div>
          
          <div className={`px-6 py-3 rounded-xl text-2xl font-bold border-2 ${getIntensityColor(entry.intensity)}`}>
            {entry.intensity}/10
          </div>
        </div>

        {/* CORE VALUE */}
        {entry.CoreValues && (
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl">
                {entry.CoreValues?.MaslowLevel?.icon || '💎'}
              </div>
              <div>
                <div className="text-xs text-purple-600 font-semibold uppercase mb-1">
                  Үнэт зүйл
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {entry.CoreValues.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WHEN FELT */}
        {entry.when_felt && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              ⏰ Хэзээ мэдэрсэн
            </h3>
            <p className="text-gray-900 text-lg">
              {entry.when_felt}
            </p>
          </div>
        )}

        {/* TRIGGER EVENT */}
        {entry.trigger_event && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              ⚡ Шалтгаан
            </h3>
            <p className="text-gray-900 text-lg">
              {entry.trigger_event}
            </p>
          </div>
        )}

        {/* COPING STRATEGY */}
        {entry.coping_strategy && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              💡 Шийдэл
            </h3>
            <p className="text-gray-900 text-lg">
              {entry.coping_strategy}
            </p>
          </div>
        )}

        {/* NOTES */}
        {entry.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              📝 Тэмдэглэл
            </h3>
            <p className="text-gray-900 text-lg whitespace-pre-wrap">
              {entry.notes}
            </p>
          </div>
        )}

        {/* METADATA */}
        {(entry.location || entry.weather) && (
          <div className="flex gap-4 pt-6 border-t text-gray-600">
            {entry.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{entry.location}</span>
              </div>
            )}
            {entry.weather && (
              <div className="flex items-center gap-2">
                <span>🌤️</span>
                <span>{entry.weather}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}