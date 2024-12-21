import asyncio
import aio_pika
import logging
import json
from app.messageQueue.connection import RabbitMQConnection

logger = logging.getLogger("RabbitMQProducer")

class RabbitMQProducer:
    """
    RabbitMQ 生产者类，专注于消息的发布。
    使用单例模式确保全局唯一实例。
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, exchange_name: str = "orders_exchange"):
        if not hasattr(self, "_initialized"):
            self.exchange_name = exchange_name
            self._initialized = True  # 防止重复初始化

    async def publish_message(self, routing_key: str, message: dict, delay: int = 0):
        """
        发布消息到 RabbitMQ。
        :param routing_key: 路由键
        :param message: 消息内容（字典）
        :param delay: 延迟时间（秒），默认无延迟
        """
        try:
            channel = await RabbitMQConnection.get_channel()
            exchange = await channel.get_exchange(self.exchange_name)
            logger.info(f"Connected to exchange '{self.exchange_name}'.")

            if delay > 0:
                await asyncio.sleep(delay)

            # 将字典转换为 JSON 字符串
            message_body = json.dumps(message)
            logger.info(f"&&&&&&&&&Publishing message to routing_key '{routing_key}': {message_body}")

            await exchange.publish(
                aio_pika.Message(
                    body=message_body.encode('utf-8'),
                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT
                ),
                routing_key=routing_key,
            )
            logger.info(f"Message published to routing_key '{routing_key}': {message_body}")
        except Exception as e:
            logger.error(f"Failed to publish message to RabbitMQ: {e}")

# 使用全局单例
rabbitmq_producer = RabbitMQProducer()
