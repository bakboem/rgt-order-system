import aio_pika
import logging
import json
import uuid  
from app.core.config import ORDER_EXCHANGE, QUEUE_URL
from app.messageQueue.connection import RabbitMQConnection

logger = logging.getLogger("RabbitMQProducer")

class RabbitMQProducer:

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, exchange_name: str = ORDER_EXCHANGE,queue_url: str = QUEUE_URL):
        if not hasattr(self, "_initialized"):
            self.exchange_name = exchange_name
            self.queue_url = queue_url
            self.connection: aio_pika.RobustConnection = None
            self.channel: aio_pika.RobustChannel = None
            self.exchange = None
            self._initialized = True

    async def initialize(self):
            """
            初始化 RabbitMQ 连接、通道和交换机。
            """
            if not self.connection or self.connection.is_closed:
                self.connection = await RabbitMQConnection.get_connection(self.queue_url)

            if not self.channel or self.channel.is_closed:
                self.channel = await self.connection.channel()
                await self.channel.set_qos(prefetch_count=1)

            # 声明交换机（如果尚未声明）
            if not self.exchange:
                self.exchange = await self.channel.declare_exchange(
                    self.exchange_name, aio_pika.ExchangeType.DIRECT, durable=True
                )

    async def publish_message(self, routing_key: str, message: dict):
        """
        发布消息到 RabbitMQ。
        :param routing_key: 路由键
        :param message: 消息内容（字典）
        :param delay: 延迟时间（秒），默认无延迟
        """
        if not self.exchange:
            await self.initialize()
            
        message_id = str(uuid.uuid4())

        message_body = json.dumps(message)
        logger.info(f"Publishing message to routing_key '{routing_key}': {message_body} (message_id={message_id})")

        msg = aio_pika.Message(
            body=message_body.encode('utf-8'),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            message_id=message_id,  
        )

        try:
            await self.exchange.publish(msg, routing_key=routing_key)
            logger.info(f"Message published successfully to routing_key '{routing_key}': {message}")
        except Exception as e:
            logger.error(f"Failed to publish message to routing_key '{routing_key}': {e}")
            raise

rabbitmq_producer = RabbitMQProducer()
