/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import CustomText from '../../../../commonView/customText';
import timerService from '../../../../services/timerService';
import SocketUtils from '../../../../utils/socketUtil';
import webSocketService from '../../../../services/webSocketService';
import {
  useRequestBizOrderList,
  useUpdateBizOrderState,
} from '../../../../state/homePageState/hooks';
import { generateDefaultOrder } from '../../../../utils/generatorUtils';
import AllOrderPage from './AllOrderPage';

const DashboardPageForBiz: React.FC = () => {
  const eventNames = {
    orderUpdate: 'order_update',
  };
  const { orderUpdate } = eventNames;
  const { orders, requestBizOrder } = useRequestBizOrderList();
  const updateOrderStateForBiz = useUpdateBizOrderState();
  const orderUpdateHandleForBiz = (message: any) => {
    if (message.type === 'order_update') {
      if (Array.isArray(message.data)) {
        message.data.map((obj: any) => {
          if (obj?.order_id && obj?.state && obj?.biz_id) {
            const model = generateDefaultOrder({
              order_id: obj.order_id,
              state: obj.state,
              biz_id: obj.biz_id,
            });
            updateOrderStateForBiz(model);
          } else {
            console.warn('Invalid order data:', obj);
          }
        });
      }
    }
  };

  // ***INIT***
  useEffect(() => {
    let isUnmounted = false;
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        webSocketService.connect(socketUrl);
        webSocketService.registerHandler(orderUpdate, orderUpdateHandleForBiz);

        timerService.start(async () => {
          if (!isUnmounted) {
            const isAlive = await webSocketService.checkAlive();
            if (!isAlive) {
              console.warn(
                'WebSocket connection lost, attempting to reconnect...',
              );
              webSocketService.disconnect();
              webSocketService.connect(socketUrl);
            }
          }
        }, 20000);
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
      }
    };
    initializeSocket();
    requestBizOrder();
    return () => {
      isUnmounted = true;
      timerService.clear();
      webSocketService.disconnect();
      webSocketService.unregisterHandler(orderUpdate);
    };
  }, []);

  return (
     <AllOrderPage data={orders}></AllOrderPage>
  );
};

export default DashboardPageForBiz;
