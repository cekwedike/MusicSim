// Service Worker for MusicSim PWA
const CACHE_NAME = 'musicsim-v1';
const API_CACHE = 'musicsim-api-v1';

// Assets to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Vite will bundle these, so we'll cache the built files dynamically
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache POST, PUT, DELETE requests - only GET requests can be cached
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Don't cache external API requests (different origin)
  if (url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api')) {
    // Network first for API calls
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses only
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Cache first for assets, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background sync for offline saves (when connection restored)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-saves') {
    console.log('[SW] Syncing offline saves...');
    event.waitUntil(syncOfflineSaves());
  }
});

async function syncOfflineSaves() {
  // Get offline saves from IndexedDB and sync to backend
  // This will be implemented in the next step
  console.log('[SW] Sync completed');
}