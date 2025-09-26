// Database enums.
export const CurrencyCodeEnum = [
  "INR",
  "USD",
  "GBP",
  "EUR",
  "JPY",
  "CHF",
] as const;

export const RoleEnum = ["USER", "ADMIN"] as const;

export const GroupTypeEnum = ["TRIP", "HOME", "COUPLE", "OTHER"] as const;

export const GroupRoleEnum = ["MANAGER", "MEMBER"] as const;

export const LogTypeEnum = [
  "USER",
  "GROUP",
  "EXPENSE",
  "SETTLEMENT",
  "FRIEND_REQUEST",
] as const;

// Error codes and interface.
export type TErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "UNPROCESSABLE_CONTENT"
  | "TOO_MANY_REQUESTS"
  | "CLIENT_CLOSED_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT";

export interface IError {
  code: TErrorCode;
  message: string;
}
