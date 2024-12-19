export interface ApiRequestTypeBodyModel<T = any> {
  params?: Record<string, string | number>; // URL 查询参数
  body?: T; // 请求体数据
  headers?: Record<string, string>; // 请求头
  options?: RequestInit; // 额外的 fetch 选项
}
