import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import { z } from "zod";

import { nanoid, throwInternalServerError, tryCatch } from "..";
import { newUserRegistrationSchema } from "@fsplit/types/zod";
import { confirmEmailTokens, users } from "@fsplit/db/schema";
import { and, db, eq } from "@fsplit/db";

const domain = process.env.WEB_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function getUserByEmail(email: string) {
  const { data, error } = await tryCatch(
    (async () => {
      const [existingUser] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          isVerified: users.emailVerified,
        })
        .from(users)
        .where(and(eq(users.email, email), eq(users.disabled, false)));

      return existingUser || null;
    })()
  );

  if (!!error) {
    throwInternalServerError(error, "Failed to fetch user by email.");
  }

  return data;
}

export async function sendVerificationEmail({
  email,
  token,
  pathname,
}: {
  email: string;
  token: string;
  pathname: string;
}) {
  const confirmLink = `${domain}${pathname}?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "fsplit-verify@fondingo.com",
    to: email,
    subject: "Confirm your email address to use FSplit",
    html: `<p><a href="${confirmLink}">Click here</a> to confirm your email address.<br />This link will be valid for 15 minutes. If you have initiated this manually, any previous links received will not be functional. This is the link to rule them all.</p>`,
  });
  if (error) {
    console.error("Failed to send verification email", error);
    return false;
  }
  return true;
}

export async function initiateVerificationProcess(
  input: z.infer<typeof newUserRegistrationSchema>
) {
  const existingUser = await getUserByEmail(input.email);

  if (!existingUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }
  if (existingUser.isVerified) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email is already verified.",
    });
  }

  const isSuccess = await db.transaction(async (tx) => {
    // Create email confirmation token.
    const { data: newVerificationToken, error: newVerificationTokenError } =
      await tryCatch(
        (async () => {
          const [newVerificationToken] = await tx
            .insert(confirmEmailTokens)
            .values({
              token: nanoid(),
              userId: existingUser.id,
              expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
            })
            .returning({
              token: confirmEmailTokens.token,
            });

          return newVerificationToken;
        })()
      );
    if (!!newVerificationTokenError) {
      await tx.delete(users).where(eq(users.email, input.email));
      throwInternalServerError(
        newVerificationTokenError,
        "Error when trying to create email confirmation token. User creation failed."
      );
    }

    if (!newVerificationToken || !newVerificationToken.token) {
      await tx.delete(users).where(eq(users.email, input.email));
      throwInternalServerError(
        null,
        "Failed to create email confirmation token. User creation failed."
      );
    }

    // Send verification email.
    const { data: response, error: isError } = await tryCatch(
      (async () => {
        const response = await sendVerificationEmail({
          email: existingUser.email,
          token: newVerificationToken.token,
          pathname: "/verify",
        });

        return response;
      })()
    );
    if (isError) {
      await tx.delete(users).where(eq(users.email, input.email));
      throwInternalServerError(
        isError,
        "Error when trying to send verification email. User creation failed."
      );
    }
    if (!response) {
      await tx.delete(users).where(eq(users.email, input.email));
      throwInternalServerError(
        null,
        "Failed to send verification email. User creation failed."
      );
    }

    // Update profile.
    const { data: profileUpdated, error: profileUpdatedError } = await tryCatch(
      (async () => {
        const { displayName, firstName, lastName, phone } = input;
        const [updatedProfile] = await tx
          .update(users)
          .set({
            name: displayName,
            firstName: firstName || null,
            lastName: lastName || null,
            phone: phone || null,
          })
          .where(eq(users.email, input.email))
          .returning({ id: users.id });

        return !!updatedProfile;
      })()
    );
    if (!!profileUpdatedError || !profileUpdated) {
      throwInternalServerError(
        profileUpdatedError,
        "Failed to update user profile after registration. User creation failed."
      );
    }
    return response;
  });

  return isSuccess;
}
