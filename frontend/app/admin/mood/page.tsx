'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodUnit, MoodCategory, PlutchikEmotion, PlutchikCombination } from '@/lib/types';
import { useGlobalToast } from '@/context/ToastContext';
import { 
  Plus, Edit2, Layers, Heart, 
  Settings2, Hash, X, Save, 
  LayoutGrid, ChevronRight, Info
} from 'lucide-react';

export default function AdminMoodUnitsEditPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();

  const [loading, setLoading] = useState(true);
  const [moodUnits, setMoodUnits] = useState<MoodUnit[]>([]);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [emotions, setEmotions] = useState<PlutchikEmotion[]>([]);
  const [combinations, setCombinations] = useState<PlutchikCombination[]>([]);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [editingCombo, setEditingCombo] = useState<PlutchikCombination | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    emotion1_id: 0,
    emotion2_id: 0,
    combined_name_en: '',
    combined_name_mn: '',
    combined_type: 'primary' as any,
    emoji: '',
    color: '#6366f1',
  };
  
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (token) loadInitialData();
  }, [token]);

  const loadInitialData = async () => {
    try {
      const [cats, emos, combos] = await Promise.all([
        apiClient.getMoodCategories(token!),
        apiClient.getPlutchikEmotions(token!),
        apiClient.getPlutchikCombinations(token!),
      ]);
      setCategories(cats);
      setEmotions(emos);
      setCombinations(combos);
      if (cats.length > 0) setSelectedCategoryId(cats[0].id);
      await loadMoodUnits();
    } catch (error) {
      showToast('❌ Мэдээлэл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && categories.length > 0) loadMoodUnits();
  }, [selectedCategoryId]);

  const loadMoodUnits = async () => {
    try {
      const unitsRes = await apiClient.getMoodUnitsByCategory(selectedCategoryId, token!);
      setMoodUnits(unitsRes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (combo: PlutchikCombination) => {
    setEditingCombo(combo);
    setForm({
      emotion1_id: combo.emotion1_id,
      emotion2_id: combo.emotion2_id,
      combined_name_en: combo.combined_name_en,
      combined_name_mn: combo.combined_name_mn,
      combined_type: combo.combined_type,
      emoji: combo.emoji || '',
      color: combo.color || '#6366f1',
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setForm({ ...initialForm, emotion1_id: emotions[0]?.id || 0, emotion2_id: emotions[1]?.id || 0 });
    setIsAdding(true);
    setEditingCombo(null);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (isAdding) {
        await apiClient.createPlutchikCombination(form, token);
        showToast('✅ Шинэ хослол нэмэгдлээ', 'success');
      } else if (editingCombo) {
        await apiClient.updatePlutchikCombination(editingCombo.id, form, token);
        showToast('✅ Амжилттай шинэчлэгдлээ', 'success');
      }
      
      const updatedCombos = await apiClient.getPlutchikCombinations(token);
      setCombinations(updatedCombos);
      setIsAdding(false);
      setEditingCombo(null);
      loadMoodUnits();
    } catch (error) {
      showToast('❌ Алдаа гарлаа', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      

      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Heart size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Mood Combinations</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plutchik's Wheel Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name_mn}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Хослол нэмэх</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mood Unit</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Combination</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Structure</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {moodUnits.map(unit => {
                const combo = combinations.find(c => c.id === unit.combination_id);
                return (
                  <tr key={unit.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-2xl group-hover:scale-110 transition-transform">
                          {unit.display_emoji}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{unit.display_name_mn}</p>
                          <p className="text-[10px] font-mono text-gray-400">ID: {unit.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {combo ? (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          <span className="text-base">{combo.emoji}</span>
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-tight">{combo.combined_name_mn}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">Unlinked</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {combo && (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] font-bold text-gray-500">
                            {emotions.find(e => e.id === combo.emotion1_id)?.name_mn}
                          </div>
                          <Plus size={10} className="text-gray-300" />
                          <div className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] font-bold text-gray-500">
                            {emotions.find(e => e.id === combo.emotion2_id)?.name_mn}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {combo && (
                        <button 
                          onClick={() => handleEdit(combo)}
                          className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {moodUnits.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info size={32} className="text-gray-200" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Мэдээлэл олдсонгүй</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {(isAdding || editingCombo) && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl border border-white">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                  <Settings2 size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {isAdding ? 'Хослол нэмэх' : 'Хослол засах'}
                </h2>
              </div>
              <button onClick={() => { setIsAdding(false); setEditingCombo(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Emotion 1</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                    value={form.emotion1_id}
                    onChange={(e) => setForm({...form, emotion1_id: Number(e.target.value)})}
                  >
                    {emotions.map(em => <option key={em.id} value={em.id}>{em.emoji} {em.name_mn}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Emotion 2</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                    value={form.emotion2_id}
                    onChange={(e) => setForm({...form, emotion2_id: Number(e.target.value)})}
                  >
                    {emotions.map(em => <option key={em.id} value={em.id}>{em.emoji} {em.name_mn}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Нэр (MN)</label>
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                    value={form.combined_name_mn}
                    onChange={(e) => setForm({...form, combined_name_mn: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Нэр (EN)</label>
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                    value={form.combined_name_en}
                    onChange={(e) => setForm({...form, combined_name_en: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Emoji</label>
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-center text-xl focus:ring-2 focus:ring-indigo-100"
                    value={form.emoji}
                    onChange={(e) => setForm({...form, emoji: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Type</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                    value={form.combined_type}
                    onChange={(e) => setForm({...form, combined_type: e.target.value as any})}
                  >
                    <option value="primary">Primary (1st Dyad)</option>
                    <option value="secondary">Secondary (2nd Dyad)</option>
                    <option value="tertiary">Tertiary (3rd Dyad)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                {isAdding ? 'Бүртгэх' : 'Шинэчлэх'}
              </button>
              <button 
                onClick={() => { setIsAdding(false); setEditingCombo(null); }}
                className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all uppercase text-xs"
              >
                Болих
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}