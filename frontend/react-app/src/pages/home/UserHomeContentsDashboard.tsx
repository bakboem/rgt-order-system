/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SocketUtils from '../../utils/socketUtil';
import socketService from '../../services/socketService';
import timerService from '../../services/timerService';
import { useRequestOrderList } from '../../state/homePageState/hooks';
import UserHomeDashboardListView from './UserHomeDashboardListView';

const UserHomeContentsDashboard: React.FC = () => {
  //  const isFetching = useRef(false);
   const { orders, requestOrder } = useRequestOrderList();

   useEffect(() => {
    let isUnmounted = false;
    // 初始化
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        socketService.connect(socketUrl);
  
        // 启动心跳检测
        timerService.start(async () => {
          if (!isUnmounted) {
            const isAlive = await socketService.checkAlive();
            if (!isAlive) {
              console.warn("WebSocket connection lost, attempting to reconnect...");
              socketService.disconnect();
              socketService.connect(socketUrl); // 自动重连
            }
          }
        }, 10000); // 每 10 秒检测一次
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
      }
    };
  
    initializeSocket();
    requestOrder()
  
    // 清理资源
    return () => {
      isUnmounted = true;
      timerService.clear();
      socketService.disconnect();
    };
  }, []);
  
 
  return (
    <UserHomeDashboardListView data={orders}/>
  );
};

export default UserHomeContentsDashboard;
