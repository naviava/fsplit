import { TRPCError } from "@trpc/server";

export { nanoid } from "nanoid";

type Success<T> = {
  data: T;
  error: null;
};
type Failure<E> = {
  data: null;
  error: E;
};
type Result<T, E = Error> = Success<T> | Failure<E>;
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export function throwInternalServerError(
  error: unknown | null,
  message: string
): never {
  if (error !== null) console.error(message + ": " + error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: error || undefined,
  });
}
