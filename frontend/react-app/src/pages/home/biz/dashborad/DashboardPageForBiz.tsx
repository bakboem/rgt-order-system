import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import CustomText from '../../../../commonView/customText';
import timerService from '../../../../services/timerService';
import SocketUtils from '../../../../utils/socketUtil';
import webSocketService from '../../../../services/webSocketService';


const DashboardPageForBiz: React.FC = () => {
 
  useEffect(() => {
    let isUnmounted = false;
  
    // 初始化
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        webSocketService.connect(socketUrl);
  
        // 启动心跳检测
        timerService.start(async () => {
          if (!isUnmounted) {
            const isAlive = await webSocketService.checkAlive();
            if (!isAlive) {
              console.warn("WebSocket connection lost, attempting to reconnect...");
              webSocketService.disconnect();
              webSocketService.connect(socketUrl); // 自动重连
            }
          }
        }, 10000); // 每 10 秒检测一次
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
      }
    };
  
    initializeSocket();
  
    // 清理资源
    return () => {
      isUnmounted = true;
      timerService.clear();
      webSocketService.disconnect();
    };
  }, []);
  
  
  return (
    <Box>
      <CustomText>this is biz dashboard</CustomText>
    </Box>
  );
};

export default DashboardPageForBiz;
