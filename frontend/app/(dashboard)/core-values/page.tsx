'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { CoreValue } from '@/lib/types';



// ==================== CORE VALUES PAGE ====================
export default function CoreValuesPage() {
  const { token } = useAuth();
  const [values, setValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    //icon: '💎',
    priority_order: 1
  });

  useEffect(() => {
     // eslint-disable-next-line react-hooks/exhaustive-deps
    loadValues();
  }, [token]);

  const loadValues = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiClient.getCoreValues(token);
      setValues(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !formData.name) return;
    
    try {
      if (editingId) {
        await apiClient.updateCoreValue(editingId, formData, token);
      } else {
        await apiClient.createCoreValue(formData, token);
      }
      
      setFormData({ name: '', description: '', color: '#6366f1', priority_order: 1 });
      setShowForm(false);
      setEditingId(null);
      loadValues();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  const handleEdit = (value: CoreValue) => {
    setFormData({
      name: value.name,
      description: value.description || '',
      color: value.color || '#6366f1',
    //   icon: value.icon || '💎',
      priority_order: value.priority_order || 1
    });
    setEditingId(value.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Устгах уу?')) return;
    try {
      await apiClient.deleteCoreValue(id, token);
      loadValues();
    } catch (error) {
      alert('Алдаа гарлаа');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">💎 Миний үнэт зүйлс</h1>
          <p className="text-gray-600">Таны амьдралд чухал зүйлс</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '', color: '#6366f1', priority_order: 1 });
          }}
          className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-lg"
        >
          + Үнэт зүйл нэмэх
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-purple-50 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? '✏️ Засах' : '➕ Шинэ үнэт зүйл'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Нэр *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            
            {/* <input
              type="text"
              placeholder="Эможи 💎"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
            /> */}
          </div>

          <textarea
            placeholder="Тайлбар"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />

          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold">Өнгө:</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-20 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{formData.color}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!formData.name}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
            >
              {editingId ? '✅ Хадгалах' : '➕ Нэмэх'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Цуцлах
            </button>
          </div>
        </div>
      )}

      {/* VALUES LIST */}
      {values.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Үнэт зүйл байхгүй байна
          </h2>
          <p className="text-gray-500">Эхлээд үнэт зүйлсээ тодорхойлоорой!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value) => (
            <div
              key={value.id}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border-2"
              style={{ borderColor: value.color || '#e5e7eb' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {/* <span className="text-3xl">{value.icon || '💎'}</span> */}
                  <div>
                    <h3 className="font-bold text-lg">{value.name}</h3>
                    {value.description && (
                      <p className="text-sm text-gray-600 mt-1">{value.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(value)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(value.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div
                className="h-2 rounded-full"
                style={{ backgroundColor: value.color || '#6366f1' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}