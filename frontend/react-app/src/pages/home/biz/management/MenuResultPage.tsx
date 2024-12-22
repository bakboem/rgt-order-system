import React from 'react';
import CustomText from '../../../../commonView/customText';
import { Box } from '@mui/material';
import { as_center, as_start } from '../../../../style/align';
import { defaultContainerColumnSx } from '../../../../style/sx/containerSx';
import CustomColumnHolder from '../../../../commonView/customColumnHolder';

const MenuResultPage:React.FC = () => {
    const pageName = "메뉴";

    return (
        <Box sx={{...defaultContainerColumnSx, alignItems:as_center, justifyItems: as_start}} >
         <CustomColumnHolder multiplier={3}/>
         <CustomText>{pageName}</CustomText>
         <CustomColumnHolder multiplier={3}/>
       </Box>
    );
};

export default MenuResultPage;