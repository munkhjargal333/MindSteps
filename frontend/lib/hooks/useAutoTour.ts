// lib/hooks/useAutoTour.ts
'use client';

import { useEffect } from 'react';
import { useTour, TourType } from '@/context/TourContext';

/**
 * Автоматаар tour эхлүүлэх hook
 * Хэрэв хэрэглэгч тухайн tour-г үзээгүй бол автоматаар эхлүүлнэ
 */
export function useAutoTour(tourType: TourType, delay = 500) {
  const { startTour, hasSeenTour } = useTour();

  useEffect(() => {
    // Хуудас бүрэн ачаалагдсаны дараа шалгах
    const timer = setTimeout(() => {
      if (!hasSeenTour(tourType)) {
        startTour(tourType);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [tourType, startTour, hasSeenTour, delay]);
}