import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.api.routes.socket import router as socket_route
from app.db.init_db import init_db
from app.messageQueue.queue_config import setup_queues
from app.messageQueue.consumer import RabbitMQConsumer
from app.services.socket_service import WebSocketService
from app.messageQueue.connection import RabbitMQConnection
from app.db.session import engine
from asyncio import create_task
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RGT-Order-System")

app = FastAPI(title="RGT Order System")

# 添加中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(order_router, prefix="/order", tags=["Order"])
app.include_router(socket_route, prefix="/socket", tags=["WebSocket"])

# 初始化服务和消费者
websocket_service = WebSocketService()
rabbitmq_consumer = RabbitMQConsumer(websocket_service)
consumer_tasks = []

@app.on_event("startup")
async def on_startup():
    logger.info("Starting application...")
    await init_db()
    logger.info("Database initialized.")
    await setup_queues()
    logger.info("RabbitMQ queues and exchange initialized.")

    # 启动消费者任务
    task = create_task(
        rabbitmq_consumer.start("orders_queue", rabbitmq_consumer.process_message)
    )
    consumer_tasks.append(task)

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down application...")
    await rabbitmq_consumer.stop()
    for task in consumer_tasks:
        task.cancel()
        try:
            await task
        except Exception as e:
            logger.error(f"Error shutting down task: {e}")

    connection = await RabbitMQConnection.get_connection()
    await connection.close()
    logger.info("RabbitMQ connection closed.")

    await engine.dispose()
    logger.info("Database connection closed.")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to RGT Order System",
        "version": "1.0.0",
        "docs": "/docs",
    }
