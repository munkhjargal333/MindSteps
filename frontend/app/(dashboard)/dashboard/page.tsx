'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './../../../context/AuthContext';
import { apiClient } from './../../../lib/api/client';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient.getUserStats(token)
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Сайн байна уу, {user?.name}!</h1>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm opacity-90">Түвшин</span>
            <div className="text-2xl font-bold">{user?.current_level}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm opacity-90">Нийт оноо</span>
            <div className="text-2xl font-bold">{user?.total_score}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm opacity-90 mb-1">Түвшин явц</div>
            <div className="bg-white/30 rounded-full h-3">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${user?.level_progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Журнал"
          value={stats?.total_journals || 0}
          icon="📔"
          color="bg-blue-500"
        />
        <StatCard
          title="Сэтгэлийн бичлэг"
          value={stats?.total_mood_entries || 0}
          icon="😊"
          color="bg-green-500"
        />
        <StatCard
          title="Бясалгал"
          value={`${stats?.total_meditation_minutes || 0} мин`}
          icon="🧘"
          color="bg-purple-500"
        />
        <StatCard
          title="Дараалсан өдөр"
          value={stats?.streaks?.[0]?.current_streak || 0}
          icon="🔥"
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Журнал бичих"
          description="Өнөөдрийн сэтгэгдлээ бичээрэй"
          link="/journal/new"
          icon="✍️"
          color="from-blue-400 to-blue-600"
        />
        <ActionCard
          title="Сэтгэл санаа"
          description="Өнөөдрийн сэтгэлээ тэмдэглэх"
          link="/mood/track"
          icon="💭"
          color="from-green-400 to-green-600"
        />
        <ActionCard
          title="Бясалгал"
          description="Бясалгал эхлүүлэх"
          link="/meditation/session"
          icon="🧘‍♀️"
          color="from-purple-400 to-purple-600"
        />
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, link, icon, color }: any) {
  return (
    <Link href={link}>
      <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
}