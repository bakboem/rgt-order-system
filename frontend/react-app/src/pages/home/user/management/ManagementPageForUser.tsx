/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import { useEffect } from "react";
import { userTokenName } from "../../../../config/statics";
import { useRequestMenuList } from "../../../../state/homePageState/hooks";
import { s_full } from "../../../../style/size";
import { defaultContainerColumnSx } from "../../../../style/sx/containerSx";
import { getToken, isTokenValid } from "../../../../utils/tokenUtils";
import OrderRequestPage from "./OrderRequestPage";



const ManagementPageForUser: React.FC = () => {
  const { menus, requestMenu } = useRequestMenuList();

  useEffect(() => {
    const userToken  = sessionStorage.getItem(userTokenName);
    const activeToken  = getToken();
  if (userToken && userToken ===activeToken && isTokenValid(userToken)) {
    requestMenu();
  }
  }, []);
  
  return (
    <Box sx={{...defaultContainerColumnSx,width:s_full,height:s_full}}>
      <OrderRequestPage data={ menus}/>  
    </Box>
  );
};

export default ManagementPageForUser;
