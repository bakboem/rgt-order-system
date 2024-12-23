/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import timerService from '../../../../services/timerService';
import SocketUtils from '../../../../utils/socketUtil';
import webSocketService from '../../../../services/webSocketService';
import {
  useAddBizOrderState,
  useRequestBizOrderList,
  useUpdateBizOrderState,
} from '../../../../state/homePageState/hooks';
import { generateDefaultOrder } from '../../../../utils/generatorUtils';
import AllOrderPage from './AllOrderPage';

const DashboardPageForBiz: React.FC = () => {
  const eventNames = {
    orderUpdate: 'order_update',
    orderAdd:'order_add'
  };
  const { orderUpdate,orderAdd } = eventNames;

  const updateOrderStateForBiz = useUpdateBizOrderState();
      const { orders, requestBizOrder } = useRequestBizOrderList();
  const addOrderStateForBiz = useAddBizOrderState();
  const orderUpdateHandleForBiz = (message: any) => {
    if (message.type === orderUpdate) {
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
  const orderAddHandleForBiz = (message: any) => {
    if (message.type === orderAdd){
      if (Array.isArray(message.data)) {
        message.data.map((obj: any) => {
          if (obj?.id && obj?.menu_id && obj?.biz_id&&obj?.menu) {
            addOrderStateForBiz(obj);
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
        webSocketService.registerHandler(orderAdd,orderAddHandleForBiz)
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
    if (!isUnmounted) {
      requestBizOrder();
    }
    return () => {
      isUnmounted = true;
      timerService.clear();
      webSocketService.disconnect();
      webSocketService.unregisterHandler(orderUpdate);
      webSocketService.unregisterHandler(orderAdd);
    };
  }, []);

  return (
     <AllOrderPage></AllOrderPage>
  );
};

export default DashboardPageForBiz;
