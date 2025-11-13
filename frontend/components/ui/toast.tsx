'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

export function Toast({ message, type }: { message: string; type: ToastType }) {
  const bgColor =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-yellow-500';

  const Icon =
    type === 'success'
      ? CheckCircle
      : type === 'error'
      ? AlertCircle
      : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white font-medium z-50 ${bgColor}`}
    >
      <Icon className="w-5 h-5" />
      <span>{message}</span>
    </motion.div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const ToastContainer = () => (
    <AnimatePresence>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </AnimatePresence>
  );

  return { showToast, ToastContainer };
}
