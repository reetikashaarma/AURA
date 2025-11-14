# AURA - Alert Understand Respond Assist

**A comprehensive personal safety companion web application** that provides real-time emergency assistance, location sharing, and safety features to keep you protected 24/7.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
  - [1. Emergency Contacts Management](#1-emergency-contacts-management)
  - [2. Permissions System](#2-permissions-system)
  - [3. SOS Alert System](#3-sos-alert-system)
  - [4. Fake Call Feature](#4-fake-call-feature)
  - [5. Safe Route Navigation](#5-safe-route-navigation)
  - [6. Interactive Map](#6-interactive-map)
- [User Interface Features](#user-interface-features)
- [Settings & Customization](#settings--customization)
- [Technical Features](#technical-features)
- [API & Backend Features](#api--backend-features)
- [Offline Capabilities](#offline-capabilities)
- [Accessibility Features](#accessibility-features)
- [Security & Privacy](#security--privacy)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

---

## Overview

AURA is a full-featured web-based personal safety application designed to provide comprehensive emergency assistance and safety features. It combines modern web technologies with offline capabilities to ensure users can access critical safety features even without an internet connection.

### Key Highlights

- ✅ **Real-time Emergency Alerts** - Instant SOS notifications to trusted contacts
- ✅ **Offline Support** - Works without internet using native device features
- ✅ **Multi-language Support** - Available in 6 languages
- ✅ **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Progressive Web App** - Service Worker support for offline functionality
- ✅ **Accessibility First** - WCAG compliant with screen reader support
- ✅ **Privacy Focused** - User-controlled permissions and data storage

---

## Core Features

### 1. Emergency Contacts Management

**Location:** `contacts.html`

#### Features:
- **Add Up to 3 Emergency Contacts**
  - Contact 1 (Required): Name, Phone Number, Email (optional)
  - Contact 2 (Optional): Name, Phone Number, Email (optional)
  - Contact 3 (Optional): Name, Phone Number, Email (optional)

- **Input Validation**
  - Phone number validation with international format support
  - Email validation with proper format checking
  - Real-time form validation with visual feedback
  - Country code support for phone numbers

- **Data Storage**
  - Server-side storage via API (`POST /api/contacts`)
  - Local storage backup (localStorage) for offline access
  - Automatic synchronization between server and local storage
  - Data persistence across sessions

- **Contact Display**
  - Shows saved contacts on SOS page
  - Visual contact cards with icons
  - Empty state handling when no contacts are added
  - Quick access to add contacts from any page

- **API Integration**
  - `GET /api/contacts` - Retrieve saved contacts
  - `POST /api/contacts` - Save new contacts
  - Automatic fallback to localStorage if API unavailable

---

### 2. Permissions System

**Location:** `permissions.html`

#### Features:
- **Location Permission**
  - Browser geolocation API integration
  - Real-time permission status checking
  - One-click permission grant
  - Visual status indicators (Granted/Denied/Not Set)
  - Automatic permission status updates

- **Microphone Permission**
  - Audio recording capability for emergency situations
  - MediaDevices API integration
  - Permission status monitoring
  - Audio capture for SOS alerts

- **Camera Permission**
  - Photo/video capture capability
  - MediaDevices API for camera access
  - Visual permission status display
  - Optional feature for emergency documentation

- **Permission Status Monitoring**
  - Real-time permission state checking using Permissions API
  - Automatic status updates when permissions change
  - Persistent storage of permission states in localStorage
  - Visual feedback with color-coded status badges

- **User Experience**
  - Clear descriptions of why each permission is needed
  - Step-by-step instructions for granting permissions
  - Browser compatibility fallbacks
  - Helpful error messages for denied permissions

---

### 3. SOS Alert System

**Location:** `sos.html`

#### Core Functionality:
- **SOS Activation**
  - Long-press button activation (3-second countdown)
  - Touch and mouse support for activation
  - Visual countdown timer (3, 2, 1)
  - Cancel option during countdown
  - Instant activation when countdown is disabled in settings

- **Location Sharing**
  - Automatic GPS location retrieval
  - Multiple location retrieval attempts (3 retries)
  - High accuracy GPS with fallback to lower accuracy
  - Cached location support if GPS unavailable
  - Default location fallback (Lovely Professional University, Jalandhar, Punjab)
  - **Base location always included** in all SOS messages
  - Location format includes:
    - Base location name (Lovely Professional University, Jalandhar, Punjab)
    - GPS coordinates (latitude, longitude)
    - Google Maps link for easy navigation
    - Location accuracy information

- **Automatic Message Sending**
  - **Automatic sending** - No manual confirmation required
  - Messages sent immediately when SOS is activated
  - Online mode: Automatic sending via API
  - Offline mode: Automatic storage for sync when online

- **Message Delivery Methods**
  - **Email Notifications** (when online via API)
    - HTML formatted emergency emails
    - Rich content with location map links
    - Subject: "🚨 EMERGENCY SOS ALERT from AURA"
    - Automatic email sending to all contacts with email addresses
  
  - **SMS Notifications** (when online via API)
    - Text message alerts with location
    - Automatic SMS sending to all contacts with phone numbers
    - Emergency message format with map links
  
  - **Offline Mode Support**
    - Native SMS app opening (mobile devices)
    - Native Email app opening (all devices)
    - Pre-filled messages ready to send
    - IndexedDB storage for automatic sync when online

- **Notification Features**
  - Toast notifications for success/error states
  - Visual feedback during SOS activation
  - Status updates during message sending
  - Contact notification success/failure tracking

- **SOS Settings Integration**
  - 3-second countdown toggle (enabled/disabled)
  - Silent mode option (no siren or flash)
  - Siren volume control (0-100%)
  - Settings persist across sessions

- **Status Indicators**
  - "Ready to Activate" - Normal state
  - "SOS ACTIVE" - Emergency state
  - Connection status (Online/Offline)
  - Contact notification status

- **What Happens When SOS is Activated**
  1. Location is automatically retrieved (GPS or default)
  2. All emergency contacts are notified via SMS and Email
  3. Location is shared with GPS coordinates and map link
  4. Base location (Lovely Professional University) is included in all messages
  5. Audio recording capability (if permission granted)
  6. Alert is stored for sync if offline
  7. Status is updated in real-time

---

### 4. Fake Call Feature

**Location:** `index.html` (main page)

#### Features:
- **Schedule Fake Call**
  - Custom caller name input (max 30 characters)
  - Call delay setting (1-60 minutes)
  - Optional phone number display
  - Realistic incoming call screen simulation

- **Call Options**
  - **Call Now** - Immediate fake call activation
  - **Schedule Call** - Delayed activation
  - **Cancel** - Close scheduling modal

- **Incoming Call Screen**
  - Full-screen realistic call interface
  - Caller name display
  - Phone number display (if provided)
  - Avatar with caller initials
  - Answer and Decline buttons
  - iOS-style call interface design

- **Audio & Vibration**
  - iPhone-style ringtone simulation
  - Web Audio API for realistic ringtone
  - Haptic vibration (if device supports)
  - Visual ring animation
  - Automatic ringtone loop

- **Use Cases**
  - Exit uncomfortable situations
  - Deter strangers
  - Create excuse to leave
  - Safety tool for social situations

- **User Experience**
  - Modal interface for scheduling
  - Form validation
  - Visual feedback
  - Keyboard shortcuts (Escape to close)
  - Click outside to close modal

---

### 5. Safe Route Navigation

**Location:** `index.html` (main page) & `map.html`

#### Features:
- **Route Planning**
  - Start location input with autocomplete
  - End location input with autocomplete
  - Current location button
  - Route calculation with multiple options
  - Safety-based route recommendations

- **Map Integration**
  - Interactive map with full controls
  - Multiple map types (roadmap, satellite, terrain)
  - Zoom controls
  - Pan and rotate capabilities
  - Street View integration
  - Custom markers and waypoints

- **Route Features**
  - Distance calculation
  - Estimated travel time
  - Turn-by-turn directions
  - Alternative routes
  - Safety indicators
  - Route optimization

- **Navigation Tools**
  - Visual route highlighting
  - Direction indicators
  - Waypoint markers
  - Real-time location tracking
  - Accuracy circle display

---

### 6. Interactive Map

**Location:** `map.html`

#### Features:
- **Map Types**
  - Roadmap view
  - Satellite imagery
  - Terrain view
  - Street View integration

- **Location Features**
  - Current location marker
  - Custom location markers
  - Location accuracy circles
  - Multiple marker support
  - Marker clustering (if enabled)

- **Search & Autocomplete**
  - Google Places Autocomplete integration
  - Location search suggestions
  - Recent locations
  - Saved locations
  - Address validation

- **Map Controls**
  - Zoom in/out
  - Pan controls
  - Rotate controls
  - Full-screen mode
  - Reset view button
  - Current location button

- **Routing**
  - Route planning interface
  - Start/End location inputs
  - Route visualization
  - Alternative routes
  - Route elevation profile
  - Turn-by-turn directions

- **User Interface**
  - Responsive header with controls
  - Collapsible route panel
  - Full-screen map option
  - Touch gestures support
  - Keyboard navigation

---

## User Interface Features

### Navigation
- **Top Navigation Bar**
  - AURA brand logo with shield icon
  - Features link
  - SOS link
  - Routes section link
  - Map icon button (opens in new tab)
  - Settings button (gear icon)

- **Footer Navigation**
  - Quick Links section
  - Support section
  - Legal section
  - Social media links (Facebook, Twitter, Instagram)
  - Copyright information
  - Safety disclaimer

- **Page Navigation**
  - Smooth scrolling with visual feedback
  - Anchor link navigation
  - Visual highlighting on scroll
  - Back to top button (FAB)
  - Breadcrumb navigation

### Visual Design
- **Theme System**
  - Dark mode (default)
  - Light mode option
  - Smooth theme transitions
  - Persistent theme preference
  - System preference detection

- **Color Scheme**
  - Brand purple gradient (#7F56D9)
  - Accent colors for different features
  - Status colors (success, error, warning)
  - Accessibility-compliant contrast ratios

- **Typography**
  - Inter font family
  - Responsive font sizes
  - Font size customization (80%-150%)
  - Line height optimization
  - Text readability features

- **Layout**
  - Responsive grid system
  - Card-based design
  - Spacing consistency
  - Mobile-first approach
  - Breakpoint optimization

### Interactive Elements
- **Buttons**
  - Primary action buttons
  - Secondary buttons
  - Ghost buttons
  - Icon buttons
  - Toggle buttons
  - Loading states
  - Disabled states

- **Form Elements**
  - Input fields with icons
  - Validation feedback
  - Error states
  - Success states
  - Placeholder text
  - Autocomplete support

- **Modals**
  - Settings modal
  - Fake call modal
  - Incoming call screen
  - Overlay backdrop
  - Escape key to close
  - Click outside to close

- **Toast Notifications**
  - Success toasts (green)
  - Error toasts (red)
  - Auto-dismiss after 3-4 seconds
  - Non-intrusive positioning
  - Screen reader announcements

---

## Settings & Customization

**Location:** Settings modal (⚙️ button in navigation)

### Appearance Settings

- **Theme Toggle**
  - Dark Mode / Light Mode switch
  - Instant theme switching
  - Persistent storage
  - Smooth transitions

- **Font Size Control**
  - Increase font size button (A+)
  - Decrease font size button (A-)
  - Range: 80% to 150%
  - Step increment: 10%
  - Visual percentage display
  - Persistent storage

### Language Settings

- **Multi-language Support**
  - English (default)
  - हिंदी (Hindi)
  - मराठी (Marathi)
  - தமிழ் (Tamil)
  - తెలుగు (Telugu)
  - മലയാളം (Malayalam)

- **Language Switching**
  - Previous/Next language buttons
  - Language name display
  - Instant translation
  - Persistent language preference
  - Page-specific translations

- **Translation Coverage**
  - Navigation elements
  - Feature descriptions
  - Button labels
  - Settings sections
  - Error messages
  - Success messages

### Accessibility Settings

- **Font Size**
  - Adjustable text size
  - Percentage-based scaling
  - Affects all text elements
  - Minimum: 80%, Maximum: 150%
  - Default: 100%

### SOS Settings

- **3-Second Countdown Toggle**
  - Enable/disable countdown
  - Prevents accidental activation when enabled
  - Instant activation when disabled
  - Persistent setting

- **Silent Mode Toggle**
  - Enable silent SOS alerts
  - No siren sound when enabled
  - No flash/visual alerts
  - Useful for stealth situations
  - Persistent setting

- **Siren Volume Control**
  - Slider control (0-100%)
  - Default: 75%
  - Real-time volume adjustment
  - Hidden when silent mode is enabled
  - Persistent setting
  - Visual percentage display

---

## Technical Features

### Progressive Web App (PWA)
- **Service Worker**
  - Offline support via service worker
  - Automatic registration on page load
  - Background sync capability
  - Cache management
  - Update notifications

- **Offline Functionality**
  - Cached static assets
  - Offline SOS alert storage
  - Automatic sync when online
  - IndexedDB for data storage
  - Local storage backup

### Browser Compatibility
- **Modern Browser Support**
  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (latest)
  - Mobile browsers (iOS Safari, Chrome Mobile)

- **Feature Detection**
  - Geolocation API support
  - MediaDevices API support
  - Permissions API support
  - Service Worker support
  - IndexedDB support

### Performance Features
- **Optimizations**
  - Lazy loading where applicable
  - Image optimization
  - CSS optimization
  - JavaScript minification ready
  - Efficient DOM manipulation

- **Loading States**
  - Button loading indicators
  - Skeleton screens (where applicable)
  - Progress indicators
  - Smooth transitions

### Error Handling
- **User-Friendly Error Messages**
  - Clear error descriptions
  - Actionable error messages
  - Visual error indicators
  - Recovery suggestions

- **Graceful Degradation**
  - Fallback to localStorage when API unavailable
  - Default location when GPS unavailable
  - Offline mode when internet unavailable
  - Feature detection before use

---

## API & Backend Features

### REST API Endpoints

#### Emergency Contacts API
- **GET `/api/contacts`**
  - Retrieve all saved emergency contacts
  - Returns JSON with contact1, contact2, contact3
  - Includes name, phone, email for each contact

- **POST `/api/contacts`**
  - Save emergency contacts
  - Accepts JSON body with contact data
  - Validates required fields (Contact 1)
  - Returns saved contacts with success status

#### SOS Alert API
- **POST `/api/sos/activate`**
  - Activate SOS alert
  - Requires location and contacts in request body
  - Automatically sends notifications to all contacts
  - Supports SMS and Email notifications
  - Returns notification results for each contact

### Email Integration
- **Email Provider Support**
  - Gmail (with App Password)
  - Any SMTP provider
  - Nodemailer integration
  - HTML email templates
  - Rich email formatting

- **Email Features**
  - Automatic email sending
  - HTML formatted messages
  - Location map links
  - Emergency subject lines
  - Contact-specific emails

### SMS Integration (Optional)
- **Twilio Integration**
  - SMS sending via Twilio API
  - International number support
  - Emergency message formatting
  - Delivery status tracking

### Server Features
- **Express.js Server**
  - RESTful API design
  - JSON body parsing
  - CORS support
  - Static file serving
  - Error handling middleware

- **Data Storage**
  - In-memory contact storage (session-based)
  - Can be extended with database
  - LocalStorage client-side backup
  - IndexedDB for offline storage

---

## Offline Capabilities

### Offline SOS System

**File:** `offline-sos.js`

#### Features:
- **Offline Alert Storage**
  - IndexedDB database for alert storage
  - Automatic alert queuing when offline
  - Background sync when online
  - Persistent storage across sessions

- **Native Device Integration**
  - SMS app opening (mobile devices)
  - Email app opening (all devices)
  - Pre-filled messages with location
  - Works without internet connection

- **Automatic Sync**
  - Detects online status automatically
  - Syncs pending alerts when connection restored
  - Marks alerts as sent after successful sync
  - Retry failed syncs automatically

- **Queue Management**
  - Sequential SMS sending
  - Sequential email sending
  - Prevents overwhelming device apps
  - Time delays between app opens

### Service Worker Features
- **Cache Management**
  - Static asset caching
  - API response caching (optional)
  - Cache versioning
  - Automatic cache updates

- **Background Sync**
  - Sync pending alerts
  - Retry failed requests
  - Network status monitoring
  - Automatic recovery

### Local Storage
- **Data Persistence**
  - Contact storage (localStorage)
  - Permission states (localStorage)
  - Settings preferences (localStorage)
  - Theme preferences (localStorage)
  - Language preferences (localStorage)
  - SOS activation data (localStorage)

---

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**
  - All interactive elements have ARIA labels
  - Descriptive button labels
  - Form field labels
  - Status announcements
  - Live region updates

- **Semantic HTML**
  - Proper heading hierarchy
  - Semantic HTML5 elements
  - Form labels and associations
  - Button roles and states

### Keyboard Navigation
- **Full Keyboard Access**
  - Tab navigation through all elements
  - Enter/Space to activate buttons
  - Escape to close modals
  - Arrow keys for navigation (where applicable)

- **Focus Management**
  - Visible focus indicators
  - Logical tab order
  - Focus trapping in modals
  - Focus restoration on modal close

### Visual Accessibility
- **Color Contrast**
  - WCAG AA compliant contrast ratios
  - High contrast mode support
  - Color-blind friendly design
  - Not relying solely on color for information

- **Text Scaling**
  - Font size adjustment (80%-150%)
  - Responsive text sizing
  - Scalable vector graphics
  - No text in images

### Other Accessibility Features
- **Alt Text**
  - Descriptive alt text for icons
  - Decorative image marking
  - SVG accessibility labels

- **Error Handling**
  - Clear error messages
  - Error announcement to screen readers
  - Success message announcements
  - Field-level error indicators

---

## Security & Privacy

### Privacy Features
- **User-Controlled Permissions**
  - Explicit permission requests
  - Permission status transparency
  - Easy permission revocation
  - Clear privacy descriptions

- **Data Storage**
  - Local storage (client-side)
  - No unnecessary data collection
  - User-owned data
  - Optional server storage

- **Location Privacy**
  - Location only shared when SOS activated
  - User controls when location is accessed
  - No background location tracking
  - Cached location support

### Security Features
- **Input Validation**
  - Phone number validation
  - Email format validation
  - XSS prevention
  - SQL injection prevention (when using database)

- **HTTPS Support**
  - Secure data transmission
  - Geolocation requires HTTPS
  - MediaDevices API requires HTTPS
  - Service Worker requires HTTPS

### Data Protection
- **Client-Side Storage**
  - Encrypted data storage (where applicable)
  - Secure localStorage usage
  - IndexedDB security
  - No sensitive data in URLs

---

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Modern web browser
- Internet connection (for initial setup)

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   cd AURA
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional but Recommended)
   
   Create a `.env` file in the root directory:
   ```env
   # Email Configuration (Required for email alerts)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # SMS Configuration (Optional)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890

   # Google Maps API Key (Optional)
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Application**
   ```
   http://localhost:3000
   ```

### Quick Setup Guides
- See [QUICK_START.md](QUICK_START.md) for basic setup
- See [API_SETUP.md](API_SETUP.md) for API configuration
- See [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for Maps setup

---

## Usage Guide

### Initial Setup

1. **Add Emergency Contacts**
   - Click "Add Contacts" on the home page
   - Fill in at least Contact 1 (required)
   - Add Contact 2 and 3 (optional)
   - Click "Save Emergency Contacts"

2. **Set Permissions**
   - Click "Set Permissions" on the home page
   - Grant Location permission
   - Grant Microphone permission (optional)
   - Grant Camera permission (optional)

3. **Configure Settings** (Optional)
   - Click the ⚙️ settings icon
   - Choose your preferred theme
   - Select language
   - Adjust font size if needed
   - Configure SOS settings

### Using SOS Alert

1. **Navigate to SOS Page**
   - Click "SOS" in navigation or "Activate" on home page

2. **Activate SOS**
   - Press and hold the "Hold to Activate SOS" button for 3 seconds
   - Or disable countdown in settings for instant activation
   - Release early to cancel

3. **Automatic Notification**
   - Location is automatically retrieved
   - Messages are automatically sent to all contacts
   - Status updates are shown in real-time

### Using Fake Call

1. **Open Fake Call Modal**
   - Click "Schedule Call" on the home page

2. **Configure Call**
   - Enter caller name
   - Set call time (1-60 minutes) or click "Call Now"
   - Optionally add phone number

3. **Receive Call**
   - Incoming call screen appears at scheduled time
   - Answer or Decline the call
   - Use as needed for safety

### Using Map & Routes

1. **Open Map**
   - Click map icon in navigation
   - Or access directly at `/map.html`

2. **Set Route**
   - Enter start location (or use current location)
   - Enter end location
   - Click route button

3. **View Route**
   - Route is displayed on map
   - View directions and details
   - Switch between map types

---

## Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and animations
- **JavaScript (ES6+)** - Client-side interactivity
- **Leaflet.js** - Interactive maps
- **Leaflet Routing Machine** - Route planning

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **Twilio SDK** - SMS sending (optional)

### APIs & Services
- **Google Maps JavaScript API** - Map integration
- **Google Places API** - Location autocomplete
- **Geolocation API** - Location services
- **MediaDevices API** - Camera/microphone access
- **Permissions API** - Permission management
- **Service Worker API** - Offline support
- **IndexedDB API** - Client-side database

### Libraries & Tools
- **Web Audio API** - Ringtone generation
- **Vibration API** - Haptic feedback
- **LocalStorage API** - Client-side storage
- **Fetch API** - HTTP requests

---

## Project Structure

```
AURA/
├── index.html              # Main landing page
├── features.html           # Features showcase page
├── contacts.html           # Emergency contacts management
├── permissions.html        # Permissions setup page
├── sos.html                # SOS activation page
├── map.html                # Interactive map page
├── style.css               # Main stylesheet
├── script.js               # Main JavaScript file
├── translations.js         # Multi-language translations
├── offline-sos.js          # Offline SOS handler
├── sw.js                   # Service Worker
├── server.js               # Express.js server
├── package.json            # Dependencies
├── README.md               # This file
├── QUICK_START.md          # Quick setup guide
├── API_SETUP.md            # API configuration guide
├── GOOGLE_MAPS_SETUP.md    # Google Maps setup
├── OFFLINE_SOS.md          # Offline SOS documentation
└── views/                  # Server-side templates (EJS)
    ├── contact.ejs
    ├── cookies.ejs
    ├── disclaimer.ejs
    ├── faq.ejs
    ├── help.ejs
    ├── privacy.ejs
    ├── safety-tips.ejs
    ├── terms.ejs
    ├── tutorials.ejs
    └── partials/
        ├── footer.ejs
        └── header.ejs
```

---

## API Documentation

### Emergency Contacts Endpoints

#### GET `/api/contacts`
Retrieve all saved emergency contacts.

**Response:**
```json
{
  "success": true,
  "contacts": {
    "contact1": {
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    },
    "contact2": {
      "name": "Jane Smith",
      "phone": "+0987654321"
    }
  }
}
```

#### POST `/api/contacts`
Save emergency contacts.

**Request Body:**
```json
{
  "contact1": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "contact2": {
    "name": "Jane Smith",
    "phone": "+0987654321",
    "email": "jane@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contacts saved successfully",
  "contacts": { ... }
}
```

### SOS Alert Endpoint

#### POST `/api/sos/activate`
Activate SOS alert and notify contacts.

**Request Body:**
```json
{
  "location": {
    "lat": 31.261128,
    "lng": 75.706897,
    "baseLocation": "Lovely Professional University, Jalandhar, Punjab"
  },
  "userId": "user_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SOS alert activated and notifications sent",
  "activatedAt": "2025-01-XX",
  "location": { ... },
  "notifications": [
    {
      "contact": "John Doe",
      "type": "SMS",
      "phone": "+1234567890",
      "success": true
    },
    {
      "contact": "John Doe",
      "type": "Email",
      "email": "john@example.com",
      "success": true
    }
  ]
}
```

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

---

## Known Limitations

1. **Contact Storage**: Contacts are stored in memory on server restart (consider database for production)
2. **SMS**: Requires Twilio account for SMS functionality
3. **Email**: Requires SMTP configuration for email alerts
4. **Offline SMS/Email**: Opens native apps but requires user to manually send (browser limitation)
5. **Location Accuracy**: Depends on device GPS capabilities and signal strength
6. **HTTPS Required**: Some features (Geolocation, MediaDevices) require HTTPS in production

---

## Future Enhancements

- [ ] Database integration for contact storage
- [ ] Real-time location tracking
- [ ] Push notifications
- [ ] Mobile app version
- [ ] Voice commands for SOS
- [ ] Integration with emergency services
- [ ] Group safety features
- [ ] Advanced route safety analytics
- [ ] Community safety reports
- [ ] Integration with smartwatches

---

## Support & Documentation

- **Quick Start**: See [QUICK_START.md](QUICK_START.md)
- **API Setup**: See [API_SETUP.md](API_SETUP.md)
- **Google Maps**: See [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md)
- **Offline SOS**: See [OFFLINE_SOS.md](OFFLINE_SOS.md)

---

## License & Disclaimer

**Safety Disclaimer:** AURA is designed to assist in emergency situations but cannot guarantee immediate response. Always contact local emergency services (911) in life-threatening situations. This application is a supplement to, not a replacement for, professional emergency services.

---

## Contact & Contributions

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**AURA - Your Personal Safety Companion**  
*Alert • Understand • Respond • Assist*

© 2025 AURA. All rights reserved.
