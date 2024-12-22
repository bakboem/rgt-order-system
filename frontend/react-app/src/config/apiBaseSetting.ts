//
export const apiBaseSetting = {
  socketUrl:
    
  process.env.NODE_ENV === 'production'
      ? 'ws://appserver:8000/socket'
      : 'ws://localhost:8000/socket',
  baseUrl:  process.env.NODE_ENV === 'production'?'http://appserver:8000': 'http://localhost:8000',
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json', 
  },
};
