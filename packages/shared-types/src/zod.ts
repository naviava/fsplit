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

export const registerFormSchema = z
  .object({
    displayName: z
      .string()
      .min(1, { message: "Cannot be empty" })
      .max(20, { message: "Max 20 characters." }),
    email: z.string().email({ message: "Invalid email" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(6, { message: "Password too short" }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(
        new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}?$/),
        { message: "Invalid phone number." }
      )
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
