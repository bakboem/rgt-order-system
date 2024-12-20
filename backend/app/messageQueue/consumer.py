import asyncio
import json
import logging
from uuid import UUID
from app.messageQueue.connection import RabbitMQConnection
from app.services import socket_service

logger = logging.getLogger(__name__)

class RabbitMQConsumer:
    """
    RabbitMQ 消费者类，用于处理消息队列并通过 WebSocket 通知。
    """
    def __init__(self, websocket_service: socket_service.WebSocketService):
        self.websocket_service = websocket_service
    async def consume_messages(self, queue_name: str, callback):
        """
        异步消费消息队列中的消息。
        """
        try:
            channel = await RabbitMQConnection.get_channel()
            queue = await channel.declare_queue(queue_name, durable=True)

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        try:
                            await callback(message.body.decode())
                        except Exception as e:
                            logger.error(f"Error processing message: {e}")
        except asyncio.CancelledError:
            logger.info("consume_messages task was cancelled.")
        except Exception as e:
            logger.error(f"Error consuming messages: {e}")
        finally:
            logger.info("Consumer task exiting.")
    async def process_message(self, message: str):
        logger.info(f"Processing message: {message}")

        try:
            data = json.loads(message)
            message_type = data.get("type")
            message_data = data.get("data", [])

            for item in message_data:
                user_id = item.get("user_id")
                biz_id = item.get("biz_id")

                if message_type == "order_update" and user_id:
                    logger.info(f"Broadcasting order_update to user {user_id}")
                    await socket_service.broadcast_user_order_update(
                        UUID(user_id), f"Order Status: {item.get('status')}"
                    )
                elif message_type in ["order_add", "menu_update", "stock_update"] and biz_id:
                    logger.info(f"Broadcasting {message_type} to biz {biz_id} with data {item}")
                    await socket_service.broadcast_biz_order_update(
                        UUID(biz_id), json.dumps(item)
                    )
                else:
                    logger.warning(f"Unknown or incomplete message: {message_type} - {item}")

        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode message: {message}. Error: {e}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")
