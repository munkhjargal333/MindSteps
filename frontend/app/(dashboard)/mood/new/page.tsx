'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry, MoodCategory, Mood } from '@/lib/types';
import Link from 'next/link';


// ==================== NEW MOOD ENTRY PAGE ====================
export function NewMoodPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [whenFelt, setWhenFelt] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');

  useEffect(() => {
    loadCategories();
  }, [token]);

  useEffect(() => {
    if (selectedCategory) {
      loadMoodsByCategory(selectedCategory);
    }
  }, [selectedCategory, token]);

  const loadCategories = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getMoodCategories(token);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodsByCategory = async (categoryId: number) => {
    if (!token) return;
    try {
      const data = await apiClient.getMoodsByCategory(categoryId, token);
      setMoods(data);
    } catch (error) {
      console.error('Error loading moods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedMood) return;

    setSubmitting(true);
    try {
      await apiClient.createMoodEntry({
        mood_id: selectedMood,
        intensity,
        when_felt: whenFelt || undefined,
        trigger_event: triggerEvent || undefined,
        coping_strategy: copingStrategy || undefined,
        notes: notes || undefined,
        location: location || undefined,
        weather: weather || undefined,
      }, token);
      
      alert('✅ Сэтгэл санаа амжилттай хадгалагдлаа!');
      window.location.href = '/mood';
    } catch (error) {
      console.error('Error creating mood entry:', error);
      alert('❌ Алдаа гарлаа. Дахин оролдоно уу.');
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mood" className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">💜 Сэтгэл санаагаа бичих</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        
        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            1. Категори сонгох *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedMood(null);
                }}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedCategory === cat.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {/* <div className="text-2xl mb-1">{cat.emoji || '💭'}</div> */}
                <div className="text-sm font-semibold">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* MOOD */}
        {selectedCategory && moods.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              2. Сэтгэл санаа сонгох *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedMood === mood.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji || '😊'}</div>
                  <div className="text-sm font-semibold">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INTENSITY */}
        {selectedMood && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                3. Эрчим хүч (1-10) *
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
                4. Хэзээ мэдэрсэн бэ?
              </label>
              <input
                type="datetime-local"
                value={whenFelt}
                onChange={(e) => setWhenFelt(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* TRIGGER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                5. Ямар үйл явдал өдөөсөн бэ?
              </label>
              <input
                type="text"
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                placeholder="Жишээ: Ажлын уулзалт, найзтай уулзсан..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* COPING */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                6. Яаж шийдэж болох вэ?
              </label>
              <input
                type="text"
                value={copingStrategy}
                onChange={(e) => setCopingStrategy(e.target.value)}
                placeholder="Жишээ: Амарч авах, спорт хийх, найзтайгаа ярих..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                7. Нэмэлт тэмдэглэл
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Дэлгэрэнгүй тайлбар..."
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
                  placeholder="Гэр, ажил..."
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
                  placeholder="Нарлаг, үүлэрхэг..."
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
              {submitting ? 'Хадгалж байна...' : '✅ Хадгалах'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

