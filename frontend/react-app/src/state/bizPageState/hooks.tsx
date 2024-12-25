/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRecoilState } from 'recoil';
import { bizMenuListState, bizOrderListState } from './atoms';
import { useRef } from 'react';
import { apiRequest } from '../../services/apiService';
import { ApiRequestType } from '../../enums/apiRequestType';
import {
  MenuDeleteModel,
  MenuRequestModel,
  MenuResponseModel,
  OrderResponseModel,
} from '../../models/responseModels';
import { plainToInstance } from 'class-transformer';
import { ApiRequestTypeBodyModel } from '../../models/apiRequestBodyModels';
import { showSuccessToast } from '../../utils/toastUtil';

export function useGetBizMenuList() {
  const [menus, setMenuList] = useRecoilState(bizMenuListState);
  const isFetching = useRef(false);
  const getBizMenu = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await apiRequest<MenuResponseModel[]>(
        ApiRequestType.MENU_ALL_FOR_BIZ,
      );

      if (response) {
        console.log(response);
        const result = plainToInstance(MenuResponseModel, response);
        setMenuList([...result]);
      }
    } catch (error) {
      console.error('Failed to fetch Menu:', error);
    } finally {
      isFetching.current = false;
    }
  };
  return { menus, getBizMenu };
}

export function useRequestBizMenu() {
  const [menus, setMenuList] = useRecoilState(bizMenuListState); 
  const isFetching = useRef(false);
  const requestMenu = async (
    requestModel: MenuRequestModel,
    callback: () => void,
  ) => {
    if (isFetching.current) return;
    isFetching.current = true;
    const body = {
      name: requestModel.name,
      price: requestModel.price,
      stock: requestModel.stock,
      image_url: '', //
    };
    const requestBody: ApiRequestTypeBodyModel = {
      body: body,
    };

    try {
      const response = await apiRequest<MenuResponseModel>(
        ApiRequestType.MENU_ADD,
        requestBody,
      );

      if (response) {
     
        try {
          const result = plainToInstance(MenuResponseModel, response);
          console.log(`menu!!! response!!  ${result} `);
          console.log(result)
          console.log(typeof(result))
          setMenuList((prevMenus) => [...prevMenus, result]);
          callback();
        } catch (error) {
          console.warn('menu response is not Typeof (MenuResponseModel)');
        }
      }
    } catch (error) {
      console.error('Failed to fetch Menu:', error);
    } finally {
      isFetching.current = false;
    }
  };
  return { requestMenu };
}


export function useChangeOrderStateFunc() {
  const isFetching = useRef(false);
  const changeOrderStateFunc = async (
    orderId:string,
    state: string,
    callback: () => void,
  ) => {
    if (isFetching.current) return;
    isFetching.current = true;
    const body = {
      state: state, 
    };
    const requestBody: ApiRequestTypeBodyModel = {
      body: body,
      params:{id:orderId}
    };

    try {
      const response = await apiRequest<{}>(
        ApiRequestType.ORDER_UPDATE,
        requestBody,
      );

      if (response) {
        callback();
        try {
          console.log(response);
        } catch (error) {
          console.warn('menu response is not Typeof (MenuResponseModel)');
        }
      }
    } catch (error) {
      console.error('Failed to fetch Menu:', error);
    } finally {
      isFetching.current = false;
    }
  };
  return { changeOrderStateFunc };
}


export function useDeleteMenuFunc() {
  const isFetching = useRef(false);
  const [menus, setMenuList] = useRecoilState(bizMenuListState);
  const deleteMenuFunc = async (
    menuId:string,
  ) => {
    if (isFetching.current) return;
    isFetching.current = true;
 
    const requestBody: ApiRequestTypeBodyModel = {
      params:{id:menuId}
    };

    try {
      const response = await apiRequest<{}>(
        ApiRequestType.MENU_DELETE,
        requestBody,
      );
      if (response) {
        try {
          console.log(response);
          setMenuList((prevMenus) => {
            const newList =prevMenus.filter(menu => menu.id !== menuId);
            return newList;
          });
        } catch (error) {
          console.warn('menu response is not Typeof (MenuResponseModel)');
        }
      }
    } catch (error) {
      console.error('Failed to fetch Menu:', error);
    } finally {
      isFetching.current = false;
    }
  };
  return { deleteMenuFunc };
}



export function useAddBizOrderState() {
  const [orders, setOrderList] = useRecoilState(bizOrderListState);

  const addOrderStateForBiz = (addOrder: OrderResponseModel) => {
    setOrderList((prevOrders) => {
      if (prevOrders.some(order => order.id === addOrder.id)) {
        return prevOrders; 
      }
      console.log("the order added !!!");
     showSuccessToast("새로운 오더가 추가됐습니다.")
      return [addOrder,...prevOrders];
     
    });
  };
  return addOrderStateForBiz;
}


export function useUpdateBizOrderState() {
  const [orders, setOrderList] = useRecoilState(bizOrderListState);

  const updateOrderStateForBiz = (updateOrder: OrderResponseModel) => {
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
  return updateOrderStateForBiz;
}


export function useRequestBizOrderList() {
  const [orders, setOrderList] = useRecoilState(bizOrderListState);
  const isFetching = useRef(false);
  const requestBizOrder= async () => {
      if (isFetching.current) return; // 防止重复请求
      isFetching.current = true;
    try {
      const response = await apiRequest<OrderResponseModel[]>(
        ApiRequestType.ORDER_ALL_FOR_BIZ,
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
  return {orders, requestBizOrder };
}

