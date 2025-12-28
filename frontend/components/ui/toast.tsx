'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

// 1. Toast Component (Дизайныг нь Mood стиль рүү оруулав)
export function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  const styles = {
    success: 'bg-emerald-500 shadow-emerald-100',
    error: 'bg-rose-500 shadow-rose-100',
    warning: 'bg-amber-500 shadow-amber-100',
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl text-white font-bold z-[100] ${styles[type]}`}
    >
      <Icon className="w-5 h-5 shrink-0" strokeWidth={3} />
      <span className="text-sm tracking-tight">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors">
        <X size={14} strokeWidth={3} />
      </button>
    </motion.div>
  );
}

// 2. Hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // useCallback ашиглах нь reload болохоос сэргийлнэ
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const ToastContainer = useCallback(() => (
    <AnimatePresence>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AnimatePresence>
  ), [toast, hideToast]);

  return { showToast, ToastContainer };
}