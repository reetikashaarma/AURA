// Service Worker for AURA Offline SOS Support
const CACHE_NAME = 'aura-sos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sos.html',
  '/contacts.html',
  '/style.css',
  '/script.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background Sync for SOS alerts
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sos-alerts') {
    event.waitUntil(syncSOSAlerts());
  }
});

// Sync pending SOS alerts when online
async function syncSOSAlerts() {
  try {
    // Get pending alerts from IndexedDB
    const db = await openDB();
    const alerts = await getPendingAlerts(db);
    
    for (const alert of alerts) {
      try {
        const response = await fetch('/api/sos/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(alert)
        });
        
        if (response.ok) {
          // Mark as sent
          await markAlertAsSent(db, alert.id);
        }
      } catch (error) {
        console.error('Error syncing alert:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncSOSAlerts:', error);
  }
}

// IndexedDB helper functions
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('aura-sos-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('alerts')) {
        const objectStore = db.createObjectStore('alerts', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('sent', 'sent', { unique: false });
      }
    };
  });
}

function getPendingAlerts(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['alerts'], 'readonly');
    const store = transaction.objectStore('alerts');
    const index = store.index('sent');
    const request = index.getAll(false);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function markAlertAsSent(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['alerts'], 'readwrite');
    const store = transaction.objectStore('alerts');
    const request = store.get(id);
    
    request.onsuccess = () => {
      const alert = request.result;
      if (alert) {
        alert.sent = true;
        store.put(alert);
      }
      resolve();
    };
    
    request.onerror = () => reject(request.error);
  });
}

