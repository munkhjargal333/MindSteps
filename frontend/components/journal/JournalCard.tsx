import Link from 'next/link';
import { useState } from 'react';
import { Journal } from '@/lib/types';

interface JournalCardProps {
  journal: Journal;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function JournalCard({ journal, onDelete, isDeleting }: JournalCardProps) {
  const [showActions, setShowActions] = useState(false);

  const sentimentEmoji = journal.sentiment_score
    ? journal.sentiment_score > 0.5
      ? '😊'
      : journal.sentiment_score > 0
      ? '😐'
      : '😔'
    : '📝';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all border border-transparent hover:border-blue-200 relative">
      
      {/* ACTION BUTTONS */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => { e.preventDefault(); setShowActions(!showActions); }}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-xl"
        >
          ⋮
        </button>

        <div className={`
          ${showActions ? 'flex' : 'hidden sm:flex'}
          ${showActions ? 'absolute top-10 right-0 bg-white shadow-xl rounded-lg p-2 flex-col gap-1 border border-gray-200' : 'flex-row gap-2'}
        `}>
          <Link
            href={`/journal/edit/${journal.id}`}
            onClick={(e) => { e.stopPropagation(); setShowActions(false); }}
            className="px-3 py-2 hover:bg-blue-50 text-blue-600 rounded-lg transition text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-base">✏️</span> Засах
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowActions(false); onDelete(journal.id); }}
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
                <span className="text-base">🗑️</span> Устгах
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <Link href={`/journal/${journal.id}`} className="block group">
        <div className="pr-8 sm:pr-40">
          <div className="text-xs sm:text-sm text-gray-500 font-medium mb-2">
            {formatDate(journal.created_at)}
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
            {journal.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{journal.content}</p>
          {/* {journal.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {journal.tags.split(',').slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{tag.trim()}</span>
              ))}
              {journal.tags.split(',').length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  +{journal.tags.split(',').length - 3}
                </span>
              )}
            </div>
          )} */}
          {/* <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center gap-2">
              {journal.sentiment_score !== undefined && journal.sentiment_score !== null && (
                <>
                  <span>•</span>
                  <span>{sentimentEmoji}</span>
                </>
              )}
            </div>
          </div> */}
        </div>
      </Link>

    </div>
  );
}
