// Guarda la página y las portadas para que abra rápido; la música se pide siempre a la red.
const CACHE = 'rojo-aburra-v1';
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "covers/a1.jpg", "covers/a1_500.jpg", "covers/a1_800.jpg", "covers/a2.jpg", "covers/a2_500.jpg", "covers/a2_800.jpg", "covers/a3.jpg", "covers/a3_500.jpg", "covers/a3_800.jpg", "covers/a4.jpg", "covers/a4_500.jpg", "covers/a4_800.jpg"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('.mp3')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
