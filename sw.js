const CACHE='ez-almirath-v5';
const CORE=['./','./index.html','./manifest.webmanifest','./privacy.html','./icons/icon-192-v2.png','./icons/icon-512-v2.png','./icons/maskable-512-v2.png','./icons/apple-touch-icon-v2.png'];
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
