'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react'; // Check нэмлээ
import { Maslow } from '@/lib/types';

interface Props {
  levels: Maslow[];
  selectedValueId?: number;
  onSelect: (id: number | undefined) => void;
}

export function MaslowDropdown({ levels, selectedValueId, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLevel = levels.find(l => l.id === selectedValueId);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Label-ийг илүү жижиг, гоё болгов */}
      <label className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 block ml-1">
        Hierarchy Category
      </label>

      {/* Үндсэн товчлуур */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-300
          ${isOpen 
            ? 'bg-white ring-4 ring-indigo-500/5 border-indigo-200' 
            : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100/50'
          }
          border shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedLevel ? (
            <>
              {/* Сонгогдсон үеийн өнгөт дугуй */}
              <div 
                className="w-2 h-2 rounded-full shadow-sm flex-shrink-0" 
                style={{ backgroundColor: selectedLevel.color }}
              />
              <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest truncate">
                {selectedLevel.name}
              </span>
            </>
          ) : (
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Select Category</span>
          )}
        </div>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute z-[60] w-full mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-white p-2 overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              {levels.map((level) => {
                const isSelected = level.id === selectedValueId;
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      onSelect(level.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-3 py-2.5 mb-1 last:mb-0 rounded-xl flex items-center justify-between group transition-all
                      ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Түвшний өнгөт индикатор */}
                      <div 
                        className="w-4 h-4 rounded-lg flex items-center justify-center text-[10px] shadow-sm border border-white/50"
                        style={{ backgroundColor: level.color }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                        {level.name}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <motion.div layoutId="check-icon">
                        <Check size={12} className="text-indigo-500" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}