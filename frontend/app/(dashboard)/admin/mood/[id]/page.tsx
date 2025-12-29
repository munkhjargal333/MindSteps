'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodUnit, PlutchikCombination } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import { 
  ArrowLeft, Edit3, Trash2, Info, 
  Layers, Smile, Palette, Hash, 
  X, Save, AlertTriangle, ChevronRight
} from 'lucide-react';

export default function MoodUnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { showToast } = useGlobalToast();

  const [loading, setLoading] = useState(true);
  const [moodUnit, setMoodUnit] = useState<MoodUnit | null>(null);
  const [combination, setCombination] = useState<PlutchikCombination | null>(null);

  // Edit combination modal
  const [editingCombination, setEditingCombination] = useState(false);
  const [editForm, setEditForm] = useState({
    combined_name_en: '',
    combined_name_mn: '',
    combined_type: '', // Types-тайгаа ижил байлгах
    description: '',
    color: '',
    emoji: '',
  });
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token && params.id) loadMoodUnit();
  }, [token, params.id]);

  const loadMoodUnit = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getMoodUnitById(Number(params.id), token!);
      setMoodUnit(data);
      if (data.combination_id) {
        const combData = await apiClient.getPlutchikCombinationById(data.combination_id, token!);
        setCombination(combData);
      }
    } catch (error) {
      showToast('❌ Өгөгдөл ачаалахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!combination) return;
    setEditForm({
      combined_name_en: combination.combined_name_en,
      combined_name_mn: combination.combined_name_mn,
      combined_type: combination.combined_type || '',
      description: combination.description || '',
      color: combination.color || '',
      emoji: combination.emoji || '',
    });
    setEditingCombination(true);
  };

  const handleSave = async () => {
    if (!token || !combination) return;
    setSaving(true);
    try {
      await apiClient.updatePlutchikCombination(combination.id, editForm, token);
      showToast('✅ Амжилттай шинэчлэгдлээ', 'success');
      setEditingCombination(false);
      loadMoodUnit();
    } catch (error) {
      showToast('❌ Шинэчлэхэд алдаа гарлаа', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !combination) return;
    setDeleting(true);
    try {
      await apiClient.deletePlutchikCombination(combination.id, token);
      showToast('✅ Амжилттай устгагдлаа', 'success');
      router.push('/admin/mood-units');
    } catch (error) {
      showToast('❌ Устгахад алдаа гарлаа. Энэ combination-ийг ашиглаж байгаа өөр unit байж магадгүй', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!moodUnit) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest">Mood unit олдсонгүй</p>
        <button onClick={() => router.push('/admin/mood-units')} className="text-indigo-600 font-black uppercase text-xs flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Буцах
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      

      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/mood-units')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodUnit.display_emoji}</span>
                <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">{moodUnit.display_name_mn}</h1>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{moodUnit.display_name_en}</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            ID: {moodUnit.id}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
        
        {/* Mood Unit Basic Info Card */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Smile size={120} />
          </div>
          
          <div className="flex items-center gap-2 text-indigo-600 mb-6">
            <Info size={18} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Үндсэн мэдээлэл</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төрөл</p>
              <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                {moodUnit.type}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ангилал</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>{moodUnit.MoodCategories?.emoji}</span>
                {moodUnit.MoodCategories?.name_mn}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Emoji харагдац</p>
              <p className="text-3xl">{moodUnit.display_emoji}</p>
            </div>
          </div>
        </section>

        {/* Combination Detail Card */}
        {combination ? (
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-purple-600">
                <Layers size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Plutchik Combination</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={handleEditClick} className="p-2.5 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Combined Name (MN/EN)</p>
                    <p className="text-xl font-black text-gray-900">{combination.combined_name_mn}</p>
                    <p className="text-sm font-bold text-gray-400">{combination.combined_name_en}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                      {combination.combined_type}
                    </div>
                    {combination.emoji && <span className="text-2xl">{combination.emoji}</span>}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Components</p>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl w-fit">
                    <div className="text-center">
                      <span className="text-xl block">{combination.Emotion1?.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{combination.Emotion1?.name_mn}</span>
                    </div>
                    <ChevronRight className="text-gray-200" size={16} />
                    <div className="text-center">
                      <span className="text-xl block">{combination.Emotion2?.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{combination.Emotion2?.name_mn}</span>
                    </div>
                  </div>
                </div>
              </div>

              {combination.description && (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">{combination.description}</p>
                </div>
              )}
              
              {combination.color && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg shadow-inner border border-white" style={{ backgroundColor: combination.color }} />
                  <span className="text-xs font-mono font-bold text-gray-400">{combination.color.toUpperCase()}</span>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Combination холбогдоогүй байна</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCombination && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl border border-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <Edit3 className="text-purple-600" size={20} /> Засах
              </h2>
              <button onClick={() => setEditingCombination(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Монгол нэр</label>
                  <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" value={editForm.combined_name_mn} onChange={(e) => setEditForm({...editForm, combined_name_mn: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Англи нэр</label>
                  <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" value={editForm.combined_name_en} onChange={(e) => setEditForm({...editForm, combined_name_en: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Тайлбар</label>
                <textarea className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold min-h-[100px]" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Emoji</label>
                  <input className="w-full bg-gray-50 border-none rounded-xl p-3 text-center text-xl" value={editForm.emoji} onChange={(e) => setEditForm({...editForm, emoji: e.target.value})} />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Төрөл</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" value={editForm.combined_type} onChange={(e) => setEditForm({...editForm, combined_type: e.target.value})}>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="tertiary">Tertiary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                Хадгалах
              </button>
              <button onClick={() => setEditingCombination(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 text-xs uppercase">Болих</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Устгах уу?</h2>
            <p className="text-sm text-gray-400 font-medium mb-8">Энэ үйлдлийг буцаах боломжгүй бөгөөд системд нөлөөлж магадгүй.</p>
            <div className="flex flex-col gap-2">
              <button onClick={handleDelete} disabled={deleting} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50">
                {deleting ? 'Устгаж байна...' : 'Тийм, устга'}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 font-bold text-gray-400 uppercase text-xs">Цуцлах</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}