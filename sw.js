/* Self-removing service worker.
   Offline caching kept serving stale and truncated copies of the
   site, so this worker now does one job: wipe every cache, unregister
   itself, and reload any open window. Once a browser fetches this
   file, that device heals itself and goes straight to the network
   from then on. There is deliberately no fetch handler. */

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map(k => caches.delete(k)))
    await self.registration.unregister()
    const windows = await self.clients.matchAll({ type: 'window' })
    windows.forEach(w => w.navigate(w.url))
  })())
})
