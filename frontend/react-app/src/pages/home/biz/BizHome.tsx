/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isActiveBiz } from '../../../utils/tokenUtils';
import { login_route_name_for_biz } from '../../../config/statics';
import ChangePageContents from '../../login/ChangePageContents';
import BizHomeContents from './BizHomeContents';
import { s_full } from '../../../style/size';
import { generateGridLayout } from '../../../layout/gridLayout';
import Box from '@mui/material/Box/Box';
import ComponentTabBar from '../components/ComponentTabBar';

const BizHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isActiveBiz()) {
      navigate(login_route_name_for_biz);
    }
  },[]);
  
  
  const layoutConfigs = {
    areas: [
      {
        content: <ChangePageContents />,
        size: 12,
        height: "50px",
      },
      {
        content: <ComponentTabBar />,
        size: 12,
        height: '150px',
      },
      {
        content: <BizHomeContents />,
        size: 12,
        height: '500px',
      },
    ],
    rowSpacing: 1,
    columnSpacing: 1,
  };

  return (
    <Box sx={{ height: s_full, width:s_full, display: 'flex', flexDirection: 'column' }}>
      <>{generateGridLayout(layoutConfigs)}</>
    </Box>
  );
};

export default BizHome;
