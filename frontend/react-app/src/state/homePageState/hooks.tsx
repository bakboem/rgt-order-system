/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonResponseModel, MenuResponseModel, OrderResponseModel } from "../../models/responseModels";
import { apiRequest } from "../../services/apiService";
import { ApiRequestType } from "../../enums/apiRequestType";
import { useRecoilState } from "recoil";
import { homeMenuListState, userOrderListState } from "./atoms";
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



export function useAddUserOrderState() {
  const addOrderState = (updateOrder: OrderResponseModel) => {
  };
  return addOrderState;
}

export function useDeleteOrderState() {
  const deleteOrderState = (updateOrder: OrderResponseModel) => {
  };
  return deleteOrderState;
}

export function useAddMenuState() {
  const addMenuState = (updateOrder: OrderResponseModel) => {
  };
  return addMenuState;
}

export function useUpdateMenuState() {
  const updateMenuState = (updateOrder: OrderResponseModel) => {
  };
  return updateMenuState;
}

export function useADeleteMenuState() {
  const deleteMenuState = (updateOrder: OrderResponseModel) => {
  };
  return deleteMenuState;
}



export function useUpdateUserOrderState() {
  const [orders, setOrderList] = useRecoilState(userOrderListState);

  const updateOrderState = (updateOrder: OrderResponseModel) => {
    if (updateOrder.id && updateOrder.state) {
      setOrderList((prevOrders) => {
        const orderIndex = prevOrders.findIndex((order) =>  order.id === updateOrder.id);
        if (orderIndex !== -1) {
          const updatedOrders = [...prevOrders];
          updatedOrders[orderIndex] = { ...prevOrders[orderIndex], state: updateOrder.state };
          return updatedOrders;
        } else {
          console.log("update order successful");
          return [...prevOrders, updateOrder];
        }
      });
    }
  };
  return updateOrderState;
}


export function useUpdateBizOrderState() {
  const [orders, setOrderList] = useRecoilState(userOrderListState);

  const updateOrderState = (updateOrder: OrderResponseModel) => {
    setOrderList((prevOrders) => {
      const orderIndex = prevOrders.findIndex((order) => order.id === updateOrder.id);
      if (orderIndex !== -1) {
        const updatedOrders = [...prevOrders];
        updatedOrders[orderIndex] = { ...prevOrders[orderIndex], state: updateOrder.state };
        return updatedOrders;
      } else {
        return [...prevOrders, updateOrder];
      }
    });
  };
  return updateOrderState;
}



export function useRequestOrderList() {
  const [orders, setOrderList] = useRecoilState(userOrderListState);
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