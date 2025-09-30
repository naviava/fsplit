import { createTRPCRouter, privateProcedure, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: privateProcedure.query(() => {
    return "Hello from tRPC!";
  }),
});

export type TRPCRouter = typeof appRouter;
