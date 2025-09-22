import type { IError } from ".";

interface IServiceMessage<T extends string, P> {
  type: T;
  payload: P;
}

// Payload types.
export interface TErrorPayload {
  message: string;
  userId: string;
}

interface IBasePayload {
  error?: IError;
  userId: string;
}

export interface TAuthPayload {
  userId: string;
  sessionId: string;
}

// Add other extended payloads types here.

// Service type and payload object types.
export type TServicePayload =
  | IServiceMessage<"error", TErrorPayload>
  | IServiceMessage<"auth", TAuthPayload>;
