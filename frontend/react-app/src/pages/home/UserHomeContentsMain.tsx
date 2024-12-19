import React, { useEffect } from 'react';
import Box from '@mui/material/Box/Box';
import { useRequestMenuList } from '../../state/homePageState/hooks';
import UserHomeMenuTableView from './UserHomeMenuTableView';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { s_full } from '../../style/size';
import { userTokenName } from '../../config/statics';
import { getToken } from '../../utils/tokenUtils';


const UserHomeContentsMain: React.FC = () => {
  const { menus, requestMenu } = useRequestMenuList();

  useEffect(() => {
    const userToken  = sessionStorage.getItem(userTokenName);
    const activeToken  = getToken();
  if (userToken && userToken ===activeToken) {
    requestMenu();
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Box sx={{...defaultContainerColumnSx,width:s_full,height: s_full}}>
      <UserHomeMenuTableView data={ menus}/>
    </Box>
  );
};

export default UserHomeContentsMain;
