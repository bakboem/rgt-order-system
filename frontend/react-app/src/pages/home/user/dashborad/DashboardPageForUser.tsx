/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import timerService from '../../../../services/timerService';
import SocketUtils from '../../../../utils/socketUtil';
import TableComponent from '../../components/TableComponent';
import webSocketService from '../../../../services/webSocketService';
import {
  useUpdateUserOrderState,
  useRequestOrderList,
} from '../../../../state/homePageState/hooks';
import { generateDefaultOrder } from '../../../../utils/generatorUtils';
import { data } from 'react-router-dom';

const DashboardPageForUser: React.FC = () => {
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
            console.warn("Invalid order data:", obj);
          }
        });
      }
    }
  };

  useEffect(() => {
    let isUnmounted = false;
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        webSocketService.connect(socketUrl);
        webSocketService.registerHandler(orderUpdate, orderUpdateHandle);

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
    requestOrder();
    return () => {
      isUnmounted = true;
      timerService.clear();
      webSocketService.disconnect();
      webSocketService.unregisterHandler(orderUpdate);
    };
  }, []);
  return <TableComponent ></TableComponent>;
};

export default DashboardPageForUser;
