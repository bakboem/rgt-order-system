

import { atom } from "recoil";
import { MenuResponseModel } from "../../models/responseModels";


export const homeTabBarState = atom<number>({
  key: "homeTabBarState", // unique ID
  default: 0,
});

export const homeMenuListState = atom<MenuResponseModel[]>({
  key: "menuListState", // unique ID
  default: [],
});

