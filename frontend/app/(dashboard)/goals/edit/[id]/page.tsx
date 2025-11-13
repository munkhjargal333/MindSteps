'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Goal, CoreValue, Milestone } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
  

// ==================== EDIT GOAL PAGE ====================
export default function EditGoalPage() {
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();
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
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    loadData();
  }, [id, token]);

  const loadData = async () => {
    if (!token) return;
    try {
      const [goal, values] = await Promise.all([
        apiClient.getGoal(id, token),
        apiClient.getCoreValues(token)
      ]);
      
      setCoreValues(values);
      setFormData({
        value_id: goal.value_id?.toString() || '',
        title: goal.title,
        description: goal.description || '',
        goal_type: goal.goal_type,
        target_date: goal.target_date || '',
        priority: 'medium', // Note: priority field not in Goal type
        is_public: goal.is_public
      });
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
      await apiClient.updateGoal(id, {
        value_id: formData.value_id ? Number(formData.value_id) : undefined,
        title: formData.title,
        description: formData.description || undefined,
       // goal_type: formData.goal_type,
        target_date: formData.target_date || undefined,
        is_public: formData.is_public
      }, token);
      
      showToast('✅ Амжилттай шинэчлэгдлээ!', 'success');
      window.location.href = `/goals/${id}`;
    } catch (error) {
      showToast('❌ Алдаа гарлаа', 'error');
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
      <ToastContainer/>
      <div className="mb-6">
        <Link href={`/goals/${id}`} className="text-blue-600 hover:text-blue-700 font-medium">
          ← Буцах
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">✏️ Зорилго засах</h1>

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
              💎 Үнэт зүйл
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
          {submitting ? 'Хадгалж байна...' : '✅ Өөрчлөлт хадгалах'}
        </button>
      </div>
    </div>
  );
}
