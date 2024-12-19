import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import CustomText from '../../commonView/customText';
import socketService from '../../services/socketService';
import SocketUtils from '../../utils/socketUtil';

const BizHomeContentsDashboard: React.FC = () => {
  const handleMessage = (data: any) => {
    console.log('Received message from server:', data);
  };
  useEffect(() => {
    // 连接 WebSocket
    SocketUtils.getSocketUrl().then((socketUrl) => {
      socketService.connect(socketUrl); // 替换为你的后端 WebSocket URL
      // 监听消息事件
      socketService.onMessage((message: string) => {
        handleMessage(message);
      });
      socketService.sendMessage("hello a im client ")

    });

    // 清理函数，组件卸载时断开 WebSocket
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Box>
      <CustomText>this is biz dashboard</CustomText>
    </Box>
  );
};

export default BizHomeContentsDashboard;
