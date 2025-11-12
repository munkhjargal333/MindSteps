'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ==================== MOOD DETAIL PAGE ====================
export default function MoodDetailPage() {
  const { token } = useAuth();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const param  =  useParams();
  const id = Number(param?.id);


  useEffect(() => {
    loadEntry();
  }, [id, token]);

  const loadEntry = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getMoodEntry(id, token);
      setEntry(data);
    } catch (error) {
      console.error('Error loading mood entry:', error);
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Бичлэг олдсонгүй</h2>
        <Link href="/mood" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    return new Date(dateString).toLocaleString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/mood" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/mood/edit/${id}`}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
          >
            ✏️ Засах
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {entry.PlutchikEmotions?.emoji || '💜'} {entry.PlutchikEmotions?.name_mn || 'Сэтгэл санаа'}
            </h1>
            <p className="text-gray-500">{formatDate(entry.created_at)}</p>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${
            entry.intensity >= 8 ? 'bg-red-100 text-red-700' :
            entry.intensity >= 6 ? 'bg-orange-100 text-orange-700' :
            entry.intensity >= 4 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {entry.intensity}/10
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          {entry.trigger_event && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-2">ШАЛТГААН</h3>
              <p className="text-lg text-gray-800">{entry.trigger_event}</p>
            </div>
          )}

          {entry.coping_strategy && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-2">ШИЙДЛИЙН АРГА</h3>
              <p className="text-lg text-gray-800">{entry.coping_strategy}</p>
            </div>
          )}

          {entry.notes && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-2">ТЭМДЭГЛЭЛ</h3>
              <p className="text-lg text-gray-800 whitespace-pre-wrap">{entry.notes}</p>
            </div>
          )}

          {(entry.location || entry.weather) && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {entry.location && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">📍 БАЙРШИЛ</h3>
                  <p className="text-gray-800">{entry.location}</p>
                </div>
              )}
              {entry.weather && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">🌤️ ЦАГ АГААР</h3>
                  <p className="text-gray-800">{entry.weather}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
