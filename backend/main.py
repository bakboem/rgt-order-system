from asyncio import Task, create_task
import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.api.routes.socket import router as socket_route
from app.db.init_db import init_db
from app.messageQueue.connection import RabbitMQConnection
from app.messageQueue.consumer import RabbitMQConsumer  # 修改为导入类
from app.messageQueue.queue_config import setup_queues
from app.db.session import engine
from app.services.socket_service import WebSocketService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RGT-Order-System")
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting app...")

    await init_db()
    logger.info("Database initialized.")

    await setup_queues()
    logger.info("RabbitMQ queues and consumers initialized.")

    websocket_service = WebSocketService()
    rabbitmq_consumer = RabbitMQConsumer(websocket_service)

    # 启动多个消费者任务
    tasks = [
        create_task(rabbitmq_consumer.consume_messages("orders_queue", rabbitmq_consumer.process_message)),
    ]
    app.state.consumer_tasks = tasks

    yield

    logger.info("App is shutting down...")
    for task in tasks:
        task.cancel()
        try:
            await task
        except Exception as e:
            logger.error(f"Error shutting down consumer task: {e}")

    connection = await RabbitMQConnection.get_connection()
    await connection.close()
    logger.info("RabbitMQ connection closed.")
    await engine.dispose()
    logger.info("Database connection closed.")
app = FastAPI(title="RGT Order System", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(order_router, prefix="/order", tags=["Order"])
app.include_router(socket_route, prefix="/socket", tags=["WebSocket"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to RGT Order System",
        "version": "1.0.0",
        "docs": "/docs",
    }
