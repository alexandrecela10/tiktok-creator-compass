# TikTok Creator Compass

A comprehensive analytics platform for TikTok content creators to analyze performance and get growth recommendations.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **TikTok Profile Analytics** - Real-time scraping of TikTok profile data
- **Performance Dashboard** - Comprehensive analytics with engagement metrics
- **Target Audience Insights** - AI-powered follower analysis and matching
- **Creator Recommendations** - Discover similar creators in your niche
- **Top Performing Videos** - Analyze your best content with multiple metrics
- **Growth Insights** - Track follower growth and engagement trends
- **User Onboarding**: Personalized setup based on your offer and target audience
- **Google Authentication**: Secure sign-in with Google accounts

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Google OAuth integration
- TikTok data integration

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS
- React components
- Recharts for data visualization
- Warm, encouraging design similar to Whoop

## Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
tiktok-creator-compass/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── services/
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Environment Variables

Create `.env` files in both backend and frontend directories with the required configuration.
