const CACHE_NAME = '360-viewer-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/scripts/scripts.js',
  'https://aframe.io/releases/1.6.0/aframe.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js',
  // Add all your 360 image URLs here
  'assets/img/360ftot.jpg',
  'assets/img/image1.jpg',
  'assets/img/image2.jpg',
  'assets/img/image3.jpg',
  'assets/img/mclogo.png'
];

// Install the service worker and cache all specified assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept network requests and serve cached files when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Remove outdated caches during the activation phase
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
