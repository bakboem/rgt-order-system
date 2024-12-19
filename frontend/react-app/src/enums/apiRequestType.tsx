/* eslint-disable @typescript-eslint/no-unused-vars */

export enum ApiRequestType {
  USER_LOGIN = "LOGIN",
  BIZ_LOGIN = "BIZLOGIN",
  ORDER_ALL_FOR_USER = "ORDERALLFORUSER",
  ORDER_ALL_FOR_BIZ = "ORDERALLFORBIZ",
  MENU_ADD = "MANUADD",
  MENU_UPDATE = "MENUUPDATE",
  MENU_UPDATE_FOR_STOCK = "MENUUPDATEFORSTOCK",
  CHECK_MENU_STOCK = "CHECKMENUSTOCK",
  MENU_ALL = "MENUALL",
  ORDER_ADD = "ORDERADD",
  ORDER_DELETE= "ORDERDELETE",
  MENU_DELETE= "MENUDELETE",
  ORDER_UPDATE= "ORDERUPDATE",
  WHOAMI_USER = "WHOAMIUSER",
  WHOAMI_BIZ = "WHOAMIBIZ"
}

// 自定义反向查找函数
function getEnumKeyByValue(value: string): string | undefined {
  return (
    Object.keys(ApiRequestType) as Array<keyof typeof ApiRequestType>
  ).find((key) => ApiRequestType[key] === value);
}
