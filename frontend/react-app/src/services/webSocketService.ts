class WebSocketService {
  // *** WebSocket instance for connection / WebSocket 연결 인스턴스 ***
  private socket: WebSocket | null = null; 
  // *** Tracks the last pong response / 마지막 pong 응답을 추적 ***
  private lastResponse: boolean = false; 
  // *** Interval for heartbeat checks / 하트비트 체크 간격 ***
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null; 
  // *** Handlers for message types / 메시지 유형에 대한 핸들러 ***
  private messageHandlers: Map<string, (data: any) => void> = new Map(); 
  // *** Queue to process incoming messages / 수신 메시지를 처리하는 대기열 ***
  private messageQueue: Array<any> = []; 
  // *** Tracks if message queue is being processed / 메시지 대기열 처리 여부 추적 ***
  private isProcessingQueue: boolean = false; 
  // *** Registers a message handler for a specific type / 특정 유형에 대한 메시지 핸들러 등록 ***
  public registerHandler(type: string, handler: (data: any) => void): void {
    if (this.messageHandlers.has(type)) {
      console.warn(`Handler for message type "${type}" is being overwritten.`);
    }
    this.messageHandlers.set(type, handler);
  }

  // *** Unregisters a message handler for a specific type / 특정 유형에 대한 메시지 핸들러 등록 해제 ***
  public unregisterHandler(type: string): void {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.delete(type);
    } else {
      console.warn(`No handler found for message type "${type}" to unregister.`);
    }
  }

  // *** Establishes a WebSocket connection / WebSocket 연결 설정 ***
  public connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket is already connected.");
      return;
    }

    this.createConnection(url); // *** Creates a new WebSocket connection / 새로운 WebSocket 연결 생성 ***
    this.startHeartbeat(url); // *** Starts heartbeat to monitor connection / 연결 모니터링을 위한 하트비트 시작 ***
  }

  // *** Creates a new WebSocket connection and sets up event handlers / 새로운 WebSocket 연결 생성 및 이벤트 핸들러 설정 ***
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
      this.queueMessage(event.data); // *** Queue incoming messages for processing / 수신 메시지를 처리 대기열에 추가 ***
    };
  }

  // *** Queues an incoming message for processing / 수신 메시지를 처리 대기열에 추가 ***
  private queueMessage(rawData: string): void {
    try {
      const message = JSON.parse(rawData);
      this.messageQueue.push(message);
      this.processQueue(); // *** Processes queued messages / 대기열 메시지 처리 ***
    } catch (error) {
      console.error("Failed to queue WebSocket message:", error, "Raw data:", rawData);
    }
  }

  // *** Processes messages in the queue / 대기열의 메시지 처리 ***
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      const handler = this.messageHandlers.get(message.type);
      if (message.type === "pong") {
        this.lastResponse = true; // *** Updates pong response status / pong 응답 상태 업데이트 ***
        console.info("Pong received:", message);
      } else if (handler) {
        handler(message); // *** Executes the registered handler / 등록된 핸들러 실행 ***
      } else {
        console.warn("No handler registered for message type:", message.type);
      }
    }

    this.isProcessingQueue = false;
  }

  private reconnectAttempts = 0; // *** Tracks the number of reconnect attempts / 재연결 시도 횟수 추적 ***

  // *** Handles reconnection with exponential backoff / 지수적 백오프를 사용한 재연결 처리 ***
  private async reconnect(url: string): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.warn(`Reconnecting in ${delay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.reconnectAttempts++;
    this.createConnection(url);
  }

  // *** Starts the heartbeat interval to check connection health / 연결 상태를 확인하기 위한 하트비트 간격 시작 ***
  private startHeartbeat(url: string): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      const isAlive = await this.checkAlive();
      if (!isAlive) {
        console.warn("WebSocket connection lost, attempting to reconnect...");
        this.disconnect(); // *** Disconnects the current WebSocket / 현재 WebSocket 연결 해제 ***
        await this.reconnect(url); // *** Attempts to reconnect / 재연결 시도 ***
      } else {
        this.reconnectAttempts = 0;
      }
    }, 10000);
  }

  // *** Sends a message through the WebSocket connection / WebSocket 연결을 통해 메시지 전송 ***
  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected or not ready.");
    }
  }

  // *** Checks if the WebSocket connection is alive by sending a ping / ping을 통해 WebSocket 연결 상태 확인 ***
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

  // *** Disconnects the WebSocket and clears the heartbeat interval / WebSocket 연결 해제 및 하트비트 간격 제거 ***
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
