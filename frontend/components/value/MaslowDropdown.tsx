'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
    <div className="relative" ref={containerRef}>
      <label className="text-[11px] font-medium text-gray-400 mb-2 block ml-1 tracking-tight">
        Ангилал
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-0 py-3.5 border-b border-gray-200 flex items-center justify-between hover:border-gray-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedLevel ? (
            <span className="text-sm font-medium text-gray-800">
              {selectedLevel.icon} {selectedLevel.name}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Сонгох</span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 w-full bg-white shadow-2xl border border-gray-100 p-1.5 mt-2 rounded-lg"
          >
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => {
                  onSelect(level.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm rounded-md flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <span>{level.icon}</span>
                <span className="text-gray-700 font-medium">{level.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}