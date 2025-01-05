

from redis.asyncio import Redis
from redis.asyncio import from_url
from app.core.config import REDIS_PASSWORD, REDIS_URL


class RedisService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, redis_url: str,password: str = None):
        if not hasattr(self, "_initialized"):
            self.redis_url = redis_url
            self.redis: Redis = None
            self.password = password
            self._initialized = True
    async def initialize(self):
        if not self.redis:
            self.redis = await from_url(self.redis_url,password=self.password)
        return self.redis

    async def close(self):
        if self.redis:
            await self.redis.close()
            self.redis.wait(num_replicas=1, timeout=1000) 
redis_client = RedisService(redis_url=REDIS_URL,password=REDIS_PASSWORD)
