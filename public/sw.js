// Lets the site be installed. It caches nothing, so a new version of the site
// is never held back by an old copy.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
