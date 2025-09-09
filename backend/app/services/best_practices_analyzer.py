import asyncio
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.services.tiktok_scraper import TikTokScraper
from app.models.user import User
from app.models.tiktok_profile import TikTokProfile
import logging

logger = logging.getLogger(__name__)

class BestPracticesAnalyzer:
    """Analyzes top creators to extract actionable best practices"""
    
    def __init__(self, db: Session):
        self.db = db
        self.scraper = TikTokScraper()
    
    async def analyze_top_creators(self, user_id: int, target_audience: str = "fashion") -> Dict:
        """Analyze top creators in target audience and extract best practices"""
        try:
            # Get top creators in fashion/style niche
            top_creators = self._get_top_creators_list(target_audience)
            
            # Analyze their profiles and extract insights
            best_practices = await self._extract_best_practices(top_creators)
            
            # Generate personalized recommendations
            recommendations = self._generate_recommendations(user_id, best_practices)
            
            return {
                'best_practices': best_practices,
                'recommendations': recommendations,
                'analyzed_creators': len(top_creators),
                'target_audience': target_audience
            }
            
        except Exception as e:
            logger.error(f"Error analyzing best practices: {str(e)}")
            return self._get_fallback_best_practices(target_audience)
    
    async def _get_top_creators_list(self, niche: str) -> List[str]:
        """Get list of top creators in the specified niche by scraping data"""
        creators = await self.scraper.get_top_creators(niche)
        
        if niche == "fashion":
            return creators[:5]  # Analyze top 5 to avoid rate limits
        
        return creators[:3]  # Default fallback
    
    async def _extract_best_practices(self, creators: List[str]) -> Dict:
        """Extract best practices from top creators"""
        practices = {
            'posting_frequency': {},
            'content_themes': {},
            'engagement_strategies': {},
            'bio_patterns': {},
            'follower_ranges': {}
        }
        
        for creator in creators:
            try:
                # Get creator profile data
                profile_data = await self.scraper.get_profile_data(creator)
                if not profile_data:
                    continue
                
                # Analyze bio patterns
                bio = profile_data.get('bio', '').lower()
                self._analyze_bio_patterns(bio, practices['bio_patterns'])
                
                # Analyze follower count ranges
                followers = profile_data.get('follower_count', 0)
                self._categorize_follower_range(followers, practices['follower_ranges'])
                
                # Get recent videos for content analysis
                videos = await self.scraper.get_recent_videos(creator, limit=5)
                self._analyze_content_themes(videos, practices['content_themes'])
                
                # Analyze engagement patterns
                self._analyze_engagement_patterns(videos, practices['engagement_strategies'])
                
            except Exception as e:
                logger.warning(f"Failed to analyze creator {creator}: {str(e)}")
                continue
        
        return self._summarize_practices(practices)
    
    def _analyze_bio_patterns(self, bio: str, patterns: Dict):
        """Analyze common bio patterns"""
        keywords = ['fashion', 'style', 'outfit', 'ootd', 'brand', 'collab', 'dm', 'business']
        emojis = ['✨', '💫', '🌟', '💖', '👑', '🔥', '💯']
        
        for keyword in keywords:
            if keyword in bio:
                patterns[keyword] = patterns.get(keyword, 0) + 1
        
        for emoji in emojis:
            if emoji in bio:
                patterns[f'emoji_{emoji}'] = patterns.get(f'emoji_{emoji}', 0) + 1
    
    def _categorize_follower_range(self, followers: int, ranges: Dict):
        """Categorize follower counts into ranges"""
        if followers > 50000000:  # 50M+
            ranges['mega_influencer'] = ranges.get('mega_influencer', 0) + 1
        elif followers > 10000000:  # 10M+
            ranges['macro_influencer'] = ranges.get('macro_influencer', 0) + 1
        elif followers > 1000000:  # 1M+
            ranges['mid_tier'] = ranges.get('mid_tier', 0) + 1
        else:
            ranges['micro_influencer'] = ranges.get('micro_influencer', 0) + 1
    
    def _analyze_content_themes(self, videos: List[Dict], themes: Dict):
        """Analyze common content themes"""
        theme_keywords = {
            'dance': ['dance', 'dancing', 'choreography'],
            'fashion': ['outfit', 'ootd', 'style', 'fashion'],
            'lifestyle': ['day', 'morning', 'routine', 'life'],
            'beauty': ['makeup', 'skincare', 'beauty', 'glow'],
            'trending': ['trend', 'viral', 'challenge']
        }
        
        for video in videos:
            description = video.get('description', '').lower()
            for theme, keywords in theme_keywords.items():
                if any(keyword in description for keyword in keywords):
                    themes[theme] = themes.get(theme, 0) + 1
    
    def _analyze_engagement_patterns(self, videos: List[Dict], strategies: Dict):
        """Analyze engagement strategies"""
        for video in videos:
            views = video.get('view_count', 0)
            
            # Categorize by performance
            if views > 1000000:  # 1M+ views
                strategies['viral_content'] = strategies.get('viral_content', 0) + 1
            elif views > 100000:  # 100K+ views
                strategies['high_performing'] = strategies.get('high_performing', 0) + 1
            else:
                strategies['regular_content'] = strategies.get('regular_content', 0) + 1
    
    def _summarize_practices(self, practices: Dict) -> Dict:
        """Summarize extracted practices into actionable insights"""
        return {
            'top_bio_elements': self._get_top_elements(practices['bio_patterns'], 3),
            'most_successful_themes': self._get_top_elements(practices['content_themes'], 3),
            'engagement_insights': practices['engagement_strategies'],
            'follower_distribution': practices['follower_ranges']
        }
    
    def _get_top_elements(self, data: Dict, limit: int) -> List[Dict]:
        """Get top N elements from a frequency dictionary"""
        sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)
        return [{'element': k, 'frequency': v} for k, v in sorted_items[:limit]]
    
    def _generate_recommendations(self, user_id: int, practices: Dict) -> List[Dict]:
        """Generate personalized recommendations based on best practices"""
        recommendations = []
        
        # Bio optimization recommendations
        top_bio_elements = practices.get('top_bio_elements', [])
        if top_bio_elements:
            recommendations.append({
                'category': 'Bio Optimization',
                'title': 'Optimize Your Bio with Proven Elements',
                'description': f"Top creators use these elements: {', '.join([elem['element'] for elem in top_bio_elements[:3]])}",
                'action': 'Update your bio to include fashion keywords and relevant emojis',
                'priority': 'high'
            })
        
        # Content theme recommendations
        top_themes = practices.get('most_successful_themes', [])
        if top_themes:
            recommendations.append({
                'category': 'Content Strategy',
                'title': 'Focus on High-Performing Content Themes',
                'description': f"Most successful themes: {', '.join([theme['element'] for theme in top_themes[:3]])}",
                'action': 'Create more content around these proven themes',
                'priority': 'high'
            })
        
        # Engagement strategy recommendations
        engagement = practices.get('engagement_insights', {})
        viral_content = engagement.get('viral_content', 0)
        if viral_content > 0:
            recommendations.append({
                'category': 'Viral Strategy',
                'title': 'Learn from Viral Content Patterns',
                'description': f"Analyzed {viral_content} viral videos from top creators",
                'action': 'Study viral content patterns and adapt successful elements',
                'priority': 'medium'
            })
        
        return recommendations
    
    def _get_fallback_best_practices(self, niche: str) -> Dict:
        """Provide fallback best practices when analysis fails"""
        return {
            'best_practices': {
                'top_bio_elements': [
                    {'element': 'fashion', 'frequency': 5},
                    {'element': 'style', 'frequency': 4},
                    {'element': '✨', 'frequency': 3}
                ],
                'most_successful_themes': [
                    {'element': 'fashion', 'frequency': 8},
                    {'element': 'lifestyle', 'frequency': 6},
                    {'element': 'trending', 'frequency': 5}
                ],
                'engagement_insights': {
                    'viral_content': 2,
                    'high_performing': 5,
                    'regular_content': 8
                }
            },
            'recommendations': [
                {
                    'category': 'Content Strategy',
                    'title': 'Focus on Fashion and Lifestyle Content',
                    'description': 'Fashion and lifestyle content performs best in your niche',
                    'action': 'Create outfit posts, style tips, and lifestyle content',
                    'priority': 'high'
                }
            ],
            'analyzed_creators': 0,
            'target_audience': niche,
            'note': 'Using fallback recommendations due to analysis limitations'
        }
    
    async def close(self):
        """Close the scraper connection"""
        if self.scraper:
            await self.scraper.close()
