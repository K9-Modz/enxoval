import { sql } from "drizzle-orm";
import { pgTable, text, varchar, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const items = pgTable("items", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  room: text("room").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("available"),
  guestName: text("guest_name"),
  guestMessage: text("guest_message"),
  reservedAt: bigint("reserved_at", { mode: "number" }),
});

export const insertItemSchema = createInsertSchema(items).pick({
  room: true,
  name: true,
  status: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
