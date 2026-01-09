'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { LessonCategory } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Image as ImageIcon, Video, 
  Music, FileText, Settings, Layers, Hash,
  Star, Globe, X, UploadCloud, RefreshCw, AlertCircle, ChevronRight
} from 'lucide-react';

const transliterate = (text: string) => {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z',
    'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'ө': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ү': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function EditLessonPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = Number(params.id);
  const { showToast } = useGlobalToast();
  
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    parentCategoryId: 0,
    categoryId: 0,
    description: '',
    content: '',
    lessonType: 'theory_article',
    difficultyLevel: 'beginner',
    requiredLevel: 1,
    estimatedDuration: 10,
    pointsReward: 10,
    mediaUrl: '',
    thumbnailUrl: '',
    tags: '',
    isPremium: false,
    isPublished: false
  });

  const [files, setFiles] = useState<{
    thumbnail: File | null;
    media: File | null;
  }>({ thumbnail: null, media: null });

  const [previews, setPreviews] = useState({ thumbnail: '' });

  useEffect(() => {
    if (token && lessonId) loadData();
  }, [token, lessonId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonData, categoriesData] = await Promise.all([
        apiClient.getLesson(lessonId, token!),
        apiClient.getLessonCategories(token!)
      ]);
      
      // Find parent category
      let parentId = 0;
      categoriesData.lessons?.forEach(parent => {
        if (parent.children?.some(child => child.id === lessonData.category_id)) {
          parentId = parent.id;
        } else if (parent.id === lessonData.category_id) {
          parentId = parent.id;
        }
      });

      setFormData({
        title: lessonData.title,
        slug: lessonData.slug,
        parentCategoryId: parentId,
        categoryId: lessonData.category_id,
        description: lessonData.description || '',
        content: lessonData.content || '',
        lessonType: lessonData.lesson_type,
        difficultyLevel: lessonData.difficulty_level,
        requiredLevel: lessonData.required_level,
        estimatedDuration: lessonData.estimated_duration || 10,
        pointsReward: lessonData.points_reward,
        mediaUrl: lessonData.media_url || '',
        thumbnailUrl: lessonData.thumbnail_url || '',
        tags: Array.isArray(lessonData.tags) ? lessonData.tags.join(', ') : (lessonData.tags || ''),
        isPremium: lessonData.is_premium,
        isPublished: lessonData.is_published
      });

      if (lessonData.thumbnail_url) {
        setPreviews({ thumbnail: lessonData.thumbnail_url });
      }

      setCategories(categoriesData.lessons || categoriesData || []);
    } catch (err) {
      showToast('Мэдээлэл татахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const availableChildren = categories.find(c => c.id === formData.parentCategoryId)?.children || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'media') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'thumbnail') {
      setFiles(prev => ({ ...prev, thumbnail: file }));
      setPreviews({ thumbnail: URL.createObjectURL(file) });
    } else {
      setFiles(prev => ({ ...prev, media: file }));
      if (file.type.startsWith('video/')) setFormData(p => ({ ...p, lessonType: 'video' }));
      if (file.type.startsWith('audio/')) setFormData(p => ({ ...p, lessonType: 'audio' }));
    }
    showToast(`✅ ${file.name} сонгогдлоо`, 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.content) {
      return showToast('❌ Шаардлагатай талбаруудыг бөглөнө үү', 'error');
    }

    setSubmitting(true);
    try {
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        category_id: formData.categoryId,
        description: formData.description,
        content: formData.content,
        lesson_type: formData.lessonType,
        difficulty_level: formData.difficultyLevel,
        required_level: formData.requiredLevel,
        estimated_duration: formData.estimatedDuration,
        points_reward: formData.pointsReward,
        thumbnail_url: formData.thumbnailUrl || undefined,
        media_url: formData.mediaUrl || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        is_premium: formData.isPremium,
        is_published: formData.isPublished,
      };

      await apiClient.updateLesson(lessonId, updateData, {
        thumbnail: files.thumbnail || undefined,
        media: files.media || undefined
      }, token!);

      showToast('✅ Хичээл амжилттай шинэчлэгдлээ!', 'success');
      setTimeout(() => router.push('/admin/lessons'), 1500);
    } catch (error) {
      showToast('❌ Шинэчлэхэд алдаа гарлаа', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/lessons" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">Хичээл засах</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {lessonId}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Шинэчлэх
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Үндсэн мэдээлэл</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Хичээлийн нэр, тайлбар</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Хичээлийн гарчиг *</label>
                <input
                  type="text"
                  placeholder="Жишээ: Стрессийг хэрхэн удирдах вэ?"
                  className="w-full text-xl font-bold bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:ring-0 rounded-2xl px-5 py-4 placeholder:text-gray-300 transition-all"
                  value={formData.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({...formData, title: val, slug: transliterate(val)});
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Товч тайлбар</label>
                <textarea
                  placeholder="Энэ хичээлд та дараах зүйлсийг сурах болно..."
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:ring-0 rounded-2xl px-5 py-4 text-sm font-medium placeholder:text-gray-300 transition-all"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Editor Area */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Layers size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Агуулга</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Markdown форматаар бичнэ үү</p>
              </div>
            </div>
            <textarea
              className="w-full min-h-[500px] bg-gray-50 border-2 border-gray-100 focus:border-purple-500 focus:ring-0 rounded-2xl px-5 py-4 text-sm font-mono placeholder:text-gray-300 transition-all"
              placeholder="# Том гарчиг
              
## Дэд гарчиг

Энд агуулга бичнэ...

- Жагсаалт 1
- Жагсаалт 2"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-green-50 rounded-xl">
                <Globe size={18} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Нийтлэх</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Харагдах байдал</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-100 rounded-2xl cursor-pointer hover:border-emerald-300 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all ${formData.isPublished ? 'bg-emerald-500' : 'bg-white'}`}>
                    <Globe size={16} className={formData.isPublished ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Нийтлэх</span>
                    <span className="text-xs text-gray-500">Бүх хэрэглэгчид харна</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.isPublished} 
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} 
                  className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-2 focus:ring-emerald-500" 
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-100 rounded-2xl cursor-pointer hover:border-amber-300 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all ${formData.isPremium ? 'bg-amber-500' : 'bg-white'}`}>
                    <Star size={16} className={formData.isPremium ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Premium</span>
                    <span className="text-xs text-gray-500">Төлбөртэй контент</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.isPremium} 
                  onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} 
                  className="w-5 h-5 rounded-lg text-amber-600 focus:ring-2 focus:ring-amber-500" 
                />
              </label>
            </div>
          </section>

          {/* Category Selection */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Layers size={18} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Категори</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Бүлэг сонгох</p>
              </div>
            </div>

            {/* Parent Category */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-black">1</span>
                Үндсэн бүлэг *
              </label>
              <select 
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 focus:border-blue-500 focus:ring-0 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 appearance-none cursor-pointer transition-all"
                value={formData.parentCategoryId}
                onChange={(e) => {
                  const parentId = Number(e.target.value);
                  setFormData({
                    ...formData, 
                    parentCategoryId: parentId,
                    categoryId: 0
                  });
                }}
              >
                <option value={0} className="bg-white">— Сонгох —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-white">
                    {cat.emoji} {cat.name_mn}
                  </option>
                ))}
              </select>
            </div>

            {/* Child Category */}
            {formData.parentCategoryId > 0 && availableChildren.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xs font-black">2</span>
                  Дэд бүлэг *
                  <ChevronRight size={14} className="text-purple-400" />
                </label>
                <select 
                  className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 focus:border-purple-500 focus:ring-0 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 appearance-none cursor-pointer transition-all"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                >
                  <option value={0} className="bg-white">— Сонгох —</option>
                  {availableChildren.map(child => (
                    <option key={child.id} value={child.id} className="bg-white">
                      {child.emoji} {child.name_mn}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Validation Alert */}
            {formData.parentCategoryId > 0 && availableChildren.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
                <p className="text-xs font-medium text-yellow-800">Энэ бүлэгт дэд бүлэг байхгүй байна</p>
              </div>
            )}
          </section>

          {/* Thumbnail & Media */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-pink-50 rounded-xl">
                <ImageIcon size={18} className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Медиа</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Зураг, видео</p>
              </div>
            </div>
            
            {/* Thumbnail */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-2 block">Зураг</label>
              <div className="relative group">
                {previews.thumbnail ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100">
                    <img src={previews.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => {
                        setFiles({...files, thumbnail: null}); 
                        setPreviews({thumbnail: ''});
                        setFormData({...formData, thumbnailUrl: ''});
                      }} 
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <label className="absolute top-3 left-3 p-2 bg-white hover:bg-gray-100 text-gray-900 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg cursor-pointer">
                      <UploadCloud size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                    </label>
                  </div>
                ) : (
                  <label className="aspect-video rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                      <UploadCloud size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Зураг оруулах</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF хүртэл 5MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                  </label>
                )}
              </div>
            </div>

            {/* Media File */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-2 block">Видео / Аудио</label>
              <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                files.media || formData.mediaUrl
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
              }`}>
                <div className={`p-3 rounded-xl shadow-sm ${files.media || formData.mediaUrl ? 'bg-emerald-500' : 'bg-white'}`}>
                  {formData.lessonType === 'video' ? (
                    <Video size={20} className={files.media || formData.mediaUrl ? 'text-white' : 'text-gray-400'} />
                  ) : (
                    <Music size={20} className={files.media || formData.mediaUrl ? 'text-white' : 'text-gray-400'} />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {files.media ? files.media.name : (formData.mediaUrl ? 'Файл хавсаргасан' : 'Файл оруулах')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {files.media || formData.mediaUrl ? 'Амжилттай' : 'MP4, MOV, MP3 хүртэл 100MB'}
                  </p>
                </div>
                <input type="file" className="hidden" accept="video/*,audio/*" onChange={(e) => handleFileUpload(e, 'media')} />
              </label>
            </div>
          </section>

          {/* Details */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Settings size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Тохиргоо</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Нэмэлт мэдээлэл</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Lesson Type */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Хичээлийн төрөл *</label>
                <select 
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 appearance-none cursor-pointer transition-all"
                  value={formData.lessonType}
                  onChange={(e) => setFormData({...formData, lessonType: e.target.value})}
                >
                  <option value="theory_article">📚 Theory Article - Онолын нийтлэл</option>
                  <option value="guided_article">🎯 Guided Article - Удирдамж нийтлэл</option>
                  <option value="core_meditation">🧘 Core Meditation - Үндсэн бясалгал</option>
                  <option value="healing_meditation">✨ Healing Meditation - Эдгээх бясалгал</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Түвшин *</label>
                <select 
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 appearance-none cursor-pointer transition-all"
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({...formData, difficultyLevel: e.target.value})}
                >
                  <option value="beginner">🌱 Beginner - Анхан шат</option>
                  <option value="intermediate">🌿 Intermediate - Дунд шат</option>
                  <option value="advanced">🌳 Advanced - Ахисан шат</option>
                </select>
              </div>

              {/* Required Level & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Шаардах түвшин</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 transition-all"
                      value={formData.requiredLevel}
                      onChange={(e) => setFormData({...formData, requiredLevel: Number(e.target.value)})}
                    />
                    <Star size={14} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Хугацаа (минут)</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 transition-all"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({...formData, estimatedDuration: Number(e.target.value)})}
                    />
                    <RefreshCw size={14} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Reward Points */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Урамшуулал оноо (XP)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 transition-all"
                    value={formData.pointsReward}
                    onChange={(e) => setFormData({...formData, pointsReward: Number(e.target.value)})}
                  />
                  <div className="absolute right-3 top-2.5 bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-md font-black">XP</div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Hash size={14} /> Таг (таслалаар тусгаарлах)
                </label>
                <input
                  type="text"
                  placeholder="бясалгал, эрүүл мэнд, стресс"
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 transition-all"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Quick Action Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 lg:hidden z-40">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          {submitting ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          Шинэчлэлийг хадгалах
        </button>
      </div>
    </div>
  );
} 