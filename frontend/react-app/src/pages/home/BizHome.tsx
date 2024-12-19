import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/tokenUtils';
import { login_route_name_for_biz } from '../../config/statics';
import ChangePageContents from '../login/ChangePageContents';
import HomeTabBarView from './HomeTabBarView';
import BizHomeContents from './BizHomeContents';
import { s_full } from '../../style/size';
import { generateGridLayout } from '../../layout/gridLayout';
import Box from '@mui/material/Box/Box';

const BizHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const bizToken = sessionStorage.getItem('bizToken');
    const activeToken = sessionStorage.getItem("activeToken");
    if (!(bizToken && isTokenValid(bizToken)&& (bizToken===activeToken) )) {
      navigate(login_route_name_for_biz);
    }
  });

  
  const layoutConfigs = {
    
    areas: [
      {
        content: <ChangePageContents />,
        size: 12,
        height: "50px",
      },
      {
        content: <HomeTabBarView />,
        size: 12,
        height: '150px',
      },
      {
        content: <BizHomeContents />,
        size: 12,
        height: s_full,
      },
    ],
    rowSpacing: 1,
    columnSpacing: 1,
  };

  return (
    <Box sx={{ height: s_full, display: 'flex', flexDirection: 'column' }}>
      <>{generateGridLayout(layoutConfigs)}</>
    </Box>
  );
};

export default BizHome;
