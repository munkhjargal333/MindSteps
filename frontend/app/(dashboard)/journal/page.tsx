'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Journal } from '@/lib/types';
import Link from 'next/link';

export default function JournalListPage() {
  const { token } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (token) {
      loadJournals();
    }
  }, [token, page]);

  const loadJournals = async () => {
    if (!token) return;
    
    try {
      const data = await apiClient.getJournals(token, page, 10);
      setJournals(data.journals);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Ачааллаж байна...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Миний журналууд</h1>
        <Link
          href="/journal/new"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Шинэ журнал
        </Link>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📔</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Журнал байхгүй байна</h2>
          <p className="text-gray-500 mb-6">Эхний журналаа бичиж эхлээрэй!</p>
          <Link
            href="/journal/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Журнал бичих
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map((journal) => (
            <JournalCard key={journal.id} journal={journal} />
          ))}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Өмнөх
              </button>
              <span className="px-4 py-2 text-gray-700">
                Хуудас {page} / {Math.ceil(total / 10)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 10)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Дараах
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JournalCard({ journal }: { journal: Journal }) {
  const sentimentEmoji = journal.sentiment_score 
    ? journal.sentiment_score > 0.5 ? '😊' 
    : journal.sentiment_score > 0 ? '😐' 
    : '😔'
    : '📝';

  return (
    <Link href={`/journal/${journal.id}`}>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">{journal.title}</h3>
          <span className="text-2xl ml-4">{sentimentEmoji}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{journal.content}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex gap-4">
            <span>📅 {new Date(journal.entry_date).toLocaleDateString('mn-MN')}</span>
            <span>📝 {journal.word_count} үг</span>
          </div>
          
          {journal.ai_analysis && (
            <div className="flex items-center gap-2 text-blue-600">
              <span>🎯 {journal.ai_analysis.final_points} оноо</span>
            </div>
          )}
        </div>

        {journal.tags && journal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {journal.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}