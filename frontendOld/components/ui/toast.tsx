'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration: number;
  onClose: () => void;
}

// 1. Toast UI Component
export function Toast({ message, type, duration, onClose }: ToastProps) {
  const styles = {
    success: 'bg-emerald-500 shadow-emerald-200/40',
    error: 'bg-rose-500 shadow-rose-200/40',
    warning: 'bg-amber-500 shadow-amber-200/40',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`fixed bottom-8 right-4 sm:right-8 flex flex-col min-w-[280px] max-w-[400px] rounded-[1.2rem] shadow-2xl text-white font-bold z-[100] overflow-hidden ${styles[type]}`}
    >
      <div className="flex items-center gap-3 px-6 py-4">
        <Icon className="w-5 h-5 shrink-0" strokeWidth={3} />
        <div className="flex-1">
          <p className="text-[13px] leading-tight tracking-tight pr-2">{message}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>

      {/* ⏳ PROGRESS TIMER BAR */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="h-1 bg-white/40 origin-left"
      />
    </motion.div>
  );
}

// 2. Custom Hook
export function useToast() {
  const [toast, setToast] = useState<{ 
    message: string; 
    type: ToastType; 
    duration: number; 
  } | null>(null);

  const showToast = useCallback((
    message: string, 
    type: ToastType = 'success', 
    duration: number = 5000 // Анхны утга 5 секунд
  ) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  // Timer-ийг удирдах useEffect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // UI-д дүрслэх контейнер
  const ToastContainer = useCallback(() => (
    <AnimatePresence>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration} 
          onClose={hideToast} 
        />
      )}
    </AnimatePresence>
  ), [toast, hideToast]);

  return { showToast, ToastContainer };
}