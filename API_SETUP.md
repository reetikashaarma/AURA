# AURA Emergency Contacts API Setup Guide

This guide will help you set up the AURA Emergency Contacts API to enable SOS alerts via email and SMS.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Edit `.env` file with your configuration (see below)

## Configuration

### Email Configuration (Required for Email Alerts)

#### Gmail Setup:
1. Enable 2-Step Verification on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use your Gmail address as `EMAIL_USER`
5. Use the generated app password as `EMAIL_PASSWORD`

Example `.env` for Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

#### Other Email Providers:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

### SMS Configuration (Optional - for SMS alerts)

To enable SMS alerts, you need a Twilio account:

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the [Twilio Console](https://www.twilio.com/console)
3. Get a phone number from Twilio
4. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Note**: SMS requires a paid Twilio account. Without Twilio configuration, the system will only send emails (if email is configured) or log notifications to the console.

## Running the Server

1. Start the server:
```bash
npm start
```

2. The server will run on `http://localhost:3000` (or the port specified in `.env`)

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### GET /api/contacts
Get all emergency contacts.

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
    "contact2": {...},
    "contact3": {...},
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/contacts
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
  },
  "contact3": {
    "name": "Bob Johnson",
    "phone": "+1122334455",
    "email": "bob@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency contacts saved successfully",
  "contacts": {...}
}
```

### POST /api/sos/activate
Activate SOS alert and notify all emergency contacts.

**Request Body:**
```json
{
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "accuracy": 10
  },
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SOS alert activated and notifications sent",
  "activatedAt": "2025-01-01T00:00:00.000Z",
  "location": {...},
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

## Testing

### Test Email Configuration:
1. Make sure your `.env` file has email credentials
2. Start the server
3. Add emergency contacts via the web interface
4. Activate SOS alert
5. Check the email inbox of your emergency contacts

### Test SMS Configuration:
1. Make sure your `.env` file has Twilio credentials
2. Start the server
3. Add emergency contacts with phone numbers
4. Activate SOS alert
5. Check the phone for SMS messages

### Without Configuration:
If email/SMS is not configured, the system will:
- Log notification attempts to the console
- Show what would be sent (for testing purposes)
- Still mark the SOS as activated
- Store contact information

## Troubleshooting

### Email not sending:
- Check your email credentials in `.env`
- For Gmail, make sure you're using an App Password, not your regular password
- Check if 2-Step Verification is enabled
- Check your email provider's SMTP settings
- Check server logs for error messages

### SMS not sending:
- Verify Twilio credentials are correct
- Make sure your Twilio account has credits
- Verify the phone number format (include country code with +)
- Check Twilio console for error logs

### Contacts not saving:
- Check server logs for errors
- Verify API endpoint is accessible
- Check browser console for errors
- Make sure the server is running

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys and passwords secure
- Use environment variables for sensitive data in production
- Consider using a database instead of in-memory storage for production
- Add authentication for API endpoints in production
- Use HTTPS in production

## Production Deployment

For production deployment:
1. Use a database (MongoDB, PostgreSQL, etc.) instead of in-memory storage
2. Add user authentication and authorization
3. Use environment variables for all sensitive configuration
4. Enable HTTPS
5. Set up proper error logging and monitoring
6. Consider using a message queue for reliable notification delivery
7. Add rate limiting to prevent abuse
8. Implement proper backup and recovery procedures

