'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
  


// ==================== EDIT MOOD PAGE ====================
export default function EditMoodPage() {
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [whenFelt, setWhenFelt] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const params = useParams();
  const id = Number(params?.id);

  useEffect(() => {
    loadEntry();
  }, [id, token]);

  const loadEntry = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getMoodEntry(id, token);
      setEntry(data);
      setIntensity(data.intensity);
      setWhenFelt(data.when_felt || '');
      setTriggerEvent(data.trigger_event || '');
      setCopingStrategy(data.coping_strategy || '');
      setNotes(data.notes || '');
      setLocation(data.location || '');
      setWeather(data.weather || '');
    } catch (error) {
      console.error('Error loading mood entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    try {
      await apiClient.updateMoodEntry(id, {
        intensity,
        when_felt: whenFelt || undefined,
        trigger_event: triggerEvent || undefined,
        coping_strategy: copingStrategy || undefined,
        notes: notes || undefined,
        location: location || undefined,
        weather: weather || undefined,
      }, token);
      
      showToast('✅ Амжилттай шинэчлэгдлээ!', 'success');
      window.location.href = `/mood/${id}`;
    } catch (error) {
      console.error('Error updating mood entry:', error);
      showToast('❌ Алдаа гарлаа. Дахин оролдоно уу.', 'error');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ToastContainer/>
      <div className="mb-6">
        <Link href={`/mood/${id}`} className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        ✏️ {entry.PlutchikEmotions?.emoji} {entry.PlutchikEmotions?.name_mn} засах
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        
        {/* INTENSITY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Эрчим хүч (1-10) *
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-3xl font-bold text-purple-600 min-w-[3rem] text-center">
              {intensity}
            </div>
          </div>
        </div>

        {/* WHEN FELT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Хэзээ мэдэрсэн бэ?
          </label>
              <input
                type="text"
                placeholder="Жишээ нь: Өчигдөр орой 8 цагт, Ажлын дараа гэх мэт"
                value={whenFelt}
                onChange={(e) => setWhenFelt(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none placeholder-gray-400"
              />
        </div>

        {/* TRIGGER */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ямар үйл явдал өдөөсөн бэ?
          </label>
          <input
            type="text"
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* COPING */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Яаж шийдэж болох вэ?
          </label>
          <input
            type="text"
            value={copingStrategy}
            onChange={(e) => setCopingStrategy(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Нэмэлт тэмдэглэл
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* LOCATION & WEATHER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Байршил
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌤️ Цаг агаар
            </label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          {submitting ? 'Хадгалж байна...' : '✅ Өөрчлөлт хадгалах'}
        </button>
      </form>
    </div>
  );
}