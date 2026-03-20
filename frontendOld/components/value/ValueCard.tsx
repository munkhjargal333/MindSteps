'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { CoreValue } from '@/lib/types';
import { motion } from 'framer-motion';

interface Props {
  value: CoreValue;
  onEdit: (v: CoreValue) => void;
  onDelete: (v: CoreValue) => void;
}

export function ValueCard({ value, onEdit, onDelete }: Props) {
  const accentColor = value.MaslowLevel?.color || value.color || '#e5e7eb';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="
        group relative flex items-center gap-2 sm:gap-3
        p-2 sm:p-3
        w-full
        rounded-lg sm:rounded-xl
        bg-white/80 backdrop-blur-md
        border border-gray-50
        transition-all
        hover:shadow-md
        active:scale-[0.98]
      "
    >
      {/* Accent bar - илүү жижиг */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-6 sm:h-8 rounded-r-full"
        style={{ backgroundColor: accentColor }}
      />

      {/* Icon - жижиг хэмжээ */}
      <div
        className="relative shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex items-center justify-center ml-1 sm:ml-0"
        style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
      >
        <span className="text-xs sm:text-sm" style={{ color: accentColor }}>
          {value.MaslowLevel?.icon || '•'}
        </span>
      </div>

      {/* Content - компакт текст */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[10px] sm:text-xs font-black text-gray-900 truncate tracking-tight leading-tight">
          {value.name}
        </h4>
        {value.description && (
          <p className="text-[8px] sm:text-[10px] text-gray-400 truncate font-medium leading-tight mt-0.5">
            {value.description}
          </p>
        )}
      </div>

      {/* Actions - жижиг товчнууд */}
      <div className="flex shrink-0 gap-0.5 sm:gap-1">
        <button 
          onClick={() => onEdit(value)} 
          className="p-1 sm:p-1.5 text-gray-300 hover:text-blue-500 transition-colors active:scale-95"
          aria-label="Edit value"
        >
          <Pencil size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
        <button 
          onClick={() => onDelete(value)} 
          className="p-1 sm:p-1.5 text-gray-300 hover:text-red-500 transition-colors active:scale-95"
          aria-label="Delete value"
        >
          <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}