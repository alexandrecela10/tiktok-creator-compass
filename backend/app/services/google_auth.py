from google.auth.transport.requests import Request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import httpx
from typing import Dict, Optional
from app.core.config import settings

class GoogleAuthService:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI

    def get_authorization_url(self) -> str:
        """Generate Google OAuth authorization URL"""
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        )
        flow.redirect_uri = self.redirect_uri
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        
        return authorization_url

    async def verify_token(self, token: str) -> Optional[Dict]:
        """Verify Google ID token and extract user info"""
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, Request(), self.client_id
            )
            
            # Extract user information
            user_info = {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'name': idinfo['name'],
                'avatar_url': idinfo.get('picture', None),
                'email_verified': idinfo.get('email_verified', False)
            }
            
            return user_info
            
        except ValueError as e:
            print(f"Token verification failed: {str(e)}")
            return None

    async def exchange_code_for_token(self, code: str) -> Optional[Dict]:
        """Exchange authorization code for access token"""
        try:
            flow = Flow.from_client_config(
                {
                    "web": {
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": [self.redirect_uri]
                    }
                },
                scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
            )
            flow.redirect_uri = self.redirect_uri
            
            # Exchange code for token
            flow.fetch_token(code=code)
            
            # Get user info from the token
            credentials = flow.credentials
            user_info = await self.get_user_info_from_credentials(credentials)
            
            return user_info
            
        except Exception as e:
            print(f"Code exchange failed: {str(e)}")
            return None

    async def get_user_info_from_credentials(self, credentials) -> Optional[Dict]:
        """Get user info using OAuth2 credentials"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers={'Authorization': f'Bearer {credentials.token}'}
                )
                
                if response.status_code == 200:
                    user_data = response.json()
                    return {
                        'google_id': user_data['id'],
                        'email': user_data['email'],
                        'name': user_data['name'],
                        'avatar_url': user_data.get('picture', None),
                        'email_verified': user_data.get('verified_email', False)
                    }
                    
        except Exception as e:
            print(f"Failed to get user info: {str(e)}")
            return None
