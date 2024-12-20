

import { atom } from "recoil";
import { MenuResponseModel, OrderResponseModel } from "../../models/responseModels";


export const homeTabBarState = atom<number>({
  key: "homeTabBarState", // unique ID
  default: 0,
});

export const homeMenuListState = atom<MenuResponseModel[]>({
  key: "homeMenuListState", // unique ID
  default: [],
});

export const homeOrderListState = atom<OrderResponseModel[]>({
  key: "homeOrderListState", // unique ID
  default: [],
});
