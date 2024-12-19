import React, { useEffect } from 'react';
import { isTokenValid } from '../../utils/tokenUtils';
import { login_route_name_for_user, userTokenName } from '../../config/statics';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box/Box';
import { generateGridLayout } from '../../layout/gridLayout';
import { s_full } from '../../style/size';
import UserHomeContents from './UserHomeContents';
import HomeTabBarView from './HomeTabBarView';
import ChangePageContents from '../login/ChangePageContents';

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = sessionStorage.getItem(userTokenName);
    const activeToken = sessionStorage.getItem('activeToken');
    if (!(userToken && isTokenValid(userToken) && userToken === activeToken)) {
      navigate(login_route_name_for_user);
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
        content: <UserHomeContents />,
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

export default UserHome;
