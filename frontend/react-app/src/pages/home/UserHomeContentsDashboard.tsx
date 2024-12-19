import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import CustomText from '../../commonView/customText';
import SocketUtils from '../../utils/socketUtil';
import socketService from '../../services/socketService';

const UserHomeContentsDashboard:React.FC = () => {

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
          socketService.sendMessage("hello Server ")
    
        });
    
        // 清理函数，组件卸载时断开 WebSocket
        return () => {
          socketService.disconnect();
        };
      }, []);

    return (
         <Box>
             <CustomText>this is home</CustomText>
        </Box>
    );
};

export default UserHomeContentsDashboard;