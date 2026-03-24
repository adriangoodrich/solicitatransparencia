// ============================================
// Service Worker - SolicitaTransparencia
// ============================================

const CACHE_NAME = 'solicita-transparencia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/validaciones.js',
  '/js/mailGenerator.js',
  '/js/uiHelpers.js',
  '/data/municipios.json',
  '/data/tipos_informacion.json'
];

// Instalación: cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error cacheando archivos:', err))
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network first con fallback a cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar la respuesta para cachearla
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Escuchar mensajes del cliente para forzar actualización
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});