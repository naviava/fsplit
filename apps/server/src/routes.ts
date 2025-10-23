import { miscRouter } from "./routers/misc-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  misc: miscRouter,
});

export type TRPCRouter = typeof appRouter;
