import React from 'react';
import { TableRow, TableCell, Box } from '@mui/material';
import CustomText from '../../../commonView/customText';
import { cellSx, defaultContainerRowSx } from '../../../style/sx/containerSx';
import { OrderResponseModel } from '../../../models/responseModels';

type TableRowProps = {
  item: OrderResponseModel | null;
};

const TableRowComponent: React.FC<TableRowProps> = React.memo(({ item }) => {
  return item == null ? (
    <CustomText>not data</CustomText>
  ) : (
    <TableRow key={item.id}>
      <TableCell sx={cellSx}>
        <Box sx={defaultContainerRowSx}> {item.menu.name}</Box>
      </TableCell>
      <TableCell sx={cellSx}>
        <Box sx={defaultContainerRowSx}> {item.quantity}</Box>
      </TableCell>
      <TableCell sx={cellSx}>
        <Box sx={defaultContainerRowSx}> </Box>
      </TableCell>
    </TableRow>
  );
});

export default TableRowComponent;
