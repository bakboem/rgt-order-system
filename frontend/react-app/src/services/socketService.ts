import handleMessage from "../utils/messageHandle";

class WebSocketService {
  private socket: WebSocket | null = null;
  private lastResponse: boolean = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  public connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket is already connected.");
      return;
    }

    this.createConnection(url); // 建立连接
    this.startHeartbeat(url); // 启动心跳检测
  }

  private createConnection(url: string): void {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      this.socket = newSocket; // 替换旧连接
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      if (this.socket === newSocket) {
        this.socket = null; // 清理失效连接
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onmessage = (event) => {
      this.handleMessageFunc(event.data); // 调用消息处理函数
    };
  }

  private handleMessageFunc(rawData: string): void {
    try {
      const message = JSON.parse(rawData);
      if (message.type === "pong") {
        this.lastResponse = true;
        console.info("Pong received:", message);
      } else {
        handleMessage(rawData); // 调用你的消息代理逻辑
      }
    } catch (error) {
      console.error("Failed to process WebSocket message:", error, "Raw data:", rawData);
    }
  }

  private reconnectAttempts = 0;

  private async reconnect(url: string): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // 每次重连间隔翻倍，最大间隔 30 秒
    console.warn(`Reconnecting in ${delay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.reconnectAttempts++;
    this.createConnection(url);
  }
  
  private startHeartbeat(url: string): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  
    this.heartbeatInterval = setInterval(async () => {
      const isAlive = await this.checkAlive();
      if (!isAlive) {
        console.warn("WebSocket connection lost, attempting to reconnect...");
        this.disconnect();
        await this.reconnect(url); // 使用重连逻辑
      } else {
        this.reconnectAttempts = 0; // 如果成功，重置重连次数
      }
    }, 10000); // 每 10 秒检测一次
  }
  

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected or not ready.");
    }
  }

  public async checkAlive(): Promise<boolean> {
    console.log("Checking WebSocket connection...");
    return new Promise((resolve) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.lastResponse = false;
        this.sendMessage("ping");
        setTimeout(() => {
          resolve(this.lastResponse); // 等待 pong 回复
        }, 1000);
      } else {
        resolve(false); // 如果当前没有连接，返回 false
      }
    });
  }

  public disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
