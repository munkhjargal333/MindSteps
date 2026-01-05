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

// СУПЕР САЙЖРУУЛАЛТ: Stale-While-Revalidate стратеги
self.addEventListener('fetch', (event) => {
  // Зөвхөн GET хүсэлтийг кэшлэнэ (API post-уудыг кэшлэхгүй)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // Хэрэв сүлжээний хариу амжилттай бол кэшийг шинэчилнэ
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Сүлжээгүй үед кэшээс хайх (Fallback)
          return cachedResponse;
        });

        // Кэшид байгаа бол шууд үзүүлнэ, үгүй бол сүлжээг хүлээнэ
        return cachedResponse || fetchedResponse;
      });
    })
  );
});