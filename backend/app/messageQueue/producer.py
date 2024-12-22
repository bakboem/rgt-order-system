import asyncio
import aio_pika
import logging
import json
import uuid  
from app.messageQueue.connection import RabbitMQConnection

logger = logging.getLogger("RabbitMQProducer")

class RabbitMQProducer:

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, exchange_name: str = "orders_exchange"):
        if not hasattr(self, "_initialized"):
            self.exchange_name = exchange_name
            self._initialized = True  

    async def publish_message(self, routing_key: str, message: dict, delay: int = 0):
        """
        发布消息到 RabbitMQ。
        :param routing_key: 路由键
        :param message: 消息内容（字典）
        :param delay: 延迟时间（秒），默认无延迟
        """
        try:
            channel = await RabbitMQConnection.get_channel()

            await channel.set_qos(prefetch_count=1)  
            exchange = await channel.get_exchange(self.exchange_name)
            logger.info(f"Connected to exchange '{self.exchange_name}'.")

            if delay > 0:
                await asyncio.sleep(delay)

            message_id = str(uuid.uuid4())

            message_body = json.dumps(message)
            logger.info(f"Publishing message to routing_key '{routing_key}': {message_body} (message_id={message_id})")

            msg = aio_pika.Message(
                body=message_body.encode('utf-8'),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                message_id=message_id,  
            )

            await exchange.publish(msg, routing_key=routing_key)

            logger.info(f"Message published successfully to routing_key '{routing_key}': {message_body} (message_id={message_id})")
        except Exception as e:
            logger.error(f"Failed to publish message to RabbitMQ: {e}")

rabbitmq_producer = RabbitMQProducer()
