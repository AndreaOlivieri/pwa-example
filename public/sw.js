const VERSION = '1.0.2';
const STATIC_CACHE = 'static-v' + VERSION;
const DYNAMIC_CACHE = 'dynamic-v' + VERSION;

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache){
        console.log('[Service Worker] Precaching App Shell', cache)
        cache.addAll([
          '/',
          '/src/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          'src/css/app.css',
          'src/css/feed.css',
          'src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList){
        return Promise.all(
          keyList.filter(key => key !== DYNAMIC_CACHE && key !== STATIC_CACHE)
            .map(key => caches.delete(key))
        );
      })
  )
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request).then(function(res) {
          return caches.open(DYNAMIC_CACHE)
            .then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res
            })
        }).catch(function(err) {

        });
      })
  );
});