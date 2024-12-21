

import { atom } from "recoil";
import { atomFamily } from "recoil";
import { MenuResponseModel, OrderResponseModel } from "../../models/responseModels";


export const homeTabBarState = atom<number>({
  key: "homeTabBarState", // unique ID
  default: 0,
});

export const homeMenuListState = atom<MenuResponseModel[]>({
  key: "homeMenuListState", // unique ID
  default: [],
});

export const userOrderListState = atom<OrderResponseModel[]>({
  key: "userOrderListState", // unique ID
  default: [],
});


export const tableRowAtomFamily = atomFamily<OrderResponseModel, string>({
  key: "tableRowAtomFamily",
  default: (id: string) =>
    new OrderResponseModel(
      id,
      "waiting",
      0, 
      "",
      "", 
      new MenuResponseModel(
        "", 
        "", 
        "", 
        0, 
        0 
      )
    ),
});