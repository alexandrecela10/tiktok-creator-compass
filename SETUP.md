# TikTok Creator Compass - Setup Guide

This guide will help you set up and run the TikTok Creator Compass application locally.

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Chrome browser (for web scraping)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd tiktok-creator-compass/backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables
Copy the `.env` file and update with your actual values:
```bash
cp .env .env.local
```

Update the following variables in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: A secure random string for JWT tokens
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: Should be `http://localhost:3000/auth/callback`

### 5. Set Up Database
Create a PostgreSQL database:
```sql
CREATE DATABASE tiktok_creator_compass;
```

Run database migrations:
```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head

# Or use the helper script
python create_db.py
```

### 6. Start Backend Server
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd tiktok-creator-compass/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Update `.env.local` with your values:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret to your environment files

## Database Schema

The application uses the following main tables:
- `users`: User accounts and profile information
- `tiktok_profiles`: TikTok profile data and metrics
- `tiktok_videos`: Individual video performance data
- `profile_analytics`: Historical analytics snapshots
- `creator_recommendations`: AI-generated creator recommendations

## API Documentation

Once the backend is running, visit:
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Workflow

1. **Backend Development**:
   - Make changes to Python files
   - Server auto-reloads with uvicorn
   - Use `alembic revision --autogenerate` for database changes

2. **Frontend Development**:
   - Make changes to React/TypeScript files
   - Next.js auto-reloads in development
   - Use Tailwind CSS for styling

## Testing the Application

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Click "Continue with Google" to authenticate
4. Complete onboarding with your TikTok username
5. Explore the dashboard and analytics

## Troubleshooting

### Common Issues

**Database Connection Error**:
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

**Google OAuth Error**:
- Verify Google Client ID/Secret
- Check redirect URI matches exactly
- Ensure Google+ API is enabled

**TikTok Scraping Issues**:
- Install Chrome browser
- Check if TikTok profile is public
- Some profiles may be rate-limited

**CORS Issues**:
- Verify FRONTEND_URL in backend .env
- Check API_URL in frontend .env.local

### Logs and Debugging

- Backend logs: Check terminal running `python run.py`
- Frontend logs: Check browser console and terminal running `npm run dev`
- Database logs: Check PostgreSQL logs

## Production Deployment

For production deployment:

1. **Backend**:
   - Use production WSGI server (gunicorn)
   - Set up proper environment variables
   - Configure database with connection pooling
   - Set up Redis for background tasks

2. **Frontend**:
   - Build with `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Update environment variables for production

3. **Database**:
   - Use managed PostgreSQL service
   - Set up backups and monitoring
   - Configure SSL connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section above
- Review API documentation at `/docs`
- Create an issue in the repository
