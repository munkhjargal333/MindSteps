'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; duration: number } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 5000) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-4 sm:right-8 flex flex-col min-w-[280px] max-w-[400px] rounded-[1.2rem] shadow-2xl text-white font-bold z-[9999] overflow-hidden ${
              toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-200/40' : 
              toast.type === 'error' ? 'bg-rose-500 shadow-rose-200/40' : 'bg-amber-500 shadow-amber-200/40'
            }`}
          >
            <div className="flex items-center gap-3 px-6 py-4">
              {toast.type === 'success' ? <CheckCircle size={20} strokeWidth={3} /> : 
               toast.type === 'error' ? <AlertCircle size={20} strokeWidth={3} /> : <AlertTriangle size={20} strokeWidth={3} />}
              <div className="flex-1">
                <p className="text-[13px] leading-tight tracking-tight pr-2">{toast.message}</p>
              </div>
              <button onClick={hideToast} className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0">
                <X size={14} strokeWidth={3} />
              </button>
            </div>
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
              className="h-1 bg-white/40 origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useGlobalToast must be used within ToastProvider');
  return context;
};