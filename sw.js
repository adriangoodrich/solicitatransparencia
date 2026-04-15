// ============================================
// SERVICE WORKER AUTO-REPARABLE
// ============================================
const VERSION = '2.0.2';
const CACHE_NAME = `app-v${VERSION}`;

// ============================================
// INSTALACIÓN - Con fallback inteligente
// ============================================
self.addEventListener('install', event => {
  console.log(`[SW] Instalando v${VERSION}`);
  
  // Forzar activación inmediata
  event.waitUntil(self.skipWaiting());
  
  // Intentar cachear archivos, pero sin bloquear si falla
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]).catch(err => {
        console.warn('[SW] Cache parcial completado:', err);
      });
    })
  );
});

// ============================================
// ACTIVACIÓN - Limpieza automática
// ============================================
self.addEventListener('activate', event => {
  console.log(`[SW] Activando v${VERSION}`);
  
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Limpiando caché: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Tomar control de todas las pestañas
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH - Primero red, luego caché
// ============================================
self.addEventListener('fetch', event => {
  // No interceptar peticiones a Netlify (evita loops)
  if (event.request.url.includes('netlify')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guardar en caché para offline
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en caché
        return caches.match(event.request);
      })
  );
});

// ============================================
// AUTO-REPARACIÓN: Detecta bucles infinitos
// ============================================
let reloadCount = 0;
const MAX_RELOADS = 3;

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'checkReloadLoop') {
    reloadCount++;
    if (reloadCount > MAX_RELOADS) {
      // Limpiar todo y empezar de cero
      console.log('[SW] Bucle detectado, limpiando...');
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
      reloadCount = 0;
    }
  }
});
