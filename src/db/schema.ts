import { pgTable, text, varchar, timestamp, serial, integer, unique } from "drizzle-orm/pg-core"

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

export const stacks = pgTable(
	"stacks",
	{
		id: serial("id").primaryKey(),
		name: varchar("name").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("stacks_name_unique").on(table.name)]
)

export const projectStacks = pgTable(
	"project_stacks",
	{
		id: serial("id").primaryKey(),
		projectId: integer("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		stackId: integer("stack_id")
			.notNull()
			.references(() => stacks.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("project_stacks_project_id_stack_id_unique").on(table.projectId, table.stackId)]
)

export const experienceStacks = pgTable(
	"experience_stacks",
	{
		id: serial("id").primaryKey(),
		experienceId: integer("experience_id")
			.notNull()
			.references(() => experiences.id, { onDelete: "cascade" }),
		stackId: integer("stack_id")
			.notNull()
			.references(() => stacks.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("experience_stacks_experience_id_stack_id_unique").on(table.experienceId, table.stackId)]
)
