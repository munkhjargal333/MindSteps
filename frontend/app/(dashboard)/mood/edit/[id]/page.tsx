'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry, MoodCategory, CoreValue, MoodUnit } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';

export default function EditMoodPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { showToast } = useGlobalToast();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [values, setValues] = useState<CoreValue[]>([]);
  const [moods, setMoods] = useState<MoodUnit[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [whenFelt, setWhenFelt] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCoreValue, setSelectedCoreValue] = useState<number | null>(null);

  useEffect(() => {
    if (token && id) {
      loadData();
    }
  }, [token, id]);

  const loadData = async () => {
    if (!token || !id) return;

    setLoading(true);
    try {
      const [entry, categories, coreValues] = await Promise.all([
        apiClient.getMoodEntry(Number(id), token),
        apiClient.getMoodCategories(token),
        apiClient.getCoreValues(token),
      ]);

      // Set categories and values
      setCategories(categories);
      setValues(coreValues);

      // Set form values from entry
      setSelectedCategory(entry.MoodUnit?.category_id || null);         // category
      setSelectedMood(entry.mood_unit_id);             // байхгүй
      setIntensity(entry.intensity);
      setWhenFelt(entry.when_felt || '');
      setTriggerEvent(entry.trigger_event || '');
      setCopingStrategy(entry.coping_strategy || '');
      setNotes(entry.notes || '');
      setSelectedCoreValue(entry.core_value_id || null);

      // Load moods for the category
      if (entry.mood_unit_id) {
        const moodsData = await apiClient.getMoodsByCategory(entry.MoodUnit.category_id , token);
        setMoods(moodsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('❌ Өгөгдөл ачаалахад алдаа гарлаа', 'error');
      router.push('/mood');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory && token) {
      loadMoodsByCategory(selectedCategory);
    }
  }, [selectedCategory, token]);

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
    if (!token || !selectedMood || !id) return;

    setSubmitting(true);
    try {
      await apiClient.updateMoodEntry(Number(id), {
        mood_unit_id: selectedMood,
        intensity,
        when_felt: whenFelt || undefined,
        trigger_event: triggerEvent || undefined,
        coping_strategy: copingStrategy || undefined,
        notes: notes || undefined,
        core_value_id: selectedCoreValue || undefined,
      }, token);

      showToast('✅ Амжилттай шинэчлэгдлээ!', 'success');
      router.push(`/mood/${id}`);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      

      <div className="mb-6">
        <Link href={`/mood`} className="text-purple-600 hover:text-purple-700 font-medium">
          ← Буцах
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">✏️ Сэтгэл санаа засах</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        
        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            1. Үндсэн төрөл сонгох *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                }}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedCategory === cat.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{cat.emoji || '💭'}</div>
                <div className="text-sm font-semibold">{cat.name_mn}</div>
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
                  <div className="text-2xl mb-1">{mood.display_emoji || '😊'}</div>
                  <div className="text-sm font-semibold">{mood.display_name_mn}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADDITIONAL FIELDS */}
        {selectedMood && (
          <>
            {/* CORE VALUES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                3. Үнэт зүйл сонгох
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {values.map((value) => (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => setSelectedCoreValue(value.id)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedCoreValue === value.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{value.MaslowLevel?.icon || '💎'}</div>
                    <div className="text-sm font-semibold">{value.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* WHEN FELT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                4. Хэзээ мэдэрсэн бэ?
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

            {/* INTENSITY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                7. Эрчим хүч (1-10) *
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

            {/* NOTES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                8. Нэмэлт тэмдэглэл
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Дэлгэрэнгүй тайлбар..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* SUBMIT */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {submitting ? 'Хадгалж байна...' : '✅ Хадгалах'}
              </button>
              
              <Link
                href={`/mood`}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-lg hover:bg-gray-50 active:scale-95 transition text-center"
              >
                Цуцлах
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

function setMoods(moodsData: MoodUnit[]) {
  throw new Error('Function not implemented.');
}
