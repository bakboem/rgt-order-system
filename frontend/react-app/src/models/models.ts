




interface WebSocketMessage {
  type: string | undefined;
  data: Array<any>; // 某些消息类型可能没有 `data` 字段
}

export type {WebSocketMessage}





