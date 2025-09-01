# TikTok Creator Compass - Deployment Guide

## 🚀 Deployment Options

### Option 1: Frontend-Only Demo Deployment (Recommended for Sharing)

Deploy just the frontend with demo mode for easy sharing and demonstration.

#### Frontend Deployment (Netlify)

1. **Connect Repository to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository: `alexandrecela10/Tiktok_Creator_Compass`

2. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm install && npm run build
   Publish directory: frontend/out
   ```

3. **Environment Variables**
   Set in Netlify dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Demo Mode Features**
   - Automatic demo mode detection on Netlify domains
   - Mock authentication with sample data
   - Full UI functionality without backend
   - Perfect for showcasing the application

### Option 2: Full-Stack Production Deployment

Deploy both frontend and backend for complete functionality.

#### Backend Deployment (Railway)

1. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   Set in Railway dashboard:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Database Setup**
   - Railway provides PostgreSQL add-on
   - Run migrations: `python create_db.py`

#### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from frontend directory
   cd frontend
   vercel --prod
   ```

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## 🔧 Configuration Files

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "frontend/out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Next.js Configuration (`frontend/next.config.js`)
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}
```

## 🎯 Deployment Strategy

### For Demo/Sharing (Recommended)
- **Frontend Only**: Deploy to Netlify with demo mode
- **Benefits**: Fast deployment, no backend setup required
- **Features**: Full UI with mock data, perfect for demonstrations
- **URL**: `https://your-app.netlify.app`

### For Production Use
- **Full Stack**: Deploy backend to Railway, frontend to Vercel
- **Benefits**: Real TikTok data scraping, full functionality
- **Requirements**: Database setup, environment variables
- **URL**: `https://your-app.vercel.app`

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use platform-specific environment variable settings
- Rotate secrets for production deployment

### Google OAuth
- Update redirect URIs for production domains
- Use separate OAuth credentials for production
- Configure CORS for production domains

### Database
- Use connection pooling for production
- Enable SSL for database connections
- Regular backups and monitoring

## 📊 Monitoring & Analytics

### Frontend Monitoring
- Netlify Analytics for traffic insights
- Error tracking with Sentry (optional)
- Performance monitoring

### Backend Monitoring
- Railway metrics and logs
- Database performance monitoring
- API response time tracking

## 🚀 Quick Deploy Commands

### Demo Deployment (Frontend Only)
```bash
git checkout deployment
git add .
git commit -m "Configure for demo deployment"
git push origin deployment
# Then connect to Netlify via GitHub
```

### Full Production Deployment
```bash
# Backend
cd backend
railway init
railway up

# Frontend
cd frontend
vercel --prod
```

## 🔄 Continuous Deployment

### Automatic Deployments
- **Netlify**: Auto-deploy on push to `deployment` branch
- **Railway**: Auto-deploy backend on push to `main` branch
- **Vercel**: Auto-deploy frontend on push to `main` branch

### Branch Strategy
- `main`: Stable production code
- `deployment`: Frontend deployment configurations
- `development`: Active development work

## 📝 Post-Deployment Checklist

- [ ] Frontend accessible via public URL
- [ ] Demo mode working correctly
- [ ] Google OAuth configured for production domain
- [ ] Backend API responding (if full-stack)
- [ ] Database migrations applied (if full-stack)
- [ ] Environment variables set correctly
- [ ] SSL certificates active
- [ ] Domain configured (optional)

## 🆘 Troubleshooting

### Common Issues
- **Build Failures**: Check Node.js version and dependencies
- **OAuth Errors**: Verify redirect URIs and client IDs
- **API Errors**: Check CORS configuration and environment variables
- **Database Issues**: Verify connection string and migrations

### Debug Commands
```bash
# Test frontend build locally
cd frontend
npm run build

# Test backend locally
cd backend
python run.py

# Check environment variables
echo $NEXT_PUBLIC_API_URL
```
