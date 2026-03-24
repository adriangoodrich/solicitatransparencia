// ============================================
// Service Worker - SolicitaTransparencia v9
// Actualización automática con recarga forzada
// ============================================

// Versión manual - CAMBIAR CADA VEZ QUE SUBAS CAMBIOS
const CACHE_VERSION = 'v9';
const CACHE_NAME = `solicita-transparencia-${CACHE_VERSION}`;

const urlsToCache = [
  '/solicitatransparencia/',
  '/solicitatransparencia/index.html',
  '/solicitatransparencia/404.html',
  '/solicitatransparencia/css/styles.css?v=9',
  '/solicitatransparencia/js/app.js',
  '/solicitatransparencia/js/validaciones.js',
  '/solicitatransparencia/js/mailGenerator.js',
  '/solicitatransparencia/js/uiHelpers.js',
  '/solicitatransparencia/data/municipios.json',
  '/solicitatransparencia/data/tipos_informacion.json'
];

// Instalación: cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`Cache ${CACHE_NAME} instalado`);
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error cacheando:', err))
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación: eliminar caches viejos y recargar todos los clientes
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
      // Tomar control de todos los clientes
      return self.clients.claim();
    })
  );
});

// Estrategia: Network first
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

// Mensaje para forzar recarga desde el cliente
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
  