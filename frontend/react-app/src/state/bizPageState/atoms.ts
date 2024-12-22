import { atom } from "recoil";
import { MenuResponseModel } from "../../models/responseModels";

export const bizMenuListState = atom<MenuResponseModel[]>({
  key: "bizMenuListState", 
  default: [],
});