import React from 'react';
import { OrderResponseModel } from '../../../../models/responseModels';
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
interface AllOrderPageProps {
  data: OrderResponseModel[];
}
const AllOrderPage: React.FC<AllOrderPageProps> = ({ data }) => {
  const menuNameStr = '메뉴명';
  const orderQuantitiStr = '주문수량';
  const menuStateStr = '주문상태';
  const menuMenagermentStr = '오더과리';
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
            {data?.map((item) => (
              <OrderTableRow
                key={`${item.id}${item.state}`}
                order={null}
                menu={null}
                bizOrder={item}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllOrderPage;
