/* SIMRS Enterprise — Service Worker (mode offline PWA)
 * - App shell (index.html, manifest, ikon) disimpan di cache → aplikasi tetap terbuka tanpa internet.
 * - Data TIDAK di-cache di sini: data pasien disimpan aplikasi di IndexedDB & disinkron lewat outbox.
 * - Request ke Apps Script (POST) tidak pernah disentuh SW.
 * Naikkan VERSION setiap kali index.html diperbarui agar pengguna mendapat versi baru.
 */
const VERSION = 'hmis-v2.1.0';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // API POST ke Apps Script → langsung ke jaringan
  const url = new URL(req.url);

  // Halaman: network-first (dapat versi terbaru), fallback cache saat offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Aset statis same-origin & Google Fonts: stale-while-revalidate
  const cacheable = url.origin === self.location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
