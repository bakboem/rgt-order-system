/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SocketUtils from '../../utils/socketUtil';
import socketService from '../../services/socketService';
import timerService from '../../services/timerService';
import { useRequestOrderList } from '../../state/homePageState/hooks';
import UserHomeDashboardListView from './UserHomeDashboardListView';
import handleMessage from '../../utils/messageHandle'
const UserHomeContentsDashboard: React.FC = () => {
  //  const isFetching = useRef(false);
   const { orders, requestOrder } = useRequestOrderList();


   
  useEffect(() => {
    requestOrder()
    // 连接 WebSocket
    SocketUtils.getSocketUrl().then((socketUrl) => {
      socketService.connect(socketUrl); // 替换为你的后端 WebSocket URL
      // 监听消息事件
      socketService.onMessage((message: string) => {
        handleMessage(message);
      });
    });
    timerService.start(async () => {
     await socketService.checkAlive();
    }, 10000); 
    return () => {
      timerService.clear();
      socketService.disconnect();
    };
  }, []);
 
  return (
    <UserHomeDashboardListView data={orders}/>
  );
};

export default UserHomeContentsDashboard;
