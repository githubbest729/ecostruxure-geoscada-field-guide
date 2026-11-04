/* Service worker · EcoStruxure Geo SCADA Field Engineering Guide
   Strategy: precache app shell; stale-while-revalidate for same-origin GETs;
   navigation requests fall back to cached index.html, then offline.html.
   Bump VERSION on every release so old caches are purged. */
const VERSION = 'v1.1.0';
const CACHE = 'geo-scada-guide-' + VERSION;

const PRECACHE = [
  './',
  'index.html',
  'offline.html',
  'styles.css',
  'app.js',
  'manifest.webmanifest',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'icons/icon-72.png',
  'icons/icon-96.png',
  'icons/icon-128.png',
  'icons/icon-144.png',
  'icons/icon-152.png',
  'icons/icon-192.png',
  'icons/icon-384.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('geo-scada-guide-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first-ish via stale-while-revalidate on index, offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('index.html', { ignoreSearch: true }).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put('index.html', copy));
            }
            return res;
          })
          .catch(() => null);
        if (cached) { event.waitUntil(network); return cached; }
        return network.then((res) => res || caches.match('offline.html'));
      })
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('offline.html'));
      if (cached) { event.waitUntil(network.catch(() => {})); return cached; }
      return network;
    })
  );
});
