from app.core.config import REDIS_PASSWORD, REDIS_URL
from app.messageQueue.consumer import RabbitMQConsumer
from app.messageQueue.producer import RabbitMQProducer
from app.services.redis_service import RedisService
from app.services.socket_service import WebSocketService
from app.services.retry_processer import RedisMessageProcessor
from app.services.connection_monitoring_service import ConnectionMonitorService

# 全局服务实例
redis_service = RedisService(redis_url=REDIS_URL, password=REDIS_PASSWORD)
websocket_service = WebSocketService(redis_service=redis_service)
redis_processor = RedisMessageProcessor(redis_service=redis_service, websocket_service=websocket_service)
monitoring = ConnectionMonitorService(websocket_service=websocket_service)
rabbitmq_consumer = RabbitMQConsumer(websocket_service)
producer = RabbitMQProducer()