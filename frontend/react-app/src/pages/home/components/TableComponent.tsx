import { TableContainer,  Table, TableHead, TableRow, TableCell, Box, TableBody } from "@mui/material";
import CustomText from "../../../commonView/customText";
import { cell_bg } from "../../../style/colors";
import { cellSxBolt, cellRowSx } from "../../../style/sx/containerSx";
import TableRowComponent from "./ComponentTableRow";
import { useRequestOrderList } from "../../../state/homePageState/hooks";
import { useEffect } from "react";

/* eslint-disable react-hooks/exhaustive-deps */

const TableComponent: React.FC = () => {
  const { orders } = useRequestOrderList();
  useEffect(() => {
  }, [orders]);

  return orders == null ? (
    <CustomText>not data</CustomText>
  ) : (
    <TableContainer >
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: cell_bg }}>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>Name</Box>
            </TableCell>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>Quantity</Box>
            </TableCell>
            <TableCell sx={cellSxBolt}>
              <Box sx={cellRowSx}>State</Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((item) => <TableRowComponent key={`${item.id}${item.state}`} item={item} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
