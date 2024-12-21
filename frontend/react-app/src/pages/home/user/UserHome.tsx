/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box/Box';
import UserHomeContents from './UserHomeContents';
import { isActiveUser } from '../../../utils/tokenUtils';
import { login_route_name_for_user } from '../../../config/statics';
import ChangePageContents from '../../login/ChangePageContents';
import { s_full } from '../../../style/size';
import { generateGridLayout } from '../../../layout/gridLayout';
import ComponentTabBar from '../components/ComponentTabBar';

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isActiveUser()) {
      navigate(login_route_name_for_user);
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
        height: "100px",
      },
      {
        content: <UserHomeContents />,
        size: 12,
        height: "500px",
      },
    ],
    rowSpacing: 1,
    columnSpacing: 1,
  };

  return (
    <Box sx={{   height: s_full, display: 'flex', flexDirection: 'column' }}>
      <>{generateGridLayout(layoutConfigs)}</>
    </Box>
  );
};

export default UserHome;
