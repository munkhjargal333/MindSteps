'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { CoreValue, Milestone } from '@/lib/types';
import Link from 'next/link';

export default function NewGoalPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [formData, setFormData] = useState({
    value_id: '',
    title: '',
    description: '',
    goal_type: 'short_term',
    target_date: '',
    priority: 'medium',
    is_public: false
  });

  useEffect(() => {
    loadCoreValues();
  }, [token]);

  const loadCoreValues = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getCoreValues(token);
      setCoreValues(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !formData.title) return;

    setSubmitting(true);
    try {
      await apiClient.createGoal({
        value_id: formData.value_id ? Number(formData.value_id) : undefined,
        title: formData.title,
        description: formData.description || undefined,
        goal_type: formData.goal_type,
        target_date: formData.target_date || undefined,
        priority: formData.priority,
        is_public: formData.is_public
      }, token);
      
      alert('✅ Зорилго амжилттай үүслээ!');
      window.location.href = '/goals';
    } catch (error) {
      alert('❌ Алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/goals" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Буцах
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">🎯 Шинэ зорилго үүсгэх</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        
        {/* TITLE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Зорилгын нэр *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Жишээ: Жилд 12 ном унших"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Дэлгэрэнгүй
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Энэ зорилгын тухай дэлгэрэнгүй..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* GOAL TYPE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Төрөл *
          </label>
          <select
            required
            value={formData.goal_type}
            onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="short_term">📅 Богино хугацаа</option>
            <option value="long_term">🎯 Урт хугацаа</option>
            <option value="daily">☀️ Өдөр тутам</option>
            <option value="weekly">📆 7 хоног тутам</option>
            <option value="monthly">📊 Сар тутам</option>
          </select>
        </div>

        {/* CORE VALUE */}
        {coreValues.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💎 Үнэт зүйл (Сонголттой)
            </label>
            <select
              value={formData.value_id}
              onChange={(e) => setFormData({ ...formData, value_id: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Сонгох --</option>
              {coreValues.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* TARGET DATE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Хүрэх огноо
          </label>
          <input
            type="date"
            value={formData.target_date}
            onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* PRIORITY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Чухал байдал *
          </label>
          <select
            required
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="low">🟢 Бага</option>
            <option value="medium">🟡 Дунд</option>
            <option value="high">🔴 Өндөр</option>
          </select>
        </div>

        {/* PUBLIC */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className="w-5 h-5 text-blue-600"
          />
          <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
            🌐 Нийтэд харагдана
          </label>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !formData.title}
          className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition shadow-lg"
        >
          {submitting ? 'Үүсгэж байна...' : '✅ Зорилго үүсгэх'}
        </button>
      </div>
    </div>
  );
}