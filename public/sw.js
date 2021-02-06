const CACHE_NAME = "Version-1";
const urls = ["index.html", "offline.html"];
const self = this;

//install sw
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urls)));
});

// listen for request
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then(() => fetch(e.request).catch(() => caches.match("offline.html")))
  );
});

// activate sw
self.addEventListener("activate", (e) => {
  let cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);
  e.waitUntil(
    caches.keys().then((names) => {
      Promise.all(
        names.map((name) => {
          if (!cacheWhiteList.includes(name)) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
