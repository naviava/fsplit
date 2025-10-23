import { z } from "zod";

// Add zod types here.
export const contactUsSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Cannot be empty" })
    .max(50, { message: "Too long" }),
  email: z.email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Too short" })
    .max(5000, { message: "Too long" }),
});
