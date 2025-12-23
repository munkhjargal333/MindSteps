'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { LessonCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function NewLessonPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  const [categories, setCategories] = useState<LessonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [lessonType, setLessonType] = useState('article');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [requiredLevel, setRequiredLevel] = useState(1);
  const [estimatedDuration, setEstimatedDuration] = useState(10);
  const [pointsReward, setPointsReward] = useState(10);
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');
  // const [relatedValueKeywords, setRelatedValueKeywords] = useState('');
  // const [relatedEmotionKeywords, setRelatedEmotionKeywords] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const loadCategories = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiClient.getLessonCategories(token);
      const allCategories: LessonCategory[] = [];
      data.forEach(parent => {
        if (!parent.children || parent.children.length === 0) {
          allCategories.push(parent);
        }
        
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(child => {
            allCategories.push({
              ...child,
              name_mn: `${parent.name_mn} → ${child.name_mn}`
            });
          });
        }
      });
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast('Категори ачаалахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === '') {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(autoSlug);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('❌ Зөвхөн зураг upload хийнэ үү', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('❌ Зургийн хэмжээ 10MB-аас бага байх ёстой', 'error');
      return;
    }

    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setThumbnailUrl('');
    
    showToast('✅ Зураг сонгогдлоо', 'success');
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    
    if (!isVideo && !isAudio) {
      showToast('❌ Зөвхөн видео эсвэл аудио файл upload хийнэ үү', 'error');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      showToast('❌ Файлын хэмжээ 100MB-аас бага байх ёстой', 'error');
      return;
    }

    setMediaFile(file);
    if (isVideo) setLessonType('video');
    if (isAudio) setLessonType('audio');
    setMediaUrl('');
    
    showToast(`✅ ${isVideo ? 'Видео' : 'Аудио'} файл сонгогдлоо`, 'success');
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setThumbnailUrl('');
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !categoryId || !content) {
      showToast('❌ Заавал бөглөх талбаруудыг бөглөнө үү', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const lessonData = {
        title,
        slug: slug || undefined,
        category_id: categoryId,
        description: description || undefined,
        content,
        lesson_type: lessonType,
        difficulty_level: difficultyLevel,
        required_level: requiredLevel,
        estimated_duration: estimatedDuration,
        points_reward: pointsReward,
        media_url: mediaUrl || undefined,
        thumbnail_url: thumbnailUrl || undefined,
        tags: tagsArray,
        // related_value_keywords: relatedValueKeywords || undefined,
        // related_emotion_keywords: relatedEmotionKeywords || undefined,
        is_premium: isPremium,
        is_published: isPublished,
      };

      const files = {
        thumbnail: thumbnailFile || undefined,
        media: mediaFile || undefined,
      };

      await apiClient.createLessonWithFiles(lessonData, files, token?? undefined);

      showToast('✅ Хичээл амжилттай нэмэгдлээ!', 'success');
      
      setTimeout(() => {
        router.push('/admin/lessons');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating lesson:', error);
      const errorMessage = error instanceof Error ? error.message : 'Хичээл үүсгэхэд алдаа гарлаа';
      showToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/admin/lessons"
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
          >
            ← Буцах
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            ➕ Шинэ хичээл нэмэх
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Үндсэн мэдээлэл</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Гарчиг <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Хичээлийн гарчиг"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-gray-500 mt-1">
                Хоосон үлдвэл автоматаар үүснэ
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Категори <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Сонгох...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji ? `${cat.emoji} ` : ''}{cat.name_mn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Товч тайлбар
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Хичээлийн товч тайлбар..."
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Агуулга</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Хичээлийн агуулга <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Markdown форматаар бичнэ үү...

# Гарчиг
## Дэд гарчиг

Текст..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Markdown дэмжинэ: # гарчиг, **bold**, *italic*
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Медиа файлууд</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🖼️ Зургийн файл
              </label>
              
              {!thumbnailFile && !thumbnailPreview ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, WEBP • Максимум 10MB
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Эсвэл URL оруулах:</p>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {thumbnailPreview && (
                    <img 
                      src={thumbnailPreview} 
                      alt="Preview" 
                      className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-gray-300"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      🗑️ Устгах
                    </button>
                    <p className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex-1">
                      ✅ {thumbnailFile?.name || 'URL холбогдсон'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎬 Медиа файл (Видео/Аудио)
              </label>
              
              {!mediaFile ? (
                <div>
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleMediaUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    MP4, WEBM, MP3, WAV • Максимум 100MB
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Эсвэл URL оруулах:</p>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearMedia}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      🗑️ Устгах
                    </button>
                    <p className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex-1">
                      ✅ {mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Тохиргоо</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Төрөл</label>
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="article">📝 Нийтлэл</option>
                  <option value="video">🎥 Видео</option>
                  <option value="audio">🎧 Аудио</option>
                  <option value="interactive">🎮 Интерактив</option>
                  <option value="meditation">🧘 Бясалгал</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Түвшин</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">🟢 Анхан</option>
                  <option value="intermediate">🟡 Дунд</option>
                  <option value="advanced">🔴 Ахисан</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Шаардлагатай түвшин</label>
                <input
                  type="number"
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Хугацаа (минут)</label>
                <input
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Шагналын оноо</label>
                <input
                  type="number"
                  value={pointsReward}
                  onChange={(e) => setPointsReward(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Шошго</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="meditation, mindfulness, relaxation"
              />
              <p className="text-xs text-gray-500 mt-1">Таслалаар тусгаарлана</p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Үнэт зүйлсийн түлхүүр үг</label>
                <input
                  type="text"
                  value={relatedValueKeywords}
                  onChange={(e) => setRelatedValueKeywords(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="амар амгалан, тайван байдал"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Сэтгэл хөдлөлийн түлхүүр үг</label>
                <input
                  type="text"
                  value={relatedEmotionKeywords}
                  onChange={(e) => setRelatedEmotionKeywords(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="аюулгүй, тайван"
                />
              </div>
            </div> */}

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">⭐ Premium хичээл</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">✅ Нийтлэх</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Хадгалж байна...
                </span>
              ) : (
                '✅ Хадгалах'
              )}
            </button>
            <Link
              href="/admin/lessons"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
            >
              Цуцлах
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}