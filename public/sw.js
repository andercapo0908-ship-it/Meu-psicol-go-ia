const CACHE_NAME = "psicologo-pessoal-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/icon.svg",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css"
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn("[Service Worker] Some assets failed to cache on install:", error);
      });
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting obsolete cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Rede com fallback para Cache
self.addEventListener("fetch", (event) => {
  // Ignorar requisições de API (vêm do backend local/Gemini) e recursos externos que não queremos cachear
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith("/api/") || event.request.method !== "GET") {
    // Apenas repassar requisições de API sem bloquear offline
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta for válida, duplicar para o cache de forma assíncrona
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback: Tentativa de recuperar do Cache offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Caso não esteja no cache e falhe a rede
          return new Response("Você está offline no momento e este recurso ainda não foi salvo em cache.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" })
          });
        });
      })
  );
});
