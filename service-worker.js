const CACHE_NAME = "prodi-si-ubp-v2";
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
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching files");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("[Service Worker] Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[Service Worker] Installation failed:", error);
      })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch Strategy: Cache First, then Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return cachedResponse;
      }

      console.log("[Service Worker] Fetching from network:", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone response
          const responseToCache = response.clone();

          // Cache new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("[Service Worker] Fetch failed:", error);
          // Return offline page if available
          return caches.match("/offline.html");
        });
    })
  );
});
