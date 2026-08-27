/* Offline-first cache for LOVE. IndexedDB data is untouched by
   this cache — it only makes the app shell load with no network. */
const CACHE = 'love-shell-v1';
const ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css',
  './js/db.js', './js/time.js', './js/verses.js', './js/location.js',
  './js/vocabulary.js', './js/record.js',
  './js/views/time-view.js', './js/views/matter-view.js', './js/views/space-view.js',
  './js/views/fetch-view.js', './js/views/analyse-view.js', './js/views/export-view.js',
  './js/views/settings-view.js', './js/app.js',
  './icons/icon-192.svg', './icons/icon-512.svg', './icons/favicon.svg'
];

self.addEventListener('install', (event)=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});
self.addEventListener('fetch', (event)=>{
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      return fetch(event.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(cache=> cache.put(event.request, copy));
        return res;
      }).catch(()=> caches.match('./index.html'));
    })
  );
});
