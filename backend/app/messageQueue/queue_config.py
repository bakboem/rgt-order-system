from aio_pika import ExchangeType
from app.messageQueue.connection import RabbitMQConnection

async def setup_queues():
    channel = await RabbitMQConnection.get_channel()

    # 声明交换器
    exchange = await channel.declare_exchange("orders_exchange", ExchangeType.DIRECT, durable=True)

    # 声明队列
    queue = await channel.declare_queue("orders_queue", durable=True)

    # 绑定队列到交换器
    await queue.bind(exchange, routing_key="orders")

    print("RabbitMQ queues and exchange are ready!")
