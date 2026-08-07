/* BRUTOS — Service Worker
   Estratégias:
   - navegação (HTML): network-first, cai para o cache quando offline
   - assets próprios: cache-first (stale-while-revalidate em segundo plano)
   - fontes Google: cache-first em cache separado
   - telemetria (/_vercel/insights): nunca cacheada
   Ao alterar arquivos do site, suba o VERSION para invalidar o cache antigo. */

const VERSION = 'v1';
const APP_CACHE = `brutos-app-${VERSION}`;
const FONT_CACHE = `brutos-fonts-${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/BRUTOS.png',
  '/aa.png',
  '/truck-showcase.jpg',
  '/brt-favicon-lp.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      // addAll é atômico: um 404 aborta tudo. Adiciona item a item para
      // tolerar arquivo ausente sem quebrar a instalação.
      .then((cache) => Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== APP_CACHE && k !== FONT_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isFontRequest(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Analytics da Vercel sempre direto da rede.
  if (url.pathname.startsWith('/_vercel/')) return;

  // Fontes: cache-first, cache próprio (sobrevive a troca de VERSION do app).
  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(req).then((hit) =>
          hit || fetch(req).then((res) => {
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
            return res;
          }).catch(() => hit)
        )
      )
    );
    return;
  }

  // Só lidamos com o próprio domínio daqui em diante.
  if (url.origin !== self.location.origin) return;

  // Navegação: network-first para pegar atualizações, cache como fallback offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_CACHE).then((cache) => cache.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/index.html')))
    );
    return;
  }

  // Demais assets: cache-first com revalidação em segundo plano.
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(APP_CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
