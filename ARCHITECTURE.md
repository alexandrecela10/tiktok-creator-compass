# TikTok Creator Compass - Architecture Overview

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    USER                                         │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (Next.js)                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Landing Page  │  │   Dashboard     │  │   Analytics     │                │
│  │   - Google Auth │  │   - Profile     │  │   - Insights    │                │
│  │   - Hero        │  │   - Metrics     │  │   - Videos      │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                    │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Onboarding    │  │  Recommendations│  │   Auth Callback │                │
│  │   - TikTok ID   │  │   - Creators    │  │   - OAuth Flow  │                │
│  │   - Audience    │  │   - Insights    │  │   - Token Store │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │ HTTP/HTTPS Requests
                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                                    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        API ROUTES                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │    Auth     │ │   Users     │ │   TikTok    │ │  Analytics  │      │   │
│  │  │  /auth/*    │ │  /users/*   │ │ /tiktok/*   │ │/analytics/* │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       CORE SERVICES                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │   Auth      │ │   User      │ │   TikTok    │ │ Recommendations│   │   │
│  │  │  Service    │ │  Service    │ │  Scraper    │ │   Service     │   │   │
│  │  │             │ │             │ │             │ │               │   │   │
│  │  │- JWT Tokens │ │- User CRUD  │ │- Selenium   │ │- Creator Recs │   │   │
│  │  │- OAuth      │ │- Profiles   │ │- Data Parse │ │- Insights     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL)                                  │
│                                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │    Users    │ │  TikTok     │ │   Videos    │ │ Analytics   │              │
│  │             │ │  Profiles   │ │             │ │             │              │
│  │- id         │ │- username   │ │- video_id   │ │- metrics    │              │
│  │- email      │ │- followers  │ │- views      │ │- insights   │              │
│  │- name       │ │- likes      │ │- likes      │ │- trends     │              │
│  │- tiktok_id  │ │- videos     │ │- comments   │ │- growth     │              │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                       │
│                                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐                          │
│  │  Google OAuth   │              │     TikTok      │                          │
│  │                 │              │   (Web Scraping)│                          │
│  │- Authentication │              │                 │                          │
│  │- User Profile   │              │- Profile Data   │                          │
│  │- JWT Tokens     │              │- Video Metrics  │                          │
│  └─────────────────┘              └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Authentication Flow
```
User → Frontend → Google OAuth → Backend → JWT Token → Database → Frontend
```

### 2. TikTok Data Scraping Flow
```
User Input → Backend → TikTok Scraper → Selenium WebDriver → TikTok Website → 
Parse Data → Database → Analytics Processing → Frontend Display
```

### 3. Dashboard Analytics Flow
```
Frontend Request → Backend API → Database Query → Analytics Service → 
Data Processing → JSON Response → Frontend Visualization
```

## 🧩 Component Interactions

### Frontend Components
- **Landing Page**: Entry point with Google OAuth
- **Onboarding**: Collects TikTok username and preferences
- **Dashboard**: Main analytics interface
- **Analytics Page**: Detailed performance metrics
- **Recommendations**: Creator suggestions and insights

### Backend Services
- **Auth Service**: Handles Google OAuth and JWT tokens
- **User Service**: Manages user profiles and preferences
- **TikTok Scraper**: Extracts data from TikTok profiles
- **Analytics Service**: Processes and analyzes data
- **Recommendations Service**: Generates creator suggestions

### Database Schema
- **Users**: Store user accounts and preferences
- **TikTok Profiles**: Cache scraped profile data
- **Videos**: Store individual video metrics
- **Analytics**: Processed insights and trends

## 🔧 Technology Stack

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Notification system

### Backend Stack
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Python ORM
- **PostgreSQL**: Relational database
- **Selenium**: Web scraping automation
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Infrastructure
- **Development**: Local servers (localhost:3000, localhost:8000)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Google OAuth 2.0
- **Web Scraping**: Selenium WebDriver with Chrome

## 🚀 Deployment Architecture

### Local Development
```
Frontend (localhost:3000) ←→ Backend (localhost:8000) ←→ PostgreSQL
                                        ↓
                              TikTok Scraper (Selenium)
```

### Production Ready
```
Frontend (Netlify/Vercel) ←→ Backend (Railway/Heroku) ←→ PostgreSQL (Cloud)
                                        ↓
                              TikTok Scraper (Headless Chrome)
```

## 📊 Key Features Implementation

### Real-time Analytics
- Scrapes TikTok data on-demand
- Processes engagement metrics
- Calculates growth trends
- Generates performance insights

### AI-Powered Recommendations
- Analyzes follower demographics
- Matches target audience criteria
- Suggests similar creators
- Provides actionable insights

### Secure Authentication
- Google OAuth integration
- JWT token management
- Session handling
- User preference storage
