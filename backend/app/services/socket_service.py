import json
from fastapi import WebSocket
from uuid import UUID
import logging

logger = logging.getLogger(__name__)
class WebSocketService:
    def __init__(self):
        self.user_connections = {}  # {user_id: [websocket1, websocket2, ...]}
        self.biz_connections = {}   # {biz_id: [websocket1, websocket2, ...]}
    async def connect_user(self, websocket: WebSocket, user_id: UUID):
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        logger.info(f"Connecting user: {user_id}, current connections: {self.user_connections.get(user_id, [])}")
        self.user_connections[user_id].append(websocket)
        logger.info(f"User {user_id} connected, updated connections: {self.user_connections[user_id]}")
        await websocket.accept()

    async def connect_biz(self, websocket: WebSocket, biz_id: UUID):
        if biz_id not in self.biz_connections:
            self.biz_connections[biz_id] = []
        logger.info(f"Connecting biz: {biz_id}, current connections: {self.biz_connections.get(biz_id, [])}")
        self.biz_connections[biz_id].append(websocket)
        logger.info(f"Biz {biz_id} connected, updated connections: {self.biz_connections[biz_id]}")
        await websocket.accept()


    async def disconnect_user(self, websocket: WebSocket, user_id: UUID):
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:  # 如果没有设备连接，移除记录
                del self.user_connections[user_id]

    async def disconnect_biz(self, websocket: WebSocket, biz_id: UUID):
        if biz_id in self.biz_connections:
            self.biz_connections[biz_id].remove(websocket)
            if not self.biz_connections[biz_id]:
                del self.biz_connections[biz_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """给单个 WebSocket 连接发送消息"""
        await websocket.send_text(message)
        
    async def broadcast_user_order_update(self, user_id: UUID, message: str):
        connections = self.user_connections.get(user_id, [])
        if not connections:
            logger.warning(f"No active connections for user {user_id}")
            return  # 无连接时直接返回
        logger.info(f"Broadcasting message to biz {user_id}: {message}")
        for websocket in connections:
            try:
                logger.info(f"Websocket Public Message is  {message}")
                logger.info(f"Websocket Message Type is  {type(message)}")
                await websocket.send_text(json.loads(message))
            except Exception as e:
                logger.error(f"Error broadcasting to user {user_id}: {e}")
                #! impotant!!!
                await self.disconnect_user(websocket, user_id)

    async def broadcast_biz_order_update(self, biz_id: UUID, message: str):
        connections = self.biz_connections.get(biz_id, [])
        if not connections:
            logger.warning(f"No active connections for biz {biz_id}")
            return  # 无连接时直接返回

        logger.info(f"Broadcasting message to biz {biz_id}: {message}")
        for websocket in connections:
            try:
                await websocket.send_text(json.loads(message))
                logger.info(f"Send broadcasting Message to biz {biz_id}: {json.loads(message)}")
            except Exception as e:
                logger.error(f"Error broadcasting to biz {biz_id}: {e}")
                await self.disconnect_biz(websocket, biz_id)

websocket_service = WebSocketService()