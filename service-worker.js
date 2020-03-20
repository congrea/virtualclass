const FILES_TO_CACHE = [
    './css/modules/test.css',
  ];

const CACHE_NAME = 'pages-cache-v1';

self.addEventListener('install', (event) => {
    console.log('Inside the install handler:', event);
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(FILES_TO_CACHE);
        })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Inside the activate handler:', event);
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Inside the fetch handler:', event);
    event.respondWith(event.request);
    // event.respondWith(
    //   caches.match(event.request)
    //   .then(response => {
    //     if (response) {
    //       console.log('Found ', event.request.url, ' in cache');
    //       return response;
    //     }
    //     console.log('Network request for ', event.request.url);
    //     return fetch(event.request)
  
    //     .then(response => {
    //       // TODO 5 - Respond with custom 404 page
    //       return caches.open(CACHE_NAME).then(cache => {
    //         cache.put(event.request.url, response.clone());
    //         return response;
    //       });
    //     });
  
    //   }).catch(error => {
  
    //     // TODO 6 - Respond with custom offline page
  
    //   })
    // );
  });


