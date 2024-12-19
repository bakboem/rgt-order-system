//
export const apiBaseSetting = {
  socketUrl:
    process.env.NODE_ENV === 'production'
      ? 'wss://hospital.temashare.com/mqtt/socket/'
      : 'ws://localhost:8000/ws/user/xxxx',
  baseUrl: 'http://localhost:8000',
  defaultHeaders: {
    'Content-Type': 'application/json', // 默认的 Content-Type
    Accept: 'application/json', // 默认的 Accept 头
  },
};
