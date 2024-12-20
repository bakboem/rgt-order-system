import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, logger
from uuid import UUID
from app.services.socket_service import websocket_service

router = APIRouter()
@router.websocket("/user/{user_id}")
async def websocket_user_endpoint(websocket: WebSocket, user_id: UUID):
    """用户登录后连接，监听订单状态更新和处理自定义消息"""
    await websocket_service.connect_user(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong", "message": "pong"}))
            else:
                logger.info(f"Received data from user {user_id}: {data}")
    except WebSocketDisconnect:
        await websocket_service.disconnect_user(websocket, user_id)
        logger.info(f"User {user_id} disconnected")

@router.websocket("/biz/{biz_id}")
async def websocket_biz_endpoint(websocket: WebSocket, biz_id: UUID):
    """企业主登录后连接，监听订单状态更新和处理自定义消息"""
    await websocket_service.connect_biz(websocket, biz_id)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong", "message": "pong"}))
            else:
                logger.info(f"Received data from biz {biz_id}: {data}")
    except WebSocketDisconnect:
        await websocket_service.disconnect_biz(websocket, biz_id)
        logger.info(f"Biz {biz_id} disconnected")
