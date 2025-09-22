import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
// import jwt from "jsonwebtoken";

// import type { TUserContext } from "@fsplit/types";
import { db } from "@fsplit/db";
import Env from "../lib/env";

export function createContext({ req, res }: CreateExpressContextOptions) {
  // const authHeader = req.headers.authorization;
  // const token = authHeader?.split(" ")[1];
  // const unauthenticated = {
  //   req,
  //   res,
  //   user: null,
  //   db,
  // };
  // if (!token) return unauthenticated;
  // try {
  //   const user = jwt.verify(token, Env.JWT_SECRET as string) as TUserContext;
  //   return {
  //     req,
  //     res,
  //     user,
  //     db,
  //   };
  // } catch (err) {
  //   return unauthenticated;
  // }
}
export type Context = Awaited<ReturnType<typeof createContext>>;
