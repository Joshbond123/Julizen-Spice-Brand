import { pgTable, text, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull().default(1500),
  description: text("description").notNull(),
  image: text("image").notNull().default("/images/product-chicken.png"),
  status: varchar("status", { length: 20 }).notNull().default("available"),
});

export const insertProductSchema = createInsertSchema(productsTable);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
