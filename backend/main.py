import asyncio
import logging
from app.core.config import ORDER_QUEUE_NAME
from app.global_services import redis_service,redis_processor,monitoring,rabbitmq_consumer,producer
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.api.routes.socket import router as socket_route
from app.messageQueue.queue_config import setup_queues
from app.messageQueue.producer import RabbitMQProducer
from app.messageQueue.connection import RabbitMQConnection
from app.utils.setup_coloer_log import setup_logger
from contextlib import asynccontextmanager
from app.db.init_db import init_db
from app.db.session import engine
from asyncio import create_task
from dotenv import load_dotenv
#  .env 
load_dotenv()


logger = logging.getLogger("RGT-Order-System")
setup_logger()

consumer_tasks = []

# Connection Service


@asynccontextmanager
async def lifespan(app: FastAPI):
    await producer.initialize()
    logger.info("Starting application...")
    # DB
    await init_db()
    logger.info("Database initialized.")
    # RabbitMQ Queue
    await setup_queues()
    logger.info("RabbitMQ queues and exchange initialized.")

    # Task Consumer
    task = create_task(
        rabbitmq_consumer.start(ORDER_QUEUE_NAME)

    )
    consumer_tasks.append(task)

    # Redis 
    await redis_service.initialize()
 
    # redis_processor start
    retry_task = asyncio.create_task(redis_processor.retry_failed_messages())
    logger.info("Retry task started.")
    # Socket connection monitoring
    monitoring.start()

    try:
        yield  # 应用运行期间
    finally:
        # OnClose
        logger.info("Shutting down application...")
        # Cancel Retry Task 
        retry_task.cancel()
        # Stop Rabbit Consumer Task
        await rabbitmq_consumer.stop()
        for task in consumer_tasks:
            task.cancel()
            try:
                await task
            except Exception as e:
                logger.error(f"Error shutting down task: {e}")
        # Stop Rabbit
        connection = await RabbitMQConnection.get_connection()
        await connection.close()
        logger.info("RabbitMQ connection closed.")
        await redis_service.close()
        logger.info("Redis connection closed.")
        await engine.dispose()
        logger.info("Database connection closed.")
        monitoring.stop()

app = FastAPI(title="RGT Order System", lifespan=lifespan)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route
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
