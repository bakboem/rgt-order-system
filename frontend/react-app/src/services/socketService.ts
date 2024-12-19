class WebSocketService {
  private socket: WebSocket | null = null;
  private lastResponse: boolean = false;

  public connect(url: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("WebSocket connected");
      };

      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.socket.onmessage = (event) => {
        if (event.data === "pong") {
          this.lastResponse = true; // 收到服务端的 pong 回复
        } else {
          console.log("Received message:", event.data);
        }
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


  public async checkAlive(): Promise<boolean> {
    console.log("start check Alive");
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
}

const webSocketService = new WebSocketService();
export default webSocketService;
