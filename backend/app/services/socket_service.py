from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict
from uuid import UUID

class WebSocketService:
    def __init__(self):
        self.user_connections: Dict[UUID, List[WebSocket]] = {}  # 用户ID -> 连接列表
        self.biz_connections: Dict[UUID, List[WebSocket]] = {}  # 企业ID -> 连接列表

    async def connect_user(self, websocket: WebSocket, user_id: UUID):
        """用户连接，添加到用户连接池"""
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        await websocket.accept()
        self.user_connections[user_id].append(websocket)

    async def connect_biz(self, websocket: WebSocket, biz_id: UUID):
        """企业连接，添加到企业连接池"""
        if biz_id not in self.biz_connections:
            self.biz_connections[biz_id] = []
        await websocket.accept()
        self.biz_connections[biz_id].append(websocket)

    def disconnect_user(self, websocket: WebSocket, user_id: UUID):
        """断开用户连接"""
        self.user_connections[user_id].remove(websocket)

    def disconnect_biz(self, websocket: WebSocket, biz_id: UUID):
        """断开企业连接"""
        self.biz_connections[biz_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """给单个 WebSocket 连接发送消息"""
        await websocket.send_text(message)

    async def broadcast_user_order_update(self, user_id: UUID, message: str):
        """向特定用户广播订单状态更新"""
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                await connection.send_text(message)

    async def broadcast_biz_order_update(self, biz_id: UUID, message: str):
        """向特定企业广播订单状态更新"""
        if biz_id in self.biz_connections:
            for connection in self.biz_connections[biz_id]:
                await connection.send_text(message)

    async def broadcast_to_all_users(self, message: str):
        """向所有连接的用户广播消息"""
        for connections in self.user_connections.values():
            for connection in connections:
                await connection.send_text(message)

# 创建 WebSocket 服务实例
websocket_service = WebSocketService()
