self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cache-v1')
      .then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js'
        ]);
      })
  );
});