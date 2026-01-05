'use client';
import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered:', registration.scope);

          // 1. Deployment болгоны дараа шинэчлэлийг шалгах (5 минут тутамд)
          const interval = setInterval(() => {
            registration.update();
          }, 1000 * 60 * 5);

          // 2. Шинэ хувилбар суулгахад бэлэн болсон үед
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Шинэ хувилбар бэлэн болсон тул reload хийнэ
                  // Хэрэглэгчид мэдэгдэл гаргаж байгаад reload хийвэл илүү гоё UX
                  window.location.reload();
                }
              }
            };
          };

          return () => clearInterval(interval);
        } catch (error) {
          console.error('SW registration failed:', error);
        }
      };

      registerSW();

      // Service Worker солигдох үед хуудсыг нэг л удаа reload хийх
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  return null;
}