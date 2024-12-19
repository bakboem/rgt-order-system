/*
 * Filename: /Users/bakbeom/work/sm/htms/src/config/apiConfig.tsx
 * Path: /Users/bakbeom/work/sm/htms
 * Created Date: Saturday, October 19th 2024, 4:24:22 pm
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

import { ApiRequestType } from "../enums/apiRequestType";
import { apiBaseSetting } from "./apiBaseSetting";

// 通用 API 配置
export interface ApiConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

// 生成 API 配置，结合全局的 baseUrl 和每个请求的特定路径
export function getApiConfig(requestType: ApiRequestType): ApiConfig {
  switch (requestType) {
    case ApiRequestType.LOGIN:
      return { url: `${apiBaseSetting.baseUrl}/login`, method: "POST" };
    case ApiRequestType.ADD_PATIENT:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/patient/add`,
        method: "POST",
      };
    case ApiRequestType.BIND_THERMOMETER:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/thermometer/bind`,
        method: "PUT",
      };
    case ApiRequestType.LIST_PATIENT:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/list/patient`,
        method: "GET",
      };
    case ApiRequestType.LIST_THERMOMETER:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/list/thermometer`,
        method: "GET",
      };
    case ApiRequestType.REFRESH_TOKEN:
      return { url: `${apiBaseSetting.baseUrl}/token/refresh`, method: "POST" };
    case ApiRequestType.LIST_BUIDONG:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/list/building`,
        method: "GET",
      };
    case ApiRequestType.LIST_STAFF:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/list/staff`,
        method: "GET",
      };
    case ApiRequestType.LIST_FAVORITES:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/staff/favorites`,
        method: "GET",
      };
    case ApiRequestType.ADD_OR_DEL_FAVORITES:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/staff/favorite/addOrDelete`,
        method: "POST",
      };
    case ApiRequestType.GRAFANA_TOKEN_REQUEST:
      return {
        url: `${apiBaseSetting.baseUrl}/generate-token`,
        method: "POST",
      };
    case ApiRequestType.LAST_TEMPERATURE_REQUEST:
      return {
        url: `${apiBaseSetting.baseUrl}/hospital/staff/favorites/temperature`,
        method: "GET",
      };
    default:
      throw new Error(`Unknown request type: ${requestType}`);
  }
}
