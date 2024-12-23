/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { cell_bg } from '../../../../style/colors';
import {
  cellSxBolt,
  cellRowSx,
  defaultContainerColumnSx,
} from '../../../../style/sx/containerSx';
import OrderTableRow from '../../components/OrderTableRow';
import { s_full } from '../../../../style/size';
import { as_center, as_start } from '../../../../style/align';
import { useRequestBizOrderList } from '../../../../state/homePageState/hooks';

const AllOrderPage: React.FC = () => {
  const menuNameStr = '메뉴명';
  const orderQuantitiStr = '주문수량';
  const menuStateStr = '주문상태';
  const menuMenagermentStr = '오더과리';

    const { orders } = useRequestBizOrderList();
  
    useEffect(() => {
      let isUnmounted = false;
      console.warn("updated add order!!!")
      if (!isUnmounted) {
      }
      return () => {
        isUnmounted=true;
      }
    }, [orders])
    
  return (
    <Box
      sx={{
        ...defaultContainerColumnSx,
        width: s_full,
        height: s_full,
        alignItems: as_center,
        justifyContent: as_start,
      }}
    >
      <TableContainer sx={{ position: 'relative' }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: cell_bg }}>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{menuNameStr}</Box>
              </TableCell>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{orderQuantitiStr}</Box>
              </TableCell>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{menuStateStr}</Box>
              </TableCell>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{menuMenagermentStr}</Box>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <OrderTableRow
                key={`${order.id}${order.state}`}
                order={null}
                menu={null}
                bizOrder={order}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllOrderPage;
