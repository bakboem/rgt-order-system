/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useRequestMenuList } from "../../../../state/homePageState/hooks";
import { s_full } from "../../../../style/size";
import { defaultContainerColumnSx } from "../../../../style/sx/containerSx";
import OrderRequestPage from "./OrderRequestPage";
import { isActiveUser } from "../../../../utils/tokenUtils";



const ManagementPageForUser: React.FC = () => {
  const { menus, requestMenuAllForUser } = useRequestMenuList();
  
  //  INIT 
  useEffect(() => {
    if (isActiveUser()) {
      requestMenuAllForUser();
    }
  }, []);
  
  return (
    <Box sx={{...defaultContainerColumnSx,width:s_full,height:s_full}}>
      <OrderRequestPage data={ menus}/>  
    </Box>
  );
};

export default ManagementPageForUser;
