export interface ApiRequestTypeBodyModel<T = any> {
  params?: Record<string, string | number>; 
  body?: T; 
  headers?: Record<string, string>; 
  options?: RequestInit; 
}
