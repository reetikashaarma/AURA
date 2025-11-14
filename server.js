const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware to allow frontend to access API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the current directory
app.use(express.static(__dirname));

// In-memory storage for emergency contacts (in production, use a database)
let emergencyContacts = {};

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
    }
});

// Verify email configuration
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    emailTransporter.verify((error, success) => {
        if (error) {
            console.log('Email configuration error:', error);
        } else {
            console.log('Email server is ready to send messages');
        }
    });
}

// Helper function to send email
async function sendEmail(to, subject, text, html) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('Email not configured. Would send email to:', to);
        console.log('Subject:', subject);
        console.log('Message:', text);
        return { success: false, message: 'Email not configured' };
    }

    try {
        const info = await emailTransporter.sendMail({
            from: `"AURA Emergency Alert" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

// Helper function to send SMS (using Twilio)
async function sendSMS(to, message) {
    // Twilio configuration (optional)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        console.log('SMS not configured. Would send SMS to:', to);
        console.log('Message:', message);
        return { success: false, message: 'SMS not configured' };
    }

    try {
        // Dynamically require Twilio only if configured
        let twilio;
        try {
            twilio = require('twilio');
        } catch (err) {
            console.log('Twilio package not installed. Install with: npm install twilio');
            return { success: false, message: 'Twilio package not installed' };
        }
        
        const client = twilio(accountSid, authToken);
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });
        console.log('SMS sent:', result.sid);
        return { success: true, messageSid: result.sid };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
}

// API Routes for Emergency Contacts

// GET /api/contacts - Get all emergency contacts
app.get('/api/contacts', (req, res) => {
    res.json({
        success: true,
        contacts: emergencyContacts
    });
});

// POST /api/contacts - Save emergency contacts
app.post('/api/contacts', (req, res) => {
    try {
        const { contact1, contact2, contact3 } = req.body;
        
        // Validate at least contact1 is provided
        if (!contact1 || !contact1.name || !contact1.phone) {
            return res.status(400).json({
                success: false,
                error: 'Contact 1 is required with name and phone'
            });
        }

        // Store contacts
        emergencyContacts = {
            contact1: contact1 || null,
            contact2: contact2 || null,
            contact3: contact3 || null,
            updatedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            message: 'Emergency contacts saved successfully',
            contacts: emergencyContacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/sos/activate - Activate SOS and notify contacts
app.post('/api/sos/activate', async (req, res) => {
    try {
        const { location, userId } = req.body;
        
        // Get contacts
        if (!emergencyContacts.contact1) {
            return res.status(400).json({
                success: false,
                error: 'No emergency contacts found. Please add contacts first.'
            });
        }

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
        // Always include base location (Lovely Professional University) prominently
        const baseLocation = location.baseLocation || location.name || 'Lovely Professional University, Jalandhar, Punjab';
        const locationText = `Location: ${baseLocation}\nGPS Coordinates: ${location.lat}, ${location.lng}\nMap Link: https://www.google.com/maps?q=${location.lat},${location.lng}`;
        
        const locationLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
        
        const timestamp = new Date().toLocaleString();
        const sosMessage = `🚨 EMERGENCY ALERT FROM AURA 🚨\n\nThis is an emergency SOS alert.\n\nTime: ${timestamp}\n${locationText}\n\nPlease respond immediately.`;
        
        const sosEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .alert { background-color: #ff4444; color: white; padding: 20px; border-radius: 8px; }
                    .info { background-color: #f5f5f5; padding: 15px; margin-top: 10px; border-radius: 5px; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="alert">
                    <h2>🚨 EMERGENCY SOS ALERT 🚨</h2>
                    <p>This is an emergency SOS alert from AURA.</p>
                </div>
                <div class="info">
                    <p><strong>Time:</strong> ${timestamp}</p>
                    <p><strong>Location:</strong> ${baseLocation}</p>
                    <p><strong>GPS Coordinates:</strong> ${location.lat}, ${location.lng}</p>
                    <p><a href="${locationLink}" target="_blank">View Location on Map</a></p>
                    <p><strong>Action Required:</strong> Please respond immediately and check on the person who activated this alert.</p>
                </div>
            </body>
            </html>
        `;

        const notifications = [];

        // Notify contact1
        if (emergencyContacts.contact1) {
            const contact1 = emergencyContacts.contact1;
            
            // Send SMS
            if (contact1.phone) {
                const smsResult = await sendSMS(contact1.phone, sosMessage);
                notifications.push({
                    contact: contact1.name,
                    type: 'SMS',
                    phone: contact1.phone,
                    success: smsResult.success,
                    error: smsResult.error
                });
            }
            
            // Send Email
            if (contact1.email) {
                const emailResult = await sendEmail(
                    contact1.email,
                    '🚨 EMERGENCY SOS ALERT from AURA',
                    sosMessage,
                    sosEmailHtml
                );
                notifications.push({
                    contact: contact1.name,
                    type: 'Email',
                    email: contact1.email,
                    success: emailResult.success,
                    error: emailResult.error
                });
            }
        }

        // Notify contact2
        if (emergencyContacts.contact2 && emergencyContacts.contact2.name) {
            const contact2 = emergencyContacts.contact2;
            
            if (contact2.phone) {
                const smsResult = await sendSMS(contact2.phone, sosMessage);
                notifications.push({
                    contact: contact2.name,
                    type: 'SMS',
                    phone: contact2.phone,
                    success: smsResult.success,
                    error: smsResult.error
                });
            }
            
            if (contact2.email) {
                const emailResult = await sendEmail(
                    contact2.email,
                    '🚨 EMERGENCY SOS ALERT from AURA',
                    sosMessage,
                    sosEmailHtml
                );
                notifications.push({
                    contact: contact2.name,
                    type: 'Email',
                    email: contact2.email,
                    success: emailResult.success,
                    error: emailResult.error
                });
            }
        }

        // Notify contact3
        if (emergencyContacts.contact3 && emergencyContacts.contact3.name) {
            const contact3 = emergencyContacts.contact3;
            
            if (contact3.phone) {
                const smsResult = await sendSMS(contact3.phone, sosMessage);
                notifications.push({
                    contact: contact3.name,
                    type: 'SMS',
                    phone: contact3.phone,
                    success: smsResult.success,
                    error: smsResult.error
                });
            }
            
            if (contact3.email) {
                const emailResult = await sendEmail(
                    contact3.email,
                    '🚨 EMERGENCY SOS ALERT from AURA',
                    sosMessage,
                    sosEmailHtml
                );
                notifications.push({
                    contact: contact3.name,
                    type: 'Email',
                    email: contact3.email,
                    success: emailResult.success,
                    error: emailResult.error
                });
            }
        }

        res.json({
            success: true,
            message: 'SOS alert activated and notifications sent',
            activatedAt: new Date().toISOString(),
            location: location,
            notifications: notifications
        });

    } catch (error) {
        console.error('Error activating SOS:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Routes
// Main route - render index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Map route - render map page with optional location parameters
app.get('/map', (req, res) => {
    // Pass Google Maps API key to the page if available
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    
    try {
        let mapHtml = fs.readFileSync(path.join(__dirname, 'map.html'), 'utf8');
        
        // Inject API key into the page if available
        // Replace the initialization line to inject the API key
        if (googleMapsApiKey) {
            mapHtml = mapHtml.replace(
                /window\.GOOGLE_MAPS_API_KEY = window\.GOOGLE_MAPS_API_KEY \|\| new URLSearchParams\(window\.location\.search\)\.get\('key'\) \|\| '';/g,
                `window.GOOGLE_MAPS_API_KEY = '${googleMapsApiKey}' || window.GOOGLE_MAPS_API_KEY || new URLSearchParams(window.location.search).get('key') || '';`
            );
        }
        
        res.send(mapHtml);
    } catch (error) {
        console.error('Error reading map.html:', error);
        res.sendFile(path.join(__dirname, 'map.html'));
    }
});

// Support Routes
// Contact Us page
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'AURA • Contact Us' });
});

// Help Center page
app.get('/help', (req, res) => {
    res.render('help', { title: 'AURA • Help Center' });
});

// FAQ page
app.get('/faq', (req, res) => {
    res.render('faq', { title: 'AURA • FAQ' });
});

// Tutorials page
app.get('/tutorials', (req, res) => {
    res.render('tutorials', { title: 'AURA • Tutorials' });
});

// Safety Tips page
app.get('/safety-tips', (req, res) => {
    res.render('safety-tips', { title: 'AURA • Safety Tips' });
});

// Legal Routes
// Privacy Policy page
app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'AURA • Privacy Policy' });
});

// Terms of Service page
app.get('/terms', (req, res) => {
    res.render('terms', { title: 'AURA • Terms of Service' });
});

// Cookie Policy page
app.get('/cookies', (req, res) => {
    res.render('cookies', { title: 'AURA • Cookie Policy' });
});

// Safety Disclaimer page
app.get('/disclaimer', (req, res) => {
    res.render('disclaimer', { title: 'AURA • Safety Disclaimer' });
});

// Start server
app.listen(PORT, () => {
    console.log(`AURA server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  GET  /api/contacts - Get emergency contacts`);
    console.log(`  POST /api/contacts - Save emergency contacts`);
    console.log(`  POST /api/sos/activate - Activate SOS alert`);
});

