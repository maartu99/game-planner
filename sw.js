// Game Planner - service worker minimo.
// Serve a rendere l'app installabile (su Android i link di invito aprono l'app).
// Rete prima di tutto: si vede sempre la versione più recente; la copia salvata
// si usa solo se manca la connessione.
const CACHE = "gp-v26";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html"])).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  // La pagina si chiede sempre fresca al sito (senza la copia di 10 minuti del browser)
  const req = r.mode === "navigate" ? new Request(r.url, { cache: "no-cache", credentials: "same-origin" }) : r;
  e.respondWith(fetch(req).then(res => {
    if (res.ok && r.mode === "navigate") { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
});

// Notifiche push (mandate dal controllo automatico su GitHub tramite Firebase Cloud Messaging)
self.addEventListener("push", e => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || j.notification || j; } catch (err) { d = { body: e.data ? e.data.text() : "" }; }
  const title = d.title || "Game Planner";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag || undefined, data: { url: d.url || "./" },
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope) && "focus" in c) { c.navigate ? c.navigate(url).catch(() => {}) : null; return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
