# TikTok Creator Compass - Code Documentation

This document explains all the code in the TikTok Creator Compass project in simple, plain English - as if explaining to a 15-year-old.

## What This App Does

The TikTok Creator Compass is like having a competitive intelligence agent for TikTok creators. It discovers and analyzes successful creators in your niche, reveals what makes them successful, and gives you actionable strategies based on proven winners. The core value isn't just showing your own data - it's uncovering the secrets of similar successful creators you can learn from. Think of it as a spy tool that reveals the winning strategies of your competition.

## How The App Is Built

The app is split into two main parts:
1. **Backend** (the brain) - Handles data, scraping TikTok, and user authentication
2. **Frontend** (the face) - The website users see and interact with

---

## Backend Code Explanation

### Main Application Setup (`app/main.py`)

This is like the main entrance to our app. It:
- Creates a FastAPI application (a web server that can handle requests)
- Sets up CORS (allows the frontend website to talk to the backend)
- Connects all the different parts of the app together
- Provides basic health check endpoints so we know the app is running

**Why we built this:** Every web app needs a main entry point that coordinates everything else.

### Configuration (`app/core/config.py`)

This file is like a settings menu for the entire app. It stores:
- Database connection details
- Google login credentials
- Security keys for protecting user data
- API endpoints and URLs

**Why we built this:** Instead of hardcoding settings throughout the app, we keep them all in one place. This makes it easy to change settings without touching the main code.

### Security (`app/core/security.py`)

This handles user authentication and security. It:
- Creates secure tokens when users log in (like digital ID cards)
- Verifies tokens to make sure users are who they say they are
- Encrypts passwords and sensitive data

**Why we built this:** We need to protect user accounts and make sure only authorized people can access their data.

### Database Models

These are like blueprints that define how we store information:

#### User Model (`app/models/user.py`)
Stores information about each user:
- Basic info (email, name, Google ID)
- TikTok username
- User preferences (like whether they want weekly updates)
- Onboarding questions (what they offer, target audience)

**Why we built this:** We need to remember who our users are and their preferences.

#### TikTok Profile Model (`app/models/tiktok_profile.py`)
Stores TikTok account information:
- Username, display name, bio
- Follower count, following count, likes
- Profile picture, verification status
- When we last updated this information

**Why we built this:** We need to store all the TikTok data we scrape so users can see their analytics.

#### TikTok Video Model (`app/models/tiktok_video.py`)
Stores information about individual TikTok videos:
- Video URL and description
- View count, like count, comments
- Engagement rate calculations
- When the video was posted

**Why we built this:** To analyze which videos perform best and give insights.

### Services (The Workers)

#### TikTok Scraper (`app/services/tiktok_scraper.py`)
This is like a robot that visits multiple TikTok profiles and collects competitive intelligence:
- Uses Selenium (automated browser) to visit many similar creators' pages
- Extracts profile data like follower count, bio, engagement patterns
- Gets information about recent videos from successful creators
- Converts text like "1.2M" into actual numbers (1,200,000)
- Analyzes patterns across multiple similar creators

**Why we built this:** The main value is analyzing successful creators in your niche to extract winning strategies that you can't easily get by manually checking profiles one by one.

#### Google Authentication (`app/services/google_auth.py`)
Handles logging in with Google accounts:
- Creates special URLs for Google login
- Verifies Google tokens to make sure they're real
- Gets user information from Google (name, email, profile picture)

**Why we built this:** Instead of making users create new passwords, we let them use their existing Google accounts for convenience and security.

### API Endpoints (The Doorways)

#### Authentication Endpoints (`app/api/v1/endpoints/auth.py`)
These are like different doors users can use to log in:
- `/google/url` - Gets the Google login page
- `/google/callback` - Handles what happens after Google login

**Why we built this:** Users need a way to log into the app securely.

#### TikTok Endpoints (`app/api/v1/endpoints/tiktok.py`)
These handle TikTok-related requests:
- `/scrape-profile` - Starts collecting data from a TikTok profile
- `/profile` - Shows the user's TikTok profile data
- `/videos` - Shows the user's TikTok videos
- `/refresh-profile` - Updates the profile data with fresh information

**Why we built this:** Users need ways to connect their TikTok accounts and see their data.

#### Analytics Endpoints (`app/api/v1/endpoints/analytics.py`)
These provide insights and analysis:
- `/overview` - Shows a summary of performance (like a report card)
- `/videos/performance` - Ranks videos by how well they performed
- `/growth` - Shows how the account has grown over time
- `/insights` - Provides AI-powered recommendations

**Why we built this:** The main value of our app is giving creators insights they can't easily get elsewhere.

---

## Frontend Code Explanation

### Main Page (`frontend/src/app/page.tsx`)
This is the first page users see when they visit the website:
- Shows a beautiful landing page explaining what the app does
- Has a "Login with Google" button
- Displays features like analytics, recommendations, and insights
- Automatically redirects logged-in users to their dashboard

**Why we built this:** We need an attractive homepage that explains the value and gets users to sign up.

### Authentication Flow
The frontend handles user login by:
- Redirecting to Google for authentication
- Storing login tokens in cookies
- Checking if users are logged in when they visit pages
- Redirecting users to appropriate pages based on their status

**Why we built this:** Users need a smooth, secure way to access their personal data.

---

## How Everything Works Together

1. **User visits the website** → Frontend shows landing page
2. **User clicks "Login with Google"** → Backend creates Google auth URL
3. **User logs in with Google** → Google sends user back with a token
4. **Backend verifies the token** → Creates user account if new, logs them in
5. **User connects TikTok account** → Backend scrapes their TikTok profile
6. **User views dashboard** → Frontend requests data from backend APIs
7. **Backend provides analytics** → Calculates insights and recommendations
8. **User sees their data** → Beautiful charts and insights on frontend

## Key Technologies Used

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - Tool for working with databases in Python
- **Selenium** - Automated web browser for scraping TikTok
- **Next.js** - React framework for building the frontend website
- **PostgreSQL** - Database for storing all user and TikTok data
- **Google OAuth** - Secure login system using Google accounts

## Why We Made These Technical Choices

1. **FastAPI** - It's fast, has automatic documentation, and great for APIs
2. **Selenium** - TikTok loads content dynamically, so we need a real browser
3. **PostgreSQL** - Reliable database that can handle lots of data
4. **Next.js** - Makes building React websites easier with built-in features
5. **Google OAuth** - Users trust Google, and it's more secure than passwords

This architecture allows us to safely collect TikTok data, store it securely, analyze it for insights, and present it beautifully to users - all while keeping their information protected and the app running smoothly.
