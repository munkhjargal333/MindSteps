import Link from 'next/link';
import { useState } from 'react';
import { Goal } from '@/lib/types';

export default function GoalCard({ 
  goal, 
  onDelete, 
  onPause, 
  onResume 
}: { 
  goal: Goal;
  onDelete: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const typeLabels = {
    short_term: '📅 Богино хугацаа',
    long_term: '🎯 Урт хугацаа',
    daily: '☀️ Өдөр тутам',
    weekly: '📆 7 хоног тутам',
    monthly: '📊 Сар тутам'
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border border-gray-100 relative">
      
      {/* ACTIONS */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-100 rounded-lg text-xl"
        >
          ⋮
        </button>
        
        {showActions && (
          <div className="absolute top-10 right-0 bg-white shadow-xl rounded-lg p-2 flex flex-col gap-1 border min-w-[150px]">
            <Link
              href={`/goals/${goal.id}`}
              className="px-3 py-2 hover:bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              👁️ Харах
            </Link>
            <Link
              href={`/goals/edit/${goal.id}`}
              className="px-3 py-2 hover:bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              ✏️ Засах
            </Link>
            {goal.status === 'active' && (
              <button
                onClick={() => {
                  onPause(goal.id);
                  setShowActions(false);
                }}
                className="px-3 py-2 hover:bg-yellow-50 text-yellow-600 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                ⏸️ Түр зогсоох
              </button>
            )}
            {goal.status === 'paused' && (
              <button
                onClick={() => {
                  onResume(goal.id);
                  setShowActions(false);
                }}
                className="px-3 py-2 hover:bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                ▶️ Үргэлжлүүлэх
              </button>
            )}
            <button
              onClick={() => {
                onDelete(goal.id);
                setShowActions(false);
              }}
              className="px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              🗑️ Устгах
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <Link href={`/goals/${goal.id}`} className="block">
        <div className="pr-10">
          <div className="text-xs text-gray-500 mb-2">
            {typeLabels[goal.goal_type as keyof typeof typeLabels]}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {goal.title}
          </h3>
          
          {goal.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {goal.description}
            </p>
          )}

          {/* PROGRESS BAR */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Явц</span>
              <span className="font-semibold">{goal.progress_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${goal.progress_percentage}%` }}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            {goal.target_date && (
              <span>🎯 {formatDate(goal.target_date)}</span>
            )}
            {goal.status === 'completed' && goal.completed_at && (
              <span className="text-green-600 font-semibold">✅ {formatDate(goal.completed_at)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
