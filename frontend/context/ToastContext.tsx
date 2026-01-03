'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
  // type болон duration-ийг заавал биш (optional) болголоо
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; duration: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default утгуудыг энд зааж өгсөн: type = 'success', duration = 4000
  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 4000) => {
    setToast(null);
    // Маш богино хугацааны дараа шинээр гарч ирэх нь анимейшн гацахгүй байх нөхцөл болдог
    setTimeout(() => {
      setToast({ message, type, duration });
    }, 5);
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
                exit={{ opacity: 0, scale: 0.95, x: "-50%", transition: { duration: 0.15 } }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                style={{
                  position: 'fixed',
                  left: '50%',
                  bottom: '60px',
                  width: 'min(420px, 92%)',
                  pointerEvents: 'auto',
                  transition: 'none', 
                }}
                className={`
                  flex flex-col rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                  border border-black/5 overflow-hidden
                  ${
                    toast.type === 'success' ? 'bg-[#f0fdf4]' : 
                    toast.type === 'error' ? 'bg-[#fef2f2]' : 
                    'bg-[#fffbeb]'
                  }
                `}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="shrink-0">
                    {toast.type === 'success' && <CheckCircle size={26} className="text-emerald-600" />}
                    {toast.type === 'error' && <AlertCircle size={26} className="text-rose-600" />}
                    {toast.type === 'warning' && <AlertTriangle size={26} className="text-amber-600" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-black leading-snug">
                      {toast.message}
                    </p>
                  </div>

                  <button 
                    onClick={hideToast}
                    className="p-2 -mr-1 hover:bg-black/5 active:bg-black/10 rounded-full transition-colors text-black/40"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Progress Bar - Доод талын анимейшн зураас */}
                <div className="h-[4px] w-full bg-black/[0.03]">
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