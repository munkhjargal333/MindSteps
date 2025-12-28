'use client';

import { Pencil, Trash2 , ChevronDown, Plus} from 'lucide-react';
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
      className="group relative flex items-center gap-2 p-2 sm:p-4 w-full rounded-lg sm:rounded-2xl bg-white border border-gray-50 shadow-sm"
    >
      {/* Жижиг өнгөт зураас */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: accentColor }} />

      {/* Жижиг Icon */}
      <div className="shrink-0 w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
        <span className="text-[10px] sm:text-lg">{value.MaslowLevel?.icon || '•'}</span>
      </div>

      {/* Текст - Хальж гарахаас сэргийлсэн */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[10px] sm:text-sm font-black text-gray-900 truncate uppercase tracking-tighter">
          {value.name}
        </h4>
        {/* Mobile дээр тайлбарыг нууж зай хэмнэх эсвэл маш богино харуулах */}
        <p className="hidden sm:block text-[10px] text-gray-400 truncate">
          {value.description || '...'}
        </p>
      </div>

      {/* Үйлдэл - Жижиг товчнууд */}
      <div className="flex shrink-0 gap-0.5 sm:gap-1">
        <button onClick={() => onEdit(value)} className="p-1 text-gray-300 hover:text-black">
          <ChevronDown className="rotate-90 w-3 h-3 sm:w-4 sm:h-4" /> {/* Pencil-ийн оронд жижиг icon ашиглаж болно */}
        </button>
        <button onClick={() => onDelete(value)} className="p-1 text-gray-300 hover:text-red-500">
          <Plus className="rotate-45 w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  );
}
