'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Journal } from '@/lib/types';

export default function JournalDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const journalId = params?.id as number | undefined;

  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token && journalId) {
      loadJournal();
    }
  }, [token, journalId]);

  const loadJournal = async () => {
    if (!token || !journalId) return;
    
    try {
      const data = await apiClient.getJournal(journalId, token);
      setJournal(data);
    } catch (error) {
      console.error('Error loading journal:', error);
      alert('Журнал ачаалахад алдаа гарлаа');
      router.push('/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !journalId) return;
    
    const confirmed = confirm('Энэ журналыг устгахдаа итгэлтэй байна уу?');
    if (!confirmed) return;
    
    setDeleting(true);
    
    try {
      await apiClient.deleteJournal(journalId, token);
      alert('Журнал амжилттай устгагдлаа');
      router.push('/journal');
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Журнал устгахад алдаа гарлаа');
      setDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  const sentimentEmoji = journal?.sentiment_score 
    ? journal.sentiment_score > 0.5 ? '😊' 
    : journal.sentiment_score > 0 ? '😐' 
    : '😔'
    : '📝';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-base sm:text-lg text-gray-600">Журнал ачаалж байна...</div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Журнал олдсонгүй
        </h2>
        <Link
          href="/journal"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      
      {/* BACK BUTTON */}
      <Link
        href="/journal"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm sm:text-base"
      >
        <span>←</span>
        <span>Буцах</span>
      </Link>

      {/* MAIN CONTENT CARD */}
      <article className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
        
        {/* HEADER WITH ACTIONS */}
        <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b">
          <div className="flex-1 min-w-0">
            {/* DATE */}
            <div className="text-xs sm:text-sm text-gray-500 mb-3">
              {formatDate(journal.created_at)}
            </div>

            {/* TITLE */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {journal.title}
            </h1>

            {/* TAGS */}
            {journal.tags && (
              <div className="flex flex-wrap gap-2">
                {journal.tags.split(',').map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/journal/edit/${journal.id}`}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium whitespace-nowrap"
            >
              ✏️ Засах
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium whitespace-nowrap disabled:opacity-50"
            >
              {deleting ? '⏳' : '🗑️'} {deleting ? 'Устгаж байна...' : 'Устгах'}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6">
          <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {journal.content}
          </div>
        </div>

        {/* STATS & INFO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
          {/* Word Count */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Үгийн тоо</div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">{journal.word_count}</div>
          </div>

          {/* Sentiment */}
          {journal.sentiment_score !== undefined && journal.sentiment_score !== null && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Сэтгэл</div>
              <div className="text-2xl sm:text-3xl">{sentimentEmoji}</div>
            </div>
          )}

          {/* Points
          {journal.ai_analysis && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 mb-1">Оноо</div>
              <div className="text-lg sm:text-xl font-bold text-blue-700">
                {journal.ai_analysis.final_points}
              </div>
            </div>
          )} */}

          {/* Created Date */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Үүсгэсэн</div>
            <div className="text-xs sm:text-sm font-medium text-gray-700">
              {new Date(journal.created_at).toLocaleDateString('mn-MN')}
            </div>
          </div>
        </div>

        {/* AI ANALYSIS - If available */}
        {/* {journal.ai_analysis && (
          <div className="mt-6 p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>🤖</span>
              <span>AI дүн шинжилгээ</span>
            </h3>
            
            {journal.ai_analysis.summary && (
              <div className="mb-3">
                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Хураангуй:</div>
                <p className="text-sm sm:text-base text-gray-600">{journal.ai_analysis.summary}</p>
              </div>
            )}

            {journal.ai_analysis.insights && journal.ai_analysis.insights.length > 0 && (
              <div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Ойлголтууд:</div>
                <ul className="space-y-1 text-sm sm:text-base text-gray-600">
                  {journal.ai_analysis.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )} */}
      </article>
    </div>
  );
}