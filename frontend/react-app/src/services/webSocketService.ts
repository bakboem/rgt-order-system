class WebSocketService {
  // WebSocket instance for connection
  private socket: WebSocket | null = null; 
  // Tracks the last pong response 
  private lastResponse: boolean = false; 
  // Interval for heartbeat checks
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null; 
  // Handlers for message types 
  private messageHandlers: Map<string, (data: any) => void> = new Map(); 
  // Queue to process incoming messages 
  private messageQueue: Array<any> = []; 
  // Tracks if message queue is being processed 
  private isProcessingQueue: boolean = false; 
  // Registers a message handler for a specific type 
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

  // Processes messages in the queue / 대기열의 메시지 처리
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      const handler = this.messageHandlers.get(message.type);
      if (message.type === "pong") {
        this.lastResponse = true; // Updates pong response status 
        console.info("Pong received:", message);
      } else if (handler) {
        handler(message); // Executes the registered handler 
      } else {
        console.warn("No handler registered for message type:", message.type);
      }
    }

    this.isProcessingQueue = false;
  }

  private reconnectAttempts = 0; // Tracks the number of reconnect attempts 

  // Handles reconnection with exponential backoff 
  private async reconnect(url: string): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.info(`Reconnecting in ${delay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.reconnectAttempts++;
    this.createConnection(url);
  }

  // Starts the heartbeat interval to check connection health 
  private startHeartbeat(url: string): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      const isAlive = await this.checkAlive();
      if (!isAlive) {
        console.info("WebSocket connection lost, attempting to reconnect...");
        this.disconnect(); // Disconnects the current WebSocket 
        await this.reconnect(url); // Attempts to reconnect
      } else {
        this.reconnectAttempts = 0;
      }
    }, 10000);
  }

  // Sends a message through the WebSocket connection 
  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected or not ready.");
    }
  }

  // Checks if the WebSocket connection is alive by sending a ping 
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

  // Disconnects the WebSocket and clears the heartbeat interval 
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
