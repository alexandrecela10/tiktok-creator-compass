# Environment Management Guide

## 🌍 Understanding Environments

**Environments** are different setups of your app with separate configurations, databases, and settings. Think of them as isolated versions of your app for different purposes.

### **3 Main Environments:**

1. **Development (Local)** 🏠
   - Your computer, for building and testing
   - Uses local database and test data
   - Fast iteration and debugging

2. **Staging/Test** 🧪
   - Online copy that mimics production
   - Safe place to test before going live
   - Uses test database with sample data

3. **Production** 🌐
   - Live app that real users access
   - Real database with real user data
   - Must be stable and secure

## 🔧 Setting Up Each Environment

### **Development Environment (Your Computer)**

**Frontend Setup:**
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_dev_google_client_id
```

**Backend Setup:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```bash
DATABASE_URL=postgresql://user:password@localhost/tiktok_compass_dev
SECRET_KEY=dev_secret_key_123
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
REDIS_URL=redis://localhost:6379/0
ENVIRONMENT=development
DEBUG=true
FRONTEND_URL=http://localhost:3000
```

**Run Development:**
```bash
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **Staging/Test Environment (Online Demo)**

**Purpose:** Safe testing before production

**Frontend (Netlify):**
- Branch: `staging` or `deployment`
- Environment Variables in Netlify:
```
NEXT_PUBLIC_API_URL=https://your-test-backend.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_test_google_client_id
```

**Backend (Railway - Test Instance):**
- Separate Railway project for testing
- Environment Variables in Railway:
```
DATABASE_URL=postgresql://test_db_connection
SECRET_KEY=test_secret_key_generate_random_32_chars
GOOGLE_CLIENT_ID=your_test_google_client_id
GOOGLE_CLIENT_SECRET=your_test_google_client_secret
GOOGLE_REDIRECT_URI=https://your-staging-app.netlify.app/auth/callback
REDIS_URL=redis://redis-staging-url:6379/0
ENVIRONMENT=staging
DEBUG=false
FRONTEND_URL=https://your-staging-app.netlify.app
```

### **Production Environment (Live App)**

**Purpose:** Real users access this

**Frontend (Netlify/Vercel):**
- Branch: `main`
- Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-prod-backend.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_prod_google_client_id
```

**Backend (Railway - Production):**
- Production Railway project
- Environment Variables:
```
DATABASE_URL=postgresql://prod_db_connection
SECRET_KEY=super_secure_production_key_64_chars_random
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_client_secret
GOOGLE_REDIRECT_URI=https://your-production-app.netlify.app/auth/callback
REDIS_URL=redis://redis-production-url:6379/0
ENVIRONMENT=production
DEBUG=false
FRONTEND_URL=https://your-production-app.netlify.app
```

## 📁 File Structure for Environments

```
tiktok-creator-compass/
├── frontend/
│   ├── .env.local          # Development (your computer)
│   ├── .env.example        # Template for others
│   └── .env.production     # Production secrets (never commit)
├── backend/
│   ├── .env                # Development (your computer)
│   ├── .env.example        # Template for others
│   └── .env.production     # Production secrets (never commit)
└── .gitignore              # Excludes .env files from Git
```

## 🔐 Google OAuth for Each Environment

You need **separate Google OAuth credentials** for each environment:

### **Development OAuth:**
- Redirect URI: `http://localhost:3000/auth/callback`
- For testing on your computer

### **Staging OAuth:**
- Redirect URI: `https://your-staging-app.netlify.app/auth/callback`
- For testing the deployed version

### **Production OAuth:**
- Redirect URI: `https://your-production-app.netlify.app/auth/callback`
- For real users

**How to Create:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create separate OAuth credentials for each environment
3. Set the correct redirect URIs for each

## 🚀 Deployment Workflow

### **Step 1: Development**
```bash
# Work on your computer
git checkout main
# Make changes
git add .
git commit -m "Add new feature"
```

