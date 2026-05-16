ALTER TABLE "experiences" ADD COLUMN "company" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "start_year" integer;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "end_year" integer;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "location" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "responsibilities_en" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "responsibilities_pt" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "stack" text[] DEFAULT '{}' NOT NULL;