'use client';

// ─────────────────────────────────────────────────────────────────────────────
// contexts/ToastContext.tsx
// REFACTORED: All colors use design tokens. No bg-white, bg-black/5, etc.
// Toast surfaces use bg-surface; icon badges use semantic color tokens.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ── Token maps for each toast type ────────────────────────────────────────────
const TOAST_STYLES: Record<
  ToastType,
  { wrapper: string; iconWrapper: string; icon: string; bar: string }
> = {
  success: {
    wrapper:     'border-success/20 bg-surface',
    iconWrapper: 'bg-success/15 p-1.5 rounded-full',
    icon:        'text-success',
    bar:         'bg-success',
  },
  error: {
    wrapper:     'border-destructive/20 bg-surface',
    iconWrapper: 'bg-destructive/15 p-1.5 rounded-full',
    icon:        'text-destructive',
    bar:         'bg-destructive',
  },
  warning: {
    wrapper:     'border-primary/20 bg-surface',
    iconWrapper: 'bg-primary/15 p-1.5 rounded-full',
    icon:        'text-primary',
    bar:         'bg-primary',
  },
};

const TOAST_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    duration: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3000) => {
      setToast(null);
      setTimeout(() => setToast({ message, type, duration }), 10);
    },
    []
  );

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 999999 }}>
            <AnimatePresence mode="wait">
              {toast && (() => {
                const styles = TOAST_STYLES[toast.type];
                const Icon   = TOAST_ICONS[toast.type];

                return (
                  <motion.div
                    key={toast.message}
                    initial={{ opacity: 0, y: 30, x: '-50%' }}
                    animate={{ opacity: 1, y: 0,  x: '-50%' }}
                    exit={{
                      opacity: 0, scale: 0.95, y: 20, x: '-50%',
                      transition: { duration: 0.2 },
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    style={{
                      position: 'fixed',
                      left: '50%',
                      top: '60px',
                      width: 'min(400px, 90%)',
                      pointerEvents: 'auto',
                    }}
                    className={cn(
                      'flex flex-col rounded-2xl shadow-xl overflow-hidden border',
                      styles.wrapper
                    )}
                  >
                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Icon */}
                      <div className="shrink-0">
                        <div className={styles.iconWrapper}>
                          <Icon size={22} className={styles.icon} strokeWidth={3} />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-foreground leading-snug">
                          {toast.message}
                        </p>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={hideToast}
                        className="p-1.5 hover:bg-muted active:bg-muted/70 rounded-full transition-colors text-muted-foreground"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="h-[3px] w-full bg-muted">
                      <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                        style={{ originX: 0 }}
                        className={cn('h-full', styles.bar)}
                      />
                    </div>
                  </motion.div>
                );
              })()}
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
