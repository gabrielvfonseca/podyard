import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const createdAt = () =>
  timestamp("createdAt", { withTimezone: true }).notNull().defaultNow();

const updatedAt = () =>
  timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const user = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  password: text("password"),
  role: text("role").notNull().default("USER"),
  stripeCustomerId: text("stripeCustomerId").unique(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable("Session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const account = pgTable("Account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const verification = pgTable("Verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  // Better Auth only writes this once a user exists; verification rows are
  // created before login, so it must be nullable (schema is enforced by
  // Better Auth's runtime migration check, not by a NOT NULL constraint).
  userId: text("userId").references(() => user.id, {
    onDelete: "cascade",
  }),
});

export const page = pgTable("Page", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  page,
};
