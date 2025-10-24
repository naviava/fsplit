import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

import { initiateVerificationProcess } from "@fsplit/utils/server/user";
import { newUserRegistrationSchema } from "@fsplit/types/zod";
import { throwInternalServerError } from "@fsplit/utils";

export const userRouter = {
  /**
   * User has been created in db, by better auth.
   * Here we send a verification email or perform other post-registration actions.
   */
  newUserRegistration: publicProcedure
    .input(newUserRegistrationSchema)
    .mutation(async ({ input }) => {
      await initiateVerificationProcess(input);
      return {
        toastTitle: "Verification email sent",
        toastDescription:
          "Please check your email to verify your account. Email will expire in 15 minutes.",
      };
    }),

  // End of userRouter
} satisfies TRPCRouterRecord;
