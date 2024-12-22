import { Box, TableContainer,  Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useState } from "react";
import CustomButton from "../../../../commonView/customButton";
import CustomColumnHolder from "../../../../commonView/customColumnHolder";
import CustomText from "../../../../commonView/customText";
import { CreateOrderModel } from "../../../../models/requestModels";
import { MenuResponseModel } from "../../../../models/responseModels";
import { useCreateOrder } from "../../../../state/homePageState/hooks";
import { as_center } from "../../../../style/align";
import { cell_bg } from "../../../../style/colors";
import { s_full } from "../../../../style/size";
import { defaultContainerColumnSx, cellSxBolt, cellRowSx, cellSx, defaultContainerRowSx, buttonSx } from "../../../../style/sx/containerSx";
import { showWarnToast } from "../../../../utils/toastUtil";


interface MenuTableListViewProps {
  data: MenuResponseModel[];
}
const OrderRequestPage: React.FC<MenuTableListViewProps> = ({ data }) => {

  const messageShow = "주문이 접수 되었습니다.대시보드에서 확인 해주세요!";
  const { requestCreateOrder } = useCreateOrder();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    data.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),
  );

  const handleIncrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 0;
      return { ...prev, [id]: currentQuantity + 1 };
    });
  };

  const handleDecrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 0;
      return { ...prev, [id]: Math.max(currentQuantity - 1, 0) };
    });
  };

  const submmitButtonText = '주문';
  const nameStr = "상품명";
  const priceStr = "단가";
  const quantityStr = "주문수량";
  return data.length === 0 ? (
    <CustomText>not data</CustomText>
  ) : (
    <Box sx={{ ...defaultContainerColumnSx }}>
      <TableContainer >
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: cell_bg }}>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{nameStr}</Box>
              </TableCell>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{priceStr}</Box>
              </TableCell>
              <TableCell sx={cellSxBolt}>
                <Box sx={cellRowSx}>{quantityStr}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={cellSx}>
                  <Box sx={defaultContainerRowSx}> {item.name}</Box>
                </TableCell>
                <TableCell sx={cellSx}>
                  <Box sx={defaultContainerRowSx}> {item.price}</Box>
                </TableCell>
                <TableCell sx={cellSx}>
                  <Box
                    sx={{
                      ...defaultContainerRowSx,
                      alignItems: as_center,
                      height: '15px',
                    }}
                  >
                    <Button
                      onClick={() => handleDecrease(item.id)}
                      sx={buttonSx}
                    >
                      -
                    </Button>
                    <CustomText>{quantities[item.id] || 0}</CustomText>
                    <Button
                      onClick={() => handleIncrease(item.id)}
                      sx={buttonSx}
                    >
                      +
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomColumnHolder multiplier={8} />
      <Box
        sx={{
          ...defaultContainerRowSx,
          width: s_full,
          alignItems: as_center,
          justifyItems: as_center,
        }}
      >
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
              showWarnToast(messageShow);
              setQuantities({});
            });
          }}
        ></CustomButton>
      </Box>
    </Box>
  );
};

export default OrderRequestPage;
