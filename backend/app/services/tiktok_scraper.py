import httpx
import json
from typing import Dict, List, Optional
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

class TikTokScraper:
    def __init__(self):
        self.session = httpx.AsyncClient()
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    async def get_profile_data(self, username: str) -> Optional[Dict]:
        """Scrape TikTok profile data from public profile"""
        try:
            # Remove @ if present
            username = username.lstrip('@')
            url = f"https://www.tiktok.com/@{username}"
            
            # Use Selenium for dynamic content
            driver = webdriver.Chrome(options=self.chrome_options)
            driver.get(url)
            
            # Wait for profile data to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[data-e2e='user-page']"))
            )
            
            time.sleep(3)  # Additional wait for dynamic content
            
            # Extract profile information
            profile_data = {
                "username": username,
                "display_name": self._extract_display_name(driver),
                "bio": self._extract_bio(driver),
                "follower_count": self._extract_follower_count(driver),
                "following_count": self._extract_following_count(driver),
                "likes_count": self._extract_likes_count(driver),
                "video_count": self._extract_video_count(driver),
                "avatar_url": self._extract_avatar_url(driver),
                "is_verified": self._check_verification(driver)
            }
            
            driver.quit()
            return profile_data
            
        except Exception as e:
            print(f"Error scraping profile {username}: {str(e)}")
            if 'driver' in locals():
                driver.quit()
            return None

    def _extract_display_name(self, driver) -> Optional[str]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='user-title']")
            return element.text.strip()
        except:
            return None

    def _extract_bio(self, driver) -> Optional[str]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='user-bio']")
            return element.text.strip()
        except:
            return None

    def _extract_follower_count(self, driver) -> Optional[int]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='followers-count']")
            return self._parse_count(element.text)
        except:
            return None

    def _extract_following_count(self, driver) -> Optional[int]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='following-count']")
            return self._parse_count(element.text)
        except:
            return None

    def _extract_likes_count(self, driver) -> Optional[int]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='likes-count']")
            return self._parse_count(element.text)
        except:
            return None

    def _extract_video_count(self, driver) -> Optional[int]:
        try:
            # Video count is often inferred from the number of videos on the profile
            video_elements = driver.find_elements(By.CSS_SELECTOR, "[data-e2e='user-post-item']")
            return len(video_elements)
        except:
            return None

    def _extract_avatar_url(self, driver) -> Optional[str]:
        try:
            element = driver.find_element(By.CSS_SELECTOR, "[data-e2e='user-avatar'] img")
            return element.get_attribute("src")
        except:
            return None

    def _check_verification(self, driver) -> bool:
        try:
            driver.find_element(By.CSS_SELECTOR, "[data-e2e='user-verified']")
            return True
        except:
            return False

    def _parse_count(self, count_text: str) -> Optional[int]:
        """Parse count strings like '1.2M', '45.6K', '123' to integers"""
        if not count_text:
            return None
        
        count_text = count_text.strip().upper()
        
        # Remove any non-numeric characters except K, M, B, and decimal points
        clean_text = re.sub(r'[^\d.KMB]', '', count_text)
        
        if 'B' in clean_text:
            multiplier = 1_000_000_000
            number = clean_text.replace('B', '')
        elif 'M' in clean_text:
            multiplier = 1_000_000
            number = clean_text.replace('M', '')
        elif 'K' in clean_text:
            multiplier = 1_000
            number = clean_text.replace('K', '')
        else:
            multiplier = 1
            number = clean_text
        
        try:
            return int(float(number) * multiplier)
        except ValueError:
            return None

    async def get_recent_videos(self, username: str, limit: int = 10) -> List[Dict]:
        """Scrape recent videos from a TikTok profile"""
        try:
            username = username.lstrip('@')
            url = f"https://www.tiktok.com/@{username}"
            
            driver = webdriver.Chrome(options=self.chrome_options)
            driver.get(url)
            
            # Wait for videos to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[data-e2e='user-post-item']"))
            )
            
            time.sleep(3)
            
            # Extract video data
            video_elements = driver.find_elements(By.CSS_SELECTOR, "[data-e2e='user-post-item']")[:limit]
            videos = []
            
            for element in video_elements:
                try:
                    video_data = {
                        "video_url": element.find_element(By.TAG_NAME, "a").get_attribute("href"),
                        "view_count": self._extract_video_views(element),
                        "description": self._extract_video_description(element)
                    }
                    videos.append(video_data)
                except Exception as e:
                    print(f"Error extracting video data: {str(e)}")
                    continue
            
            driver.quit()
            return videos
            
        except Exception as e:
            print(f"Error scraping videos for {username}: {str(e)}")
            if 'driver' in locals():
                driver.quit()
            return []

    def _extract_video_views(self, element) -> Optional[int]:
        try:
            view_element = element.find_element(By.CSS_SELECTOR, "[data-e2e='video-views']")
            return self._parse_count(view_element.text)
        except:
            return None

    def _extract_video_description(self, element) -> Optional[str]:
        try:
            desc_element = element.find_element(By.CSS_SELECTOR, "[data-e2e='video-desc']")
            return desc_element.text.strip()
        except:
            return None

    async def close(self):
        """Close the HTTP session"""
        await self.session.aclose()
