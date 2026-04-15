const CACHE_VERSION = '1.1';
const CACHE_NAME = `solicita-transparencia-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/css/styles.css?v=10',
  '/js/app.js',
  '/js/validaciones.js',
  '/js/mailGenerator.js',
  '/js/uiHelpers.js',
  '/data/municipios.json',
  '/data/tipos_informacion.json'
  ,
  '/version.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Error cacheando:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache.startsWith('solicita-transparencia-')) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
