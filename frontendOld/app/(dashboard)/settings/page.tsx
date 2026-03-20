// Example 3: Reset all tours (for testing or settings)
// pages/settings/page.tsx

'use client';

import { useTour } from '@/context/TourContext';

export default function SettingsPage() {
  const { resetTours } = useTour();

  return (
    <div>
      <button onClick={resetTours}>
        Бүх танилцуулгыг дахин үзэх
      </button>
    </div>
  );
}