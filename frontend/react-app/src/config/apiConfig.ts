/*
 * Filename: /Users/bakbeom/work/sm/htms/src/config/apiConfig.tsx
 * Path: /Users/bakbeom/work/sm/htms
 * Created Date: Saturday, October 19th 2024, 4:24:22 pm
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

import { ApiRequestType } from '../enums/apiRequestType';
import { apiBaseSetting } from './apiBaseSetting';

// 通用 API 配置
export interface ApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

// 生成 API 配置，结合全局的 baseUrl 和每个请求的特定路径
export function getApiConfig(requestType: ApiRequestType, params?: { id?: string }): ApiConfig {
  const { id = "default" } = params || {};
  switch (requestType) {
    case ApiRequestType.USER_LOGIN:
      return {
        url: `${apiBaseSetting.baseUrl}/auth/login/user`,
        method: 'POST',
      };
    case ApiRequestType.BIZ_LOGIN:
      return { url: `${apiBaseSetting.baseUrl}/auth/login/biz`, method: 'POST' };
    case ApiRequestType.ORDER_ALL_FOR_USER:
      return {
        url: `${apiBaseSetting.baseUrl}/order/all/for/user`,
        method: 'GET',
      };
    case ApiRequestType.ORDER_ALL_FOR_BIZ:
      return {
        url: `${apiBaseSetting.baseUrl}/order/all/for/user`,
        method: 'GET',
      };
    case ApiRequestType.MENU_ADD:
      return {
        url: `${apiBaseSetting.baseUrl}/menu/add`,
        method: 'POST',
      };
    case ApiRequestType.MENU_UPDATE:
      return { url: `${apiBaseSetting.baseUrl}/menu/update/${id}`, method: 'PUT' };
    case ApiRequestType.MENU_UPDATE_FOR_STOCK:
      return {
        url: `${apiBaseSetting.baseUrl}/menu/update/stock/${id}`,
        method: 'POST',
      };
    case ApiRequestType.CHECK_MENU_STOCK:
      return {
        url: `${apiBaseSetting.baseUrl}/menu/${id}/stock`,
        method: 'GET',
      };
    case ApiRequestType.MENU_ALL_FOR_USER:
      return {
        url: `${apiBaseSetting.baseUrl}/menu/all/for/user`,
        method: 'GET',
      };
      case ApiRequestType.MENU_ALL_FOR_BIZ:
        return {
          url: `${apiBaseSetting.baseUrl}/menu/all/for/biz`,
          method: 'GET',
        };
    case ApiRequestType.ORDER_ADD:
      return {
        url: `${apiBaseSetting.baseUrl}/order/add`,
        method: 'POST',
      };
    case ApiRequestType.ORDER_DELETE:
      return {
        url: `${apiBaseSetting.baseUrl}/order/delete/${id}`,
        method: 'DELETE',
      };
    case ApiRequestType.MENU_DELETE:
      return {
        url: `${apiBaseSetting.baseUrl}/menu/delete/${id}`,
        method: 'DELETE',
      };
      case ApiRequestType.ORDER_UPDATE:
        return {
          url: `${apiBaseSetting.baseUrl}/update/order/${id}`,
          method: 'DELETE',
        };
        case ApiRequestType.WHOAMI_BIZ:
          return {
            url: `${apiBaseSetting.baseUrl}/auth/biz/info`,
            method: 'GET',
          };
          case ApiRequestType.WHOAMI_USER:
            return {
              url: `${apiBaseSetting.baseUrl}/auth/user/info`,
              method: 'GET',
            };
    default:
      throw new Error(`Unknown request type: ${requestType}`);
  }
}
