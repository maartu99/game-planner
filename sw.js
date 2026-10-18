// Game Planner - service worker minimo.
// Serve a rendere l'app installabile (su Android i link di invito aprono l'app).
// Rete prima di tutto: si vede sempre la versione più recente; la copia salvata
// si usa solo se manca la connessione.
const CACHE = "gp-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html"])).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok && r.mode === "navigate") { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
});
