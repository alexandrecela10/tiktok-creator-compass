# Database Verification Commands

## Check All Users
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "SELECT id, email, name, google_id, tiktok_username, created_at FROM users;"
```

## Check User Details (including onboarding data)
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "SELECT id, email, name, tiktok_username, offer_description, target_audience FROM users;"
```

## Check All Database Tables
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "\dt"
```

## Count Records in Each Table
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'tiktok_profiles', COUNT(*) FROM tiktok_profiles
UNION ALL
SELECT 'tiktok_videos', COUNT(*) FROM tiktok_videos
UNION ALL
SELECT 'profile_analytics', COUNT(*) FROM profile_analytics
UNION ALL
SELECT 'creator_recommendations', COUNT(*) FROM creator_recommendations;"
```

## Check TikTok Profile Data (when available)
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "SELECT * FROM tiktok_profiles;"
```

## Check Analytics Data (when available)
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "SELECT * FROM profile_analytics;"
```

## Delete Test User (if needed)
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "DELETE FROM users WHERE email = 'your_email@example.com';"
```

## Reset Database (if needed)
```bash
docker exec tiktok_compass_db psql -U tiktok_user -d tiktok_compass -c "TRUNCATE users, tiktok_profiles, tiktok_videos, profile_analytics, creator_recommendations RESTART IDENTITY CASCADE;"
```
