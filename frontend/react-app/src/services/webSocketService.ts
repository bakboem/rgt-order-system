class WebSocketService {
  private socket: WebSocket | null = null;
  private lastResponse: boolean = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private messageQueue: Array<any> = []; 
  private isProcessingQueue: boolean = false; 

  public registerHandler(type: string, handler: (data: any) => void): void {
    if (this.messageHandlers.has(type)) {
      console.warn(`Handler for message type "${type}" is being overwritten.`);
    }
    this.messageHandlers.set(type, handler);
  }

  public unregisterHandler(type: string): void {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.delete(type);
    } else {
      console.warn(`No handler found for message type "${type}" to unregister.`);
    }
  }

  public connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket is already connected.");
      return;
    }

    this.createConnection(url); 
    this.startHeartbeat(url);
  }

  private createConnection(url: string): void {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      this.socket = newSocket; 
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      if (this.socket === newSocket) {
        this.socket = null; 
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onmessage = (event) => {
      this.queueMessage(event.data); 
    };
  }

  private queueMessage(rawData: string): void {
    try {
      const message = JSON.parse(rawData);
      this.messageQueue.push(message);
      this.processQueue(); 
    } catch (error) {
      console.error("Failed to queue WebSocket message:", error, "Raw data:", rawData);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return; 
    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      const handler =   this.messageHandlers.get(message.type);
      if (message.type === "pong") {
        this.lastResponse = true;
        console.info("Pong received:", message);
      } else if (handler) {
         handler(message);
      } else {
        console.warn("No handler registered for message type:", message.type);
      }
    }

    this.isProcessingQueue = false; 
  }

  private reconnectAttempts = 0;

  private async reconnect(url: string): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); 
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
        await this.reconnect(url); 
      } else {
        this.reconnectAttempts = 0; 
      }
    }, 10000); 
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
          resolve(this.lastResponse); 
        }, 1000);
      } else {
        resolve(false); 
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
