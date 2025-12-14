const CACHE_NAME = "prodi-si-ubp-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/tentang.html",
  "/kurikulum.html",
  "/dosen.html",
  "/kontak.html",
  "/css/reset.css",
  "/css/variables.css",
  "/css/main.css",
  "/css/components.css",
  "/js/main.js",
  "/js/animations.js",
  "/images/logo-ubp.png",
  "/images/logo-fik.png",
  "/images/logo-himasi.png",
  "/images/hero-campus.jpg",
  "/images/himasi-sibootcamp.jpg",
  "/images/himasi-mesi.jpg",
  "/images/himasi-seminar.jpg",
  "/images/himasi-schoolvisit.jpg",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing v3...");
  self.skipWaiting(); // Force activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker & Clean Old Caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating v3...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: NETWORK FIRST, then Cache
// This ensures user always sees latest changes if online.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid network response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        console.log("[Service Worker] Network failed, serving from cache:", event.request.url);
        return caches.match(event.request);
      })
  );
});
