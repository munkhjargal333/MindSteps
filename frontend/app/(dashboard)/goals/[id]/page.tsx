
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Goal, CoreValue, Milestone } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ==================== GOAL DETAIL PAGE ====================
export default function GoalDetailPage() {
  const { token } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', target_date: '' });
  const params = useParams();
  const id = Number(params?.id);
  useEffect(() => {
    
    loadGoalDetail();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const loadGoalDetail = async () => {
    if (!token) return;
    try {
      const data = await apiClient.getGoal(id, token);
      setGoal(data);
      // Note: If milestones are included in goal data, extract them
      // Otherwise, you'd need a separate API call
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!token || !newMilestone.title) return;
    try {
      await apiClient.createMilestone(id, {
        title: newMilestone.title,
        description: newMilestone.description || undefined,
        target_date: newMilestone.target_date || undefined,
        sort_order: milestones.length + 1
      }, token);
      setNewMilestone({ title: '', description: '', target_date: '' });
      setShowMilestoneForm(false);
      loadGoalDetail();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  const handleCompleteMilestone = async (milestoneId: number) => {
    if (!token) return;
    try {
      await apiClient.completeMilestone(milestoneId, token);
      loadGoalDetail();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Зорилго олдсонгүй</h2>
        <Link href="/goals" className="text-blue-600 hover:text-blue-700">← Буцах</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/goals" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Буцах
        </Link>
        <Link
          href={`/goals/edit/${id}`}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
        >
          ✏️ Засах
        </Link>
      </div>

      {/* GOAL HEADER */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4">{goal.title}</h1>
        
        {goal.description && (
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{goal.description}</p>
        )}

        {/* PROGRESS */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">Явц</span>
            <span className="font-bold text-blue-600">{goal.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${goal.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* METADATA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs text-gray-500 mb-1">Төрөл</div>
            <div className="font-semibold">{goal.goal_type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Статус</div>
            <div className="font-semibold capitalize">{goal.status}</div>
          </div>
          {goal.target_date && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Хүрэх огноо</div>
              <div className="font-semibold">{new Date(goal.target_date).toLocaleDateString('mn-MN')}</div>
            </div>
          )}
        </div>
      </div>

      {/* MILESTONES SECTION */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🎯 Алхамууд</h2>
          <button
            onClick={() => setShowMilestoneForm(!showMilestoneForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Алхам нэмэх
          </button>
        </div>

        {/* ADD MILESTONE FORM */}
        {showMilestoneForm && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-3">
            <input
              type="text"
              placeholder="Алхамын нэр *"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Тайлбар"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={newMilestone.target_date}
              onChange={(e) => setNewMilestone({ ...newMilestone, target_date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddMilestone}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                ✅ Хадгалах
              </button>
              <button
                onClick={() => setShowMilestoneForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Цуцлах
              </button>
            </div>
          </div>
        )}

        {/* MILESTONES LIST */}
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>Алхам нэмээгүй байна</p>
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border-2 transition ${
                  milestone.is_completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${milestone.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {milestone.title}
                    </h3>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    )}
                    {milestone.target_date && (
                      <div className="text-xs text-gray-500">
                        🎯 {new Date(milestone.target_date).toLocaleDateString('mn-MN')}
                      </div>
                    )}
                  </div>
                  {!milestone.is_completed && (
                    <button
                      onClick={() => handleCompleteMilestone(milestone.id)}
                      className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      ✓ Дуусгах
                    </button>
                  )}
                  {milestone.is_completed && (
                    <div className="ml-4 text-green-600 font-semibold">✅</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
