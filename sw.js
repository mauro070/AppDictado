const CACHE = 'grabar-notas-v5';

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

// Network-first: online siempre trae lo último; offline sirve la copia cacheada.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return; // no cachear los POST al Apps Script
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const net = await fetch(e.request);
        cache.put(e.request, net.clone());
        return net;
      } catch (_) {
        const cached = await cache.match(e.request);
        return cached || Response.error();
      }
    })
  );
});
