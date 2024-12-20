import aio_pika
from aio_pika import RobustConnection, RobustChannel
from typing import Optional

class RabbitMQConnection:
    _connection: Optional[RobustConnection] = None
    _channel: Optional[RobustChannel] = None

    @staticmethod
    async def get_connection(url: str = "amqp://guest:guest@localhost/") -> RobustConnection:
        if RabbitMQConnection._connection is None or RabbitMQConnection._connection.is_closed:
            RabbitMQConnection._connection = await aio_pika.connect_robust(
                url,
                heartbeat=60,  # 设置心跳间隔为 60 秒
                client_properties={
                    "connection_name": "aio-pika-client"  # 可选：给连接命名，便于调试
                }
            )
        return RabbitMQConnection._connection

    @staticmethod
    async def get_channel() -> RobustChannel:
        if RabbitMQConnection._channel is None or RabbitMQConnection._channel.is_closed:
            connection = await RabbitMQConnection.get_connection()
            RabbitMQConnection._channel = await connection.channel()
        return RabbitMQConnection._channel
