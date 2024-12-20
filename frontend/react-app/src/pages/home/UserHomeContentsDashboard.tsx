/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import SocketUtils from '../../utils/socketUtil';
import socketService from '../../services/socketService';
import timerService from '../../services/timerService';
import { useRequestOrderList } from '../../state/homePageState/hooks';
import UserHomeDashboardListView from './UserHomeDashboardListView';

const UserHomeContentsDashboard: React.FC = () => {
  const isFetching = useRef(false);
   const { orders, requestOrder } = useRequestOrderList();
  const handleMessage = (data: any) => {
    console.log('Received message from server:', data);
  };
  useEffect(() => {
    if (isFetching.current) return; // 防止重复请求
    isFetching.current = true;
    requestOrder();
    SocketUtils.getSocketUrl().then((socketUrl) => {
      socketService.connect(socketUrl); // 替换为你的后端 WebSocket URL
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
