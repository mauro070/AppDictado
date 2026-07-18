const CACHE = 'grabar-notas-v5';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;                         // no cachear POST al script
  if (new URL(e.request.url).origin !== location.origin) return;  // no cachear terceros
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    try {
      const net = await fetch(e.request);
      cache.put(e.request, net.clone());
      return net;
    } catch (_) {
      return (await cache.match(e.request)) || Response.error();
    }
  }));
});
