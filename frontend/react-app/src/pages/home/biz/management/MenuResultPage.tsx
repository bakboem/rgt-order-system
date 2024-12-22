import React from 'react';
import CustomText from '../../../../commonView/customText';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { as_center, as_start } from '../../../../style/align';
import { cellRowSx, cellSxBolt, defaultContainerColumnSx } from '../../../../style/sx/containerSx';
import CustomColumnHolder from '../../../../commonView/customColumnHolder';
import { useGetBizMenuList } from '../../../../state/bizPageState/hooks';
import { cell_bg } from '../../../../style/colors';
import OrderTableRow from '../../components/OrderTableRow';

const MenuResultPage: React.FC = () => {
  const pageName = '전체 메뉴';
  const menuNameStr = "메뉴명";
  const orderPriceStr = "단가";
  const menuInstockStr = "재고";
  const menuManagermentStr = "메뉴관리";
  const { menus } = useGetBizMenuList();
  return (
    <Box
      sx={{
        ...defaultContainerColumnSx,
        alignItems: as_center,
        justifyItems: as_start,
      }}
    >
      <CustomColumnHolder multiplier={3} />
      <CustomText>{pageName}</CustomText>
      <CustomColumnHolder multiplier={3} />
      <Box sx={{...defaultContainerColumnSx, height: "300px"}}>
      
      <TableContainer >
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: cell_bg }}>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>{menuNameStr}</Box>
            </TableCell>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>{orderPriceStr}</Box>
            </TableCell>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>{menuInstockStr}</Box>
            </TableCell>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>{menuManagermentStr}</Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menus?.map((item) => <OrderTableRow key={`${item.id}${item.stock}`} menu={item} order={null}  bizOrder={null}/>)}
        </TableBody>
      </Table>
    </TableContainer>
      
       
      </Box>
    </Box>
  );
};

export default MenuResultPage;
