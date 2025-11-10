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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      loadJournals();
    }
  }, [token, page]);

  const loadJournals = async () => {
    if (!token) return;
    
    try {
      const data = await apiClient.getJournals(page, 10, token);
      setJournals(data.journals);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    
    const confirmed = confirm('Энэ журналыг устгахдаа итгэлтэй байна уу?');
    if (!confirmed) return;
    
    setDeletingId(id);
    
    try {
      await apiClient.deleteJournal(id, token);
      // Remove from list
      setJournals(prev => prev.filter(j => j.id !== id));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Журнал устгахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-base sm:text-lg text-gray-600">Журналууд ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      
      {/* HEADER - Responsive title & button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          📔 Миний журналууд
        </h1>
        <Link
          href="/journal/new"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition text-center text-sm sm:text-base shadow-lg"
        >
          <span className="sm:hidden">+ Шинэ</span>
          <span className="hidden sm:inline">+ Шинэ журнал</span>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {journals.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="text-5xl sm:text-6xl mb-4">📔</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
            Журнал байхгүй байна
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Эхний журналаа бичиж эхлээрэй!
          </p>
          <Link
            href="/journal/new"
            className="inline-block px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-lg"
          >
            Журнал бичих
          </Link>
        </div>
      ) : (
        <>
          {/* JOURNAL LIST */}
          <div className="space-y-3 sm:space-y-4">
            {journals.map((journal) => (
              <JournalCard 
                key={journal.id} 
                journal={journal}
                onDelete={handleDelete}
                isDeleting={deletingId === journal.id}
              />
            ))}
          </div>

          {/* PAGINATION - Better mobile design */}
          {total > 10 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
              >
                ← Өмнөх
              </button>
              
              <div className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm sm:text-base">
                {page} / {Math.ceil(total / 10)}
              </div>
              
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 10)}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm sm:text-base"
              >
                Дараах →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// JOURNAL CARD - Fully responsive
function JournalCard({ 
  journal, 
  onDelete, 
  isDeleting 
}: { 
  journal: Journal;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  const sentimentEmoji = journal.sentiment_score 
    ? journal.sentiment_score > 0.5 ? '😊' 
    : journal.sentiment_score > 0 ? '😐' 
    : '😔'
    : '📝';

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all border border-transparent hover:border-blue-200 relative">
      
      {/* ACTION BUTTONS - Top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
        {/* Mobile: 3 dots menu */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowActions(!showActions);
          }}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-xl"
        >
          ⋮
        </button>

        {/* Desktop & Mobile dropdown: Show buttons */}
        <div className={`
          ${showActions ? 'flex' : 'hidden sm:flex'} 
          ${showActions ? 'absolute top-10 right-0 bg-white shadow-xl rounded-lg p-2 flex-col gap-1 border border-gray-200' : 'flex-row gap-2'}
        `}>
          <Link
            href={`/journal/edit/${journal.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
            }}
            className="px-3 py-2 hover:bg-blue-50 text-blue-600 rounded-lg transition text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-base">✏️</span>
            <span>Засах</span>
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowActions(false);
              onDelete(journal.id);
            }}
            disabled={isDeleting}
            className="px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg transition text-sm font-medium flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Устгаж байна...</span>
              </>
            ) : (
              <>
                <span className="text-base">🗑️</span>
                <span>Устгах</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CLICKABLE CONTENT - Link to detail page */}
      <Link href={`/journal/${journal.id}`} className="block group">
        <div className="pr-8 sm:pr-40">{/* Space for action buttons */}
        
        {/* DATE FIRST - Most important */}
        <div className="text-xs sm:text-sm text-gray-500 font-medium mb-2">
          {formatDate(journal.created_at)}
        </div>

        {/* TITLE */}
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {journal.title}
        </h3>
        
        {/* CONTENT PREVIEW */}
        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
          {journal.content}
        </p>
        
        {/* TAGS - Subtle */}
        {journal.tags && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {journal.tags.split(',').slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded"
              >
                {tag.trim()}
              </span>
            ))}
            {journal.tags.split(',').length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                +{journal.tags.split(',').length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* STATS ROW - Simple */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {/* <span>{journal.word_count} үг</span> */}
            
            {journal.sentiment_score !== undefined && journal.sentiment_score !== null && (
              <>
                <span>•</span>
                <span>{sentimentEmoji}</span>
              </>
            )}
          </div>
          
          {/* POINTS
          {journal.ai_analysis && (
            <span className="text-blue-600 font-semibold">
              {journal.ai_analysis.final_points} оноо
            </span>
          )} */}
        </div>
        </div>
      </Link>

    </div>
  );
}