// ============================================
// Service Worker - SolicitaTransparencia
// Versión dinámica con activación inmediata
// ============================================

// Versión del cache - CAMBIA ESTE NÚMERO CADA VEZ QUE SUBAS CAMBIOS
const CACHE_VERSION = 'v4';
const CACHE_NAME = `solicita-transparencia-${CACHE_VERSION}`;

const urlsToCache = [
  '/solicitatransparencia/',
  '/solicitatransparencia/index.html',
  '/solicitatransparencia/404.html',
  '/solicitatransparencia/css/styles.css',
  '/solicitatransparencia/js/app.js',
  '/solicitatransparencia/js/validaciones.js',
  '/solicitatransparencia/js/mailGenerator.js',
  '/solicitatransparencia/js/uiHelpers.js',
  '/solicitatransparencia/data/municipios.json',
  '/solicitatransparencia/data/tipos_informacion.json'
];

// Instalación: cachear archivos y forzar activación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`Cache ${CACHE_NAME} instalado`);
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error cacheando archivos:', err))
  );
  // Forzar que el nuevo SW tome el control inmediatamente
  self.skipWaiting();
});

// Activación: eliminar caches viejos y tomar control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache.startsWith('solicita-transparencia-')) {
            console.log('Eliminando cache antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Tomar control de todos los clientes abiertos
      return self.clients.claim();
    })
  );
});

// Estrategia: Network first con fallback a cache
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
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
