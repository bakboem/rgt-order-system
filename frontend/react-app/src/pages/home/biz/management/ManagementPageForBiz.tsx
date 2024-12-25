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
  // *** Define event names / 이벤트 이름 정의 ***
  const eventNames = {
    menuDelete: 'menu_delete', // *** Menu delete event name / 메뉴 삭제 이벤트 이름 ***
  };

  const { menuDelete } = eventNames;
  const deleteMenuFunc = useDeleteBizMenuState(); // *** State update function for deleting menu / 메뉴 삭제 상태 업데이트 함수 ***

  // *** Handle menu delete events / 메뉴 삭제 이벤트 처리 ***
  const menuDeleteHandleForBiz = (message: any) => {
    if (message.type === menuDelete) {
      if (Array.isArray(message.data)) {
        message.data.map((obj: any) => {
          if (obj?.menu_id && obj?.biz_id) {
            const model = generateDefaultMenu({
              menu_id: obj?.menu_id,
              biz_id: obj.biz_id,
            });
            deleteMenuFunc(model); // *** Delete the menu based on model / 모델에 따라 메뉴 삭제 ***
          } else {
            console.warn('Invalid order data:', obj); // *** Log invalid data / 유효하지 않은 데이터 로그 ***
          }
        });
      }
    }
  };

  // *** INIT: Initialize WebSocket and Timer Service / WebSocket 및 Timer 서비스 초기화 ***
  useEffect(() => {
    let isUnmounted = false; // *** Tracks component unmount status / 컴포넌트 언마운트 상태 추적 ***

    const initializeSocket = async () => {
      try {
        const socketUrl = await SocketUtils.getSocketUrl(); // *** Get WebSocket URL / WebSocket URL 가져오기 ***

        webSocketService.connect(socketUrl); // *** Establish WebSocket connection / WebSocket 연결 설정 ***
        webSocketService.registerHandler(menuDelete, menuDeleteHandleForBiz); // *** Register handler for menu delete events / 메뉴 삭제 이벤트 핸들러 등록 ***

        timerService.start(async () => {
          if (!isUnmounted) {
            const isAlive = await webSocketService.checkAlive(); // *** Check WebSocket connection health / WebSocket 연결 상태 확인 ***
            if (!isAlive) {
              console.info('WebSocket connection lost, attempting to reconnect...');
              webSocketService.disconnect(); // *** Disconnect WebSocket / WebSocket 연결 해제 ***
              webSocketService.connect(socketUrl); // *** Reconnect WebSocket / WebSocket 재연결 ***
            }
          }
        }, 20000); // *** Set heartbeat interval to 20 seconds / 하트비트 간격 20초 설정 ***
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error); // *** Log WebSocket initialization failure / WebSocket 초기화 실패 로그 ***
      }
    };

    initializeSocket();

    // *** Cleanup on component unmount / 컴포넌트 언마운트 시 정리 ***
    return () => {
      isUnmounted = true;
      timerService.clear(); // *** Clear timer service / 타이머 서비스 초기화 ***
      webSocketService.disconnect(); // *** Disconnect WebSocket / WebSocket 연결 해제 ***
      webSocketService.unregisterHandler(menuDelete); // *** Unregister menu delete handler / 메뉴 삭제 핸들러 등록 해제 ***
    };
  }, []);

  // *** Render Management Page Layout / 관리 페이지 레이아웃 렌더링 ***
  return (
    <Box sx={{ ...defaultContainerRowSx, width: s_full, height: '500px' }}>
      <Box sx={boxSx}>
        <MenuRequestConetents /> {/* *** Menu Request Section / 메뉴 요청 섹션 *** */}
      </Box>
      <Box sx={boxSx}>
        <MenuResultPage /> {/* *** Menu Result Section / 메뉴 결과 섹션 *** */}
      </Box>
    </Box>
  );
};

export default ManagementPageForBiz;
