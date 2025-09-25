// Imports
import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
  CurrencyCodeEnum,
  ProvidersEnum,
  GroupRoleEnum,
  GroupTypeEnum,
  LogTypeEnum,
  RoleEnum,
} from "@fsplit/types";

import { timestamps } from "./constants";

/**
 *
 * Enums
 *
 */

export const providersEnum = t.pgEnum("providers_enum", ProvidersEnum);
export const currencyCodeEnum = t.pgEnum(
  "currency_code_enum",
  CurrencyCodeEnum
);
export const roleEnum = t.pgEnum("role_enum", RoleEnum);
export const groupTypeEnum = t.pgEnum("group_type_enum", GroupTypeEnum);
export const groupRoleEnum = t.pgEnum("group_role_enum", GroupRoleEnum);
export const logTypeEnum = t.pgEnum("log_type_enum", LogTypeEnum);

/**
 *
 * Tables
 *
 */

// Users table
export const users = t.pgTable(
  "users",
  {
    id: t.varchar({ length: 255 }).primaryKey(),
    email: t.varchar({ length: 255 }).unique().notNull(),
    provider: providersEnum().default("CREDENTIALS").notNull(),
    oauthId: t.varchar({ length: 100 }),
    phone: t.varchar({ length: 255 }),
    isMerged: t.boolean().default(false).notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    firstName: t.varchar({ length: 255 }),
    middleName: t.varchar({ length: 255 }),
    lastName: t.varchar({ length: 255 }),
    hashedPassword: t.varchar({ length: 255 }), //TODO: Remove this field from schema.
    image: t.text(),
    preferredCurrency: currencyCodeEnum().default("INR").notNull(),
    role: roleEnum().default("USER").notNull(),
    disabled: t.boolean().default(false).notNull(),
    emailVerified: t.boolean().default(false).notNull(),
    emailVerifiedAt: t.timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (table) => [t.uniqueIndex().on(table.email), t.index().on(table.disabled)]
);

// Sessions table
export const sessions = t.pgTable(
  "sessions",
  {
    id: t.varchar({ length: 255 }).primaryKey(),
    token: t.varchar({ length: 255 }).unique().notNull(),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    ipAddress: t.varchar({ length: 255 }),
    userAgent: t.text(),
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.index().on(table.userId)]
);

// Accounts table
export const accounts = t.pgTable(
  "accounts",
  {
    id: t.varchar({ length: 255 }).primaryKey(),
    accountId: t.varchar({ length: 255 }).notNull(),
    providerId: t.varchar({ length: 255 }).notNull(),
    accessToken: t.text(),
    refreshToken: t.text(),
    accessTokenExpiresAt: t.timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: t.timestamp({ withTimezone: true }),
    scope: t.text(),
    idToken: t.text(),
    password: t.varchar({ length: 255 }),
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t
      .unique("provider_id_account_id_unique")
      .on(table.providerId, table.accountId),
  ]
);

// Verifications table
export const verifications = t.pgTable("verification", {
  id: t.varchar({ length: 255 }).primaryKey(),
  identifier: t.varchar({ length: 255 }).notNull(),
  value: t.varchar({ length: 255 }).notNull(),
  expiresAt: t.timestamp({ withTimezone: true }).notNull(),
  ...timestamps,
});

// Confirm Email Tokens table.
export const confirmEmailTokens = t.pgTable(
  "confirm_email_tokens",
  {
    id: t.serial().primaryKey(),
    token: t
      .varchar({ length: 25 })
      .unique()
      .notNull()
      .$defaultFn(() => nanoid()),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    userId: t
      .varchar({ length: 255 })
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.uniqueIndex().on(table.token), t.index().on(table.expiresAt)]
);

// PasswordResetTokens table
export const passwordResetTokens = t.pgTable(
  "password_reset_tokens",
  {
    id: t.serial().primaryKey(),
    token: t.varchar({ length: 255 }).unique().notNull(),
    email: t.varchar({ length: 255 }).unique().notNull(),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    userEmail: t
      .varchar({ length: 255 })
      .unique()
      .notNull()
      .references(() => users.email, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.uniqueIndex().on(table.token), t.index().on(table.expiresAt)]
);

// AccountVerifications table
export const accountVerifications = t.pgTable(
  "account_verifications",
  {
    id: t.serial().primaryKey(),
    userId: t
      .varchar({ length: 255 })
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.uniqueIndex().on(table.userId)]
);

// Friends table
export const friends = t.pgTable(
  "friends",
  {
    id: t.serial().primaryKey(),
    user1Id: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    user2Id: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.unique("user1_id_user2_id_unique").on(table.user1Id, table.user2Id),
  ]
);

// TempFriends table
export const tempFriends = t.pgTable(
  "temp_friends",
  {
    id: t.serial().primaryKey(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    phone: t.varchar({ length: 255 }),
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.unique("user_id_email_unique").on(table.userId, table.email)]
);

// Invitations table
export const invitations = t.pgTable(
  "invitations",
  {
    id: t.serial().primaryKey(),
    email: t.varchar({ length: 255 }).unique().notNull(),
    fromId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.uniqueIndex().on(table.email)]
);

// FriendRequests table
export const friendRequests = t.pgTable(
  "friend_requests",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    fromId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.uniqueIndex("from_id_to_id_unique").on(table.fromId, table.toId),
    t.check("distinct_users", sql`${table.fromId} <> ${table.toId}`),
  ]
);

// Groups table
export const groups = t.pgTable("groups", {
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  color: t.varchar({ length: 255 }).notNull(),
  type: groupTypeEnum().notNull(),
  currency: currencyCodeEnum().default("INR").notNull(),
  lastCalculatedDebtsAt: t.timestamp({ withTimezone: true }),
  ...timestamps,
});

// GroupMembers table
export const groupMembers = t.pgTable(
  "group_members",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    role: groupRoleEnum().default("MEMBER").notNull(),
    isDeleted: t.boolean().default(false).notNull(),
    groupId: t
      .uuid()
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: t
      .varchar({ length: 255 })
      .references(() => users.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    t.index().on(table.groupId),
    t.uniqueIndex("group_id_email_unique").on(table.groupId, table.email),
  ]
);

// Expenses table
export const expenses = t.pgTable(
  "expenses",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    amount: t.bigint({ mode: "bigint" }).notNull(),
    createdById: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    lastModifiedById: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    groupId: t
      .uuid()
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.index().on(table.groupId)]
);

// Expense Payments table
export const expensePayments = t.pgTable(
  "expense_payments",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    amount: t.bigint({ mode: "bigint" }).notNull(),
    expenseId: t
      .uuid()
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    groupMemberId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    t.index().on(table.expenseId),
    t
      .unique("payment_expense_id_group_member_id_unique")
      .on(table.expenseId, table.groupMemberId),
  ]
);

