import React from 'react';
import { TableRow, TableCell, Box } from '@mui/material';
import CustomText from '../../../commonView/customText';
import { cellSx, defaultContainerRowSx } from '../../../style/sx/containerSx';
import {
  MenuResponseModel,
  OrderResponseModel,
} from '../../../models/responseModels';
import CustomButton from '../../../commonView/customButton';
import {  c_primary, c_second, c_sub_text, c_warning } from '../../../style/colors';
import { useChangeOrderStateFunc, useDeleteMenuFunc } from '../../../state/bizPageState/hooks';
import { showSuccessToast } from '../../../utils/toastUtil';

type TableRowProps = {
  order: OrderResponseModel | null;
  menu: MenuResponseModel | null;
  bizOrder: OrderResponseModel | null;
};

const OrderTableRow: React.FC<TableRowProps> = React.memo(
  ({ order, menu, bizOrder }) => {
    const { changeOrderStateFunc } = useChangeOrderStateFunc();
    const { deleteMenuFunc } = useDeleteMenuFunc();
    
    return order && menu == null && bizOrder == null ? (
      <TableRow key={order.id}>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {order.menu.name}</Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {order.quantity}</Box>
        </TableCell>
        
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}>
            <CustomText color={order.state === 'waiting'
              ? c_second
              : order.state === 'pending'
                ? c_primary
                :c_warning}>
            {order.state === 'waiting'
              ? '접수대기'
              : order.state === 'pending'
                ? '처리중'
                : '처리완료'}
            </CustomText>
          </Box>
        </TableCell>
      </TableRow>
    ) : menu && order == null && bizOrder == null ? (
      <TableRow key={menu.id}>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {menu.name}</Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {menu.price}</Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {menu.stock}</Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}>
            {
              <CustomButton
                sx={{
                  backgroundColor: c_warning,
                }}
                onClick={async () => {
                    try {
                      deleteMenuFunc(menu.id)
                    } catch (error) {
                      
                    }
                }}
              >
                {'메뉴삭제'}
              </CustomButton>
            }
          </Box>
        </TableCell>
      </TableRow>
    ) : bizOrder && order == null && menu == null ? (
      <TableRow key={bizOrder.id}>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {bizOrder.menu.name}</Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}> {bizOrder.quantity}</Box>
        </TableCell>
        
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}>
            {' '}
            {bizOrder.state === 'waiting'
              ? '접수대기'
              : bizOrder.state === 'pending'
                ? '접수중'
                : '작업완료'}
          </Box>
        </TableCell>
        <TableCell sx={cellSx}>
          <Box sx={defaultContainerRowSx}>
            {
              <CustomButton
                sx={{
                  backgroundColor:
                    bizOrder.state === 'complate'
                      ? c_sub_text
                      : bizOrder.state === 'pending'
                        ? c_warning
                        : c_primary,
                }}
                onClick={async () => {
                  if (bizOrder.state !== 'complate') {
                    changeOrderStateFunc(
                      bizOrder.id,
                      bizOrder.state === 'waiting' ? 'pending' : 'complate',
                      () => {
                        showSuccessToast('정상적으로 처리하였습니다');
                      },
                    );
                  }
                }}
              >
                {bizOrder.state === 'waiting'
                  ? '접수하기'
                  : bizOrder.state === 'pending'
                    ? '완료하기'
                    : '오더종료'}
              </CustomButton>
            }
          </Box>
        </TableCell>
      </TableRow>
    ) : (
      <CustomText>not data</CustomText>
    );
  },
);

export default OrderTableRow;
