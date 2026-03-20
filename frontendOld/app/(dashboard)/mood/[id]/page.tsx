'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import DeleteConfirmModal from '@/components/ui/DeleteModal';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Edit2, Trash2, Calendar, Clock, Zap, Lightbulb, FileText, TrendingUp } from 'lucide-react';

export default function MoodDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { showToast } = useGlobalToast();
  
  const entryId = params?.id ? Number(params.id) : null;
  
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || !entryId) return;
    
    async function fetchEntry() {
      try {
        const data = await apiClient.getMoodEntry(entryId!, token!);
        setEntry(data);
      } catch (error) {
        showToast('Мэдээлэл авахад алдаа гарлаа', 'error');
        router.push('/mood');
      } finally {
        setLoading(false);
      }
    }

    fetchEntry();
  }, [token, entryId]);

  const handleDelete = async () => {
    if (!token || !entryId) return;
    
    setDeleting(true);
    try {
      await apiClient.deleteMoodEntry(entryId, token);
      showToast('Амжилттай устгагдлаа', 'success');
      setTimeout(() => router.push('/mood'), 500);
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      
      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={entry.MoodUnit.display_name_mn}
        isDeleting={deleting}
      />

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <ChevronLeft size={24} className="text-gray-500 group-hover:text-black" />
          </button>
          
          <h1 className="font-black text-gray-900">Дэлгэрэнгүй</h1>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/mood`)}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* MOOD HERO CARD */}
          <div 
            className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${entry.MoodUnit.display_color}15 0%, ${entry.MoodUnit.display_color}05 100%)`
            }}
          >
            <div className="flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-lg"
                style={{ backgroundColor: `${entry.MoodUnit.display_color}20` }}
              >
                {entry.MoodUnit.display_emoji}
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {entry.MoodUnit.display_name_mn}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(entry.entry_date).toLocaleDateString('mn-MN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Intensity Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Эрчим</span>
                <span className="text-2xl font-black" style={{ color: entry.MoodUnit.display_color }}>
                  {entry.intensity}/10
                </span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${entry.intensity * 10}%`,
                    backgroundColor: entry.MoodUnit.display_color
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* When Felt */}
            {entry.when_felt && (
              <DetailCard
                icon={<Clock size={18} className="text-blue-500" />}
                label="Хэзээ мэдэрсэн"
                value={entry.when_felt}
                color="blue"
              />
            )}

            {/* Trigger Event */}
            {entry.trigger_event && (
              <DetailCard
                icon={<Zap size={18} className="text-amber-500" />}
                label="Шалтгаан"
                value={entry.trigger_event}
                color="amber"
              />
            )}

            {/* Core Value */}
            {entry.CoreValues && (
              <DetailCard
                icon={<Lightbulb size={18} className="text-purple-500" />}
                label="Үнэт зүйл"
                value={
                  <span className="flex items-center gap-2">
                    <span>{entry.CoreValues?.MaslowLevel?.icon}</span>
                    <span>{entry.CoreValues?.name}</span>
                  </span>
                }
                color="purple"
              />
            )}

            {/* Coping Strategy */}
            {entry.coping_strategy && (
              <DetailCard
                icon={<TrendingUp size={18} className="text-green-500" />}
                label="Хандлага"
                value={entry.coping_strategy}
                color="green"
              />
            )}
          </div>

          {/* NOTES SECTION */}
          {entry.notes && (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <FileText size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Нэмэлт тэмдэглэл</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {entry.notes}
              </p>
            </div>
          )}

          {/* METADATA */}
          {/* <div className="bg-gray-100/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Үүсгэсэн: {new Date(entry.created_at).toLocaleString('mn-MN')}
              {entry.updated_at && entry.updated_at !== entry.created_at && (
                <> • Засварласан: {new Date(entry.updated_at).toLocaleString('mn-MN')}</>
              )}
            </p>
          </div> */}
        </div>
      </main>
    </div>
  );
}

// DetailCard Component
interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color: 'blue' | 'amber' | 'purple' | 'green';
}

function DetailCard({ icon, label, value, color }: DetailCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
    purple: 'bg-purple-50 border-purple-100',
    green: 'bg-green-50 border-green-100'
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-5 border shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-gray-900 font-bold text-sm leading-relaxed">
        {value}
      </div>
    </div>
  );
}