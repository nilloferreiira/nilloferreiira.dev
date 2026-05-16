ALTER TABLE "projects" ADD COLUMN "category" text DEFAULT 'personal' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "tags" text[] DEFAULT '{}' NOT NULL;