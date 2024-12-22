import { useRecoilState } from 'recoil';
import { bizMenuListState } from './atoms';
import { useRef } from 'react';
import { apiRequest } from '../../services/apiService';
import { ApiRequestType } from '../../enums/apiRequestType';
import {
  MenuRequestModel,
  MenuResponseModel,
} from '../../models/responseModels';
import { plainToInstance } from 'class-transformer';
import { ApiRequestTypeBodyModel } from '../../models/apiRequestBodyModels';

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
        callback();
        try {
          const result = plainToInstance(MenuResponseModel, response);
          console.log(response);
          setMenuList([...menus, result]);
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
  const deleteMenuFunc = async (
    menuId:string,
    callback: () => void,
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
  return { deleteMenuFunc };
}
