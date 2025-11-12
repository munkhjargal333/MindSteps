import Link from 'next/link';
import { useState } from 'react';
import { MoodEntry } from '@/lib/types';

// MOOD - entries CARD COMPONENT
export default function MoodCard({ 
  entry, 
  onDelete, 
  isDeleting 
}: { 
  entry: MoodEntry;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600 bg-red-50';
    if (intensity >= 6) return 'text-orange-600 bg-orange-50';
    if (intensity >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getIntensityEmoji = (intensity: number) => {
    if (intensity >= 8) return '🔥';
    if (intensity >= 6) return '😊';
    if (intensity >= 4) return '😐';
    return '😌';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Огноо байхгүй';
    try {
      return new Date(dateString).toLocaleDateString('mn-MN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Огноо алдаатай';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all border border-transparent hover:border-purple-200 relative">
      
      {/* ACTION BUTTONS */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowActions(!showActions);
          }}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-xl"
        >
          ⋮
        </button>

        <div className={`
          ${showActions ? 'flex' : 'hidden sm:flex'} 
          ${showActions ? 'absolute top-10 right-0 bg-white shadow-xl rounded-lg p-2 flex-col gap-1 border border-gray-200' : 'flex-row gap-2'}
        `}>
          <Link
            href={`/mood/edit/${entry.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
            }}
            className="px-3 py-2 hover:bg-purple-50 text-purple-600 rounded-lg transition text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-base">✏️</span>
            <span>Засах</span>
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowActions(false);
              onDelete(entry.id);
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

      {/* CONTENT */}
      <Link href={`/mood/${entry.id}`} className="block group">
        <div className="pr-8 sm:pr-40">
        
        {/* DATE & INTENSITY */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            {formatDate(entry.created_at)}
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getIntensityColor(entry.intensity)}`}>
            <span>{getIntensityEmoji(entry.intensity)}</span>
            <span>{entry.intensity}/10</span>
          </div>
        </div>

        {/* MOOD NAME */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
          {entry.PlutchikEmotions?.name_mn || 'Сэтгэл санаа'}
        </h3>
        
        {/* TRIGGER EVENT */}
        {entry.trigger_event && (
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Шалтгаан:</span> {entry.trigger_event}
          </p>
        )}
        
        {/* COPING STRATEGY */}
        {entry.coping_strategy && (
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Арга:</span> {entry.coping_strategy}
          </p>
        )}
        
        {/* NOTES */}
        {entry.notes && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-3 italic">
            "{entry.notes}"
          </p>
        )}
        
        {/* METADATA */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
          {entry.location && (
            <span className="flex items-center gap-1">
              📍 {entry.location}
            </span>
          )}
          {entry.weather && (
            <span className="flex items-center gap-1">
              🌤️ {entry.weather}
            </span>
          )}
        </div>
        </div>
      </Link>

    </div>
  );
}