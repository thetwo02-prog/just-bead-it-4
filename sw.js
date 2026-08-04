const CACHE = 'just-bead-it-v3'
const ASSETS = ['./index.html', './manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

// Let the page force an update: navigator.serviceWorker.controller.postMessage('flush')
self.addEventListener('message', e => {
  if (e.data === 'flush') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  }
})

self.addEventListener('fetch', e => {
  const req = e.request

  // Only GET is cacheable — Cache.put() throws on POST/PATCH/DELETE,
  // which every Supabase write would otherwise trigger.
  if (req.method !== 'GET') return

  // Leave cross-origin traffic (Supabase, EmailJS, fonts) to the network.
  if (new URL(req.url).origin !== self.location.origin) return

  // Network-first: always try for the latest, fall back to cache if offline.
  e.respondWith(
    fetch(req).then(res => {
      // Only store good, complete responses. Caching an error page or a
      // truncated file is how a broken copy gets stuck on screen forever.
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone()
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})
      }
      return res
    }).catch(() => caches.match(req))
  )
})
