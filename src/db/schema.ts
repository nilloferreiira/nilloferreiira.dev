import { pgTable, text, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core"

export const projects = pgTable("projects", {
	id: serial("id").primaryKey(),
	title: varchar("title").notNull(),
	description_en: text("description_en").notNull(),
	description_pt: text("description_pt").notNull(),
	imgSrc: varchar("img_src").notNull(),
	url: varchar("url").notNull(),
	position: serial("position").notNull(),
	category: text("category").notNull().default("personal"),
	tags: text("tags").array().notNull().default([]),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at")
})

export const experiences = pgTable("experiences", {
	id: serial("id").primaryKey(),
	title_en: varchar("title_en").notNull(),
	title_pt: varchar("title_pt").notNull(),
	description_en: text("description_en").notNull(),
	description_pt: text("description_pt").notNull(),
	position: serial("position").notNull(),
	company: varchar("company").default("").notNull(),
	start_year: integer("start_year"),
	end_year: integer("end_year"),
	location: varchar("location").default("").notNull(),
	responsibilities_en: text("responsibilities_en").array().notNull().default([]),
	responsibilities_pt: text("responsibilities_pt").array().notNull().default([]),
	stack: text("stack").array().notNull().default([]),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at")
})
