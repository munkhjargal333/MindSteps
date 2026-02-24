import redis.asyncio as aioredis
from app.core.config import get_settings

settings = get_settings()

_redis_pool: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = await aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_pool


async def close_redis():
    global _redis_pool
    if _redis_pool:
        await _redis_pool.close()
        _redis_pool = None


# Pub/Sub channel нэр
def analysis_channel(user_id: int) -> str:
    return f"analysis:user:{user_id}"


def entry_channel(entry_id: int) -> str:
    return f"analysis:entry:{entry_id}"
