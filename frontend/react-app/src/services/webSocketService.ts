import SocketUtils from "../utils/socketUtil";

class WebSocketService {
  // WebSocket instance for connection
  private socket: WebSocket | null = null; 
  // Interval for heartbeat checks
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null; 
  // Handlers for message types 
  private messageHandlers: Map<string, (data: any) => void> = new Map(); 
  // Queue to process incoming messages 
  private messageQueue: Array<any> = []; 
  // Tracks if message queue is being processed 
  private isProcessingQueue: boolean = false; 
  private isDisconnecting: boolean = false; 
  // interval
  private readonly HEARTBEAT_INTERVAL: number = 30000;

  private scheduleNextHeartbeat: (() => Promise<void>) | null = null;

  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;

  private reconnectAttempts = 0; // Tracks the number of reconnect attempts 

  private readonly MAX_RECONNECT_ATTEMPTS: number = 5; // 最大重试次数

  public registerHandler(type: string, handler: (data: any) => void): void {
    if (this.messageHandlers.has(type)) {
      console.info(`Handler for message type "${type}" is being overwritten.`);
    }
    this.messageHandlers.set(type, handler);
  }

  // Unregisters a message handler for a specific type 
  public unregisterHandler(type: string): void {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.delete(type);
    } else {
      console.info(`No handler found for message type "${type}" to unregister.`);
    }
  }

  // Establishes a WebSocket connection
  public connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.info("WebSocket is already connected.");
      return;
    }
    this.createConnection(url); // Creates a new WebSocket connection 
    this.startHeartbeat(url); // Starts heartbeat to monitor connection 
  }

  // Creates a new WebSocket connection and sets up event handlers 
  private createConnection(url: string): void {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      this.socket = newSocket;
      this.reconnectAttempts = 0;
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      if (this.socket === newSocket) {
        this.socket = null;
      }
      console.info("Attempting to reconnect...");
        this.reconnect(url).catch((error) => {
            console.error("Reconnect failed:", error);
        });
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onmessage = (event) => {
      console.log(`OnMessage:"${event}"`);
      this.queueMessage(event.data); // Queue incoming messages for processing
    };
  }

  // Queues an incoming message for processing
  private queueMessage(rawData: string): void {
  
    try {
      const message = JSON.parse(rawData);
      this.messageQueue.push(message);
      this.processQueue(); // Processes queued messages 
    } catch (error) {
      console.error("Failed to queue WebSocket message:", error, "Raw data:", rawData);
    }
  }

  // Processes messages in the queue 
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      const handler = this.messageHandlers.get(message.type);

      if ( message.type === "pong") {
        console.log(`Heartbeat received: ${message.type}`);
        this.resetHeartbeatTimer();
      }else if (message.type === "ping" ){
        this.sendMessage("pong");
        console.warn(`Received to Server: pong`);
      } else if (handler) {
        console.log(`Processing message of type: ${message.type}`);
        try {
          handler(message); // Executes the registered handler
        } catch (error) {
          console.error(`Error processing message of type ${message.type}:`, error);
        }
      } else {
        console.warn("No handler registered for message type:", message.type);
      }
    }

    this.isProcessingQueue = false;
  }


  

  // Handles reconnection with exponential backoff 
  private async reconnect(url: string): Promise<void> {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        console.error("Maximum reconnect attempts reached. Stopping reconnection attempts.");
        return; // 停止重试
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // 指数退避
    console.info(`Reconnecting in ${delay / 1000} seconds... (Attempt ${this.reconnectAttempts + 1}/${this.MAX_RECONNECT_ATTEMPTS})`);
    await new Promise((resolve) => setTimeout(resolve, delay)); // 延迟重试
    this.reconnectAttempts++;
    console.warn(`"retry Count: ${this.reconnectAttempts}"`)
    this.createConnection(url); // 尝试重新连接
}

  private async performPing(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false); // 心跳超时
      }, this.HEARTBEAT_INTERVAL);
  
      this.messageHandlers.set("pong", () => {
        console.error("messageHandlers Pong is Callded");
        clearTimeout(timeout);
        resolve(true); // 收到 pong
      });
  
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.sendMessage("ping");
      } else {
        clearTimeout(timeout);
        resolve(false); // WebSocket 未连接
      }
    });
  }
  // Starts the heartbeat interval to check connection health 
  private startHeartbeat(url: string): void {
    const scheduleNextHeartbeat = async () => {
      const isAlive = await this.performPing();
      if (!isAlive) {
        console.info("WebSocket connection lost, attempting to reconnect...");
        this.disconnect();
        const socketUrl = await SocketUtils.getSocketUrl();
        await this.reconnect(socketUrl);
      } else {
        this.reconnectAttempts = 0;
        console.log("Heartbeat check passed.");
            
        if (this.scheduleNextHeartbeat) {
          this.heartbeatTimeout = setTimeout(() => {
              this.scheduleNextHeartbeat!().catch((error) => {
                  console.error("Error in heartbeat scheduling:", error);
              });
          }, this.HEARTBEAT_INTERVAL);
        } else {
          console.warn("scheduleNextHeartbeat is not defined.");
        }
      }
    };
  
    // Store the function for reuse
    this.scheduleNextHeartbeat = scheduleNextHeartbeat;
  
    // Schedule the initial heartbeat check
    this.heartbeatTimeout = setTimeout(scheduleNextHeartbeat, this.HEARTBEAT_INTERVAL);
  }
  private resetHeartbeatTimer(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout); // Clear the existing timeout
    }
  
    if (this.scheduleNextHeartbeat) {
      this.heartbeatTimeout = setTimeout(() => {
          this.scheduleNextHeartbeat!().catch((error) => {
              console.error("Error in heartbeat scheduling:", error);
          });
      }, this.HEARTBEAT_INTERVAL);
    } else {
      console.warn("scheduleNextHeartbeat is not defined.");
    }
  }
  // Sends a message through the WebSocket connection 
  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected or not ready.");
    }
  }

  public async checkAlive(): Promise<boolean> {
    console.log("Checking WebSocket connection...");
    const isAlive = await this.performPing();
    if (!isAlive) {
      console.warn("WebSocket connection is not alive.");
    }
    return isAlive;
  }

  // Disconnects the WebSocket and clears the heartbeat interval 
  public disconnect(): void {
    if (this.isDisconnecting) return;
    if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
    }
    if (this.socket) {
        this.socket.close();
        this.socket = null;
    }
    if (this.scheduleNextHeartbeat) {
        this.scheduleNextHeartbeat = null;
    }
    if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
    }
    this.messageHandlers.clear(); // 清理所有注册的消息处理程序
    this.messageQueue = []; // 清空消息队列
    this.isProcessingQueue = false; // 重置队列处理状态
    this.isDisconnecting = false;
}

}

export default WebSocketService;
