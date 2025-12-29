'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Goal } from '@/lib/types';
import Link from 'next/link';
import StatCard from '@/components/goals/StatCard';
import GoalCard from '@/components/goals/GaolCard';
import { useGlobalToast } from '@/context/ToastContext';
  

// ==================== GOALS LIST PAGE ====================
export default function GoalsPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  const [goals, setGoals] = useState<{ active: Goal[]; completed: Goal[]; paused: Goal[] }>({
    active: [],
    completed: [],
    paused: []
  });
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'paused'>('active');

  const loadGoals = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [goalsData] = await Promise.all([
        apiClient.getGoals(token),
       // apiClient.getGoalStatistics(token)
      ]);
      setGoals(goalsData.goals);
     // setStatistics(statsData);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadGoals();
  }, [token, loadGoals]);

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Энэ зорилгыг устгах уу?')) return;
    try {
      await apiClient.deleteGoal(id, token);
      loadGoals();
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    }
  };

  const handlePause = async (id: number) => {
    if (!token) return;
    try {
      await apiClient.pauseGoal(id, token);
      loadGoals();
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    }
  };

  const handleResume = async (id: number) => {
    if (!token) return;
    try {
      await apiClient.resumeGoal(id, token);
      loadGoals();
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-lg text-gray-600">Зорилгууд ачааллаж байна...</div>
      </div>
    );
  }

  const currentGoals = goals[activeTab];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToastContainer/>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🎯 Миний зорилгууд</h1>
        <div className="flex gap-3">
          <Link
            href="/core-values"
            className="px-5 py-2.5 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition"
          >
            💎 Үнэт зүйлс
          </Link>
          <Link
            href="/goals/new"
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            + Шинэ зорилго
          </Link>
        </div>
      </div>

      {/* STATISTICS */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Нийт" value={statistics.total_goals} color="blue" />
          <StatCard label="Идэвхтэй" value={statistics.active_goals} color="green" />
          <StatCard label="Дууссан" value={statistics.completed_goals} color="purple" />
          <StatCard label="Түр зогссон" value={statistics.paused_goals} color="yellow" />
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'active'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Идэвхтэй ({goals.active.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Дууссан ({goals.completed.length})
        </button>
        <button
          onClick={() => setActiveTab('paused')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'paused'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Түр зогссон ({goals.paused.length})
        </button>
      </div>

      {/* GOALS LIST */}
      {currentGoals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {activeTab === 'active' && 'Идэвхтэй зорилго байхгүй'}
            {activeTab === 'completed' && 'Дууссан зорилго байхгүй'}
            {activeTab === 'paused' && 'Түр зогссон зорилго байхгүй'}
          </h2>
          <p className="text-gray-500 mb-6">Шинэ зорилго үүсгэж эхлээрэй!</p>
          <Link
            href="/goals/new"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            + Зорилго үүсгэх
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
            />
          ))}
        </div>
      )}
    </div>
  );
}