import { Sunrise } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
        
        {/* MindSteps Minimal Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer transition-opacity hover:opacity-80">
          {/* Sunrise Icon - Одоо илүү цэвэрхэн */}
          <Sunrise className="w-6 h-6 text-orange-500" strokeWidth={2.5} />

          <span className="text-[17px] font-bold tracking-tight text-foreground">
            MindSteps
          </span>
        </div>

        {/* Minimal Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}