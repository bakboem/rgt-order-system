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

import SocketUtils from '../../../../utils/socketUtil';

const boxSx ={ ...defaultContainerColumnSx, ...borderAllSx,   width:"50%" , hight: s_full,  justifyContent: as_center,alignItems: as_center,}


const ManagementPageForBiz: React.FC = () => {
 
  // INIT: Initialize WebSocket and Timer Service 
  useEffect(() => {
    let isUnmounted = false; 
    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl(); 
        // Establish WebSocket connection 
        webSocketService.connect(socketUrl); 
        timerService.start(async () => {
          if (!isUnmounted) {
            // Check WebSocket connection health 
            const isAlive = await webSocketService.checkAlive(); 
            if (!isAlive) {
              console.info('WebSocket connection lost, attempting to reconnect...');
              // Disconnect WebSocket
              webSocketService.disconnect(); 
              // Reconnect WebSocket 
              webSocketService.connect(socketUrl); 
            }
          }
        // Set heartbeat interval to 20 seconds 
        }, 20000); 
      } catch (error) {
        // Log WebSocket initialization failure 
        console.error('Failed to initialize WebSocket:', error); 
      }
    };

    initializeSocket();

    // Cleanup on component unmount
    return () => {
      isUnmounted = true;
      // Clear timer service 
      timerService.clear(); 
      // Disconnect WebSocket 
      webSocketService.disconnect(); 
    };
  }, []);

  // Render Management Page Layout 
  return (
    <Box sx={{ ...defaultContainerRowSx, width: s_full, height: '500px' }}>
      <Box sx={boxSx}>
        <MenuRequestConetents /> {/*   Menu Request Section   */}
      </Box>
      <Box sx={boxSx}>
        <MenuResultPage /> {/*   Menu Result Section   */}
      </Box>
    </Box>
  );
};

export default ManagementPageForBiz;
