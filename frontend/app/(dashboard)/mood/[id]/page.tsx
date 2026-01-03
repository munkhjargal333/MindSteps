'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodEntry } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import { ChevronLeft, Edit3, Calendar, Clock, Sparkles, PencilLine, Lightbulb, TrendingUp, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { mn } from 'date-fns/locale';

export default function MoodDetailPage() {
  const { token } = useAuth(); 
  const { showToast } = useGlobalToast();
  const router = useRouter();
  const params = useParams();
  const entryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [entry, setEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    loadEntry();
  }, [token, entryId]);

  const loadEntry = async () => {
    if (!token || !entryId) return;
    setLoading(true);
    try {
      const data = await apiClient.getMoodEntry(Number(entryId), token);
      setEntry(data);
    } catch (error) {
      showToast('Өгөгдөл ачаалахад алдаа гарлаа', 'error');
      router.push('/mood');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !entryId) return;
    
    if (!confirm('Энэ тэмдэглэлийг устгахдаа итгэлтэй байна уу?')) return;

    setDeleting(true);
    try {
      await apiClient.deleteMoodEntry(Number(entryId), token);
      showToast('Амжилттай устгагдлаа', 'success');
      setTimeout(() => router.push('/mood'), 800);
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) return null;

  const moodColor = entry.MoodUnit.display_color;
  const categoryColor = entry.MoodUnit.display_color || moodColor;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ChevronLeft size={24} className="text-gray-500 group-hover:text-black" />
          </button>
          <h1 className="font-black text-gray-900">Дэлгэрэнгүй</h1>
          <button 
            onClick={() => router.push(`/mood/edit/${entryId}`)}
            className="p-2 hover:bg-purple-50 rounded-full transition-colors group"
          >
            <Edit3 size={20} className="text-purple-600 group-hover:text-purple-700" />
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* MOOD HERO CARD */}
          <section 
            className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ 
              background: `radial-gradient(circle at top right, ${moodColor} 0%, ${moodColor}dd 50%, ${moodColor}99 100%)`,
              borderColor: moodColor
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl drop-shadow-2xl">{entry.MoodUnit.display_emoji}</div>
                <div>
                  <h2 className="text-2xl font-black text-white drop-shadow-md">{entry.MoodUnit.display_name_mn}</h2>
                  <p className="text-white/80 text-sm font-bold mt-1 drop-shadow">
                    {entry.MoodUnit.display_name_mn}
                  </p>
                </div>
              </div>
              
              {/* INTENSITY BADGE */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border-2 border-white/30">
                <div className="text-xs font-black text-white/70 uppercase tracking-wider mb-1">Эрчим</div>
                <div className="text-3xl font-black text-white">{entry.intensity}</div>
              </div>
            </div>

            {/* DATE INFO */}
            <div className="flex items-center gap-4 text-white/90 text-sm font-bold">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                <Calendar size={16} />
                <span>{format(new Date(entry.created_at), 'yyyy оны MM сарын dd', { locale: mn })}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                <Clock size={16} />
                <span>{format(new Date(entry.created_at), 'HH:mm')}</span>
              </div>
            </div>
          </section>

          {/* CORE VALUE */}
          {entry.CoreValues && (
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
              <div className="flex items-center gap-2 mb-3 text-purple-600">
                <Lightbulb size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Холбоотой үнэт зүйл</h3>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 rounded-2xl p-4 border-2 border-purple-100">
                <span className="text-2xl">{entry.CoreValues.MaslowLevel?.icon}</span>
                <div>
                  <div className="font-black text-purple-900">{entry.CoreValues.name}</div>
                  <div className="text-xs text-purple-600 font-bold">{entry.CoreValues.MaslowLevel?.name}</div>
                </div>
              </div>
            </section>
          )}

          {/* DETAILS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
            
            {entry.when_felt && (
              <DetailCard 
                icon={<Clock size={18} />} 
                label="Хэзээ мэдэрсэн" 
                content={entry.when_felt}
                color="text-blue-600"
                bgColor="bg-blue-50"
                borderColor="border-blue-100"
              />
            )}

            {entry.trigger_event && (
              <DetailCard 
                icon={<Sparkles size={18} />} 
                label="Шалтгаан" 
                content={entry.trigger_event}
                color="text-amber-600"
                bgColor="bg-amber-50"
                borderColor="border-amber-100"
              />
            )}

            {entry.coping_strategy && (
              <DetailCard 
                icon={<TrendingUp size={18} />} 
                label="Арга хэрэгсэл" 
                content={entry.coping_strategy}
                color="text-green-600"
                bgColor="bg-green-50"
                borderColor="border-green-100"
              />
            )}
          </section>

          {/* NOTES */}
          {entry.notes && (
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-500 delay-300">
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <PencilLine size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Нэмэлт тэмдэглэл</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">{entry.notes}</p>
            </section>
          )}

          {/* ACTION BUTTONS */}
          <section className="grid grid-cols-2 gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-500 delay-400">
            <button
              onClick={() => router.push(`/mood/edit/${entryId}`)}
              className="py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Edit3 size={18} /> Засах
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={18} /> {deleting ? 'Устгаж байна...' : 'Устгах'}
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}

// DetailCard Component
function DetailCard({ icon, label, content, color, bgColor, borderColor }: any) {
  return (
    <div className={`${bgColor} rounded-2xl p-5 border-2 ${borderColor}`}>
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        {icon}
        <h4 className="text-xs font-black uppercase tracking-widest">{label}</h4>
      </div>
      <p className="text-gray-800 font-medium leading-relaxed">{content}</p>
    </div>
  );
}