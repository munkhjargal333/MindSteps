"""
Redis холболт болон RQ Queue factory.
Queue тус бүр тусдаа үүрэгтэй:
  - analysis_queue    : тэмдэглэлийн LLM шинжилгээ
  - deep_insight_queue: гүн шинжилгээ (10+ тэмдэглэлийн дараа)
"""

from functools import lru_cache
import redis
from rq import Queue
from app.core.settings import get_settings

_settings = get_settings()


@lru_cache()
def get_redis_connection() -> redis.Redis:
    return redis.from_url(_settings.redis_url)


@lru_cache()
def get_analysis_queue() -> Queue:
    return Queue("analysis", connection=get_redis_connection())


@lru_cache()
def get_deep_insight_queue() -> Queue:
    return Queue("deep_insight", connection=get_redis_connection())
