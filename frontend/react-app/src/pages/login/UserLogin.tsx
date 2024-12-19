import React from 'react';
import { s_full } from '../../style/size';
import UserLoginContents from './UserLoginContents';
import Box from '@mui/material/Box/Box';
import { generateGridLayout } from '../../layout/gridLayout';
import ChangePageContents from './ChangePageContents';

const UserLogin: React.FC = () => {
  const layoutConfigs = {
    areas: [
      {
        content: <ChangePageContents />,
        size: 12,
        height: "50px",
      },
      {
        content: <UserLoginContents />,
        size: 12,
        height: "90%",
      },
 
    ],
    rowSpacing: 1,
    columnSpacing: 0,
  };

  return (
    <Box sx={{ height: s_full, display: 'flex', flexDirection: 'column' }}>
      <>{generateGridLayout(layoutConfigs)}</>
    </Box>
  );
};

export default UserLogin;
