// Smart CBT Progressive Web App (PWA) Service Worker
// Mode Hemat Kuota & Offline Cache Engine for Lab School Wi-Fi Resilience

const CACHE_NAME = 'smart-cbt-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/file.svg',
  '/globe.svg',
  '/window.svg'
];

// 1. Install Event: Cache Core Application Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA SW] Pre-caching application shell...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-caching partial failure, continuing:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Stale-While-Revalidate & Network-First with Offline Fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Jangan tangani non-GET requests (misal POST server action / mutations)
  if (req.method !== 'GET') {
    return;
  }

  // A. Static Assets (_next/static, images, fonts, icons, svg) -> Stale While Revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/i)
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resToCache));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // B. Navigation / HTML Document requests -> Network First, Fallback to Cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.warn('[PWA SW] Offline mode: serving cached document fallback');
          const cached = await caches.match(req);
          if (cached) return cached;
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          return new Response(
            '<html><head><title>Mode Offline - Smart CBT</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body style="background:#0b0f19;color:#fff;font-family:sans-serif;padding:2rem;text-align:center;"><h2>📡 Mode Offline Aktif</h2><p>Koneksi WiFi / internet terputus sementara. Anda tetap dapat melanjutkan ujian melalui cache lokal.</p><button onclick="window.location.reload()" style="background:#2563eb;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;">Coba Muat Ulang</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // C. Fallback default
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
