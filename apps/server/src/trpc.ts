import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./config/trpc.config";

const t = initTRPC.context<Context>().create({
  // transformer: superjson,
});
const middleware = t.middleware;

const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  return next({ ctx });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
