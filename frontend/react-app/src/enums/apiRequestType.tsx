/* eslint-disable @typescript-eslint/no-unused-vars */

export enum ApiRequestType {
    LOGIN = "LOGIN",
    REFRESH_TOKEN = "MODIFY_USER",
    ADD_PATIENT = "ADD_PATIENT",
    LIST_PATIENT = "LIST_PATIENT",
    LIST_THERMOMETER = "LIST_THERMOMETER",
    LIST_STAFF = "LIST_STAFF",
    BIND_THERMOMETER = "BIND_THERMOMETER",
    LIST_BUIDONG = "LIST_BUIDONG",
    LIST_FAVORITES = "LIST_FAVORITES",
    ADD_OR_DEL_FAVORITES = "ADD_OR_DEL_FAVORITES",
    GRAFANA_TOKEN_REQUEST = "GRAFANA_TOKEN_REQUEST",
    LAST_TEMPERATURE_REQUEST = "LAST_TEMPERATURE_REQUEST",
  }
  
  // 自定义反向查找函数
  function getEnumKeyByValue(value: string): string | undefined {
    return (
      Object.keys(ApiRequestType) as Array<keyof typeof ApiRequestType>
    ).find((key) => ApiRequestType[key] === value);
  }
  