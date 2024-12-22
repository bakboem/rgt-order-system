import { TableContainer,  Table, TableHead, TableRow, TableCell, Box, TableBody } from "@mui/material";
import CustomText from "../../../commonView/customText";
import { cell_bg } from "../../../style/colors";
import { cellSxBolt, cellRowSx } from "../../../style/sx/containerSx";
import { useRequestOrderList } from "../../../state/homePageState/hooks";
import { useEffect } from "react";
import OrderTableRow from "./OrderTableRow";

/* eslint-disable react-hooks/exhaustive-deps */

const TableComponent: React.FC = () => {
  const { orders } = useRequestOrderList();
  useEffect(() => {
  }, [orders]);
const menuNameStr = "메뉴명";
const orderQuantitiStr = "주문수량";
const menuStateStr = "메뉴상태";
  return orders == null ? (
    <CustomText>not data</CustomText>
  ) : (
    <TableContainer sx={{position: "relative"}}>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((item) => <OrderTableRow key={`${item.id}${item.state}`} order={item} menu={null} bizOrder={null} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
