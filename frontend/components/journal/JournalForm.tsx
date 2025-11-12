'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface JournalFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string;
  initialIsPrivate?: boolean;
  onSubmit: (data: { title: string; content: string; tags?: string; is_private?: boolean }) => Promise<void>;
  loading?: boolean;
}


export default function JournalForm({
  initialTitle = '',
  initialContent = '',
  initialTags = '',
  initialIsPrivate = true,
  onSubmit,
  loading = false,
}: JournalFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [error, setError] = useState('');

  // анхны утгууд өөрчлөгдөхөд state шинэчлэх
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
    setIsPrivate(initialIsPrivate);
  }, [initialTitle, initialContent, initialTags, initialIsPrivate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({
        title,
        content,
        tags,
        is_private: isPrivate,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'тэмдэглэл хадгалахад алдаа гарлаа';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Гарчиг</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Өнөөдрийн тэмдэглэл..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Агуулга</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Өнөөдөр юу болсон бэ? Юу бодож байна..."
          required
        />
        <p className="mt-2 text-sm text-gray-500">{content.split(/\s+/).length} үг</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Шошго</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="өдөр тутмын, сэтгэл хөдлөл, ажил"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPrivate"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
          Хувийн тэмдэглэл (зөвхөн би харах)
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50"
        >
          {loading ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Болих
        </button>
      </div>
    </form>
  );
}
