import asyncio
import json
import logging
from uuid import UUID
from aio_pika import IncomingMessage
from app.messageQueue.connection import RabbitMQConnection
from app.services import socket_service

logger = logging.getLogger(__name__)

class RabbitMQConsumer:
    def __init__(self, websocket_service: socket_service.WebSocketService):
        self.websocket_service = websocket_service
        self.tasks = set()  # 管理异步任务

    async def start(self, queue_name: str, callback):
        """启动消费者"""
        try:
            logger.info(f"Starting consumer for queue: {queue_name}")
            channel = await RabbitMQConnection.get_channel()
            queue = await channel.declare_queue(queue_name, durable=True)

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    task = asyncio.create_task(self._handle_message(message, callback))
                    self.tasks.add(task)
                    task.add_done_callback(self._on_task_done)

        except asyncio.CancelledError:
            logger.warning("Consumer task was cancelled.")
        except Exception as e:
            logger.error(f"Error consuming messages: {e}")
        finally:
            await self.stop()
            logger.info("Consumer stopped.")

    async def stop(self):
        """停止所有消费者任务"""
        logger.info("Stopping RabbitMQ consumer tasks...")
        for task in self.tasks:
            task.cancel()
        await asyncio.gather(*self.tasks, return_exceptions=True)
        self.tasks.clear()

    def _on_task_done(self, task):
        self.tasks.discard(task)
        if task.exception():
            logger.error(f"Task raised an exception: {task.exception()}")

    async def _handle_message(self, message: IncomingMessage, callback):
        try:
            async with message.process():
                await callback(message)
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            await message.nack(requeue=False)

    async def process_message(self, message: IncomingMessage):
        try:
            decoded_msg = message.body.decode() 
            logger.info(f"Decoded message: {decoded_msg}")
            data = json.loads(decoded_msg)
            logger.info(f"Parsed JSON data: {data}")
            message_type = data.get("type")
            message_data = data.get("data", [])
            logger.info(f"Parsed JSON message_type: {message_type}")
            logger.info(f"Parsed JSON message_data: {message_data}")

            for item in message_data:
                user_id = item.get("user_id")
                biz_id = item.get("biz_id")

                if message_type == "order_update":
                    if user_id:
                        await self.websocket_service.broadcast_user_order_update(
                            UUID(user_id), json.dumps(data)
                        )
                    if biz_id:
                        await self.websocket_service.broadcast_biz_order_update(
                            UUID(biz_id), json.dumps(data)
                        )
                elif message_type in [
                    "order_add", "menu_update", "stock_update", "menu_add",
                    "menu_delete", "order_delete",
                ] and biz_id:
                    await self.websocket_service.broadcast_biz_order_update(
                        UUID(biz_id), json.dumps(data)
                    )
                    logger.info(f"Call broadcast_biz_order_update successful: {message_type} - {item}")
                else:
                    logger.warning(f"Unknown or incomplete message: {message_type} - {item}")

        except Exception as e:
            logger.error(f"Error processing message: {e}")
