importScripts('/idb.js')


CACHE_VERSION = 'v-0.2'
STATIC_FILES = [
  // '/',
  // '/index.html',
  // '/idb.js',
  // '/static/js/main.chunk.js',
  // 'static/js/bundle.js',
  // '/static/js/1.chunk.js',
  // 'main.f8906d8aa964ebc37280.hot-update.js',
  // 'https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',
];

let dbPromise = idb.open('StoreMon', 1, (db) => {
  if (!db.objectStoreNames.contains('inventar')) {
    db.createObjectStore('inventar', {keyPath: 'invBr'})
  }
});

this.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
});

this.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ....', event);
  return this.clients.claim();
});

this.addEventListener('fetch', (event) => {
  event.respondeWith( event => {
    zaprimkaFetch("9c700a4d2745506f862ebae29c058250ebad2ded").then(data=>{return(data)})
   })
});