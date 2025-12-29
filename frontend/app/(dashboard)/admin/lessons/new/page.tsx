'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { LessonCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useGlobalToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Image as ImageIcon, Video, 
  Music, FileText, Settings, Layers, Hash,
  Star, Globe, X, UploadCloud, AlertCircle
} from 'lucide-react';

// Монгол үсгийг латин руу хөрвүүлэх функц (Slug-д зориулав)
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

export default function NewLessonPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast } = useGlobalToast();
  
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: 0,
    description: '',
    content: '',
    lessonType: 'article',
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
    if (token) loadCategories();
  }, [token]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getLessonCategories(token!);
      const flattened: LessonCategory[] = [];
      data.forEach(parent => {
        if (parent.children?.length) {
          parent.children.forEach(child => {
            flattened.push({ ...child, name_mn: `${parent.name_mn} → ${child.name_mn}` });
          });
        } else {
          flattened.push(parent);
        }
      });
      setCategories(flattened);
    } catch (err) {
      showToast('Категори ачаалахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title: val, 
      slug: transliterate(val) 
    }));
  };

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
      // Backend-д очих өгөгдлийн бүтцийг TypeScript-ийн шаардлагад тааруулж бэлдэнэ
      const lessonData = {
        title: formData.title,
        slug: formData.slug || undefined,
        category_id: formData.categoryId,
        description: formData.description,
        content: formData.content,
        lesson_type: formData.lessonType,         // CamelCase -> snake_case
        difficulty_level: formData.difficultyLevel, // CamelCase -> snake_case
        required_level: formData.requiredLevel,     // CamelCase -> snake_case
        estimated_duration: formData.estimatedDuration, // CamelCase -> snake_case
        points_reward: formData.pointsReward,       // CamelCase -> snake_case
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        is_premium: formData.isPremium,             // CamelCase -> snake_case
        is_published: formData.isPublished,         // CamelCase -> snake_case
      };

      // Одоо энэ lessonData-г apiClient рүү дамжуулна
      await apiClient.createLessonWithFiles(lessonData, {
        thumbnail: files.thumbnail || undefined,
        media: files.media || undefined
      }, token!);

      showToast('✅ Хичээл амжилттай нэмэгдлээ!', 'success');
      setTimeout(() => router.push('/admin/lessons'), 1500);
    } catch (error) {
      console.error(error);
      showToast('❌ Алдаа гарлаа', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/lessons" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">Шинэ хичээл үүсгэх</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            Хадгалах
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Үндсэн мэдээлэл</h2>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Хичээлийн гарчиг..."
                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 placeholder:text-gray-200"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                <span className="text-[10px] font-black text-gray-400 uppercase">Slug:</span>
                <input 
                  className="bg-transparent border-none p-0 text-xs font-mono text-blue-500 focus:ring-0 w-64"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
              <textarea
                placeholder="Товч тайлбар оруулах..."
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-100"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </section>

          {/* Editor Area */}
          <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Layers size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Агуулга (Markdown)</h2>
              </div>
            </div>
            <textarea
              className="w-full min-h-[500px] bg-gray-50 border-none rounded-2xl p-6 text-sm font-mono focus:ring-2 focus:ring-blue-100"
              placeholder="# Том гарчиг..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Globe size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Нийтлэх төлөв</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Globe size={16} className={formData.isPublished ? 'text-emerald-500' : 'text-gray-400'} />
                  <span className="text-sm font-bold">Нийтлэх</span>
                </div>
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Star size={16} className={formData.isPremium ? 'text-amber-500' : 'text-gray-400'} />
                  <span className="text-sm font-bold">Premium</span>
                </div>
                <input type="checkbox" checked={formData.isPremium} onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} className="rounded text-blue-600" />
              </label>
            </div>
          </section>

          {/* Thumbnail & Media */}
          <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <ImageIcon size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Медиа файл</h2>
            </div>
            
            {/* Thumbnail */}
            <div className="relative group">
              {previews.thumbnail ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100">
                  <img src={previews.thumbnail} className="w-full h-full object-cover" />
                  <button onClick={() => {setFiles({...files, thumbnail: null}); setPreviews({thumbnail: ''})}} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                  <UploadCloud size={24} className="text-gray-300" />
                  <span className="text-[10px] font-black text-gray-400 uppercase">Зураг оруулах</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                </label>
              )}
            </div>

            {/* Media File (Video/Audio) */}
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${files.media ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`p-2 rounded-lg ${files.media ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'}`}>
                {formData.lessonType === 'video' ? <Video size={18} /> : <Music size={18} />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black uppercase tracking-tight truncate">{files.media ? files.media.name : 'Видео/Аудио оруулах'}</p>
                <p className="text-[10px] text-gray-400">Максимум 100MB</p>
              </div>
              <input type="file" className="hidden" accept="video/*,audio/*" onChange={(e) => handleFileUpload(e, 'media')} />
            </label>
          </section>

          {/* Details */}
          <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Settings size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Тохиргоо</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Категори</label>
                <select className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}>
                  <option value={0}>Сонгох...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_mn}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Хугацаа (мин)</label>
                  <input type="number" className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" value={formData.estimatedDuration} onChange={(e) => setFormData({...formData, estimatedDuration: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Оноо</label>
                  <input type="number" className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" value={formData.pointsReward} onChange={(e) => setFormData({...formData, pointsReward: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Шошго</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input placeholder="tag1, tag2..." className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold pl-9" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}