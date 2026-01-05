const CACHE_NAME = 'mindful-v' + new Date().getTime(); // Кэш нэрийг цаг хугацаагаар ялгах
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Хуучин кэшүүдийг шууд устгах
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 1. Зөвхөн GET хүсэлтийг кэшлэнэ
  if (event.request.method !== 'GET') return;

  // 2. chrome-extension гэх мэт дэмжигдээгүй протоколуудыг алгасах (ЭНЭ ХЭСЭГ АЛДААГ ЗАСНА)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // Хэрэв хариу зөв (status 200) байвал кэшлэх
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          return cachedResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});