# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "TikTok Creator Compass"
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on it and press "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name: "TikTok Creator Compass Web Client"

### Configure URLs:
**Authorized JavaScript origins:**
- `http://localhost:3000` (for development)
- `https://yourdomain.com` (for production - add later)

**Authorized redirect URIs:**
- `http://localhost:3000/auth/callback` (for development)
- `https://yourdomain.com/auth/callback` (for production - add later)

## Step 4: Copy Credentials

After creating, you'll get:
- **Client ID**: Copy this to your `.env` file as `GOOGLE_CLIENT_ID`
- **Client Secret**: Copy this to your `.env` file as `GOOGLE_CLIENT_SECRET`

## Step 5: Update .env File

```bash
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Security Note
- Never commit real credentials to Git
- Use different credentials for development and production
- Keep your client secret secure
