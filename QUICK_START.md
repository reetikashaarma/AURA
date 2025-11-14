# AURA API Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example` if available, or create manually):
```bash
# Email Configuration (for email alerts)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS Configuration (optional - requires Twilio account)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Server Port
PORT=3000
```

## Gmail Setup (Quick)

1. Go to https://myaccount.google.com/apppasswords
2. Generate an app password for "Mail"
3. Use that password in `.env` as `EMAIL_PASSWORD`

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Testing

1. Open `http://localhost:3000` in your browser
2. Go to "Add Contacts" and add emergency contacts
3. Go to "SOS" page and activate SOS
4. Check your email/SMS for alerts

## Without Configuration

If you don't configure email/SMS:
- The system will still work
- Notifications will be logged to the console
- Contacts will be stored in memory (lost on server restart)

## API Endpoints

- `GET /api/contacts` - Get emergency contacts
- `POST /api/contacts` - Save emergency contacts
- `POST /api/sos/activate` - Activate SOS alert

See `API_SETUP.md` for detailed documentation.

