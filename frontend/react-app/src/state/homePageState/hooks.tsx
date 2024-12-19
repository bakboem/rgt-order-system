import { MenuResponseModel } from "../../models/responseModels";
import { apiRequest } from "../../services/apiService";
import { ApiRequestType } from "../../enums/apiRequestType";
import { useRecoilState } from "recoil";
import { homeMenuListState } from "./atoms";
import { plainToInstance } from "class-transformer";
import { useRef } from "react";


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
            result.forEach((p) => {
              console.log(p.id);
              console.log(p.name);
            });
            console.log(menus.length);
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
  