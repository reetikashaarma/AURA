# Offline SOS Functionality

## Overview

AURA now supports **offline SOS alerts** that work even without an internet connection. When you activate SOS offline, the app uses your device's native capabilities to open SMS and Email apps with pre-filled emergency messages.

## How It Works

### Online Mode
- When online, SOS alerts are sent via the API (email/SMS through server)
- Alerts are also stored locally for redundancy
- Real-time notifications to all emergency contacts

### Offline Mode
- When offline, the app uses **native device features**:
  - **SMS**: Opens your device's SMS app with pre-filled message and emergency contact's phone number
  - **Email**: Opens your device's email app with pre-filled message and emergency contact's email
  - **Storage**: Alerts are stored in IndexedDB for later sync when connection is restored

## Key Features

### 1. Native SMS (Works Offline)
- Uses `sms:` URI scheme to open SMS app
- Pre-fills recipient phone number
- Pre-fills emergency message with location
- Works on mobile devices (iOS, Android)
- **User must manually send the SMS** (this is intentional for emergency situations)

### 2. Native Email (Works Offline)
- Uses `mailto:` URI scheme to open email app
- Pre-fills recipient email address
- Pre-fills subject and message with location
- Works on all devices with email apps
- **User must manually send the email** (this is intentional for emergency situations)

### 3. Offline Storage
- Alerts are stored in IndexedDB (browser database)
- Automatically syncs when connection is restored
- Pending alerts are sent via API when online

### 4. Service Worker
- Caches app files for offline access
- Enables background sync for pending alerts
- Works even when the browser is closed

## Usage

### Activating SOS Offline

1. **Add Emergency Contacts** (when online or offline):
   - Go to "Add Contacts" page
   - Add up to 3 emergency contacts with phone numbers and/or emails
   - Contacts are stored locally (works offline)

2. **Activate SOS** (works offline):
   - Go to "SOS" page
   - Press and hold the "Hold to Activate SOS" button for 3 seconds
   - The app will:
     - Get your current location (if GPS available)
     - Open SMS app(s) for each contact with phone number
     - Open Email app(s) for each contact with email
     - Store the alert for later sync

3. **Send Messages**:
   - When SMS/Email apps open, **you must manually send the messages**
   - The messages are pre-filled with:
     - Emergency alert message
     - Your location (if available)
     - Timestamp
   - Tap "Send" in each app to notify your contacts

### Online Sync

- When connection is restored, pending alerts are automatically synced
- Alerts are sent via API (email/SMS through server)
- You'll see a notification when sync is complete

## Technical Details

### Files
- `offline-sos.js` - Offline SOS handler class
- `sw.js` - Service Worker for offline support
- `sos.html` - Updated SOS page with offline support

### Storage
- **IndexedDB**: Stores pending alerts for sync
- **LocalStorage**: Stores contacts and SOS status (fallback)
- **Service Worker Cache**: Caches app files for offline access

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Offline Features**: Requires HTTPS (or localhost for development)

## Limitations

1. **Manual Sending Required**: 
   - SMS and Email apps require manual send action
   - This is a security feature to prevent accidental sends
   - In emergency situations, this ensures you control when alerts are sent

2. **Location Accuracy**:
   - GPS may not work indoors or in poor signal areas
   - Location accuracy depends on device capabilities

3. **Browser Restrictions**:
   - Some browsers may block multiple app opens
   - SMS URI scheme works best on mobile devices
   - Email URI scheme works on all devices with email apps

## Best Practices

1. **Test Offline Mode**:
   - Enable airplane mode
   - Activate SOS
   - Verify SMS/Email apps open correctly

2. **Keep Contacts Updated**:
   - Update emergency contacts regularly
   - Ensure phone numbers include country codes
   - Verify email addresses are correct

3. **Location Permissions**:
   - Grant location permissions for accurate alerts
   - Location works offline if GPS is available

4. **Battery Considerations**:
   - GPS can drain battery quickly
   - Consider charging during extended use

## Security & Privacy

- **Local Storage**: All data is stored locally on your device
- **No Cloud Storage**: Contacts and alerts are not sent to cloud without your action
- **Manual Send**: You control when alerts are sent
- **Encryption**: Consider encrypting sensitive data in production

## Troubleshooting

### SMS App Doesn't Open
- Verify phone number format (include country code: +1234567890)
- Check if device has SMS capability
- Try on a mobile device (SMS URI works best on mobile)

### Email App Doesn't Open
- Verify email address format
- Check if device has email app installed
- Try different email clients

### Location Not Available
- Grant location permissions
- Check if GPS is enabled
- Move to area with better signal
- Location may not work indoors

### Alerts Not Syncing
- Check internet connection
- Verify API endpoint is accessible
- Check browser console for errors
- Alerts will sync when connection is restored

## Future Enhancements

- [ ] Push notifications for offline alerts
- [ ] Automatic SMS sending (requires device permissions)
- [ ] Emergency call integration (tel: URI)
- [ ] Offline map caching
- [ ] Background location tracking
- [ ] Encrypted local storage

## Support

For issues or questions:
1. Check browser console for errors
2. Verify contacts are saved correctly
3. Test on different devices/browsers
4. Check network connectivity
5. Review this documentation

---

**Note**: This offline functionality is designed for emergency situations. Always test the system when you have internet connection first, and ensure your emergency contacts are correctly configured.

