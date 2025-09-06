# Authentication Flow Testing Guide

## Prerequisites
1. Backend running on `localhost:8000`
2. Frontend running on `localhost:3000`
3. PostgreSQL and Redis containers running
4. Google OAuth credentials configured

## Step-by-Step Testing Process

### 1. Set Up Google OAuth Credentials

**Go to Google Cloud Console:**
1. Visit: https://console.cloud.google.com/
2. Create new project: "TikTok Creator Compass"
3. Enable Google+ API in "APIs & Services" → "Library"
4. Create OAuth client ID in "APIs & Services" → "Credentials"

**Configure OAuth Client:**
- Application type: Web application
- Name: TikTok Creator Compass Web Client
- Authorized JavaScript origins: `http://localhost:3000`
- Authorized redirect URIs: `http://localhost:3000/auth/callback`

**Copy your credentials:**
- Client ID: `your_client_id_here`
- Client Secret: `your_client_secret_here`

### 2. Update Backend Configuration

Update `/backend/.env` with your real credentials:
```bash
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### 3. Test Authentication Flow

**Test Sequence:**
1. Visit `http://localhost:3000`
2. Click "Continue with Google"
3. Should redirect to Google OAuth page
4. Sign in with your Google account
5. Should redirect back to `/auth/callback`
6. Should redirect to `/onboarding` (first time) or `/dashboard` (returning user)

### 4. Test Onboarding Flow

**Fill out onboarding form:**
- TikTok username: `@your_username`
- Offer description: Your content/service description
- Target audience: Your audience description
- Click "Complete Setup"

**Expected behavior:**
- Data should be saved to PostgreSQL
- Should redirect to `/dashboard`
- Should show real user data in dashboard

### 5. Verify Database Storage

Check if user data was stored:
```bash
docker exec -it tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "SELECT * FROM users;"
```

### 6. Test Dashboard Authentication

**Dashboard should show:**
- Real user name and avatar from Google
- Authentication guards working
- Logout functionality working
- No authentication loops

### 7. Test Logout Flow

1. Click logout in dashboard
2. Should clear JWT token
3. Should redirect to main page
4. Should not be able to access `/dashboard` or `/onboarding` directly

## Troubleshooting

**Common Issues:**
- **401 Unauthorized**: Check Google OAuth credentials
- **Redirect URI mismatch**: Verify callback URL in Google Console
- **Database connection**: Ensure PostgreSQL container is running
- **CORS errors**: Check backend CORS configuration

**Debug Commands:**
```bash
# Check backend logs
docker logs tiktok_compass_db

# Check if backend is responding
curl http://localhost:8000/health

# Check Google OAuth URL generation
curl http://localhost:8000/api/v1/auth/google/url
```

## Success Criteria

✅ Google OAuth redirects work
✅ JWT tokens are generated and stored
✅ User data is saved to PostgreSQL
✅ Onboarding flow completes successfully
✅ Dashboard loads with real user data
✅ Authentication guards prevent unauthorized access
✅ Logout clears tokens and redirects properly
