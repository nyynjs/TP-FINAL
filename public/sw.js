// Service Worker for TourPlanner PWA
const CACHE_NAME = 'tourplanner-v2'; // Zwiększona wersja
const urlsToCache = [
    '/',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/debug.html'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Cache opened');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                // Aktywuj nowy Service Worker natychmiast
                return self.skipWaiting();
            })
    );
});

// Fetch event - POPRAWKA: NIE cache'uj API requests!
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // NIE cache'uj żadnych requestów API
    if (url.pathname.startsWith('/api/') || 
        url.pathname.includes('tourplanner') ||
        event.request.method !== 'GET') {
        console.log('🌐 API request - fetching from network:', url.pathname);
        // Zawsze pobieraj z sieci dla API
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Dla statycznych zasobów - spróbuj cache, potem sieć
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('📦 Serving from cache:', url.pathname);
                    return response;
                }
                
                console.log('🌐 Fetching from network:', url.pathname);
                return fetch(event.request)
                    .then((response) => {
                        // Cache tylko udane odpowiedzi
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    });
            })
            .catch((error) => {
                console.error('❌ Fetch error:', error);
                // Zwróć podstawową stronę offline jeśli dostępna
                return caches.match('/');
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activated');
            // Przejmij kontrolę nad wszystkimi klientami natychmiast
            return self.clients.claim();
        })
    );
});