### **Step 2: Test Deployment**
```bash
# Deploy to staging for testing
git checkout deployment
git merge main
git push origin deployment
# Test on staging URL
```

### **Step 3: Production Deployment**
```bash
# Deploy to production when ready
git checkout main
git push origin main
# Production auto-deploys
```

## 🎯 Environment Variables Cheat Sheet

### **What Each Variable Does:**

**Frontend:**
- `NEXT_PUBLIC_API_URL`: Where your backend is hosted
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

**Backend:**
- `DATABASE_URL`: PostgreSQL database connection
- `SECRET_KEY`: Encrypts user sessions and tokens (use strong random key in production)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `GOOGLE_REDIRECT_URI`: OAuth callback URL (must match Google Console settings)
- `REDIS_URL`: Redis connection for caching and sessions
- `ENVIRONMENT`: Current environment (development/staging/production)
- `DEBUG`: Enable debug mode (true for dev, false for production)
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `TIKTOK_CLIENT_KEY`: Optional TikTok API key
- `TIKTOK_CLIENT_SECRET`: Optional TikTok API secret

### **How to Set Them:**

**Local Development:**
- Create `.env` files manually
- Never commit these files to Git

**Netlify (Frontend):**
- Go to Site Settings → Environment Variables
- Add each variable manually

**Railway (Backend):**
- Go to Project → Variables
- Add each variable manually

## 🔄 Quick Setup Commands

### **Initialize Development Environment:**
```bash
# Frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
npm install

# Backend  
cd backend
cp .env.example .env
# Edit .env with your values
pip install -r requirements.txt

# Database setup
python create_db.py
alembic upgrade head
```

### **Test Your Setup:**
```bash
# Check if environment variables are loaded
cd frontend
npm run dev
# Should show your API URL in console

cd backend
python run.py
# Should connect to your database
```

## 🆘 Common Issues & Solutions

**Problem:** "Environment variable not found"
**Solution:** 
- Check if `.env` file exists in correct directory
- Verify variable names match exactly (case-sensitive)
- Restart development servers after changing .env files

**Problem:** "OAuth redirect URI mismatch"
**Solution:** 
- Ensure Google OAuth redirect URI exactly matches your environment URL
- Check for trailing slashes and http vs https
- Verify GOOGLE_REDIRECT_URI in backend matches Google Console

**Problem:** "Database connection failed"
**Solution:** 
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure PostgreSQL is running locally for development
- Check database exists and user has permissions

**Problem:** "CORS errors"
**Solution:** 
- Update `FRONTEND_URL` in backend .env to match frontend URL
- Ensure frontend `NEXT_PUBLIC_API_URL` points to correct backend
- Check CORS middleware configuration in main.py

**Problem:** "Redis connection failed"
**Solution:**
- Install and start Redis locally: `brew install redis && brew services start redis`
- Verify `REDIS_URL` format in .env file
- For production, ensure Redis service is provisioned

**Problem:** "Secret key too short"
**Solution:**
- Generate secure secret key: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Use different keys for each environment
- Never use default/example keys in production

## 🚨 Pre-Deployment Checklist

### **Before Deploying to Staging:**
- [ ] All environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Google OAuth credentials configured for staging domain
- [ ] Redis service provisioned and accessible
- [ ] CORS settings allow staging frontend domain
- [ ] Secret keys are secure and unique

### **Before Deploying to Production:**
- [ ] All staging tests pass
- [ ] Production database backed up
- [ ] Production Google OAuth credentials configured
- [ ] All secret keys are production-grade (64+ characters)
- [ ] DEBUG=false in production environment
- [ ] Error monitoring and logging configured
- [ ] SSL certificates valid
- [ ] Domain DNS configured correctly

### **Security Best Practices:**
- Never commit .env files to Git
- Use different OAuth credentials for each environment
- Generate unique, strong secret keys for each environment
- Set DEBUG=false in staging and production
- Use HTTPS for all production URLs
- Regularly rotate secret keys and API credentials

This setup gives you clean separation between development, testing, and production with robust security! 🎉
