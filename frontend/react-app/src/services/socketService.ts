class WebSocketService {
  private socket: WebSocket | null = null;

  public connect(url: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);

      // 监听连接事件
      this.socket.onopen = () => {
        console.log("WebSocket connected");
      };

      // 监听关闭事件
      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      // 监听错误事件
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }

  public onMessage(callback: (data: string) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        callback(event.data);
      };
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected or not ready.");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
