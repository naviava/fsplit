import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

import type { TServicePayload } from "@fsplit/types/services";
import { socketHandlerMap } from "../utils/socket/map";

export class SocketService {
  private wss: WebSocketServer;
  private connectedUsers: Map<string, Map<string, WebSocket>>;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.connectedUsers = new Map();
    this.initialize();
  }

  private initialize(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (message: string) => {
        this.handleMessage(ws, message);
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });
    });
  }

  private handleMessage(ws: WebSocket, message: string): void {
    try {
      const data = JSON.parse(message) as TServicePayload;

      if (data.type === "auth") {
        const { userId, sessionId } = data.payload;

        if (!sessionId) {
          ws.send(
            JSON.stringify({
              type: "error",
              payload: { message: "Missing sessionId" },
            })
          );
          ws.close();
          return;
        }

        // Initialize a Set for the user if it doesn't exist
        if (!this.connectedUsers.has(userId))
          this.connectedUsers.set(userId, new Map());

        this.connectedUsers.get(userId)?.set(sessionId, ws);
        // Exit early after handling "auth"
        return;
      }

      // Look up the handler in the map for non-"auth" cases
      const handler = socketHandlerMap[data.type];
      if (handler) handler(ws, data);
      else console.warn("Unknown message type:", data.type);
    } catch (error) {
      console.error("Error parsing message: ", error);
    }
  }

  private handleDisconnect(ws: WebSocket): void {
    for (const [userId, sessionMap] of this.connectedUsers) {
      for (const [sessionId, clientWs] of sessionMap) {
        if (clientWs === ws) {
          sessionMap.delete(sessionId);

          // Remove the user entry if no sessions remain'
          if (sessionMap.size === 0) this.connectedUsers.delete(userId);
          break;
        }
      }
    }
  }

  public sendToUser(
    userId: string,
    type: TServicePayload["type"],
    message: TServicePayload
  ): void {
    const sessionMap = this.connectedUsers.get(userId);
    if (!!sessionMap)
      sessionMap.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(JSON.stringify({ type, payload: message.payload }));
      });
  }

  public sendToUserSession(
    userId: string,
    sessionId: string,
    type: TServicePayload["type"],
    message: TServicePayload
  ): void {
    const sessionMap = this.connectedUsers.get(userId);
    const ws = sessionMap?.get(sessionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload: message.payload }));
    }
  }

  public sendToAll(
    userIds: string[],
    type: TServicePayload["type"],
    message: TServicePayload
  ) {
    userIds.forEach((userId) => {
      const sessionMap = this.connectedUsers.get(userId);
      if (!!sessionMap)
        sessionMap.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, payload: message.payload }));
          }
        });
    });
  }

  public sendToOthers(
    userIds: string[],
    type: TServicePayload["type"],
    message: TServicePayload
  ) {
    const filteredUsers = userIds.filter((id) => id !== message.payload.userId);
    filteredUsers.forEach((userId) => {
      const sessionMap = this.connectedUsers.get(userId);
      if (!!sessionMap)
        sessionMap.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type, payload: message.payload }));
          }
        });
    });
  }

  public broadcast(type: string, payload: unknown): void {
    this.connectedUsers.forEach((sessionMap) => {
      sessionMap.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(JSON.stringify({ type, payload }));
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      this.broadcast("server_shutdown", {
        message: "Server is shutting down.",
      });

      this.connectedUsers.forEach((sessionMap) => {
        sessionMap.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN)
            ws.close(1000, "Server shutdown");
        });
      });
      this.connectedUsers.clear();

      this.wss.close((error) => {
        if (!!error) console.error("Error closing WebSocket server: ", error);
        else console.log("WebSocket server closed.");
        resolve();
      });
    });
  }
}
