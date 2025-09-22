import type { WebSocket } from "ws";
import type { TServicePayload } from "@fsplit/types/services";
import { publish } from "@fsplit/redis";

type SocketHandler<T extends TServicePayload["type"]> = (
  ws: WebSocket,
  message: Extract<TServicePayload, { type: T }>
) => void;

export const socketHandlerMap: {
  [K in TServicePayload["type"]]: SocketHandler<K>;
} = {
  auth: () => {},
  error: () => {},

  /**
   *
   * EXAMPLE USAGE:
   * new_task: (ws, message) => publish(ws, message),
   *
   */
};
