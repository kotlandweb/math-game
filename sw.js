// Cache pavadinimas (pakeitus versiją, bus sukurta nauja talpykla).
const CACHE = "math-game-v1";

// Failai, kurie bus įrašomi į cache offline veikimui.
const ASSETS = [
  "/math-game/",
  "/math-game/index.html",
  "/math-game/style.css",
  "/math-game/main.js",
  "/math-game/manifest.webmanifest",
  "/math-game/icon-192.png",
  "/math-game/icon-512.png"
];

// Install įvykis: iš anksto užkrauname visus svarbius failus.
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Activate įvykis: išvalome senas cache versijas.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Fetch įvykis: pirmiausia bandom rasti cache, jei nėra - imam iš tinklo.
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
