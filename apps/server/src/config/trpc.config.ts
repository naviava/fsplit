import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { db } from "@fsplit/db";
import { auth } from "../lib/auth";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const session = await auth.api.getSession({
    headers: req.headers as unknown as Headers,
  });
  console.log(req.headers);
  return {
    req,
    res,
    db,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
