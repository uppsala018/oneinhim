const VERSION = "logos-legacy-v7";
const SHELL_CACHE = `${VERSION}-shell`;
const PAGE_CACHE = `${VERSION}-pages`;
const API_CACHE = `${VERSION}-api`;
const ASSET_CACHE = `${VERSION}-assets`;

const SHELL_URLS = [
  "/",
  "/library",
  "/library/kjv",
  "/library/catholic",
  "/library/catechism",
  "/library/fathers",
  "/library/history",
  "/library/notes",
  "/library/catholic/john-prologue",
  "/library/catholic/annunciation-luke-1",
  "/library/catholic/matthew-16-keys",
  "/library/fathers/ignatius-antioch",
  "/library/fathers/justin-martyr",
  "/library/fathers/athanasius",
  "/library/history/nicaea",
  "/library/history/great-schism",
  "/library/history/reformation",
  "/manifest.webmanifest",
  "/assets/art/catholic-icon.png",
];

async function cacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  await cache.addAll(SHELL_URLS);
}

async function cleanupCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => !key.startsWith(VERSION))
      .map((key) => caches.delete(key)),
  );
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response && response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    if (request.mode === "navigate") {
      return (
        (await caches.match(request.url)) ||
        (await caches.match("/library")) ||
        (await caches.match("/"))
      );
    }

    return new Response("Offline", {
      status: 503,
      statusText: "Offline",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;

  if (networkResponse) {
    return networkResponse;
  }

  return new Response("Offline", {
    status: 503,
    statusText: "Offline",
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await cleanupCaches();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/api/kjv/") ||
    url.pathname.startsWith("/api/strongs/") ||
    url.pathname.startsWith("/api/catholic/")
  ) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});
