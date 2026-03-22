import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
});

export type Setting = typeof settingsTable.$inferSelect;
