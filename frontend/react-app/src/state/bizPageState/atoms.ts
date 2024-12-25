import { atom } from "recoil";
import { MenuResponseModel, OrderResponseModel } from "../../models/responseModels";



export const bizOrderListState = atom<OrderResponseModel[]>({
  key: "bizOrderListState", // unique ID
  default: [],
});


export const bizMenuListState = atom<MenuResponseModel[]>({
  key: "bizMenuListState", 
  default: [],
});