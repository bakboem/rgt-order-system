import asyncio
import logging
from uuid import UUID
from app.services.redis_service import RedisService
from app.services.socket_service import WebSocketService

logger = logging.getLogger("RGT-Order-System")
class RedisMessageProcessor:
    def __init__(self, redis_service:RedisService, websocket_service:WebSocketService, max_retries=5):
        self.redis_service = redis_service
        self.websocket_service = websocket_service
        self.failed_messages_key = "failed_messages"
        self.dead_letter_queue_key = "dead_letter_queue"
        self.max_retries = max_retries
        self._initialized = True

    async def retry_failed_messages(self):
        logger.info("Entering retry_failed_messages loop.")  # 确认方法是否启动
        redis = await self.redis_service.initialize()
        logger.info("Redis initialized.")  # 确认 Redis 是否初始化成功
        while True:
            try:
                # 检查队列长度
                queue_length = await redis.llen(self.failed_messages_key)
                logger.info(f"Checking queue: {self.failed_messages_key}, Length: {queue_length}")

                # 获取队列头部消息
                message_data = await redis.lpop(self.failed_messages_key)
                logger.info(f"Retrieved message_data: {message_data}")

                if message_data is None:  # 队列为空
                    logger.info("No messages in queue. Waiting...")
                    await asyncio.sleep(10)
                    continue

                # 消息处理逻辑
                logger.info(f"Processing message: {message_data}")
            except Exception as e:
                logger.error(f"Error in retry_failed_messages loop: {e}")
            finally:
                logger.info("Sleeping before next iteration.")
                await asyncio.sleep(1)

    async def process_message(self, message):
        """
        处理消息的具体逻辑，根据 user_id 和 biz_id 分别处理
        """
        biz_id = message.get("biz_id")
        user_id = message.get("user_id")
        payload = message.get("payload")
        
        if not payload:
            raise ValueError("Invalid message format: Missing payload")
        
        # 根据消息内容调用相应的广播方法
        if biz_id:
            logger.info(f"Processing message for biz_id: {biz_id}")
            await self.websocket_service.broadcast_biz_order_update(UUID(biz_id), payload)
        elif user_id:
            logger.info(f"Processing message for user_id: {user_id}")
            await self.websocket_service.broadcast_user_order_update(UUID(biz_id), payload)
        else:
            raise ValueError("Invalid message format: Missing both biz_id and user_id")

