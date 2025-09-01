# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.tiktok_profile import TikTokProfile  # noqa
from app.models.tiktok_video import TikTokVideo  # noqa
from app.models.analytics import ProfileAnalytics, CreatorRecommendation  # noqa
