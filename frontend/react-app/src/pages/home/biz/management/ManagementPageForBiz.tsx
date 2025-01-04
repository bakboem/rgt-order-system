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


const boxSx ={ ...defaultContainerColumnSx, ...borderAllSx,   width:"50%" , hight: s_full,  justifyContent: as_center,alignItems: as_center,}


const ManagementPageForBiz: React.FC = () => {
 
  useEffect(() => {
 
    return () => {
  
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
