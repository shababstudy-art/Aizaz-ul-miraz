const CACHE='ez-almirath-v15';
const CORE=['./','./index.html','./manifest.webmanifest','./privacy.html','./fonts/nastaliq-ar-400.woff2','./fonts/nastaliq-ar-700.woff2','./fonts/nastaliq-lat-400.woff2','./fonts/nastaliq-lat-700.woff2','./fonts/naskh-ar.woff2','./fonts/naskh-lat.woff2','./fonts/inter-lat.woff2','./icons/jamia-logo.png','./icons/icon-192-v2.png','./icons/icon-512-v2.png','./icons/maskable-512-v2.png','./icons/apple-touch-icon-v2.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  // same-origin files and Google Fonts: serve from cache, refresh in background
  if(u.origin===location.origin||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(r).then(hit=>{
      const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}return res;}).catch(()=>hit);
      return hit||net;
    }));
  }
});
