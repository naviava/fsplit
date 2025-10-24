import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { newUserRegistrationSchema } from "@fsplit/types/zod";

export const userRouter = {
  /**
   * User has been created in db, by better auth.
   * Here we send a verification email or perform other post-registration actions.
   */
  newUserRegistration: publicProcedure
    .input(newUserRegistrationSchema)
    .mutation(async ({ input }) => {
      const { displayName, email, firstName, lastName, phone } = input;

      // TODO: Create confirm email token.

      // TODO: Send verification email.

      return {
        toastTitle: "Verification email sent",
        toastDescription:
          "Please check your email to verify your account. Email will expire in 15 minutes.",
      };
    }),

  // End of userRouter
} satisfies TRPCRouterRecord;
