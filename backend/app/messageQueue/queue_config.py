from aio_pika import ExchangeType
from app.messageQueue.connection import RabbitMQConnection
import logging

logger = logging.getLogger("QueueConfig")

async def setup_queues():
    channel = await RabbitMQConnection.get_channel()

    exchange = await channel.declare_exchange("orders_exchange", ExchangeType.DIRECT, durable=True)
    logger.info("Declared exchange 'orders_exchange'.")

    queue = await channel.declare_queue("orders_queue", durable=True)
    logger.info("Declared queue 'orders_queue'.")

    await queue.bind(exchange, routing_key="orders")
    logger.info("Bound queue 'orders_queue' to exchange 'orders_exchange' with routing_key 'orders'.")

    print("RabbitMQ queues and exchange are ready!")
