import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { contactUsSchema } from "@fsplit/types/zod";
import { createContactFormEntry } from "@fsplit/utils/server/misc";

export const miscRouter = {
  contactUs: publicProcedure
    .input(contactUsSchema)
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase();
      const { fullName, message } = input;

      const newEntry = await createContactFormEntry({
        name: fullName,
        email,
        message,
      });

      return {
        toastTitle: "Message sent",
        toastDescription: "We'll get back to you soon!",
      };
    }),

  // End of miscRouter
} satisfies TRPCRouterRecord;
