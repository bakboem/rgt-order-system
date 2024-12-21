/* eslint-disable react-hooks/exhaustive-deps */
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  TableBody,
} from '@mui/material';
import { OrderResponseModel } from '../../../models/responseModels';
import { cell_bg } from '../../../style/colors';
import { cellSxBolt, cellRowSx } from '../../../style/sx/containerSx';
import TableRowComponent from './ComponentTableRow';
import CustomText from '../../../commonView/customText';

type TableComponentProps = {
  data: OrderResponseModel[] | null;
};
const TableComponent: React.FC<TableComponentProps> = ({ data }) => {
  return data == null ? (
    <CustomText>not data</CustomText>
  ) : (
    <TableContainer component={Paper}>
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
          {data?.map((item) => <TableRowComponent key={item.id} item={item} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
