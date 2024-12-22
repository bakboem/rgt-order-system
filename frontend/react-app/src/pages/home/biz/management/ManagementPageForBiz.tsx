/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Box from '@mui/material/Box/Box';
import {
  borderAllSx,
  defaultContainerColumnSx,
  defaultContainerRowSx,
} from '../../../../style/sx/containerSx';
import MenuRequestConetents from './MenuRequestConetents';
import MenuResultPage from './MenuResultPage';
import { s_full } from '../../../../style/size';
import { as_center } from '../../../../style/align';
import timerService from '../../../../services/timerService';
import webSocketService from '../../../../services/webSocketService';

import { generateDefaultMenu } from '../../../../utils/generatorUtils';
import SocketUtils from '../../../../utils/socketUtil';
import { useDeleteBizMenuState } from '../../../../state/homePageState/hooks';

const boxSx ={ ...defaultContainerColumnSx, ...borderAllSx,   width:"50%" , hight: s_full,  justifyContent: as_center,alignItems: as_center,}
const ManagementPageForBiz: React.FC = () => {

  const eventNames = {
    menuDelete: 'menu_delete',
  };
  const { menuDelete } = eventNames;
  const deleteMenuFunc = useDeleteBizMenuState();
  const menuDeleteHandleForBiz = (message: any) => {
    if (message.type ===menuDelete) {
      if (Array.isArray(message.data)) {
        message.data.map((obj: any) => {
          if (obj?.menu_id && obj?.biz_id) {
            const model = generateDefaultMenu({
              menu_id: obj?.menu_id,
              biz_id: obj.biz_id
            });
            deleteMenuFunc(model);
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
        webSocketService.registerHandler(menuDelete, menuDeleteHandleForBiz);

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
    return () => {
      isUnmounted = true;
      timerService.clear();
      webSocketService.disconnect();
      webSocketService.unregisterHandler(menuDelete);
    };
  }, []);


  return (
    <Box sx={{ ...defaultContainerRowSx , width :s_full,height : "500px" }}>
      <Box sx={boxSx}>
        <MenuRequestConetents ></MenuRequestConetents>
      </Box>
      <Box sx={boxSx}>
        <MenuResultPage></MenuResultPage>
      </Box>
    </Box>
  );
};

export default ManagementPageForBiz;
