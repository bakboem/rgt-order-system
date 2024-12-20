import React, { useState } from 'react';
import { MenuResponseModel } from '../../models/responseModels';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { s_full, s_menu_icon_height } from '../../style/size';
import Box from '@mui/material/Box/Box';
import {
  defaultContainerColumnSx,
  defaultContainerRowSx,
} from '../../style/sx/containerSx';
import CustomButton from '../../commonView/customButton';
import { as_center } from '../../style/align';
import CustomColumnHolder from '../../commonView/customColumnHolder';
import { useCreateOrder } from '../../state/homePageState/hooks';
import { CreateOrderModel } from '../../models/requestModels';
import { toast } from 'react-toastify';
interface MenuTableListViewProps {
  data: MenuResponseModel[];
}
const UserHomeMenuTableView: React.FC<MenuTableListViewProps> = ({ data }) => {
  const { requestCreateOrder } = useCreateOrder();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    data.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),
  );

  const handleIncrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 0; // 如果值不存在，默认为 0
      return { ...prev, [id]: currentQuantity + 1 };
    });
  };

  const handleDecrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 0; // 如果值不存在，默认为 0
      return { ...prev, [id]: Math.max(currentQuantity - 1, 0) }; // 确保不低于 0
    });
  };

  const submmitButtonText = '주문';
  return (
    <Box sx={{ ...defaultContainerColumnSx, width: s_full ,height :"300px" }}>
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
                Price
              </TableCell>
              <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  {item.price}
                </TableCell>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Button
                      onClick={() => handleDecrease(item.id)}
                      sx={{ fontSize: s_menu_icon_height }}
                    >
                      -
                    </Button>
                    <span style={{ margin: '0 10px', fontSize: '18px' }}>
                      {quantities[item.id]}
                    </span>
                    <Button
                      onClick={() => handleIncrease(item.id)}
                      sx={{ fontSize: s_menu_icon_height }}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomColumnHolder multiplier={8} />
      <Box
        sx={{ ...defaultContainerRowSx, width: s_full, alignItems: as_center }}
      >
        {' '}
        <CustomButton
          textKey={submmitButtonText}
          onClick={async () => {
            var ordersRequest: CreateOrderModel[] = [];
            data.forEach((item) => {
              if (quantities[item.id] > 0) {
                ordersRequest.push(
                  new CreateOrderModel(item.id, quantities[item.id]),
                );
              }
            });
            console.log(ordersRequest.length);
            if (ordersRequest.length < 1) return;
            await requestCreateOrder(ordersRequest, () => {
              console.log('Quantities reset to:', {});
              toast.success(
                '주문이 접수 되었습니다.데시보드에서 확인 해주세요!',
                {
                  position: 'top-right',
                  autoClose: 3000,
                },
              );
              setQuantities({});
            });
          }}
        ></CustomButton>
      </Box>
    </Box>
  );
};

export default UserHomeMenuTableView;
