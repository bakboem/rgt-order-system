from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from uuid import UUID
from app.services.socket_service import websocket_service
router = APIRouter()

# 用户 WebSocket 路由
@router.websocket("/ws/user/{user_id}")
async def websocket_user_endpoint(websocket: WebSocket, user_id: UUID):
    """用户登录后连接，监听订单状态更新"""
    await websocket_service.connect_user(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received message from user {user_id}: {data}")
            await websocket_service.send_personal_message(f"Received Message\nFROM:{user_id}\nDATA:{data}", websocket)
    except WebSocketDisconnect:
        websocket_service.disconnect_user(websocket, user_id)
        print(f"User {user_id} disconnected")

# 企业 WebSocket 路由
@router.websocket("/ws/biz/{biz_id}")
async def websocket_biz_endpoint(websocket: WebSocket, biz_id: UUID):
    """企业主连接，监听企业订单状态更新"""
    await websocket_service.connect_biz(websocket, biz_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received message from biz {biz_id}: {data}")
            await websocket_service.send_personal_message(f"Hello biz {biz_id}, you sent: {data}", websocket)
    except WebSocketDisconnect:
        websocket_service.disconnect_biz(websocket, biz_id)
        print(f"Biz {biz_id} disconnected")