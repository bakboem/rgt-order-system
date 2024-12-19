export type ApiHooks = {
  onBeforeRequest?: (headers: Headers, options: RequestInit) => void;
  onResponseSuccess?: (response: Response) => Promise<void>;
  onResponseError?: (error: Error, response?: Response) => Promise<void>;
  serialize?: (body: any) => any; 
  deserialize?: (response: Response) => Promise<any>; 
};
