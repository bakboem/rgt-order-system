import React from 'react';
import Box from '@mui/material/Box/Box';
import { generateGridLayout } from '../../layout/gridLayout';
import { s_full } from '../../style/size';
import SplashContents from './SplashContents';

const SplashPage: React.FC = () => {
  const layoutConfigs = {
    areas: [
      {
        content: <SplashContents />,
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

export default SplashPage;
