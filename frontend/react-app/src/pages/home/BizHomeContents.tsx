import React from 'react';
import BizHomeContentsMain from './BizHomeContentsMain';
import BizHomeContentsDashboard from './BizHomeContentsDashboard';
import { homeTabBarState } from '../../state/homePageState/atoms';
import { useRecoilState } from 'recoil';
import Box from '@mui/material/Box/Box';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { s_full } from '../../style/size';
import { as_center } from '../../style/align';

const BizHomeContents:React.FC = () => {
  const [tabIndex] = useRecoilState(homeTabBarState);
    return (
        <Box
          sx={{
            ...defaultContainerColumnSx,
            width: s_full,
            height: s_full,
            alignItems: as_center,
            justifyContent: as_center,
          }}
        >
          {tabIndex === 0 ? <BizHomeContentsMain /> : <BizHomeContentsDashboard />}
        </Box>
      );
};

export default BizHomeContents;