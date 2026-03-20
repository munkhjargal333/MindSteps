'use client';

import { useEffect, useState } from 'react';

interface LessonProgressProps {
  lessonId: number;
  onProgressUpdate?: (progress: number) => void;
}

export default function LessonProgress({ lessonId, onProgressUpdate }: LessonProgressProps) {
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const totalScroll = documentHeight - windowHeight;
      const currentProgress = Math.min(Math.round((scrollTop / totalScroll) * 100), 100);
      
      setScrollProgress(currentProgress);
      setProgress(currentProgress);
      
      if (onProgressUpdate) {
        onProgressUpdate(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgressUpdate]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {progress > 0 && (
        <div className="absolute top-2 right-4 bg-white shadow-lg rounded-full px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200">
          {progress}%
        </div>
      )}
    </div>
  );
}