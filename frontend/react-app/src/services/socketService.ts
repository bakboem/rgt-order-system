import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;

  public connect(url: string): void {
    if (!this.socket) {
      this.socket = io(url);

      this.socket.on("connect", () => {
        console.log("WebSocket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });
    }
  }

  public onMessage(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  public sendMessage(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
