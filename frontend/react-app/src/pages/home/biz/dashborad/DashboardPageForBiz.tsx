/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import SocketUtils from '../../../../utils/socketUtil';

import { generateDefaultOrder } from '../../../../utils/generatorUtils';
import AllOrderPage from './AllOrderPage';
import { useUpdateBizOrderState, useRequestBizOrderList, useAddBizOrderState } from '../../../../state/bizPageState/hooks';
import TabVisibilityService from '../../../../services/tabVisibilityService';
import WebSocketService from '../../../../services/webSocketService';

interface DashboardPageForBizProps {
  webSocketservice: WebSocketService;
}
const DashboardPageForBiz: React.FC<DashboardPageForBizProps> = (data) => {

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
          if (obj?.state && obj?.biz_id) {
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
 
  //  INIT 
  useEffect(() => {
    let isUnmounted = false;
    // handle Tab visibility
    const handleVisible = () => {
      data.webSocketservice.setIsLivePageState(false);
      console.warn("Page is visible");
    }
    const handleHidden = () => {
      data.webSocketservice.setIsLivePageState(true);
      console.warn("Page is hidden");
    }
    const handleUserActive = () => {
      data.webSocketservice.setIsLivePageState(false);
      console.log("User is active")
    }
    const handleUserInactive = () => {
      data.webSocketservice.setIsLivePageState(true);
      console.log("User is inactive");

    }
    const visibilityManager = new TabVisibilityService(
      handleVisible ,
      handleHidden,
      handleUserActive,
      handleUserInactive
    );
    visibilityManager.register();

    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        console.warn(`"${socketUrl}"`)
        data.webSocketservice.connect(socketUrl);
        data.webSocketservice.registerHandler(orderUpdate, orderUpdateHandleForBiz);
        data.webSocketservice.registerHandler(orderAdd,orderAddHandleForBiz)
      
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
      // timerService.clear();
      data.webSocketservice.disconnect();
      data.webSocketservice.unregisterHandler(orderUpdate);
      data.webSocketservice.unregisterHandler(orderAdd);
      visibilityManager.unregister();
    };
  }, []);

  return (
     <AllOrderPage></AllOrderPage>
  );
};

export default DashboardPageForBiz;
