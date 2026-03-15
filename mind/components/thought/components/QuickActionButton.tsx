// components/quick-action-button.tsx
'use client';

import { ArrowRight } from 'lucide-react';
import type { QuickActionType } from '../../../types/types';

interface QuickActionButtonProps {
  action: {
    type: QuickActionType;
    icon: any;
    label: string;
    sub: string;
    color: string;
    bg: string;
  };
  onSelect: (type: QuickActionType) => void;
  variant?: 'default' | 'compact';
  showArrow?: boolean;
  className?: string;
}

export function QuickActionButton({ 
  action, 
  onSelect, 
  variant = 'default',
  showArrow = true,
  className = ''
}: QuickActionButtonProps) {
  const Icon = action.icon;
  
  const variants = {
    default: {
      button: "group relative flex flex-col items-start p-5 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-border shadow-sm hover:shadow-md active:scale-95 transition-all text-left overflow-hidden",
      iconContainer: `p-3 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform ${action.bg} ${action.color}`,
      iconSize: 22,
      label: "font-bold text-sm leading-tight",
      sub: "text-[11px] text-muted-foreground mt-1.5 leading-snug"
    },
    compact: {
      button: `group flex flex-col items-start p-5 rounded-[2.5rem] text-left border border-transparent hover:border-border hover:shadow-md active:scale-[0.95] transition-all min-h-[160px] relative overflow-hidden ${action.bg} ${className}`,
      iconContainer: `p-3 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform bg-white/90 dark:bg-black/20 ${action.color} shadow-sm`,
      iconSize: 24,
      label: `text-sm font-bold leading-tight ${action.color}`,
      sub: "text-[10px] text-muted-foreground/80 leading-snug font-medium"
    }
  };

  const style = variants[variant];

  return (
    <button
      onClick={() => onSelect(action.type)}
      className={style.button}
    >
      <div className={style.iconContainer}>
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

      {showArrow && (
        <ArrowRight size={14} className="absolute bottom-5 right-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      )}

      {variant === 'compact' && (
        <Icon size={40} className={`absolute -bottom-2 -right-2 opacity-5 ${action.color} rotate-12`} />
      )}
    </button>
  );
}