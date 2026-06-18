const CACHE_NAME = 'v1'; // Ganti nama versi ini (misal v1 ke v2) setiap kali Anda ganti link

self.addEventListener('install', (event) => {
  // Memaksa service worker baru langsung mengambil alih tanpa menunggu aplikasi ditutup
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Membersihkan cache versi lama agar link baru langsung terbaca
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Selalu ambil data langsung dari internet (Network First) agar perubahan link terdeteksi
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
