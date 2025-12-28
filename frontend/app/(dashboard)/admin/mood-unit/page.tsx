'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodUnit, MoodCategory, PlutchikEmotion, PlutchikCombination } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

export default function AdminMoodUnitsEditPage() {
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [moodUnits, setMoodUnits] = useState<MoodUnit[]>([]);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [emotions, setEmotions] = useState<PlutchikEmotion[]>([]);
  const [combinations, setCombinations] = useState<PlutchikCombination[]>([]);
  
  // Анхны утга 1 (Category ID: 1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  
  const [editingCombo, setEditingCombo] = useState<PlutchikCombination | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
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
      if (cats.length > 0) setSelectedCategoryId(cats[0].id); // Хамгийн эхний ангиллыг авах
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
    setForm({ ...initialForm, emotion1_id: emotions[0]?.id, emotion2_id: emotions[1]?.id });
    setIsAdding(true);
    setEditingCombo(null);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (isAdding) {
        await apiClient.createPlutchikCombination(form, token);
        showToast('✅ Шинэ хослол амжилттай нэмэгдлээ', 'success');
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Combinations Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Ангилал бүрээр сэтгэл хөдлөлийн хослолыг удирдах</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="flex-1 md:w-64 border-2 border-purple-100 rounded-xl px-4 py-2.5 bg-white shadow-sm font-bold text-purple-700 outline-none focus:border-purple-500 transition-all"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name_mn}</option>
            ))}
          </select>

          <button 
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
          >
            <span>+</span> Нэмэх
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Mood Unit</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Linked Combination</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Components</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {moodUnits.map(unit => {
              const combo = combinations.find(c => c.id === unit.combination_id);
              return (
                <tr key={unit.id} className="hover:bg-purple-50/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm border group-hover:scale-110 transition-transform">{unit.display_emoji}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-base">{unit.display_name_mn}</p>
                        <p className="text-xs text-gray-400 font-medium">ID: {unit.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {combo ? (
                      <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                        <span className="text-lg">{combo.emoji}</span>
                        <span className="font-bold text-purple-700">{combo.combined_name_mn}</span>
                      </div>
                    ) : <span className="text-gray-300 italic">Холбоогүй</span>}
                  </td>
                  <td className="p-5">
                    {combo && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                          {emotions.find(e => e.id === combo.emotion1_id)?.name_mn}
                        </span>
                        <span className="text-gray-300">+</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-md border border-green-100">
                          {emotions.find(e => e.id === combo.emotion2_id)?.name_mn}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    {combo && (
                      <button 
                        onClick={() => handleEdit(combo)}
                        className="text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Засах
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {moodUnits.length === 0 && !loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
             <div className="text-4xl mb-4 text-gray-200">Empty</div>
             <p className="text-gray-400 font-medium">Энэ ангилалд одоогоор Mood Unit бүртгэгдээгүй байна.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAdding || editingCombo) && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-in zoom-in duration-200 border border-white/20">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                 {isAdding ? '🚀 Шинэ хослол нэмэх' : '✏️ Хослол засах'}
               </h2>
               <button onClick={() => { setIsAdding(false); setEditingCombo(null); }} className="text-gray-400 hover:text-gray-900 text-3xl">&times;</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Base Emotion 1</label>
                  <select 
                    className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:bg-white outline-none focus:border-purple-500 transition-all font-semibold"
                    value={form.emotion1_id}
                    onChange={(e) => setForm({...form, emotion1_id: Number(e.target.value)})}
                  >
                    {emotions.map(em => <option key={em.id} value={em.id}>{em.emoji} {em.name_mn}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Base Emotion 2</label>
                  <select 
                    className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:bg-white outline-none focus:border-purple-500 transition-all font-semibold"
                    value={form.emotion2_id}
                    onChange={(e) => setForm({...form, emotion2_id: Number(e.target.value)})}
                  >
                    {emotions.map(em => <option key={em.id} value={em.id}>{em.emoji} {em.name_mn}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Нэр (MN)</label>
                  <input 
                    className="w-full border-2 border-gray-100 rounded-2xl p-3 outline-none focus:border-purple-500 font-semibold"
                    placeholder="Жишээ: Хайр"
                    value={form.combined_name_mn}
                    onChange={(e) => setForm({...form, combined_name_mn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Нэр (EN)</label>
                  <input 
                    className="w-full border-2 border-gray-100 rounded-2xl p-3 outline-none focus:border-purple-500 font-semibold"
                    placeholder="Example: Love"
                    value={form.combined_name_en}
                    onChange={(e) => setForm({...form, combined_name_en: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Emoji</label>
                    <input 
                      className="w-full border-2 border-gray-100 rounded-2xl p-3 text-center text-xl outline-none focus:border-purple-500"
                      value={form.emoji}
                      onChange={(e) => setForm({...form, emoji: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2 col-span-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Type</label>
                    <select 
                      className="w-full border-2 border-gray-100 rounded-2xl p-3 font-semibold outline-none focus:border-purple-500"
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

            <div className="mt-10 flex gap-4">
               <button 
                 onClick={handleSave} 
                 disabled={saving}
                 className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-purple-700 shadow-xl shadow-purple-200 transition-all disabled:bg-gray-300"
               >
                 {saving ? 'Түр хүлээнэ үү...' : (isAdding ? 'Бүртгэх' : 'Шинэчлэх')}
               </button>
               <button 
                 onClick={() => { setIsAdding(false); setEditingCombo(null); }}
                 className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
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