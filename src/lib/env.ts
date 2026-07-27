import { z } from "zod"

// SUPABASE_SERVICE_ROLE_KEY is intentionally not here: it's only read by the
// one-off migration script (scripts/migrate-admin-user.ts), never at request time.
const EnvSchema = z.object({
	DATABASE_URL: z.url(),
	NEXT_PUBLIC_SUPABASE_URL: z.url(),
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1)
})

export const env = EnvSchema.parse(process.env)
