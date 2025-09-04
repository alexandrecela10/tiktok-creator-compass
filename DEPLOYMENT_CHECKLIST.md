# Deployment Checklist - Step by Step Guide

This checklist ensures smooth deployment of both frontend and backend components across all environments.

## 🔧 Local Development Setup

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running (`brew install redis && brew services start redis`)
- [ ] Git repository cloned

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your local values
pip install -r requirements.txt
python create_db.py
alembic upgrade head
python run.py
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your local values
npm install
npm run dev
```

### Verification
- [ ] Backend runs on http://localhost:8000
- [ ] Frontend runs on http://localhost:3000
- [ ] Database connection successful
- [ ] Redis connection successful
- [ ] Google OAuth login works locally

---

## 🧪 Staging Deployment

### Backend (Railway - Staging)
1. **Create Railway Project**
   - [ ] Create new Railway project for staging
   - [ ] Connect to GitHub repository
   - [ ] Set deployment branch to `deployment` or `staging`

2. **Environment Variables**
   - [ ] `DATABASE_URL` - Railway PostgreSQL URL
   - [ ] `SECRET_KEY` - Generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
   - [ ] `GOOGLE_CLIENT_ID` - Staging Google OAuth client ID
   - [ ] `GOOGLE_CLIENT_SECRET` - Staging Google OAuth secret
   - [ ] `GOOGLE_REDIRECT_URI` - `https://staging-app.netlify.app/auth/callback`
   - [ ] `REDIS_URL` - Railway Redis URL
   - [ ] `ENVIRONMENT=staging`
   - [ ] `DEBUG=false`
   - [ ] `FRONTEND_URL` - Staging frontend URL

3. **Database Setup**
   - [ ] Railway PostgreSQL service added
   - [ ] Database migrations run automatically on deploy
   - [ ] Database connection verified

### Frontend (Netlify - Staging)
1. **Site Configuration**
   - [ ] Create new Netlify site
   - [ ] Connect to GitHub repository
   - [ ] Set deployment branch to `deployment` or `staging`
   - [ ] Build command: `npm install && npm run build`
   - [ ] Publish directory: `frontend/out`

2. **Environment Variables**
   - [ ] `NEXT_PUBLIC_API_URL` - Railway staging backend URL
   - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Staging Google OAuth client ID

3. **Google OAuth Setup**
   - [ ] Create staging OAuth credentials in Google Console
   - [ ] Set redirect URI to staging Netlify URL + `/auth/callback`
   - [ ] Test OAuth flow on staging

### Staging Verification
- [ ] Staging backend accessible and healthy
- [ ] Staging frontend loads correctly
- [ ] Google OAuth login works
- [ ] Database operations work
- [ ] TikTok scraping functions
- [ ] All API endpoints respond correctly
- [ ] CORS configured properly

---

## 🌐 Production Deployment

### Backend (Railway - Production)
1. **Create Production Railway Project**
   - [ ] Separate Railway project for production
   - [ ] Connect to GitHub repository
   - [ ] Set deployment branch to `main`

2. **Environment Variables**
   - [ ] `DATABASE_URL` - Production PostgreSQL URL
   - [ ] `SECRET_KEY` - Generate new 64-char key: `python -c "import secrets; print(secrets.token_urlsafe(48))"`
   - [ ] `GOOGLE_CLIENT_ID` - Production Google OAuth client ID
   - [ ] `GOOGLE_CLIENT_SECRET` - Production Google OAuth secret
   - [ ] `GOOGLE_REDIRECT_URI` - Production domain + `/auth/callback`
   - [ ] `REDIS_URL` - Production Redis URL
   - [ ] `ENVIRONMENT=production`
   - [ ] `DEBUG=false`
   - [ ] `FRONTEND_URL` - Production frontend URL

3. **Production Database**
   - [ ] Production PostgreSQL service provisioned
   - [ ] Database backup strategy configured
   - [ ] Connection pooling configured
   - [ ] Database migrations run

### Frontend (Netlify - Production)
1. **Production Site**
   - [ ] Create production Netlify site
   - [ ] Connect to GitHub repository
   - [ ] Set deployment branch to `main`
   - [ ] Custom domain configured (if applicable)

2. **Environment Variables**
   - [ ] `NEXT_PUBLIC_API_URL` - Production Railway backend URL
   - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Production Google OAuth client ID

3. **Production OAuth**
   - [ ] Create production OAuth credentials in Google Console
   - [ ] Set redirect URI to production domain + `/auth/callback`
   - [ ] Verify OAuth credentials work

### Production Verification
- [ ] Production backend accessible via HTTPS
- [ ] Production frontend loads via HTTPS
- [ ] SSL certificates valid
- [ ] Google OAuth login works
- [ ] Database operations work
- [ ] All API endpoints secure and functional
- [ ] Error monitoring configured
- [ ] Performance monitoring active

---

## 🚨 Critical Security Checks

### Before Any Deployment
- [ ] No `.env` files committed to Git
- [ ] All secret keys are unique per environment
- [ ] DEBUG=false in staging and production
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Database credentials secure

### Production-Specific
- [ ] Secret keys are 64+ characters
- [ ] OAuth credentials are production-only
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

## 🔄 Deployment Workflow

### Development to Staging
```bash
git checkout main
# Make and test changes locally
git add .
git commit -m "Feature: description"
git push origin main

# Deploy to staging
git checkout deployment
git merge main
git push origin deployment
# Test on staging environment
```

### Staging to Production
```bash
# After staging tests pass
git checkout main
git push origin main
# Production auto-deploys from main branch
```

---

## 🆘 Troubleshooting Guide

### Common Deployment Issues

**Backend won't start:**
- Check all environment variables are set
- Verify database connection string
- Check Railway logs for specific errors
- Ensure Redis service is running

**Frontend build fails:**
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check for TypeScript errors
- Review Netlify build logs

**OAuth errors:**
- Verify redirect URIs match exactly
- Check client ID/secret are correct for environment
- Ensure HTTPS in production
- Test OAuth flow step by step

**Database connection issues:**
- Verify DATABASE_URL format
- Check database service is running
- Ensure migrations have run
- Test connection from Railway console

**CORS errors:**
- Verify FRONTEND_URL matches actual frontend domain
- Check CORS middleware configuration
- Ensure both HTTP and HTTPS are handled correctly

### Emergency Rollback
```bash
# If production deployment fails
git checkout main
git revert HEAD  # Revert last commit
git push origin main
# Or redeploy previous working commit
```

This checklist ensures robust, secure deployment across all environments with proper verification at each step.
