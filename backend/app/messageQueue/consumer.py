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
    async def consume_messages(self, queue_name: str, callback):
        try:
            channel = await RabbitMQConnection.get_channel()
            queue = await channel.declare_queue(queue_name, durable=True)

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        try:
                            await callback(message)
                        except Exception as e:
                            logger.error(f"Error processing message: \n{e}\n")
        except asyncio.CancelledError:
            logger.info("consume_messages task was cancelled.")
        except Exception as e:
            logger.error(f"Error consuming messages: \n{e}\n")
        finally:
            logger.info("Consumer task exiting.")
    async def process_message(self, message: IncomingMessage):

        try:
            logger.debug("Starting to process a new message.")
            body = message.body.decode('utf-8')
            logger.info(f"Received raw message: \n{body}\n")
            data = json.loads(body)
            logger.info(f"Decoded JSON payload: \n{data}\n")
            
            if not isinstance(data, dict):
                    raise ValueError(f"Parsed data is not a dictionary. Type: \n{type(data)}\n")
            logger.info(f"Parsing Data Type : \n{type(data)}\n")
            message_type = data.get("type")
            message_data = data.get("data", [])
            logger.info(f"message_type Type : \n{type(message_type)}\n")
            logger.info(f"message_data Type : \n{type(message_data)}\n")
            logger.info(f"message_type Contents is : \n{message_type}\n")
            logger.info(f"message_data Contents is : \n{message_data}\n")

            for item in message_data:
                user_id = item.get("user_id")
                biz_id = item.get("biz_id")
                logger.info(f"biz_id type: {type(biz_id)}, value: {biz_id}")
                if message_type == "order_update":
                    if user_id:
                        await socket_service.websocket_service.broadcast_user_order_update(
                            UUID(user_id), json.dumps(body)
                        )
                    if biz_id:
                        await socket_service.websocket_service.broadcast_biz_order_update(
                            UUID(biz_id), json.dumps(body)
                        )
                elif message_type in ["order_add", "menu_update", "stock_update", "menu_add", "menu_delete", "order_delete"] and biz_id:
                    logger.info(f"Broadcasting {message_type} to biz {biz_id} with data {item}")
                    await socket_service.websocket_service.broadcast_biz_order_update(
                        UUID(biz_id), json.dumps(body)
                    )
                    #
                else:
                    logger.warning(f"Unknown or incomplete message: {message_type} - {item}")

        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode message: {message}. Error: {e}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")
