'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { CoreValue, Mood, MoodCategory } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ==================== CORE VALUES DETAIL PAGE ====================
export default function CoreValueDetailPage() {
   
  const { token } = useAuth();
  const [value, setValue] = useState<CoreValue | null>(null);
  const [loading, setLoading] = useState(true);
   const param  =  useParams();
    const id = Number(param?.id);

  useEffect(() => {
    if (token && id) {
      loadValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const loadValue = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getCoreValue(id, token);
      setValue(data);
    } catch (err) {
      console.error('Error loading core value:', err);
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

  if (!value) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Үнэт зүйл олдсонгүй</h2>
        <Link href="/core-values" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/core-values" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
        <Link
          href={`/core-values/edit/${id}`}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
        >
          ✏️ Засах
        </Link>
      </div>

      <div 
        className="bg-white rounded-xl shadow-lg p-8 border-4"
        style={{ borderColor: value.color || '#8b5cf6' }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        
          <div className="text-6xl">{ '💎'}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{value.name}</h1>
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: value.color ? `${value.color}20` : '#f3e8ff',
                color: value.color || '#8b5cf6'
              }}
            >
              Эрэмбэ: {value.priority_order}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {value.description && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 mb-2">ТАЙЛБАР</h3>
            <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
              {value.description}
            </p>
          </div>
        )}

        {/* METADATA */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t text-sm">
          <div>
            <div className="text-gray-500 mb-1">Үүсгэсэн огноо</div>
            <div className="font-semibold">
              {new Date(value.created_at).toLocaleDateString('mn-MN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Статус</div>
            <div className="font-semibold">
              {value.is_active ? (
                <span className="text-green-600">✅ Идэвхтэй</span>
              ) : (
                <span className="text-gray-400">⏸️ Идэвхгүй</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}