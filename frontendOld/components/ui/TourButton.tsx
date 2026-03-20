import { HelpCircle } from 'lucide-react';
import { useTour, TourType } from '@/context/TourContext';

interface TourButtonProps {
  tourType: TourType;
  className?: string;
  showText?: boolean;
  text?: string;
}

export function TourButton({ tourType, className = '', showText = false, text = 'Дэлгэрэнгүй заавар' }: TourButtonProps) {
  const { startTour } = useTour();

  return (
    <button
      onClick={() => startTour(tourType)}
      className={`
        inline-flex items-center gap-1 transition-all
        ${showText 
          ? 'text-purple-600 hover:text-purple-800 underline decoration-purple-300 hover:decoration-purple-500 underline-offset-2' 
          : 'p-1.5 text-gray-400 hover:text-purple-600'} 
        ${className}
      `}
      title="Хэрхэн ашиглах вэ?"
    >
      {showText && (
        <span className="text-[13px] font-medium">
          {text}
        </span>
      )}
      
      {!showText && (
        <HelpCircle 
          size={18} 
          strokeWidth={3} 
          className="transition-transform hover:rotate-12" 
        />
      )}
    </button>
  );
}