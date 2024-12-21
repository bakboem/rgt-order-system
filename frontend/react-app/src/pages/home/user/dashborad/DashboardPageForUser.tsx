/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import socketService from "../../../../services/socketService";
import timerService from "../../../../services/timerService";
import { useRequestOrderList } from "../../../../state/homePageState/hooks";
import SocketUtils from '../../../../utils/socketUtil';
import TableComponent from "../../components/TableComponent";

const DashboardPageForUser: React.FC = () => {
  const { orders, requestOrder } = useRequestOrderList();
   useEffect(() => {
    let isUnmounted = false;
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl();
        socketService.connect(socketUrl);
        timerService.start(async () => {
          if (!isUnmounted) {
            const isAlive = await socketService.checkAlive();
            if (!isAlive) {
              console.warn("WebSocket connection lost, attempting to reconnect...");
              socketService.disconnect();
              socketService.connect(socketUrl); 
            }
          }
        }, 20000); 
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
      }
    };
    initializeSocket();
    requestOrder()
    return () => {
      isUnmounted = true;
      timerService.clear();
      socketService.disconnect();
    };
  }, []);
  
 
  return (
      <TableComponent data ={orders}></TableComponent>
  );
};


export default DashboardPageForUser