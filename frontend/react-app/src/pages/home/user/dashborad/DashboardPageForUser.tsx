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

    };
  }, []);
  return <TableComponent></TableComponent>;
};

export default DashboardPageForUser;
