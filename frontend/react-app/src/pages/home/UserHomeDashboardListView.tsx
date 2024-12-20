import React from 'react';
import { OrderResponseModel } from '../../models/responseModels';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CustomColumnHolder from '../../commonView/customColumnHolder';
import { s_full } from '../../style/size';
import { defaultContainerColumnSx } from '../../style/sx/containerSx';
import { as_center } from '../../style/align';
interface CustomOpderProos {
  data: OrderResponseModel[]; // 菜单项文本列表
}

const UserHomeDashboardListView:React.FC<CustomOpderProos> = ({data}) => {
    return (
        <Box sx={{ ...defaultContainerColumnSx, width: s_full ,  alignItems: as_center,
                justifyContent: as_center,}}>
          <TableContainer
            component={Paper}
            sx={{ border: '1px solid #ccc', borderRadius: '8px' }}
          >
            <Table sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                    State
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      {item.menu.name}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      {item.state}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomColumnHolder multiplier={8}/>
         
    
         
        </Box>
      );
};

export default UserHomeDashboardListView;