/* Chrome Messenger — Service Worker */

const CACHE_NAME = "chrome-messenger-v1";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./bundle.js?v=1", "./css/style.css?v=1",
  "./icons/icon-192.svg", "./icons/icon-512.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(c){ return c.addAll(ASSETS).catch(function(){}); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(function(c){
    return c || fetch(e.request).catch(function(){ return caches.match("./index.html"); });
  }));
});
