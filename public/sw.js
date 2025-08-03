const CACHE_NAME = 'first-translate-v4';
const STATIC_CACHE = 'static-v4';
const DATA_CACHE = 'data-v4';

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/data/translations.json'
];

// Install event - cache all necessary resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static files');
        return cache.addAll(urlsToCache);
      }),
      caches.open(DATA_CACHE).then((cache) => {
        console.log('Caching translation data');
        return cache.add('/data/translations.json');
      })
    ])
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (request.mode === 'navigate') {
    // For navigation requests, try cache first, then network
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              return caches.match('/');
            });
        })
    );
  } else if (url.pathname.includes('/data/translations.json')) {
    // For translation data, cache first
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving translations from cache');
            return cachedResponse;
          }
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(DATA_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              console.log('Failed to fetch translations, returning cached version');
              return caches.match(request);
            });
        })
    );
  } else if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
    // For static assets, try network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    // For other requests, try network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 