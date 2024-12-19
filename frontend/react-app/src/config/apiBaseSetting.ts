//
export const apiBaseSetting = {
  socketUrl:
    process.env.NODE_ENV === 'production'
      ? 'ws://localhost:8000/socket'
      : 'ws://localhost:8000/socket',
  baseUrl: 'http://localhost:8000',
  defaultHeaders: {
    'Content-Type': 'application/json', // 默认的 Content-Type
    Accept: 'application/json', // 默认的 Accept 头
  },
};
