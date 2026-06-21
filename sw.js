const CACHE_NAME = 'komando-packing-cache-v1';
const assets = [
  'index.html',
  'https://unpkg.com/html5-qrcode'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
