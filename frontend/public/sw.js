/* ===============================
   Mindful PWA Service Worker
   Safe for Supabase Auth & API
   =============================== */

const CACHE_NAME = 'mindful-static-v1';
const RUNTIME_CACHE = 'mindful-runtime-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.png',
];

// Auth & API замууд - ХЭЗЭЭ Ч кэшлэхгүй
const SKIP_CACHE_PATTERNS = [
  '/api/',
  '/auth/',
  '/_next/data/',
];

/* -------------------------------
   INSTALL
-------------------------------- */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.error('[SW] Cache addAll failed:', err))
  );
});

/* -------------------------------
   ACTIVATE
-------------------------------- */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* -------------------------------
   FETCH
-------------------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // 1️⃣ Зөвхөн GET хүсэлт
  if (method !== 'GET') return;

  const urlObj = new URL(url);

  // 2️⃣ http/https бусдыг алгасах
  if (!urlObj.protocol.startsWith('http')) return;

  // 3️⃣ Same origin биш бол алгасах (CDN, external APIs)
  if (urlObj.origin !== self.location.origin) return;

  const { pathname, search } = urlObj;

  // 🔥 4️⃣ Auth & API замуудыг БҮРЭН алгасах
  const shouldSkipCache = SKIP_CACHE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );

  if (shouldSkipCache) {
    console.log('[SW] Skipping cache for:', pathname);
    return; // Network-өөр шууд явна
  }

  // 🔥 5️⃣ Query параметр агуулсан динамик хуудсуудыг алгасах
  if (search && (search.includes('code=') || search.includes('error='))) {
    console.log('[SW] Skipping dynamic URL:', pathname + search);
    return;
  }

  // 6️⃣ Static assets - Cache First стратеги
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Cache hit:', pathname);
          return cachedResponse;
        }

        // Cache-д байхгүй бол network-өөс татна
        console.log('[SW] Fetching from network:', pathname);
        return fetch(request)
          .then((response) => {
            // Зөвхөн OK response-ийг кэшлэнэ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Runtime cache-д хадгална
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch((err) => console.error('[SW] Cache put failed:', err));

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            // Offline fallback эсвэл cached response буцаах
            return cachedResponse || new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable' 
            });
          });
      })
  );
});