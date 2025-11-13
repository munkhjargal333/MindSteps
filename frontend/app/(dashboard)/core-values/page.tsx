'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { CoreValue, Maslow } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

export default function CoreValuesPage() {
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [values, setValues] = useState<CoreValue[]>([]);
  const [maslowLevels, setMaslowLevels] = useState<Maslow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    priority_order: 1,
    maslow_level_id: undefined as number | undefined
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [valuesData, maslowData] = await Promise.all([
        apiClient.getCoreValues(token),
        apiClient.getMaslow(token)
      ]);
      setValues(valuesData);
      setMaslowLevels(maslowData);
    } catch (err) {
      console.error(err);
      showToast('Өгөгдөл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !formData.name) return;
    try {
      if (editingId) {
        await apiClient.updateCoreValue(editingId, formData, token);
        showToast('Амжилттай шинэчлэгдлээ', 'success');
      } else {
        await apiClient.createCoreValue(formData, token);
        showToast('Амжилттай нэмэгдлээ', 'success');
      }
      setFormData({ name: '', description: '', color: '#6366f1', priority_order: 1, maslow_level_id: undefined });
      setShowForm(false);
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Алдаа гарлаа', 'error');
    }
  };

  const handleEdit = (v: CoreValue) => {
    setFormData({
      name: v.name,
      description: v.description || '',
      color: v.color || '#6366f1',
      priority_order: v.priority_order || 1,
      maslow_level_id: v.maslow_level_id
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Устгах уу?')) return;
    try {
      await apiClient.deleteCoreValue(id, token);
      showToast('Амжилттай устгагдлаа', 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Алдаа гарлаа', 'error');
    }
  };

  const getMaslowLevel = (id?: number) => maslowLevels.find(l => l.id === id);

  const filteredValues = filterLevel ? values.filter(v => v.maslow_level_id === filterLevel) : values;
  const valuesByLevel = maslowLevels.map(level => ({ level, values: values.filter(v => v.maslow_level_id === level.id) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <ToastContainer />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">💎 Миний үнэт зүйлс</h1>
            <p className="text-sm text-gray-600">Maslow-ын хэрэгцээний түвшингээр ангилсан</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowForm(s => !s);
                setEditingId(null);
                setFormData({ name: '', description: '', color: '#6366f1', priority_order: 1, maslow_level_id: undefined });
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              + Үнэт зүйл нэмэх
            </button>
            <div className="hidden sm:block">
              <button
                onClick={() => { setFilterLevel(null); }}
                className={`px-3 py-2 rounded-md text-sm ${filterLevel === null ? 'bg-gray-800 text-white' : 'bg-white border'}`}
              >
                Бүгд ({values.length})
              </button>
            </div>
          </div>
        </div>

        {/* Maslow filter (responsive stack) */}
        {maslowLevels.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-base font-semibold mb-3">Түвшингээр шүүх:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLevel(null)}
                className={`px-3 py-1.5 rounded-md text-sm ${filterLevel === null ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Бүгд ({values.length})
              </button>

              {maslowLevels.map(level => {
                const count = values.filter(v => v.maslow_level_id === level.id).length;
                const active = filterLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setFilterLevel(level.id)}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm ${active ? 'shadow-lg scale-105 text-white' : 'bg-white border'}`}
                    style={{ backgroundColor: active ? level.color : 'white', borderColor: level.color, color: active ? 'white' : level.color }}
                  >
                    <span className="text-base">{level.icon}</span>
                    <span className="hidden sm:inline">{level.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/30' : 'bg-gray-100'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{editingId ? '✏️ Засах' : '➕ Шинэ үнэт зүйл'}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  хаах
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium mb-1">Нэр *</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Жишээ: Гэр бүл, Эрүүл мэнд"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Maslow-ын түвшин</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.maslow_level_id || ''}
                  onChange={(e) => {
                    const levelId = e.target.value ? Number(e.target.value) : undefined;
                    const level = getMaslowLevel(levelId);
                    setFormData({ ...formData, maslow_level_id: levelId, color: level?.color || formData.color });
                  }}
                >
                  <option value="">Сонгоогүй</option>
                  {maslowLevels.map(l => <option key={l.id} value={l.id}>{l.icon} {l.name}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Тайлбар</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Өнгө</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-14 h-10 rounded-md border" />
                  <span className="font-mono text-sm">{formData.color}</span>
                </div>
              </div>

              <div className="flex items-end justify-end gap-2">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-3 py-2 bg-gray-100 rounded-md">Цуцлах</button>
                <button onClick={handleSubmit} disabled={!formData.name} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md disabled:opacity-50"> {editingId ? 'Хадгалах' : 'Нэмэх'} </button>
              </div>
            </div>
          </div>
        )}

        {/* Values list */}
        {values.length === 0 ? (
          <div className="py-12 bg-white rounded-xl shadow text-center">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-xl font-semibold mb-2">Үнэт зүйл байхгүй байна</h2>
            <p className="text-sm text-gray-500">Эхлээд үнэт зүйлсээ тодорхойлоорой</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filterLevel ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredValues.map(v => {
                  const level = getMaslowLevel(v.maslow_level_id);
                  return (
                    <article key={v.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4" style={{ borderColor: v.color || '#e5e7eb' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold truncate">{v.name}</h3>
                            {level?.icon && <span className="text-xl">{level.icon}</span>}
                          </div>
                          {v.description && <p className="text-sm text-gray-600 mt-1">{v.description}</p>}
                          {level && <span className="inline-block mt-2 px-2 py-1 text-xs rounded text-white" style={{ backgroundColor: level.color }}>{level.name}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleEdit(v)} className="text-blue-600">✏️</button>
                          <button onClick={() => handleDelete(v.id)} className="text-red-600">🗑️</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              valuesByLevel.map(({ level, values: lv }) => lv.length > 0 && (
                <section key={level.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 border-b pb-3 mb-3" style={{ borderColor: level.color }}>
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <h4 className="font-semibold" style={{ color: level.color }}>{level.name}</h4>
                      <p className="text-xs text-gray-500">{level.description}</p>
                    </div>
                    <div className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">{lv.length}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lv.map(v => (
                      <div key={v.id} className="bg-gray-50 rounded p-3 border-l-4" style={{ borderColor: v.color || level.color }}>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <h5 className="font-medium truncate">{v.name}</h5>
                            {v.description && <p className="text-xs text-gray-600">{v.description}</p>}
                          </div>
                          <div className="flex flex-col gap-2 ml-3">
                            <button onClick={() => handleEdit(v)} className="text-blue-600 text-sm">✏️</button>
                            <button onClick={() => handleDelete(v.id)} className="text-red-600 text-sm">🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
