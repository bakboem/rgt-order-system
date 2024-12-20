import { ApiRequestType } from '../enums/apiRequestType';
import { getApiConfig } from '../config/apiConfig';
import { ApiRequestTypeBodyModel } from '../models/apiRequestBodyModels';
import { apiBaseSetting } from '../config/apiBaseSetting';
import 'reflect-metadata'; 
import {  token_expired_event_name } from '../config/statics';
import { ApiHooks } from '../models/apiHooks';
import { getToken, isTokenValid } from '../utils/tokenUtils';
import { emit,throttleEmit } from "./emitServer";
function deserialize<T>(cls: new (...args: any[]) => T, json: any): T {
  const instance = new cls();

  for (const key of Object.keys(json)) {
    const exposedName =
      Reflect.getMetadata('expose:name', cls.prototype, key) || key;

    const metadataType = Reflect.getMetadata(
      'design:type',
      cls.prototype,
      exposedName,
    );

    if (metadataType) {
      if (metadataType === Date) {
        (instance as any)[exposedName] = new Date(json[key]);
      }
      else if (metadataType === Array && Array.isArray(json[key])) {
        const arrayElementType = Reflect.getMetadata(
          'design:elementtype',
          cls.prototype,
          exposedName,
        );
        if (arrayElementType) {
          (instance as any)[exposedName] = json[key].map((item: any) =>
            deserialize(arrayElementType, item),
          );
        } else {
          (instance as any)[exposedName] = json[key];
        }
      }
      else if (
        typeof metadataType === 'function' &&
        metadataType !== String &&
        metadataType !== Number &&
        metadataType !== Boolean
      ) {
        (instance as any)[exposedName] = deserialize(metadataType, json[key]);
      }
      else {
        (instance as any)[exposedName] = json[key];
      }
    }
  }

  return instance;
}

const filterHeaders = (headers: HeadersInit): Record<string, string> => {
  const result: Record<string, string> = {};

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      result[key] = value;
    });
  } else {
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        result[key] = value as string;
      }
    });
  }

  return result;
};

const staticHeaders = filterHeaders(apiBaseSetting.defaultHeaders);

export async function apiRequest<T>(
  requestType: ApiRequestType,
  requestBody?: ApiRequestTypeBodyModel,
  hooks?: ApiHooks,
  cls?: new (...args: any[]) => T, 
  retryCount: number = 0, 
): Promise<T> {
  const apiConfigObject = getApiConfig(requestType);
  const { params, body, headers = {}, options = {} } = requestBody || {};

  let token = getToken();
  if (!isTokenValid(token)) {
    try {
    } catch (error) {}
    const event = new CustomEvent(token_expired_event_name);
    window.dispatchEvent(event);
  }

  const combinedHeaders = new Headers(staticHeaders);
  if (token) {
    combinedHeaders.append('Authorization', `Bearer ${token}`);
  }

  const filteredHeaders = filterHeaders(headers);
  Object.entries(filteredHeaders).forEach(([key, value]) =>
    combinedHeaders.append(key, value),
  );

  if (options.headers) {
    const filteredOptionHeaders = filterHeaders(options.headers);
    Object.entries(filteredOptionHeaders).forEach(([key, value]) =>
      combinedHeaders.append(key, value),
    );
  }

  if (hooks?.onBeforeRequest) {
    hooks.onBeforeRequest(combinedHeaders, options);
  }

  let requestBodyData: BodyInit | undefined;
  const contentType = combinedHeaders.get('Content-Type') || 'application/json';

  if (body && hooks?.serialize) {
    requestBodyData = hooks.serialize(body);
  } else if (body) {
    if (contentType === 'application/json') {
      requestBodyData = JSON.stringify(body);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      requestBodyData = new URLSearchParams(
        body as Record<string, string>,
      ).toString();
    } else if (contentType === 'multipart/form-data') {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value instanceof Blob || typeof value === 'string') {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
      requestBodyData = formData;
      combinedHeaders.delete('Content-Type');
    }
  }

  let url = apiConfigObject.url;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();
    url += `?${queryString}`;
  }

  const fetchOptions: RequestInit = {
    method: apiConfigObject.method,
    headers: combinedHeaders,
    ...(apiConfigObject.method !== 'GET' && { body: requestBodyData }), 
    ...options,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = new Error(`statusCode:${response.status}`);
      if (hooks?.onResponseError) {
        await hooks.onResponseError(error as Error);
      }
      if (response.status === 401) {
        emit("unauthorized"); 
        throw new Error(`Request failed: ${response.status}`);
      }
     
      if (response.status === 400) {
        const body = await response.json();
        throttleEmit("badRequest", { message: body.detail }, 3000); 
      }
     
    }

    let result: T;
    if (hooks?.deserialize) {
      result = await hooks.deserialize(response);
    } else {
      const json = await response.json();
      if (cls) {
        result = deserialize(cls, json); 
      } else {
        result = json as T; 
      }
    }

    if (hooks?.onResponseSuccess) {
      await hooks.onResponseSuccess(response);
    } 

    return result;
  } catch (error) {
    if (hooks?.onResponseError) {
      await hooks.onResponseError(error as Error);
    } else {
      console.error('Request failed:', error);
    }
    throw error;
  }
}

