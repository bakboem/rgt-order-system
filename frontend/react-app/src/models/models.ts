




interface WebSocketMessage {
  type: string;
  data?: any; // 某些消息类型可能没有 `data` 字段
}

export type {WebSocketMessage}