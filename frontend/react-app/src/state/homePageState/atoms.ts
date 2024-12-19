

import { atom } from "recoil";


export const homeTabBarState = atom<number>({
  key: "homeTabBarState", // unique ID
  default: 0,
});

