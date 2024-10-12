import { pgTable, text, boolean, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
// Define the status enum
export const statusEnum = pgEnum("task_status", ["pending", "done"]);

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  name: text("text").notNull(),
  is_completed: boolean("is_completed").default(false).notNull(),
  status: statusEnum("status").default("pending").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// Infer the model types
export type Task = InferSelectModel<typeof tasks>;
