'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodCategory, MoodUnit, CoreValue } from '@/lib/types';
import Link from 'next/link';
import { useGlobalToast } from '@/context/ToastContext';
import { ChevronLeft, Save, Sparkles, Clock, Target, Lightbulb, PencilLine, AlertCircle, Gem, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewMoodPage() {
  const { token } = useAuth(); 
  const { showToast } = useGlobalToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [values, setValues] = useState<CoreValue[]>([]);
  const [moods, setMoods] = useState<MoodUnit[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodUnit | null>(null);
  const [selectedCoreValue, setSelectedCoreValue] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [whenFelt, setWhenFelt] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [categoriesData, coreValuesData] = await Promise.all([
        apiClient.getMoodCategories(token),
        apiClient.getCoreValues(token),
      ]);
      setCategories(categoriesData);
      setValues(coreValuesData);
    } catch (error) {
      showToast('Өгөгдөл ачаалахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory && token) {
      apiClient.getMoodsByCategory(selectedCategory, token).then(setMoods).catch(console.error);
    }
  }, [selectedCategory, token]);

  const handleSubmit = async () => {
    if (!token || !selectedMood) return;
    if (selectedCoreValue === null) {
      showToast('Эхлээд үнэт зүйлээ тохируулна уу', 'error');
      console.log('No core values set');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.createMoodEntry({
        mood_unit_id: selectedMood.id,
        intensity,
        when_felt: whenFelt || undefined,
        trigger_event: triggerEvent || undefined,
        coping_strategy: copingStrategy || undefined,
        notes: notes || undefined,
        core_value_id: selectedCoreValue || undefined,
      }, token);
      
      showToast('Амжилттай хадгалагдлаа', 'success');
      setTimeout(() => router.push('/mood'), 800);
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ChevronLeft size={24} className="text-gray-500 group-hover:text-black" />
          </button>
          <h1 className="font-black text-gray-900">Шинэ тэмдэглэл</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-10">
          
          {/* STEP 1: CATEGORY */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4 text-purple-600">
              <Sparkles size={18} />
              <h2 className="text-xs font-black uppercase tracking-widest">Алхам 1: Үндсэн төрөл</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { 
                    setSelectedCategory(cat.id); 
                    setSelectedMood(null); 
                  }}
                  style={{
                    background: `radial-gradient(circle at center, ${cat.color || '#9333ea'} 0%, ${cat.color || '#9333ea'}dd 50%, ${cat.color || '#9333ea'}99 100%)`,
                    borderColor: cat.color || '#9333ea',
                    opacity: selectedCategory === cat.id ? 1 : 0.6,
                    transform: selectedCategory === cat.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedCategory === cat.id ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  className="p-2.5 rounded-3xl border-2 transition-all duration-200 text-center active:scale-95"
                >
                  <div className="text-2xl mb-1 drop-shadow-md">{cat.emoji || '💭'}</div>
                  {/* Текстийг илүү тод, уншигдахуйц болгох үүднээс font-black болон shadow нэмсэн */}
                  <div className="text-[10px] font-black leading-tight text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] uppercase">
                    {cat.name_mn}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* STEP 2: MOOD UNIT */}
          {selectedCategory && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-4 text-purple-600">
                <Target size={18} />
                <h2 className="text-xs font-black uppercase tracking-widest">Алхам 2: Сэтгэл санаа</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    style={{ 
                      background: `radial-gradient(circle at center, ${mood.display_color} 0%, ${mood.display_color}dd 50%, ${mood.display_color}99 100%)`,
                      borderColor: mood.display_color,
                      opacity: selectedMood?.id === mood.id ? 1 : 0.6,
                      transform: selectedMood?.id === mood.id ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedMood?.id === mood.id ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                    className="p-2.5 rounded-3xl border-2 transition-all active:scale-95"
                  >
                    <div className="text-2xl mb-1 drop-shadow-md">{mood.display_emoji}</div>
                    <div className="text-[11px] font-black leading-tight text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                      {mood.display_name_mn}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ADDITIONAL DETAILS */}
          {selectedMood && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* INTENSITY RANGE */}
              <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest">Эрчим</h2>
                  <span className="text-4xl font-black transition-all" style={{ color: selectedMood.display_color }}>{intensity}</span>
                </div>
                <input
                  type="range" 
                  min="1" 
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={{ accentColor: selectedMood.display_color }}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </section>

              {/* CORE VALUES */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-purple-600">
                  <Lightbulb size={18} />
                  <h2 className="text-xs font-black uppercase tracking-widest">Холбоотой үнэт зүйл</h2>
                </div>

                {values.length === 0 ? (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-black text-amber-900 mb-2">Үнэт зүйлс тохируулаагүй байна</h3>
                      <p className="text-sm text-amber-700 mb-4">
                        Эхлээд өөрийн үнэт зүйлсийг тохируулснаар сэтгэл санааны тэмдэглэлтэй холбож чадна.
                      </p>
                      <Link 
                        href="/core-values"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-colors"
                      >
                        <Gem size={16} /> Үнэт зүйл тохируулах
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
                    {values.map((v) => {
                      const isActive = selectedCoreValue === v.id;
                      
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedCoreValue(v.id)}
                          style={{
                            backgroundColor: isActive ? v.color : 'white',
                            borderColor: isActive ? v.color : '#f3f4f6',
                            color: isActive ? 'white' : '#4b5563',
                          }}
                          className={`
                            px-6 py-3 rounded-2xl border-2 whitespace-nowrap 
                            transition-all duration-200 font-black text-xs
                            ${isActive ? 'shadow-lg scale-105' : 'hover:border-gray-200 shadow-sm'}
                          `}
                        >
                          <span className="flex items-center gap-2.5">
                            {/* Айконы хэмжээг энд text-lg эсвэл text-xl-ээр томсгов */}
                            <span className="text-lg leading-none">
                              {v.MaslowLevel?.icon}
                            </span>
                            <span>{v.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* INPUT FIELDS */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  icon={<Clock size={16} />} 
                  label="Хэзээ мэдэрсэн?" 
                  placeholder="Жишээ: Ажлын дараа..." 
                  value={whenFelt} 
                  onChange={setWhenFelt} 
                />
                <InputGroup 
                  icon={<Sparkles size={16} />} 
                  label="Шалтгаан" 
                  placeholder="Жишээ: Найзын дуудлага..." 
                  value={triggerEvent} 
                  onChange={setTriggerEvent} 
                />
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">
                    <PencilLine size={14} /> Нэмэлт тэмдэглэл
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 transition-all placeholder:text-gray-300"
                    placeholder="Өнөөдөр ямар юу болов?..."
                  />
                </div>
              </section>

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ backgroundColor: selectedMood.display_color }}
                className="w-full py-5 text-white font-black text-lg rounded-[2rem] shadow-xl hover:brightness-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? 'Түр хүлээнэ үү...' : <><Save size={20} /> Хадгалах</>}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// InputGroup Function
function InputGroup({ icon, label, placeholder, value, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all text-gray-800 placeholder:text-gray-300 font-bold"
        placeholder={placeholder}
      />
    </div>
  );
}