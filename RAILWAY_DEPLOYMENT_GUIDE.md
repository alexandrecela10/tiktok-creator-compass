# Railway Deployment Guide: TikTok Creator Compass Backend

## 📋 Overview

This guide explains how to deploy a FastAPI backend application to Railway, including Docker containerization, environment variable configuration, and troubleshooting common deployment issues.

## 🏗️ Architecture Overview

```
GitHub Repository → Railway Platform → Production Backend
     ↓                    ↓                    ↓
Source Code         Docker Build         Live API Server
Environment         PostgreSQL DB        User Authentication
Variables           Redis Cache          TikTok Analytics
```

## 🔧 Prerequisites

### Required Files in Your Repository:
- `backend/Dockerfile` - Container configuration
- `backend/railway.json` - Railway deployment settings
- `backend/requirements.txt` - Python dependencies
- `backend/app/main.py` - FastAPI application entry point

### Required Services:
- GitHub repository with your code
- Railway account connected to GitHub
- Google OAuth credentials (for authentication)

## 🚀 Step-by-Step Deployment Process

### 1. Prepare Your Backend for Containerization

**Dockerfile Structure:**
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port and start application
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Key Components:**
- **Base Image**: `python:3.11-slim` for lightweight Python runtime
- **System Dependencies**: PostgreSQL client, GCC for compiling packages
- **Security**: Non-root user to prevent privilege escalation
- **Port**: Exposes port 8000 for web traffic
- **Start Command**: Uvicorn ASGI server for FastAPI

### 2. Configure Railway Deployment Settings

**railway.json Configuration:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Configuration Breakdown:**
- **Builder**: Uses Docker to build the container
- **Dockerfile Path**: Points to the Dockerfile location
- **Start Command**: How Railway starts your application
- **Health Check**: Endpoint Railway pings to verify app is running
- **Restart Policy**: Automatically restarts if the app crashes

### 3. Set Up Railway Project

**Project Creation:**
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `tiktok-creator-compass` repository
4. Choose the `main` branch

**Root Directory Configuration:**
- Set **Root Directory** to `backend` in Railway Settings
- This tells Railway where to find your application code
- Alternative: Leave empty and use `./Dockerfile` path in railway.json

### 4. Configure Environment Variables

Railway requires 6 critical environment variables for your app to function:

#### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```
**Purpose**: Connects to Railway's managed PostgreSQL database
**What it enables**: User data storage, analytics persistence, session management

#### Security Configuration
```bash
SECRET_KEY=your-super-secure-random-string-here
```
**Purpose**: Signs JWT tokens for user authentication
**Generation**: Use `openssl rand -hex 32` or similar secure random generator

#### Google OAuth Configuration
```bash
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-key-here
GOOGLE_REDIRECT_URI=https://your-app.railway.app/auth/google/callback
```
**Purpose**: Enables "Sign in with Google" functionality
**Setup**: Created in Google Cloud Console OAuth 2.0 credentials

#### Caching Configuration
```bash
REDIS_URL=redis://username:password@host:port
```
**Purpose**: Caches TikTok data, stores sessions, handles background jobs
**Performance Impact**: 10x faster data retrieval, reduced API calls

### 5. Add Railway Services

**PostgreSQL Database:**
1. In Railway dashboard → Click "+" → "Database" → "PostgreSQL"
2. Railway automatically provides `DATABASE_URL` environment variable
3. Database is managed, backed up, and scaled automatically

**Redis Cache:**
1. In Railway dashboard → Click "+" → "Database" → "Redis"
2. Railway automatically provides `REDIS_URL` environment variable
3. Used for caching and session storage

### 6. Deploy and Monitor

**Deployment Process:**
1. Railway automatically builds Docker container from your Dockerfile
2. Installs dependencies from requirements.txt
3. Starts application using the configured start command
4. Performs health checks on `/health` endpoint
5. Assigns a public URL: `https://your-app.railway.app`

**Monitoring:**
- **Logs**: Real-time application logs in Railway dashboard
- **Metrics**: CPU, memory, and network usage
- **Health Checks**: Automatic monitoring of application status

## 🔍 Common Issues and Solutions

### Issue 1: "Dockerfile does not exist"
**Problem**: Railway can't find the Dockerfile
**Solutions**:
- Ensure `dockerfilePath` in railway.json is correct: `"./Dockerfile"`
- Verify Root Directory setting points to `backend`
- Check that Dockerfile exists in the correct location

### Issue 2: Build Failures
**Problem**: Docker build fails during dependency installation
**Solutions**:
- Check requirements.txt for invalid package versions
- Ensure system dependencies are installed in Dockerfile
- Verify Python version compatibility

### Issue 3: Application Won't Start
**Problem**: Container builds but app crashes on startup
**Solutions**:
- Check environment variables are set correctly
- Verify database connection string format
- Review application logs for specific error messages

### Issue 4: Health Check Failures
**Problem**: Railway can't reach the health endpoint
**Solutions**:
- Ensure `/health` endpoint exists in your FastAPI app
- Verify app binds to `0.0.0.0:$PORT`, not `localhost`
- Check firewall and port configuration

## 🔐 Security Best Practices

### Environment Variables
- **Never commit secrets** to Git repository
- Use Railway's encrypted variable storage
- Rotate secrets regularly (especially JWT secret keys)

### Container Security
- Run as non-root user in Docker container
- Use minimal base images (slim variants)
- Keep dependencies updated

### Network Security
- Configure CORS properly for your frontend domain
- Use HTTPS in production (Railway provides this automatically)
- Validate all input data

## 📊 What Each Environment Variable Enables

| Variable | Function | Impact if Missing |
|----------|----------|-------------------|
| `DATABASE_URL` | PostgreSQL connection | App crashes, no data persistence |
| `SECRET_KEY` | JWT token signing | Authentication completely broken |
| `GOOGLE_CLIENT_ID` | OAuth identification | Google login unavailable |
| `GOOGLE_CLIENT_SECRET` | OAuth authentication | Google login fails silently |
| `GOOGLE_REDIRECT_URI` | OAuth callback | Login redirect loops |
| `REDIS_URL` | Caching and sessions | 10x slower performance |

## 🎯 Production Readiness Checklist

- ✅ Dockerfile optimized for production
- ✅ railway.json configured correctly
- ✅ All 6 environment variables set
- ✅ PostgreSQL database connected
- ✅ Redis cache connected
- ✅ Health check endpoint responding
- ✅ CORS configured for frontend domain
- ✅ Google OAuth credentials valid
- ✅ SSL/HTTPS enabled (automatic on Railway)

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your connected GitHub branch:

1. **Code Change** → Push to GitHub
2. **Webhook Trigger** → Railway detects changes
3. **Build Process** → Docker container rebuilt
4. **Deploy** → New version goes live
5. **Health Check** → Verifies deployment success

This enables rapid iteration and seamless updates to your production application.

## 📞 Support and Troubleshooting

**Railway Documentation**: [docs.railway.app](https://docs.railway.app)
**FastAPI Documentation**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
**Docker Best Practices**: [docs.docker.com/develop/best-practices](https://docs.docker.com/develop/best-practices)

**Common Commands for Local Testing:**
```bash
# Build Docker image locally
docker build -t tiktok-backend ./backend

# Run container locally
docker run -p 8000:8000 --env-file .env tiktok-backend

# Test health endpoint
curl http://localhost:8000/health
```
