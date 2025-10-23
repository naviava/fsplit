import { TRPCError } from "@trpc/server";
import { throwInternalServerError, tryCatch } from "..";
import { db } from "@fsplit/db";
import { contactForms } from "@fsplit/db/schema";

export async function createContactFormEntry(params: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = params;
  if (!name || !email || !message) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "All fields are required.",
    });
  }

  const { data, error } = await tryCatch(
    (async () => {
      const [newEntry] = await db
        .insert(contactForms)
        .values({
          name,
          email,
          message,
        })
        .returning({
          id: contactForms.id,
        });

      return newEntry;
    })()
  );

  if (!!error) {
    throwInternalServerError(error, "Failed to create contact form entry");
  }
  if (!data?.id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to create contact form entry, due to incomplete data.",
    });
  }
  return data;
}
