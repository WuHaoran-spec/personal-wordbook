import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const wordbooks = sqliteTable("wordbooks", {
  ownerId: text("owner_id").primaryKey(),
  data: text("data").notNull(),
  version: integer("version").notNull().default(0),
  updatedAt: integer("updated_at").notNull(),
});
export const lookupUsage = sqliteTable("lookup_usage", {
  ownerId: text("owner_id").primaryKey(),
  minute: integer("minute").notNull(),
  calls: integer("calls").notNull(),
  day: integer("day").notNull(),
  dayCalls: integer("day_calls").notNull(),
});