// Expense Splits table
export const expenseSplits = t.pgTable(
  "expense_splits",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    amount: t.bigint({ mode: "bigint" }).notNull(),
    expenseId: t
      .uuid()
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    groupMemberId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    t.index().on(table.expenseId),
    t
      .unique("split_expense_id_group_member_id_unique")
      .on(table.expenseId, table.groupMemberId),
  ]
);

// Settlements table
export const settlements = t.pgTable(
  "settlements",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    amount: t.bigint({ mode: "bigint" }).notNull(),
    groupId: t
      .uuid()
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    createdById: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    lastModifiedById: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    fromId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    toId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    t.index().on(table.groupId),
    t.index().on(table.fromId),
    t.index().on(table.toId),
  ]
);

// Simplified Debts table
export const simplifiedDebts = t.pgTable(
  "simplified_debts",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    amount: t.bigint({ mode: "bigint" }).notNull(),
    groupId: t
      .uuid()
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    fromId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    toId: t
      .uuid()
      .notNull()
      .references(() => groupMembers.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [t.index().on(table.groupId)]
);

// Logs table
export const logs = t.pgTable(
  "logs",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    type: logTypeEnum().notNull(),
    message: t.text().notNull(),
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    groupId: t.uuid().references(() => groups.id, { onDelete: "cascade" }),
    expenseId: t.uuid().references(() => expenses.id),
    settlementId: t.uuid().references(() => settlements.id),
    friendRequestId: t.uuid().references(() => friendRequests.id),
    ...timestamps,
  },
  (table) => [
    t.check(
      "log_type_id_constraint",
      sql`
      (
        (type = 'USER' AND user_id IS NOT NULL)
        OR (type = 'GROUP' AND group_id IS NOT NULL)
        OR (type = 'EXPENSE' AND expense_id IS NOT NULL)
        OR (type = 'SETTLEMENT' AND settlement_id IS NOT NULL)
        OR (type = 'FRIEND_REQUEST' AND friend_request_id IS NOT NULL)
        OR (
          type NOT IN ('USER', 'GROUP', 'EXPENSE', 'SETTLEMENT', 'FRIEND_REQUEST')
        )
      )
    `
    ),
  ]
);

// Contact Form table
export const contactForms = t.pgTable("contact_forms", {
  id: t.serial().primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).notNull(),
  message: t.text().notNull(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

/**
 *
 * Infer Insert Types
 *
 */
export type UsersTableInsert = typeof users.$inferInsert;
export type ConfirmEmailTokensTableInsert =
  typeof confirmEmailTokens.$inferInsert;
export type PasswordResetTokensTableInsert =
  typeof passwordResetTokens.$inferInsert;
export type AccountVerificationsTableInsert =
  typeof accountVerifications.$inferInsert;
export type FriendsTableInsert = typeof friends.$inferInsert;
export type TempFriendsTableInsert = typeof tempFriends.$inferInsert;
export type InvitationsTableInsert = typeof invitations.$inferInsert;
export type FriendRequestsTableInsert = typeof friendRequests.$inferInsert;
export type GroupsTableInsert = typeof groups.$inferInsert;
export type GroupMembersTableInsert = typeof groupMembers.$inferInsert;
export type ExpensesTableInsert = typeof expenses.$inferInsert;
export type ExpensePaymentsTableInsert = typeof expensePayments.$inferInsert;
export type ExpenseSplitsTableInsert = typeof expenseSplits.$inferInsert;
export type SettlementsTableInsert = typeof settlements.$inferInsert;
export type SimplifiedDebtsTableInsert = typeof simplifiedDebts.$inferInsert;
export type LogsTableInsert = typeof logs.$inferInsert;
export type ContactFormsTableInsert = typeof contactForms.$inferInsert;
