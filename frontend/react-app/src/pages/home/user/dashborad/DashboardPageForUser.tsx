/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import SocketUtils from '../../../../utils/socketUtil';
import TableComponent from '../../components/TableComponent';
import {
  useUpdateUserOrderState,
  useRequestOrderList,
} from '../../../../state/homePageState/hooks';
import { generateDefaultOrder } from '../../../../utils/generatorUtils';
import WebSocketService from '../../../../services/webSocketService';
import TabVisibilityService from '../../../../services/tabVisibilityService';

interface DashboardPageForUserProp {
  webSocketService: WebSocketService;
}
const DashboardPageForUser: React.FC<DashboardPageForUserProp> = (data) => {
  const { orders, requestOrder } = useRequestOrderList();

  const eventNames = {
    orderUpdate: 'order_update',
  };
  const { orderUpdate } = eventNames;

  const updateOrderState = useUpdateUserOrderState();

  const orderUpdateHandle = (message: any) => {
    if (message.type === 'order_update') {
      if (Array.isArray(message.data)) {
        message.data.map((obj: any) => {
          if (obj?.order_id && obj?.state && obj?.biz_id) {
            const model = generateDefaultOrder({
              order_id: obj.order_id,
              state: obj.state,
              biz_id: obj.biz_id,
            });
            updateOrderState(model);
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
    const handleVisible = () => {
      data.webSocketService.setIsLivePageState(false);
      console.warn("Page is visible");
    }
    const handleHidden = () => {
      data.webSocketService.setIsLivePageState(true);
      console.warn("Page is hidden");
    }
    const handleUserActive = () => {
      data.webSocketService.setIsLivePageState(false);
      console.log("User is active")
    }
    const handleUserInactive = () => {
      data.webSocketService.setIsLivePageState(true);
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
        data.webSocketService.connect(socketUrl);
        data.webSocketService.registerHandler(orderUpdate, orderUpdateHandle);

      
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
      }
    };
    initializeSocket();
    requestOrder();
    return () => {
      isUnmounted = true;
      // timerService.clear();
      data.webSocketService.disconnect();
      data.webSocketService.unregisterHandler(orderUpdate);
      visibilityManager.unregister();
    };
  }, []);
  return <TableComponent></TableComponent>;
};

export default DashboardPageForUser;
