'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { MoodUnit, PlutchikCombination } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

export default function MoodUnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [moodUnit, setMoodUnit] = useState<MoodUnit | null>(null);
  const [combination, setCombination] = useState<PlutchikCombination | null>(null);

  // Edit combination modal
  const [editingCombination, setEditingCombination] = useState(false);
  const [editForm, setEditForm] = useState({
    combined_name_en: '',
    combined_name_mn: '',
    combination_type: '',
    description: '',
    color: '',
    emoji: '',
  });
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token && params.id) {
      loadMoodUnit();
    }
  }, [token, params.id]);

  const loadMoodUnit = async () => {
    if (!token || !params.id) return;

    setLoading(true);
    try {
      const data = await apiClient.getMoodUnitById(Number(params.id), token);
      setMoodUnit(data);

      if (data.combination_id) {
        const combData = await apiClient.getPlutchikCombinationById(data.combination_id, token);
        setCombination(combData);
      }
    } catch (error) {
      console.error('Error loading mood unit:', error);
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
      combination_type: combination.combined_type || '',
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
      console.error('Error updating combination:', error);
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
      console.error('Error deleting combination:', error);
      showToast('❌ Устгахад алдаа гарлаа. Энэ combination-ийг ашиглаж байгаа mood unit байж магадгүй', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!moodUnit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">Mood unit олдсонгүй</p>
          <button
            onClick={() => router.push('/admin/mood-units')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            ← Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer />

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/mood-units')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            ← Буцах
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {moodUnit.display_emoji} {moodUnit.display_name_mn}
            </h1>
            <p className="text-gray-600 mt-1">{moodUnit.display_name_en}</p>
          </div>
        </div>
      </div>

      {/* MOOD UNIT INFO */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Үндсэн мэдээлэл</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">ID</p>
            <p className="font-semibold text-gray-900">{moodUnit.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              moodUnit.type === 'primary' ? 'bg-blue-100 text-blue-700' :
              moodUnit.type === 'dyad' ? 'bg-green-100 text-green-700' :
              moodUnit.type === 'triad' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {moodUnit.type}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Category</p>
            <p className="font-semibold text-gray-900">
              {moodUnit.MoodCategories?.emoji} {moodUnit.MoodCategories?.name_mn}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Emoji</p>
            <p className="text-3xl">{moodUnit.display_emoji}</p>
          </div>

          {/* {moodUnit.intensity_min !== undefined && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Intensity Range</p>
              <p className="font-semibold text-gray-900">
                {moodUnit.intensity_min} - {moodUnit.intensity_max}
              </p>
            </div>
          )} */}
        </div>
      </div>

      {/* PLUTCHIK COMBINATION */}
      {combination && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">🎭 Plutchik Combination</h2>
            <div className="flex gap-2">
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                ✏️ Засах
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                🗑️ Устгах
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Combined Name (MN)</p>
              <p className="text-lg font-semibold text-gray-900">{combination.combined_name_mn}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Combined Name (EN)</p>
              <p className="text-lg font-semibold text-gray-900">{combination.combined_name_en}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Emotion 1</p>
                <p className="font-semibold text-gray-900">
                  {combination.Emotion1?.emoji} {combination.Emotion2?.name_mn}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Emotion 2</p>
                <p className="font-semibold text-gray-900">
                  {combination.Emotion1?.emoji} {combination.Emotion1?.name_mn}
                </p>
              </div>
            </div>

            {combination.combined_type && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-700">
                  {combination.combined_type}
                </span>
              </div>
            )}

            {combination.description && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{combination.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {combination.color && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: combination.color }}
                    ></div>
                    <span className="font-mono text-gray-900">{combination.color}</span>
                  </div>
                </div>
              )}

              {combination.emoji && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Emoji</p>
                  <p className="text-3xl">{combination.emoji}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCombination && combination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                ✏️ Combination засах
              </h2>
              <p className="text-gray-600 mt-1">
                {combination.Emotion1?.name_mn} + {combination.Emotion2?.name_mn}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Combined Name (English) *
                </label>
                <input
                  type="text"
                  value={editForm.combined_name_en}
                  onChange={(e) => setEditForm({ ...editForm, combined_name_en: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Love, Optimism, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Combined Name (Монгол) *
                </label>
                <input
                  type="text"
                  value={editForm.combined_name_mn}
                  onChange={(e) => setEditForm({ ...editForm, combined_name_mn: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Хайр, Өөдрөг үзэл гэх мэт"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Combination Type
                </label>
                <select
                  value={editForm.combination_type}
                  onChange={(e) => setEditForm({ ...editForm, combination_type: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Сонгох</option>
                  <option value="dyad">Dyad</option>
                  <option value="triad">Triad</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Тайлбар
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Дэлгэрэнгүй тайлбар..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Өнгө (Hex)
                  </label>
                  <input
                    type="text"
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="#FF6B9D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={editForm.emoji}
                    onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="❤️"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !editForm.combined_name_en || !editForm.combined_name_mn}
                className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Хадгалж байна...' : '✅ Хадгалах'}
              </button>
              
              <button
                onClick={() => setEditingCombination(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && combination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                🗑️ Combination устгах
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Та <span className="font-bold text-purple-600">{combination.combined_name_mn}</span>
                {' '}({combination.Emotion1?.name_mn} + {combination.Emotion2?.name_mn})
                combination-ийг устгахдаа итгэлтэй байна уу?
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Анхаар: Хэрэв энэ combination-ийг ашиглаж байгаа mood unit байвал устгах боломжгүй.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {deleting ? 'Устгаж байна...' : '🗑️ Устгах'}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}