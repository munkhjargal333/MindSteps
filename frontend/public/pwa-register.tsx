'use client';
import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered with scope:', registration.scope);

          // Шинэ хувилбар (update) байгаа эсэхийг шалгах
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Шинэ контент (CSS, JS) бэлэн болсон тул хуудсыг шинэчилнэ
                  console.log('Шинэ хувилбар олдлоо. Хуудсыг дахин ачаалж байна...');
                  window.location.reload();
                } else {
                  // Анх удаа сууж байгаа үед
                  console.log('Контент кэшлэгдлээ. Офлайн горимд ажиллах боломжтой.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Хэрэв Service Worker өөрөө өөрийгөө шинэчилсэн бол хуудсыг reload хийх
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