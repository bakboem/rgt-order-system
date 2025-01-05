import json
import time
from typing import Dict, List
from fastapi import WebSocket
from uuid import UUID
import logging

from app.core.config import REDIS_PASSWORD, REDIS_URL
from app.services.redis_service import RedisService

logger = logging.getLogger("RGT-Order-System")
class WebSocketService:
    def __init__(self,redis_service:RedisService):
        self.user_connections: Dict[str, List[WebSocket]] = {} 
        self.biz_connections: Dict[str, List[WebSocket]] = {}  
        self.last_active: Dict[WebSocket, float] = {}  # 新增属性，记录 WebSocket 的最后活跃时间
        self.redis_service = redis_service
        self._initialized = True
    async def connect_user(self, websocket: WebSocket, user_id: UUID):
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        logger.info(f"Connecting user: {user_id}, current connections: {self.user_connections.get(user_id, [])}")

        if websocket not in self.user_connections[user_id]:
            self.user_connections[user_id].append(websocket)
            await websocket.accept()  # 仅在新增连接时调用 accept

        logger.info(f"User {user_id} connected. Total connections: {len(self.user_connections[user_id])}")

    async def connect_biz(self, websocket: WebSocket, biz_id: UUID):
        if biz_id not in self.biz_connections:
            self.biz_connections[biz_id] = []
        logger.info(f"Connecting biz: {biz_id}, current connections: {self.biz_connections.get(biz_id, [])}")
        if websocket not in self.biz_connections[biz_id]:
            self.biz_connections[biz_id].append(websocket)
            await websocket.accept()
             
        logger.info(f"Biz {biz_id} connected. Total connections: {len(self.biz_connections[biz_id])}")
       

    async def disconnect_user(self, websocket: WebSocket, user_id: UUID):
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:  
                del self.user_connections[user_id]
            self.last_active.pop(websocket, None)

    async def disconnect_biz(self, websocket: WebSocket, biz_id: UUID):
        if biz_id in self.biz_connections:
            self.biz_connections[biz_id].remove(websocket)
            if not self.biz_connections[biz_id]:
                del self.biz_connections[biz_id]
            self.last_active.pop(websocket, None)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
            self.last_active[websocket] = time.time()  # 更新活跃时间
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            raise
            
    async def broadcast_user_order_update(self, user_id: UUID, message: str):
        connections = self.user_connections.get(user_id, [])
            
        if not connections:
            logger.warning(f"No active connections for user {user_id}")
            return  # 无连接时直接返回
        for websocket in connections:
            if not isinstance(websocket, WebSocket):
                logger.error(f"Invalid connection type: {type(websocket)}. Skipping...")
                continue  
            try:
                logger.info(f"broadcast_user_order_update: {message}")
                await websocket.send_text(json.loads(message))
               
            except Exception as e:
                logger.error(f"Error broadcasting to user {user_id}: {e}")
                await self.disconnect_user(websocket, user_id)
                await self.save_failed_message(user_id=user_id,message=message)

    async def broadcast_biz_order_update(self, biz_id: UUID, message: str):
        connections = self.biz_connections.get(biz_id, [])
        if not connections:
            logger.warning(f"No active connections for biz {biz_id}")
            return  # 无连接时直接返回
        for websocket in connections:
            try:
                await websocket.send_text(json.loads(message))
                logger.info(f"Send broadcasting Message to biz {biz_id}: {json.loads(message)}")
            except Exception as e:
                logger.error(f"Error broadcasting to biz {biz_id}: {e}")
                await self.disconnect_biz(websocket, biz_id)
                await self.save_failed_message(biz_id=biz_id,message=message)

    async def save_failed_message(self, user_id:None, biz_id:None, message:str):
        """
        将未成功发送的消息保存到 Redis
        """
        redis = await self.redis_service.initialize()
        failed_message = {
            "user_id": user_id,
            "biz_id": biz_id,
            "payload": message,
            "retries": 0,
            "timestamp": int(time.time())
        }
        await redis.rpush("failed_messages", failed_message)
        logger.info(f"Failed message saved: {failed_message}")