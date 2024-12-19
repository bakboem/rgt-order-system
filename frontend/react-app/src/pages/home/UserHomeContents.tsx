import { Box } from '@mui/material';
import React from 'react';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { s_full } from '../../style/size';
import { as_center } from '../../style/align';
import { homeTabBarState } from '../../state/homePageState/atoms';
import { useRecoilState } from 'recoil';
import UserHomeContentsMain from './UserHomeContentsMain';
import UserHomeContentsDashboard from './UserHomeContentsDashboard';

const UserHomeContents: React.FC = () => {
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
      {tabIndex === 0 ? <UserHomeContentsMain /> : <UserHomeContentsDashboard />}
    </Box>
  );
};

export default UserHomeContents;
