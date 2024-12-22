import { useRecoilState } from "recoil";
import { bizMenuListState } from "./atoms";
import { useRef } from "react";
import { apiRequest } from "../../services/apiService";
import { ApiRequestType } from "../../enums/apiRequestType";
import { MenuRequestModel, MenuResponseModel } from "../../models/responseModels";
import { plainToInstance } from "class-transformer";
import { ApiRequestTypeBodyModel } from '../../models/apiRequestBodyModels';

export function useGetBizMenuList() {
  const [orders, setOrderList] = useRecoilState(bizMenuListState);
  const isFetching = useRef(false);
  const requestOrder= async () => {
      if (isFetching.current) return; 
      isFetching.current = true;
    try {
      const response = await apiRequest<MenuResponseModel[]>(
        ApiRequestType.MENU_ALL_FOR_BIZ,
      );

      if (response) {
          console.log(response);
          const result = plainToInstance(MenuResponseModel, response);
          setOrderList([...result]);
      }
    } catch (error) {
      console.error("Failed to fetch Menu:", error);
    }finally {
      isFetching.current = false;
    }
  };
  return {orders, requestOrder };
}


export function useRequestBizMenu() {
  const isFetching = useRef(false);
  const requestMenu= async ( requestModel: MenuRequestModel,callback: ()=>void) => {
      if (isFetching.current) return; 
      isFetching.current = true;
      const body =   {
        name: requestModel.name,
        price: requestModel.price,
        stock: requestModel.stock,
        image_url :'' // 
      }
      const requestBody: ApiRequestTypeBodyModel = {
        body: body,
      };

    try {
      const response = await apiRequest<MenuResponseModel[]>(
        ApiRequestType.MENU_ADD,
        requestBody
      );

      if (response) {
        callback();
        console.log(response);
      }
    } catch (error) {
      console.error("Failed to fetch Menu:", error);
    }finally {
      isFetching.current = false;
    }
  };
  return { requestMenu };
}
