import { miscRouter } from "./routers/misc-router";
import { userRouter } from "./routers/user-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  misc: miscRouter,
});

export type TRPCRouter = typeof appRouter;
