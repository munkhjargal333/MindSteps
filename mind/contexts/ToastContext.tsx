'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; duration: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- ТОСТЫГ АВТОМАТААР ХААХ ЛОГИК ---
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration);

      // Шинэ тост ирэх эсвэл компонент устхад хуучин таймерыг цэвэрлэнэ
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000) => {
    // Өмнөх тостыг шууд хаагаад шинийг гаргах (Reset)
    setToast(null);
    setTimeout(() => {
      setToast({ message, type, duration });
    }, 10);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 999999 }}>
          <AnimatePresence mode="wait">
            {toast && (
              <motion.div
                key={toast.message}
                initial={{ opacity: 0, y: 30, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%", transition: { duration: 0.2 } }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 350,
                }}
                style={{
                  position: 'fixed',
                  left: '50%',
                  top: '60px', // БАЙРШИЛ: Дээрээс 40px зайтай
                  width: 'min(400px, 90%)',
                  pointerEvents: 'auto',
                }}
                className={`
                  flex flex-col rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  border border-black/5 overflow-hidden
                  ${
                    toast.type === 'success' ? 'bg-white' : 
                    toast.type === 'error' ? 'bg-[#fef2f2]' : 
                    'bg-[#fffbeb]'
                  }
                `}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="shrink-0">
                    {toast.type === 'success' && (
                      <div className="bg-emerald-100 p-1.5 rounded-full">
                        <CheckCircle size={22} className="text-emerald-600" strokeWidth={3} />
                      </div>
                    )}
                    {toast.type === 'error' && (
                      <div className="bg-rose-100 p-1.5 rounded-full">
                        <AlertCircle size={22} className="text-rose-600" strokeWidth={3} />
                      </div>
                    )}
                    {toast.type === 'warning' && (
                      <div className="bg-amber-100 p-1.5 rounded-full">
                        <AlertTriangle size={22} className="text-amber-600" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-900 leading-snug">
                      {toast.message}
                    </p>
                  </div>

                  <button 
                    onClick={hideToast}
                    className="p-1.5 hover:bg-black/5 active:bg-black/10 rounded-full transition-colors text-black/30"
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Progress Bar Animation */}
                <div className="h-[3px] w-full bg-black/[0.05]">
                  <motion.div 
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: toast.duration / 1000, ease: "linear" }}
                    style={{ originX: 0 }}
                    className={`h-full ${
                      toast.type === 'success' ? 'bg-emerald-500' : 
                      toast.type === 'error' ? 'bg-rose-500' : 
                      'bg-amber-500'
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useGlobalToast must be used within ToastProvider');
  return context;
};