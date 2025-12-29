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
            // Mobile дээр дороосоо, Desktop дээр баруунаас гарч ирнэ
            initial={{ opacity: 0, y: 20, x: 0, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`
              fixed 
              /* 📱 Mobile: Доод цэснээс дээгүүр (bottom-24), хажуу талаасаа 16px зайтай */
              bottom-24 left-4 right-4 
              
              /* 💻 Desktop: Баруун доор байрлал руу шилжинэ */
              md:bottom-8 md:right-8 md:left-auto md:w-[380px]
              
              flex flex-col rounded-[1.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] 
              text-white font-bold z-[9999] overflow-hidden
              ${
                toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                toast.type === 'error' ? 'bg-rose-500 shadow-rose-500/20' : 
                'bg-amber-500 shadow-amber-500/20'
              }
            `}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle size={22} strokeWidth={3} />}
                {toast.type === 'error' && <AlertCircle size={22} strokeWidth={3} />}
                {toast.type === 'warning' && <AlertTriangle size={22} strokeWidth={3} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-tight tracking-tight pr-2 break-words">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={hideToast} 
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Progress Bar Timer */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
              className="h-1 bg-white/30 origin-left"
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