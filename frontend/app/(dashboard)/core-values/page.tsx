'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useGlobalToast } from '@/context/ToastContext';
import { Plus, ChevronDown } from 'lucide-react';
import { CoreValue, Maslow } from '@/lib/types';

import { ValueCard } from '@/components/value/ValueCard';
import { MaslowDropdown } from '@/components/value/MaslowDropdown';
import DeleteConfirmModal from '@/components/ui/DeleteModal';

export default function CoreValuesPage() {
  const { token } = useAuth();
  const { showToast } = useGlobalToast();
  
  const [values, setValues] = useState<CoreValue[]>([]);
  const [maslowLevels, setMaslowLevels] = useState<Maslow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ open: false, value: null as CoreValue | null });
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ 
    name: '', description: '', color: '#6366f1', maslow_level_id: undefined as number | undefined, priority_order: 1 
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 500);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [vData, mData] = await Promise.all([apiClient.getCoreValues(token), apiClient.getMaslow(token)]);
      setValues(vData);
      setMaslowLevels(mData);
    } catch (err) { showToast('Мэдээлэл авахад алдаа гарлаа', 'error'); } 
    finally { setLoading(false); }
  }, [token, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#6366f1', maslow_level_id: undefined, priority_order: 1 });
    setShowForm(false); setEditingId(null);
  };

  const handleEdit = (v: CoreValue) => {
    setFormData({ name: v.name, description: v.description || '', color: v.color || '#6366f1', maslow_level_id: v.maslow_level_id, priority_order: v.priority_order || 1 });
    setEditingId(v.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
  if (!token) return;
  if (!formData.name || !formData.maslow_level_id) {
    showToast('Нэр болон түвшинг заавал бөглөнө үү', 'error');
    return;
  }

  try {
    setSubmitting(true);
    if (editingId) {
      await apiClient.updateCoreValue(editingId, formData, token);
      showToast('Амжилттай шинэчлэгдлээ', 'success');
    } else {
      await apiClient.createCoreValue(formData, token);
      showToast('Амжилттай хадгалагдлаа', 'success');
    }
    resetForm();
    loadData(); // Жагсаалтыг шинээр авах
  } catch (err) {
    showToast('Алдаа гарлаа', 'error');
  } finally {
    setSubmitting(false);
  }
  };
  
  const handleDelete = async () => {
  if (!token || !deleteModal.value) return;

  try {
    setIsDeleting(true);
    await apiClient.deleteCoreValue(deleteModal.value.id, token);
    
    showToast('Амжилттай устгагдлаа', 'success');
    
    // Модалыг хаах
    setDeleteModal({ open: false, value: null });
    
    // Мэдээллийг дахин ачаалах (эсвэл state-ээс шууд хасах)
    loadData(); 
    } catch (err) {
      showToast('Устгахад алдаа гарлаа', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[8px] font-black tracking-[0.5em] text-gray-300 uppercase">Loading</div>;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-20 min-h-screen bg-[#FAFAFA]">
      
      
    <header className="mb-8 sm:mb-12 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        {/* Жижиг текст ба гарчгийг ойртуулсан */}
        <p className="text-[6px] sm:text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">
          Maslow Hierarchy
        </p>

        <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-[0.1em] text-gray-900 uppercase">
          Үнэт зүйлийн <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">эрэмбэ</span>
        </h1>

        {/* Маш нарийн чимэглэл */}
        <div className="w-12 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 opacity-60" />

        <p className="mt-3 text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest max-w-[240px] sm:max-w-md mx-auto">
          Дотоод ертөнцийн <span className="text-gray-600">бүтцийн зураглал</span>
        </p>
      </motion.div>
    </header>

      {/* Add Entry Button / Form - Pyramid дээр */}
      <div className="flex justify-center mb-10 sm:mb-16 relative z-30">
        <AnimatePresence mode="wait">
          {!showForm ? (
          <motion.button 
            key="add-btn"
            onClick={() => setShowForm(true)} 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            // Padding болон Radius-ийг багасгаж илүү цэвэрхэн болгосон
            className="relative group px-6 py-2.5 rounded-xl bg-white border border-gray-100 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] flex items-center gap-3 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/40 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Дүрсний хэмжээг багасгав */}
            <div className="relative z-10 w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Plus size={12} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            
            {/* Текстийг жижигрүүлж, tracking-ийг бага зэрэг шахав */}
            <span className="relative z-10 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-gray-700 group-hover:text-black transition-colors">
              Үнэт зүйл нэмэх
            </span>
          </motion.button>
          ) : (
            <motion.div 
              layoutId="form-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              /* overflow-hidden-ийг хассан тул Dropdown чөлөөтэй харагдана */
              className="w-full max-w-[350px] sm:max-w-md bg-white/95 backdrop-blur-3xl p-7 sm:p-9 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] border border-white relative z-50"
            >
              {/* Арын гэрэлтсэн blur эффектүүд */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 grid gap-6">
                <header className="flex justify-between items-center border-b border-gray-50 pb-5">
                  <div className="flex flex-col">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">
                      {editingId ? 'Утгыг засварлах' : 'Шинэ суурь тавих'}
                    </h2>
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {editingId ? 'Оршихуйн эрэмбийг өөрчлөх' : 'Пирамидын нэгэн хэсгийг бүтээх'}
                    </p>
                  </div>
                  <button 
                    onClick={resetForm} 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
                  >
                    <Plus className="rotate-45 w-5 h-5" />
                  </button>
                </header>

                <div className="space-y-6">
                  {/* Нэршил хэсэг */}
                  <section className="group">
                    <div className="flex justify-between items-end mb-2 ml-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Үнэт зүйлийн нэр</label>
                      <span className="text-[6px] text-gray-300 font-bold uppercase tracking-tighter italic">Нэршил</span>
                    </div>
                    <input 
                      autoFocus
                      className="w-full text-xs sm:text-sm font-bold outline-none bg-gray-50/50 border border-gray-100 px-5 py-4 rounded-2xl placeholder:text-gray-200 uppercase tracking-wide focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all duration-300 shadow-inner" 
                      placeholder="Жишээ: Эрх чөлөө" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </section>

                  {/* Маслоу эрэмбэ хэсэг */}
                  <section className="group">
                    <div className="flex justify-between items-end mb-2 ml-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Оршихуйн түвшин</label>
                      <span className="text-[6px] text-gray-300 font-bold uppercase tracking-tighter italic">Маслоугийн шатлал</span>
                    </div>
                    {/* Энд Dropdown нээгдэхэд чөлөөтэй харагдана */}
                    <MaslowDropdown 
                      levels={maslowLevels} 
                      selectedValueId={formData.maslow_level_id} 
                      onSelect={id => setFormData({...formData, maslow_level_id: id})} 
                    />
                  </section>
                </div>

                <footer className="flex justify-between items-center pt-4 border-t border-gray-50/80 mt-2">
                  <button 
                    onClick={resetForm} 
                    className="text-[9px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest px-2 py-1 transition-all"
                  >
                    Цуцлах
                  </button>
                  
                  <motion.button 
                    disabled={submitting}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit} 
                    className={`
                      relative px-9 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white
                      ${submitting ? 'opacity-70' : 'shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)] hover:shadow-[0_20px_35px_-8px_rgba(79,70,229,0.5)]'}
                      transition-all duration-300
                    `}
                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {submitting ? 'Батжуулж байна...' : (editingId ? 'Шинэчлэх' : 'Үүсгэх')}
                    </span>
                  </motion.button>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile friendly pyramid with tighter spacing */}
      <div className="flex flex-col gap-2 sm:gap-4 mb-16 sm:mb-32 items-center w-full">
        <LayoutGroup>
          {[...maslowLevels].map((level, index) => {
            const isActive = filterLevel === level.id;
            const levelValues = values.filter(v => v.maslow_level_id === level.id);
            
            const startWidth = isMobile ? 85 : 55;
            const endWidth = isMobile ? 100 : 95;
            const diff = endWidth - startWidth;
            const levelWidth = `${startWidth + (index * (diff / (maslowLevels.length - 1 || 1)))}%`;

            return (
              <div key={level.id} className="flex flex-col items-center w-full">
                <motion.button
                  layout
                  onClick={() => setFilterLevel(isActive ? null : level.id)}
                  style={{ 
                    // Gradient нэмэх: Үндсэн өнгийг арай бараан болон цайвар өнгөтэй холино
                    background: `linear-gradient(135deg, ${level.color} 0%, ${level.color}ee 100%)`,
                    width: levelWidth 
                  }}
                  className="relative h-10 sm:h-12 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-between px-5 sm:px-8 text-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 overflow-hidden"
                >
                  {/* Гэрэлтсэн эффект (Reflective overlay) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                    <div className={`p-1 rounded-full bg-white/10 backdrop-blur-md transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`}>
                      <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-sm">
                      {level.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-[8px] font-bold bg-black/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                      {levelValues.length}
                    </span>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.95 }}
                      animate={{ height: 'auto', opacity: 1, scale: 1, marginTop: 12, marginBottom: 8 }}
                      exit={{ height: 0, opacity: 0, scale: 0.95, marginTop: 0, marginBottom: 0 }}
                      style={{ width: levelWidth }}
                      className="overflow-hidden"
                    >
                      {/* Дотор талын контаинерыг илүү Glassmorphism болгох */}
                      <div className="flex flex-col gap-2 p-3 sm:p-4 bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                        {levelValues.length > 0 ? (
                          levelValues.map(value => (
                            <motion.div 
                              key={value.id} 
                              layoutId={`card-${value.id}`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                            >
                              <ValueCard 
                                value={value} 
                                onEdit={handleEdit}
                                onDelete={(v) => setDeleteModal({ open: true, value: v })} 
                              />
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-6 flex flex-col items-center justify-center opacity-30">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Бүртгэлгүй байна</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </LayoutGroup>
      </div>

     <DeleteConfirmModal 
        isOpen={deleteModal.open} 
        // Модал хаагдах үед state-ийг цэвэрлэх
        onClose={() => setDeleteModal({ open: false, value: null })} 
        // Устгах товч дээр дарахад handleDelete ажиллана
        onConfirm={handleDelete} 
        // Устгаж буй үнэт зүйлийн нэрийг харуулах
        title={deleteModal.value?.name || ''} 
        // Устгах явцад товчлуур дээр "loading" харуулах
        isDeleting={isDeleting} 
      />
    </div>
  );
}