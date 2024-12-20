import { CommonResponseModel, MenuResponseModel, OrderResponseModel } from "../../models/responseModels";
import { apiRequest } from "../../services/apiService";
import { ApiRequestType } from "../../enums/apiRequestType";
import { useRecoilState } from "recoil";
import { homeMenuListState, homeOrderListState } from "./atoms";
import { plainToInstance } from "class-transformer";
import { useRef } from "react";
import { ApiRequestTypeBodyModel } from "../../models/apiRequestBodyModels";
import { CreateOrderModel } from "../../models/requestModels";


export function useRequestMenuList() {
    const [menus, setMenu] = useRecoilState(homeMenuListState);
    const isFetching = useRef(false);
    const requestMenu= async () => {
        if (isFetching.current) return; // 防止重复请求
        isFetching.current = true;
      try {
        // const body: ApiRequestTypeBodyModel = {
        //   body: {
        //   },
        // };
        const response = await apiRequest<MenuResponseModel[]>(
          ApiRequestType.MENU_ALL_FOR_USER,
        );
  
        if (response) {
            console.log(response);
            const result = plainToInstance(MenuResponseModel, response);
            setMenu([...result]);
        }
  
        // 将转换后的实例列表赋值给 patients
      } catch (error) {
        console.error("Failed to fetch Menu:", error);
      }finally {
        isFetching.current = false;
      }
    };
    return {menus, requestMenu };
  }
  
export function useCreateOrder() {
  const requestCreateOrder= async (orders:CreateOrderModel[],callback: () => void )  =>  {
    
    try {
      const formattedOrders = orders.map((order) => ({
        menu_id: order.menu_id,
        quantity: order.quantity,
      }));
      console.log("Orders Request:", JSON.stringify(formattedOrders, null, 2));
      const body: ApiRequestTypeBodyModel = {
        body: formattedOrders,
      };
      const response = await apiRequest<CommonResponseModel>(
        ApiRequestType.ORDER_ADD,
        body
      );

      if (response&& response.message) {
          console.log(response);
          callback();
      }

      // 将转换后的实例列表赋值给 patients
    } catch (error) {
      console.error("Failed to fetch Menu:", error);
    }
  };
  return { requestCreateOrder };
}




export function useRequestOrderList() {
  const [orders, setOrderList] = useRecoilState(homeOrderListState);
  const isFetching = useRef(false);
  const requestOrder= async () => {
      if (isFetching.current) return; // 防止重复请求
      isFetching.current = true;
    try {
      const response = await apiRequest<OrderResponseModel[]>(
        ApiRequestType.ORDER_ALL_FOR_USER,
      );

      if (response) {
          console.log(response);
          const result = plainToInstance(OrderResponseModel, response);
          setOrderList([...result]);
      }

      // 将转换后的实例列表赋值给 patients
    } catch (error) {
      console.error("Failed to fetch Menu:", error);
    }finally {
      isFetching.current = false;
    }
  };
  return {orders, requestOrder };
}