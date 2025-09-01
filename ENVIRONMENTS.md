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
SECRET_KEY=test_secret_key
GOOGLE_CLIENT_ID=your_test_google_client_id
GOOGLE_CLIENT_SECRET=your_test_google_client_secret
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
SECRET_KEY=super_secure_production_key
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_client_secret
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
- `SECRET_KEY`: Encrypts user sessions and tokens
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret

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

# Backend  
cd backend
cp .env.example .env
# Edit .env with your values
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

## 🆘 Common Issues

**Problem:** "Environment variable not found"
**Solution:** Check if `.env` file exists and variable names match exactly

**Problem:** "OAuth redirect URI mismatch"
**Solution:** Make sure Google OAuth redirect URI matches your environment URL

**Problem:** "Database connection failed"
**Solution:** Verify `DATABASE_URL` format and database is running

**Problem:** "CORS errors"
**Solution:** Update backend CORS settings for your frontend domain

This setup gives you clean separation between development, testing, and production! 🎉
