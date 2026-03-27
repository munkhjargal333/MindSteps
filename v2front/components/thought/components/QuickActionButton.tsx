'use client';

import { ArrowRight, Lock } from 'lucide-react';
import type { QuickActionType } from '@/types/types';
import { cn } from '@/lib/utils';

interface QuickActionButtonProps {
  action: {
    type: QuickActionType;
    icon: any;
    label: string;
    sub: string;
    color: string;
    bg: string;
  };
  onSelect?: (type: QuickActionType) => void;
  onUpgrade?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  showArrow?: boolean;
  className?: string;
}

export function QuickActionButton({ 
  action, 
  onSelect, 
  onUpgrade,
  disabled = false,
  variant = 'default',
  showArrow = true,
  className = ''
}: QuickActionButtonProps) {

  const Icon = action.icon;

  const isDisabled = disabled || !onSelect;

  const variants = {
    default: {
      button: "group relative flex flex-col items-start p-5 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-border shadow-sm transition-all text-left overflow-hidden",
      iconContainer: `p-3 rounded-2xl mb-4 transition-transform ${action.bg} ${action.color}`,
      iconSize: 22,
      label: "font-bold text-sm leading-tight",
      sub: "text-[11px] text-muted-foreground mt-1.5 leading-snug"
    },
    compact: {
      button: `group flex flex-col items-start p-5 rounded-[2.5rem] text-left border transition-all min-h-[160px] relative overflow-hidden ${className}`,
      iconContainer: `p-3 rounded-2xl mb-4 transition-transform bg-white/90 dark:bg-black/20 ${action.color} shadow-sm`,
      iconSize: 24,
      label: `text-sm font-bold leading-tight ${action.color}`,
      sub: "text-[10px] text-muted-foreground/80 leading-snug font-medium"
    }
  };

  const style = variants[variant];

  return (
    <button
      onClick={() => {
        if (isDisabled) {
          onUpgrade?.()
          return
        }
        onSelect?.(action.type)
      }}
      className={cn(
        style.button,

        // 🎨 ACTIVE
        !isDisabled && [
          action.bg,
          'hover:border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.95]'
        ],

        // 🔒 DISABLED
        isDisabled && [
          'bg-muted/30 border-dashed border-border',
          'opacity-60 grayscale',
          'cursor-not-allowed'
        ]
      )}
    >
      {/* 🔒 LOCK BADGE */}
      {isDisabled && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
          <Lock size={10} />
          Pro
        </div>
      )}

      <div className={cn(
        style.iconContainer,
        !isDisabled && 'group-hover:scale-110 group-hover:rotate-3'
      )}>
        <Icon size={style.iconSize} />
      </div>
      
      <div className="space-y-1">
        <div className={style.label}>
          {action.label}
        </div>
        <div className={style.sub}>
          {action.sub}
        </div>
      </div>

      {/* 👉 Arrow зөвхөн active үед */}
      {showArrow && !isDisabled && (
        <ArrowRight
          size={14}
          className="absolute bottom-5 right-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all"
        />
      )}

      {/* background icon */}
      {variant === 'compact' && (
        <Icon
          size={40}
          className={cn(
            "absolute -bottom-2 -right-2 opacity-5 rotate-12",
            action.color
          )}
        />
      )}
    </button>
  );
}