ALTER TABLE "experience_stacks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "project_stacks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stacks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Public read access to experience_stacks" ON "experience_stacks" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Public read access to project_stacks" ON "project_stacks" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Public read access to site_settings" ON "site_settings" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Public read access to stacks" ON "stacks" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);