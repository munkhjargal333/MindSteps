'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodCategory, MoodUnit, CoreValue } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { ChevronLeft, Save, Sparkles, Clock, Target, Lightbulb, PencilLine, AlertCircle, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewMoodPage() {
  const { token } = useAuth(); 
  const { showToast, ToastContainer } = useToast();
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<MoodCategory[]>([]);
  const [values, setValues] = useState<CoreValue[]>([]);
  const [moods, setMoods] = useState<MoodUnit[]>([]);

  // Selection states
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
      console.error(error);
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

    // Үнэт зүйлс байхгүй бол анхааруулга
    if (values.length === 0) {
      showToast('Эхлээд "Үнэт зүйл" хэсэгт очиж өөрийн үнэт зүйлсийг тохируулна уу', 'error');
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
      setTimeout(() => router.push('/mood'), 1000);
    } catch (error) {
      showToast('Алдаа гарлаа', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <ToastContainer />
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/mood" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ChevronLeft size={24} className="text-gray-500 group-hover:text-black" />
          </Link>
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
                  className={`p-4 rounded-3xl border-2 transition-all duration-200 text-center ${
                    selectedCategory === cat.id
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-white bg-white hover:border-purple-200 shadow-sm'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.emoji || '💭'}</div>
                  <div className="text-xs font-bold text-gray-700">{cat.name_mn}</div>
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
                    style={{ borderColor: selectedMood?.id === mood.id ? mood.display_color : 'white' }}
                    className={`p-4 rounded-3xl border-2 transition-all shadow-sm ${
                      selectedMood?.id === mood.id ? 'bg-white shadow-md scale-[1.02]' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.display_emoji}</div>
                    <div className="text-sm font-bold text-gray-800">{mood.display_name_mn}</div>
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
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Эрчим хүч</h2>
                  <span className="text-4xl font-black" style={{ color: selectedMood.display_color }}>{intensity}</span>
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
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedCoreValue(null)}
                      className={`px-6 py-3 rounded-2xl border-2 whitespace-nowrap transition-all font-bold text-sm ${
                        selectedCoreValue === null 
                          ? 'bg-gray-100 text-gray-700 border-gray-200' 
                          : 'bg-white border-white text-gray-400 shadow-sm hover:border-gray-100'
                      }`}
                    >
                      Сонгохгүй
                    </button>
                    {values.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedCoreValue(v.id)}
                        className={`px-6 py-3 rounded-2xl border-2 whitespace-nowrap transition-all font-bold text-sm ${
                          selectedCoreValue === v.id 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : 'bg-white border-white text-gray-500 shadow-sm'
                        }`}
                      >
                        {v.MaslowLevel?.icon} {v.name}
                      </button>
                    ))}
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
                <InputGroup 
                  icon={<Target size={16} />} 
                  label="Авсан арга хэмжээ" 
                  placeholder="Жишээ: Гүйлтийн амьсгалах..." 
                  value={copingStrategy} 
                  onChange={setCopingStrategy} 
                />
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">
                    <PencilLine size={14} /> Нэмэлт тэмдэглэл
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-5 bg-white border-none rounded-[2rem] shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 transition-all"
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
                className="w-full py-5 text-white font-black text-lg rounded-[2rem] shadow-xl hover:brightness-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
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

// Reusable Input Component
function InputGroup({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChange 
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all text-gray-700"
        placeholder={placeholder}
      />
    </div>
  );
}