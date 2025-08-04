const CACHE_NAME = 'tourplanner-v1.2';
const STATIC_CACHE = 'tourplanner-static-v1.2';
const DATA_CACHE = 'tourplanner-data-v1.2';

// Pliki do cache'owania
const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon.png'
];

// Instalacja Service Worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Instalacja');
    event.waitUntil(
        Promise.all([
            // Cache plików statycznych
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_FILES);
            }),
            // Przygotuj cache dla danych
            caches.open(DATA_CACHE)
        ]).then(() => {
            console.log('✅ Service Worker: Cache przygotowany');
            return self.skipWaiting();
        })
    );
});

// Aktywacja Service Worker
self.addEventListener('activate', event => {
    console.log('🎯 Service Worker: Aktywacja');
    event.waitUntil(
        Promise.all([
            // Wyczyść stare cache
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DATA_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('🗑️ Usuwam stary cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Przejmij kontrolę nad wszystkimi klientami
            self.clients.claim()
        ])
    );
});

// Obsługa żądań sieciowych
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Obsługa plików statycznych
    if (STATIC_FILES.includes(url.pathname)) {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request);
            })
        );
        return;
    }
    
    // Obsługa API TourPlanner
    if (url.pathname.startsWith('/api/tourplanner/')) {
        event.respondWith(handleApiRequest(request));
        return;
    }
    
    // Dla innych żądań - network first
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Obsługa żądań API z cache
async function handleApiRequest(request) {
    const url = new URL(request.url);
    const cacheKey = url.pathname + url.search;
    
    // Dla danych tylko do odczytu (territories, events, points)
    const isReadOnlyData = url.pathname.includes('/list') || 
                          url.pathname.includes('/territory/') ||
                          url.pathname.includes('/event/') ||
                          url.pathname.includes('/point/');
    
    if (isReadOnlyData && request.method === 'POST') {
        return handleCachedApiData(request, cacheKey);
    }
    
    // Dla innych operacji - zawsze sieć
    return fetch(request);
}

// Cache dla danych API z TTL
async function handleCachedApiData(request, cacheKey) {
    const cache = await caches.open(DATA_CACHE);
    const cachedResponse = await cache.match(cacheKey);
    
    // Sprawdź czy cache jest świeży (5 minut)
    if (cachedResponse) {
        const cachedTime = cachedResponse.headers.get('sw-cached-time');
        if (cachedTime) {
            const age = Date.now() - parseInt(cachedTime);
            if (age < 5 * 60 * 1000) { // 5 minut
                console.log('📦 Service Worker: Używam cache dla', cacheKey);
                return cachedResponse;
            }
        }
    }
    
    // Pobierz świeże dane
    try {
        console.log('🌐 Service Worker: Pobieram świeże dane dla', cacheKey);
        const response = await fetch(request);
        
        if (response.ok) {
            // Sklonuj odpowiedź i dodaj timestamp
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-time', Date.now().toString());
            
            const cachedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
            });
            
            // Zapisz w cache
            cache.put(cacheKey, cachedResponse);
        }
        
        return response;
    } catch (error) {
        console.warn('⚠️ Service Worker: Błąd sieci, używam cache dla', cacheKey);
        
        // Jeśli sieć nie działa, użyj starego cache
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background Sync dla offline actions
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync-actions') {
        event.waitUntil(syncPendingActions());
    }
});

// Synchronizuj akcje w tle
async function syncPendingActions() {
    try {
        // Pobierz pending actions z IndexedDB
        const pendingActions = await getPendingActions();
        
        for (const action of pendingActions) {
            try {
                await sendAction(action);
                await removePendingAction(action.id);
                console.log('✅ Zsynchronizowano akcję:', action.id);
            } catch (error) {
                console.warn('❌ Nie udało się zsynchronizować:', action.id, error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Pomocnicze funkcje dla IndexedDB (placeholder)
async function getPendingActions() {
    // TODO: Implementacja IndexedDB
    return [];
}

async function removePendingAction(id) {
    // TODO: Implementacja IndexedDB
}

async function sendAction(action) {
    // TODO: Implementacja wysyłania akcji
}

// Push notifications
self.addEventListener('push', event => {
    console.log('📢 Service Worker: Push notification received');
    
    const options = {
        body: 'Masz nowe powiadomienie z TourPlanner!',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: 'tourplanner-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Otwórz aplikację'
            },
            {
                action: 'dismiss',
                title: 'Zamknij'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.message || options.body;
        options.data = data;
    }
    
    event.waitUntil(
        self.registration.showNotification('TourPlanner Pro', options)
    );
});

// Obsługa kliknięć w powiadomienia
self.addEventListener('notificationclick', event => {
    console.log('👆 Service Worker: Notification clicked');
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic Background Sync (jeśli wspierane)
self.addEventListener('periodicsync', event => {
    console.log('⏰ Service Worker: Periodic sync', event.tag);
    
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    console.log('🔄 Periodic sync: Synchronizuję zawartość...');
    // Możliwość okresowego odświeżania danych w tle
}