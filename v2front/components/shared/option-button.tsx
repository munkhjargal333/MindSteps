import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptionButtonProps {
  visual: LucideIcon | string; // Дүрс эсвэл Эможи
  label: string;
  subLabel?: string;
  isSelected: boolean;
  onClick: () => void;
  indicator?: "upper" | "lower";
}

export function OptionButton({ 
  visual: Visual, 
  label, 
  subLabel,
  isSelected, 
  onClick,
  indicator
}: OptionButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        // Өндрийг багасгаж (py-2.5), хэвтээ бүтэц рүү (flex-row) шилжүүллээ
        "h-auto py-2.5 px-3 flex flex-row items-center justify-center gap-2 transition-all duration-200 border-2 relative rounded-2xl",
        isSelected 
          ? "border-primary shadow-sm scale-[1.02]" 
          : "border-transparent bg-secondary/30 hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
      )}
    >
      {/* Icon эсвэл Emoji хэсэг */}
      <div className="shrink-0">
        {typeof Visual === 'function' || typeof Visual === 'object' ? (
          <Visual className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
        ) : (
          <span className="text-xl">{Visual}</span>
        )}
      </div>
      
      {/* Текст хэсэг - Зүүн тал руугаа наалдана */}
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[13px] font-bold">{label}</span>
        {subLabel && (
          <span className={cn(
            "text-[9px] opacity-70 font-medium",
            isSelected ? "text-primary-foreground" : "text-muted-foreground"
          )}>
            {subLabel}
          </span>
        )}
      </div>

      {indicator && (
        <span className="absolute -top-1 -right-1 text-[8px]">
          {indicator === 'upper' ? '✨' : ''}
        </span>
      )}
    </Button>
  );
}