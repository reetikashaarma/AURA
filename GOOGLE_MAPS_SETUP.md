# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the AURA application.

## Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (Google provides $200 free credit per month for Maps API)
4. Navigate to **APIs & Services** > **Library**
5. Search for and enable the following APIs:
   - **Maps JavaScript API** (Required)
   - **Geocoding API** (Optional, for address lookup)
   - **Places API** (Optional, for places search)

## Step 2: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Recommended) Click **Restrict Key** to add restrictions:
   - **Application restrictions**: HTTP referrers
   - Add your domain: `http://localhost:3000/*` (for development)
   - Add your production domain when deploying

## Step 3: Set the API Key

### Option 1: Environment Variable (Recommended)

**Windows PowerShell:**
```powershell
$env:GOOGLE_MAPS_API_KEY="your_api_key_here"
npm start
```

**Windows CMD:**
```cmd
set GOOGLE_MAPS_API_KEY=your_api_key_here
npm start
```

**Linux/Mac:**
```bash
export GOOGLE_MAPS_API_KEY="your_api_key_here"
npm start
```

### Option 2: Create .env File (Alternative)

1. Create a `.env` file in the project root
2. Add your API key:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Install dotenv package:
   ```bash
   npm install dotenv
   ```
4. Update `server.js` to load .env file:
   ```javascript
   require('dotenv').config();
   ```

## Step 4: Verify Setup

1. Start your server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/map
   ```

3. You should see Google Maps instead of OpenStreetMap
4. Check the browser console for "Google Maps initialized" message
5. You should see "✓ Google Maps" indicator on the map page

## Features Available with Google Maps

- ✅ Interactive map with full controls
- ✅ Accurate location markers
- ✅ Accuracy circle visualization
- ✅ Smooth zoom and pan
- ✅ Street View integration
- ✅ Satellite/terrain views
- ✅ Better performance and accuracy

## Troubleshooting

### "Google Maps API key is invalid"
- Verify your API key is correct
- Check that Maps JavaScript API is enabled
- Ensure billing is enabled on your Google Cloud project

### "RefererNotAllowedMapError"
- Check API key restrictions
- Add your domain to allowed referrers
- For localhost, use: `http://localhost:3000/*`

### Maps not loading
- Check browser console for errors
- Verify API key is set correctly
- Ensure internet connection is active
- Check that Maps JavaScript API is enabled

### Still using OpenStreetMap
- Verify environment variable is set correctly
- Restart the server after setting the variable
- Check server console for API key status

## Cost Information

Google Maps Platform offers:
- **$200 free credit per month**
- First 28,000 map loads per month are free
- After that, $7 per 1,000 additional loads

For most development and small projects, you'll stay within the free tier.

## Security Best Practices

1. **Restrict your API key** to specific domains
2. **Never commit API keys** to version control
3. **Use environment variables** instead of hardcoding
4. **Monitor usage** in Google Cloud Console
5. **Set up billing alerts** to avoid unexpected charges

## Support

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)

