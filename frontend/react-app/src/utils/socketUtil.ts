import { ApiRequestType } from '../enums/apiRequestType';
import { BizResponseModel, UserResponseModel } from '../models/responseModels';
import { apiRequest } from '../services/apiService';
import { getToken } from './tokenUtils';
import { apiBaseSetting } from '../config/apiBaseSetting';
import { bizTokenName, userTokenName } from '../config/statics';

class SocketUtils {
  static async getSocketUrl(): Promise<string> {
    const userToken = sessionStorage.getItem(userTokenName);
    const bizToken = sessionStorage.getItem(bizTokenName);
    const activeToken = getToken();
    const isUserToken = userToken && userToken === activeToken;
    const isBizToken = bizToken && bizToken === activeToken;
    if (isUserToken) {
      const userInfo = await this.getUserInfo();
      if (userInfo && userInfo.id) {
        return apiBaseSetting.baseUrl + '/' + userInfo.id;
      }
    } else if (isBizToken) {
      const bizInfo = await this.getBizInfo();
      if (bizInfo && bizInfo.id) {
        return apiBaseSetting.baseUrl + '/' + bizInfo.id;
      }
    }
    return '';
  }

  static async getUserInfo(): Promise<UserResponseModel | null> {
    try {
      console.log('Starting login process...');
      const response = await apiRequest<UserResponseModel>(
        ApiRequestType.USER_LOGIN,
      );
      console.log(response);
      if (response) {
        console.log('Login successful:', response.id);
        return response;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
    return null;
  }

  static async getBizInfo(): Promise<BizResponseModel | null> {
    try {
      console.log('Starting login process...');
      const response = await apiRequest<BizResponseModel>(
        ApiRequestType.USER_LOGIN,
      );
      console.log(response);
      if (response) {
        console.log('Login successful:', response.id);
        return response;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
    return null;
  }
}
export default SocketUtils;
