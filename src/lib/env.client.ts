import { z } from "zod"

const ClientEnvSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.url(),
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1)
})

// Safe to import from Client Components and server code alike — validates only
// NEXT_PUBLIC_* vars (the Supabase server clients use it too).
// Keep this file free of any server-only env access (DATABASE_URL, service
// role keys, etc.) — that's what src/lib/env.ts is for. Mixing them into one
// file would make importing this from client code crash the browser bundle,
// since importing any export re-runs the whole module's top-level code.
export const clientEnv = ClientEnvSchema.parse({
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
})
