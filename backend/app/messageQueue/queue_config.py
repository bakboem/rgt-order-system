from aio_pika import ExchangeType
from app.core.config import ORDER_EXCHANGE, ORDER_QUEUE_NAME, ROUTING_KEY
from app.messageQueue.connection import RabbitMQConnection
import logging

logger = logging.getLogger("QueueConfig")

async def setup_queues():
    channel = await RabbitMQConnection.get_channel()

    exchange = await channel.declare_exchange(ORDER_EXCHANGE, ExchangeType.DIRECT, durable=True)
    logger.info("Declared exchange ${ORDER_EXCHANGE}.")

    queue = await channel.declare_queue(ORDER_QUEUE_NAME, durable=True)
    logger.info("Declared queue ${ORDER_QUEUE_NAME}.")

    await queue.bind(exchange, routing_key=ROUTING_KEY)
    logger.info("Bound queue 'orders_queue' to exchange '${ORDER_EXCHANGE}' with routing_key '${ROUTING_KEY}'.")

    print("RabbitMQ queues and exchange are ready!")
