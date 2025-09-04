# Analytics Calculations - Plain English Guide

This document explains how we calculate engagement scores, similarity scores, and extract best practices from top creators in simple terms.

## Engagement Score Calculation

### What is an Engagement Score?
An engagement score tells you how much people interact with a video compared to how many people see it. Think of it like a "popularity percentage" - if 100 people see your video and 10 people like it, that's a 10% engagement rate.

### How We Calculate It
```
Engagement Rate = (Likes + Comments + Shares) ÷ Views × 100
```

**Example:**
- Video gets 1,000 views
- Gets 50 likes, 10 comments, 5 shares
- Total engagement = 50 + 10 + 5 = 65
- Engagement rate = 65 ÷ 1,000 × 100 = 6.5%

### Why This Matters
- **Above 5%** = Excellent engagement (your content really resonates)
- **3-5%** = Good engagement (typical for successful creators)
- **1-3%** = Average engagement (room for improvement)
- **Below 1%** = Low engagement (content needs work)

### What We Track
For each creator and video, we calculate:
- **Overall engagement rate** (across all videos)
- **Average engagement per video type** (dance, comedy, educational, etc.)
- **Engagement trends over time** (getting better or worse?)
- **Peak engagement times** (when do their videos perform best?)

---

## Similarity Score Calculation

### What is a Similarity Score?
A similarity score tells you how much another creator is like you. We look at many factors to find creators who are in your "league" and niche, so you can learn from relevant examples.

### How We Calculate Similarity

#### 1. Audience Size Similarity (30% of score)
We compare follower counts to find creators of similar size:
```
Size Score = 100 - |log(your_followers) - log(their_followers)| × 20
```
**Translation:** Creators with similar follower counts get higher scores.

#### 2. Content Category Similarity (25% of score)
We analyze video descriptions, hashtags, and content to categorize creators:
- Dance/choreography
- Comedy/entertainment  
- Educational/tutorials
- Lifestyle/vlogs
- Business/entrepreneurship
- Beauty/fashion
- Food/cooking
- Gaming
- Music/singing

**How it works:** If you're a dance creator, other dance creators get higher similarity scores.

#### 3. Engagement Pattern Similarity (20% of score)
We compare how audiences engage with content:
- Average likes per video
- Comment-to-like ratios
- Share rates
- Video length preferences

#### 4. Posting Behavior Similarity (15% of score)
We look at posting patterns:
- How often they post
- What times they post
- Video length consistency
- Use of trending sounds/hashtags

#### 5. Growth Stage Similarity (10% of score)
We compare growth trajectories:
- Recent follower growth rate
- Video performance trends
- Account age and maturity

### Final Similarity Score
```
Total Similarity = (Size × 0.3) + (Category × 0.25) + (Engagement × 0.2) + (Posting × 0.15) + (Growth × 0.1)
```

**Score Ranges:**
- **80-100%** = Very similar (learn directly from their strategies)
- **60-79%** = Quite similar (good insights available)
- **40-59%** = Somewhat similar (some applicable lessons)
- **Below 40%** = Not very similar (limited relevance)

---

## Best Practices Extraction

### How We Find Winning Strategies

#### 1. Identify Top Performers
For each similar creator, we find their best-performing videos (top 20% by engagement rate).

#### 2. Pattern Analysis
We analyze what these top videos have in common:

**Content Patterns:**
- Video length (do shorter/longer videos perform better?)
- Posting times (when do they get most engagement?)
- Hashtag strategies (which hashtags appear in top videos?)
- Caption styles (questions, statements, calls-to-action?)

**Visual Patterns:**
- Thumbnail styles
- Video opening techniques
- Use of text overlays
- Color schemes and filters

**Audio Patterns:**
- Trending vs. original sounds
- Music genres that work
- Voice-over vs. music-only content

#### 3. Best Practice Categories

**Timing Best Practices:**
- "Post between 6-9 PM for 40% higher engagement"
- "Tuesday and Thursday posts get 25% more views"
- "Videos under 15 seconds get 60% more shares"

**Content Best Practices:**
- "Ask questions in captions - increases comments by 80%"
- "Use trending sounds within first 24 hours for 3x reach"
- "Hook viewers in first 3 seconds - 70% watch time improvement"

**Hashtag Best Practices:**
- "Mix 3 trending + 2 niche hashtags for optimal reach"
- "Avoid hashtags with over 100M posts - too competitive"
- "Create branded hashtags for community building"

**Engagement Best Practices:**
- "Reply to comments within 1 hour for algorithm boost"
- "Pin your best comment to encourage more responses"
- "Cross-promote on other platforms within 2 hours"

### How We Present Best Practices

#### 1. Ranked by Impact
We show the strategies that have the biggest effect on performance first.

#### 2. Specific and Actionable
Instead of "post consistently," we say "post 3-5 times per week at 7 PM."

#### 3. Evidence-Based
Each recommendation shows:
- How many similar creators use this strategy
- Average performance improvement
- Specific examples from top performers

#### 4. Personalized Recommendations
Based on your current performance vs. similar creators:
- "Your engagement rate is 2.1%, but similar creators average 4.3%"
- "Try these 3 strategies that boosted similar creators by 50%+"
- "Focus on video length - your 30s videos get 40% less engagement than similar creators' 15s videos"

### Example Best Practice Summary

**For a Dance Creator with 50K followers:**

**Top 3 Opportunities:**
1. **Shorten videos to 10-15 seconds** - Similar creators get 65% more engagement with shorter videos
2. **Post at 8 PM EST** - Peak engagement time for your audience demographic  
3. **Use trending sounds within 6 hours** - 4x more likely to go viral

**Content Strategy:**
- Start with a hook in first 2 seconds (similar creators who do this get 80% higher completion rates)
- Include face in thumbnail (increases click-through by 45%)
- Add captions/text overlay (boosts engagement 30% for similar creators)

**Hashtag Strategy:**
- Use #fyp #dance + 1 trending dance hashtag + 2 niche hashtags
- Avoid oversaturated hashtags (over 50M posts)
- Create signature hashtag for your dance style

This approach gives creators specific, data-backed strategies they can implement immediately to improve their performance based on what's actually working for similar successful creators.
