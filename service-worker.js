
const CACHE_NAME = 'asistencia-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles.css',
  '/src/app.js',
  '/src/ui.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});


// Estrategia offline-first robusta
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then(networkResponse => {
          // Solo cachear GET y respuestas válidas
          if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si no hay red y no está en cache, mostrar fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          if (event.request.destination === 'script') {
            return caches.match('/src/app.js');
          }
          if (event.request.destination === 'style') {
            return caches.match('/src/styles.css');
          }
          if (event.request.destination === 'image') {
            return caches.match('/icons/icon-192.png');
          }
          // Si no hay nada, responde con un error genérico
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
