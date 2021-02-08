const STATIC_CACHE = "Static cache v-1";
const DYNAMIC_CACHE = "Dynamic cache v-1";
const urls = [
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "/static/js/vendors~main.chunk.js",
  "/images/logo.png",
  "/manifest.json",
  "offline.html",
];
const self = this;

const limiter = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) cache.delete(keys[0]).then(limiter(name, size));
    });
  });
};

//install sw
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(urls)));
});

// activate sw
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// listen for request
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(e.request).then((fetchRes) => {
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(e.request.url, fetchRes.clone());
              limiter(DYNAMIC_CACHE, 20);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        // if (e.request.url.indexOf(".html") > -1)
        return caches.match("offline.html");
      })
  );
});
