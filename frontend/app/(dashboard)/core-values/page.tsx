'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/toast';
import { Plus, ChevronDown } from 'lucide-react';
import { CoreValue, Maslow } from '@/lib/types';

import { ValueCard } from '@/components/value/ValueCard';
import { MaslowDropdown } from '@/components/value/MaslowDropdown';
import DeleteConfirmModal from '@/components/ui/DeleteModal';

export default function CoreValuesPage() {
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();
  
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[8px] font-black tracking-[0.5em] text-gray-300 uppercase">Loading</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 min-h-screen bg-[#FAFAFA]">
      <ToastContainer />
      
      <header className="mb-20 text-center">
        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.6em] mb-4">Values System</p>
        <h1 className="text-lg sm:text-xl font-black tracking-[0.2em] text-gray-900 uppercase">Pyramid</h1>
      </header>

      {/* Шат хоорондын зайг gap-4 (mobile) болон gap-8 (desktop) болгож нэмсэн */}
      <div className="flex flex-col gap-4 sm:gap-8 mb-32 items-center w-full">
        <LayoutGroup>
          {[...maslowLevels].reverse().map((level, index) => {
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
                  style={{ backgroundColor: level.color, width: levelWidth }}
                  className="relative h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-between px-6 text-white shadow-sm hover:brightness-105 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`} />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] truncate">
                      {level.name}
                    </span>
                  </div>
                  <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                    {levelValues.length}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12, marginBottom: 4 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }}
                      style={{ width: levelWidth }}
                      className="overflow-hidden"
                    >
                      {/* Картуудыг агуулсан хэсгийн стиль */}
                      <div className="flex flex-col gap-2 p-2 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">
                        {levelValues.length > 0 ? (
                          levelValues.map(value => (
                            <motion.div key={value.id} layoutId={`card-${value.id}`}>
                              <ValueCard 
                                value={value} 
                                onEdit={handleEdit}
                                onDelete={(v) => setDeleteModal({ open: true, value: v })} 
                              />
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-[7px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            Empty Level
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

      <div className="flex justify-center mb-24">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="flex flex-col items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-black group-hover:text-black transition-all">
              <Plus size={16} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 group-hover:text-black transition-all">Add Entry</span>
          </button>
        ) : (
          <motion.div layout className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
             <div className="grid gap-6">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <h2 className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Editor</h2>
                  <button onClick={resetForm} className="text-gray-300 hover:text-black transition-all"><Plus className="rotate-45" size={16}/></button>
                </div>
                <input className="text-sm font-black outline-none bg-transparent placeholder:text-gray-200 uppercase tracking-widest" placeholder="Entry Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <MaslowDropdown levels={maslowLevels} selectedValueId={formData.maslow_level_id} onSelect={id => setFormData({...formData, maslow_level_id: id})} />
                <div className="flex justify-end gap-6 pt-4">
                  <button onClick={resetForm} className="text-[8px] font-black text-gray-300 hover:text-black uppercase tracking-[0.2em]">Cancel</button>
                  <button onClick={() => {}} className="bg-black text-white px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]">Save</button>
                </div>
             </div>
          </motion.div>
        )}
      </div>

      <DeleteConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, value: null })} onConfirm={() => {}} title={deleteModal.value?.name || ''} isDeleting={isDeleting} />
    </div>
  );
}