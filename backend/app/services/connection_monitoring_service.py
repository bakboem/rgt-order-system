import asyncio
import json
import logging

from app.services.socket_service import WebSocketService
logger = logging.getLogger("RGT-Order-System")

class ConnectionMonitorService:
    _instance = None  # 用于存储单例实例
    _task = None      # 用于存储异步任务对象
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, websocket_service: WebSocketService):
        if not hasattr(self, "_initialized"):
            self.websocket_service = websocket_service
            self._initialized = True
    async def monitor_connections(self):
        """主任务循环，用于定时检查 WebSocket 连接状态"""
        while True:
            try:
                all_connections = list(self.websocket_service.user_connections.items()) + \
                                list(self.websocket_service.biz_connections.items())
                chunk_size = 50
                for i in range(0, len(all_connections), chunk_size):
                    tasks = []
                    for conn_id, websockets in all_connections[i:i + chunk_size]:
                        for websocket in list(websockets):
                            tasks.append(self._ping_and_check(websocket, conn_id))
                    if tasks:
                        await asyncio.gather(*tasks)
                    await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"Error in monitor_connections: {e}")
            finally:
                await asyncio.sleep(max(30, len(all_connections) // 100))  # 动态调整间隔

    async def _ping_and_check(self, websocket, identifier):
        """发送心跳，仅对非活跃连接执行"""
        last_active = self.websocket_service.last_active.get(websocket, 0)
        current_time = asyncio.get_event_loop().time()
        if current_time - last_active < 30:
            return
        try:
            await websocket.send_text(json.dumps({"type": "ping"}))
            self.websocket_service.last_active[websocket] = current_time
        except Exception as e:
            await self.websocket_service.disconnect_user(websocket, identifier)


    def start(self):
        """启动监控任务"""
        if not self._task or self._task.done():
            logger.info("Starting ConnectionMonitor task.")
            self._task = asyncio.create_task(self.monitor_connections())
            logger.warning("ConnectionMonitor Task Started")
        else:
            logger.info("ConnectionMonitor task is already running.")

    def stop(self):
        """停止监控任务"""
        if self._task and not self._task.done():
            logger.info("Stopping ConnectionMonitor task.")
            self._task.cancel()
        else:
            logger.info("ConnectionMonitor task is not running.")
