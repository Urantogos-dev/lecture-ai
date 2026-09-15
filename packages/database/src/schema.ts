import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lectures = pgTable("lectures", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioKey: varchar("audio_key", { length: 500 }),
  audioUrl: text("audio_url"),
  status: varchar("status", { length: 50 }).notNull().default("UPLOADING"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  lectureId: integer("lecture_id")
    .notNull()
    .references(() => lectures.id),
  rawContent: text("raw_content").notNull(),
  cleanContent: text("clean_content"),
  language: varchar("language", { length: 10 }).notNull().default("mn"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
