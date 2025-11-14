// Offline SOS Handler for AURA
// This module handles SOS alerts when offline using native device capabilities

class OfflineSOSHandler {
  constructor() {
    this.isOnline = navigator.onLine;
    this.dbName = 'aura-sos-db';
    this.dbVersion = 1;
    this.db = null;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingAlerts();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Initialize database
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('alerts')) {
          const objectStore = db.createObjectStore('alerts', { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('sent', 'sent', { unique: false });
        }
        if (!db.objectStoreNames.contains('contacts')) {
          db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  // Check if online
  checkOnlineStatus() {
    return navigator.onLine;
  }

  // Send SOS alert using native device capabilities (works offline)
  async sendOfflineSOS(location, contacts) {
    const timestamp = new Date().toISOString();
    
    // Ensure location is always set - use default location if null
    if (!location) {
      location = {
        lat: 31.261128,
        lng: 75.706897,
        name: 'Lovely Professional University, Jalandhar, Punjab',
        isDefault: true
      };
    }
    
    // Format location text with base location name and coordinates
    const baseLocation = location.baseLocation || location.name || 'Lovely Professional University, Jalandhar, Punjab';
    const locationText = `Location: ${baseLocation}\nGPS Coordinates: ${location.lat}, ${location.lng}\nMap Link: https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    const sosMessage = `🚨 EMERGENCY SOS ALERT 🚨\n\nThis is an emergency SOS alert from AURA.\n\nTime: ${new Date().toLocaleString()}\n${locationText}\n\nPlease respond immediately!`;
    
    const results = {
      sms: [],
      email: [],
      phone: [],
      stored: false
    };

    // Send SMS using native SMS URI (works on mobile devices)
    if (contacts.contact1 && contacts.contact1.phone) {
      results.sms.push(this.sendNativeSMS(contacts.contact1.phone, sosMessage, contacts.contact1.name));
    }
    if (contacts.contact2 && contacts.contact2.phone) {
      results.sms.push(this.sendNativeSMS(contacts.contact2.phone, sosMessage, contacts.contact2.name));
    }
    if (contacts.contact3 && contacts.contact3.phone) {
      results.sms.push(this.sendNativeSMS(contacts.contact3.phone, sosMessage, contacts.contact3.name));
    }

    // Send Email using native mailto URI (opens default email client)
    if (contacts.contact1 && contacts.contact1.email) {
      results.email.push(this.sendNativeEmail(contacts.contact1.email, sosMessage, contacts.contact1.name));
    }
    if (contacts.contact2 && contacts.contact2.email) {
      results.email.push(this.sendNativeEmail(contacts.contact2.email, sosMessage, contacts.contact2.name));
    }
    if (contacts.contact3 && contacts.contact3.email) {
      results.email.push(this.sendNativeEmail(contacts.contact3.email, sosMessage, contacts.contact3.name));
    }

    // Store alert for later sync (if online, also try to send via API)
    const alertData = {
      location: location,
      contacts: contacts,
      timestamp: timestamp,
      message: sosMessage,
      sent: false
    };

    // Store in IndexedDB
    await this.storeAlert(alertData);
    results.stored = true;

    // If online, also try to send via API
    if (this.isOnline) {
      try {
        await this.sendViaAPI(location, contacts);
      } catch (error) {
        console.log('API send failed, alert stored for later sync:', error);
      }
    }

    return results;
  }

  // Send SMS using native SMS URI scheme
  sendNativeSMS(phone, message, contactName) {
    try {
      // Remove any non-digit characters except +
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      const smsUri = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
      
      // Initialize SMS queue if needed
      if (!this.smsQueue) {
        this.smsQueue = [];
        this.smsQueueProcessing = false;
      }
      
      // Add to queue
      this.smsQueue.push({
        uri: smsUri,
        phone: cleanPhone,
        contact: contactName
      });
      
      // Start processing queue if not already processing
      if (!this.smsQueueProcessing) {
        this.processSMSQueue();
      }
      
      return {
        contact: contactName,
        phone: cleanPhone,
        method: 'native-sms',
        success: true,
        note: 'SMS app will open - user needs to send manually'
      };
    } catch (error) {
      return {
        contact: contactName,
        phone: phone,
        method: 'native-sms',
        success: false,
        error: error.message
      };
    }
  }

  // Process SMS queue sequentially
  processSMSQueue() {
    if (!this.smsQueue || this.smsQueue.length === 0) {
      this.smsQueueProcessing = false;
      return;
    }

    this.smsQueueProcessing = true;
    const item = this.smsQueue.shift();
    
    // Create a temporary link to open SMS
    try {
      const link = document.createElement('a');
      link.href = item.uri;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    } catch (error) {
      console.error('Error opening SMS:', error);
      // Fallback: try window.location
      try {
        window.location.href = item.uri;
      } catch (e) {
        console.error('Fallback SMS open also failed:', e);
      }
    }
    
    // Process next item after delay (allows user to send first one)
    if (this.smsQueue.length > 0) {
      setTimeout(() => this.processSMSQueue(), 1500);
    } else {
      this.smsQueueProcessing = false;
    }
  }

  // Send Email using native mailto URI scheme
  sendNativeEmail(email, message, contactName) {
    try {
      const subject = '🚨 EMERGENCY SOS ALERT from AURA';
      const mailtoUri = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      
      // Initialize email queue if needed
      if (!this.emailQueue) {
        this.emailQueue = [];
        this.emailQueueProcessing = false;
      }
      
      // Add to queue
      this.emailQueue.push({
        uri: mailtoUri,
        email: email,
        contact: contactName
      });
      
      // Start processing queue if not already processing
      if (!this.emailQueueProcessing) {
        this.processEmailQueue();
      }
      
      return {
        contact: contactName,
        email: email,
        method: 'native-email',
        success: true,
        note: 'Email client will open - user needs to send manually'
      };
    } catch (error) {
      return {
        contact: contactName,
        email: email,
        method: 'native-email',
        success: false,
        error: error.message
      };
    }
  }

  // Process email queue sequentially
  processEmailQueue() {
    if (!this.emailQueue || this.emailQueue.length === 0) {
      this.emailQueueProcessing = false;
      return;
    }

    this.emailQueueProcessing = true;
    const item = this.emailQueue.shift();
    
    // Create a temporary link to open email
    try {
      const link = document.createElement('a');
      link.href = item.uri;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    } catch (error) {
      console.error('Error opening email:', error);
      // Fallback: try window.location
      try {
        window.location.href = item.uri;
      } catch (e) {
        console.error('Fallback email open also failed:', e);
      }
    }
    
    // Process next item after delay (allows user to send first one)
    if (this.emailQueue.length > 0) {
      setTimeout(() => this.processEmailQueue(), 1500);
    } else {
      this.emailQueueProcessing = false;
    }
  }

  // Try to send via Web Share API (if available)
  async sendViaWebShare(message) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 EMERGENCY SOS ALERT',
          text: message,
          url: window.location.href
        });
        return { success: true, method: 'web-share' };
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Web Share error:', error);
        }
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'Web Share API not available' };
  }

  // Store alert in IndexedDB
  async storeAlert(alertData) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['alerts'], 'readwrite');
      const store = transaction.objectStore('alerts');
      const request = store.add({
        ...alertData,
        timestamp: new Date().toISOString(),
        sent: false
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Send via API (when online)
  async sendViaAPI(location, contacts) {
    try {
      const response = await fetch('/api/sos/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: location,
          contacts: contacts,
          userId: 'user_' + Date.now()
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data };
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      throw error;
    }
  }

  // Sync pending alerts when online
  async syncPendingAlerts() {
    if (!this.db) {
      await this.initDB();
    }

    try {
      const alerts = await this.getPendingAlerts();
      
      for (const alert of alerts) {
        try {
          await this.sendViaAPI(alert.location, alert.contacts);
          await this.markAlertAsSent(alert.id);
        } catch (error) {
          console.error('Error syncing alert:', error);
        }
      }

      return { success: true, synced: alerts.length };
    } catch (error) {
      console.error('Error in syncPendingAlerts:', error);
      return { success: false, error: error.message };
    }
  }

  // Get pending alerts from IndexedDB
  async getPendingAlerts() {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['alerts'], 'readonly');
      const store = transaction.objectStore('alerts');
      const index = store.index('sent');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Mark alert as sent
  async markAlertAsSent(alertId) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['alerts'], 'readwrite');
      const store = transaction.objectStore('alerts');
      const request = store.get(alertId);

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

  // Get stored contacts from IndexedDB or localStorage
  async getContacts() {
    // Try API first if online
    if (this.isOnline) {
      try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        if (data.success && data.contacts) {
          return data.contacts;
        }
      } catch (error) {
        console.log('Failed to fetch contacts from API, using local storage');
      }
    }

    // Fallback to localStorage
    try {
      const contacts = JSON.parse(localStorage.getItem('aura_contacts') || '{}');
      return contacts;
    } catch (error) {
      return {};
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OfflineSOSHandler;
}

// Create global instance
window.OfflineSOSHandler = OfflineSOSHandler;

