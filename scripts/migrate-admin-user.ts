/**
 * One-off script: creates the admin account in Supabase Auth (auth.users),
 * replacing the old bcrypt row in the (now dropped) `users` table.
 *
 * Not part of the app runtime — run locally, once, with the service-role key.
 * Reuses NEXT_PUBLIC_SUPABASE_URL from .env; only the service-role key needs
 * to be passed in separately (never add it to .env / src/lib/env.ts):
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *     pnpm tsx scripts/migrate-admin-user.ts admin@example.com "temp-password"
 *
 * The temp password should be rotated (or reset via Supabase's invite/reset-link
 * flow) after first login. Never commit SUPABASE_SERVICE_ROLE_KEY anywhere.
 */
import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

async function main() {
	const [email, password] = process.argv.slice(2)

	if (!email || !password) {
		console.error('Usage: pnpm tsx scripts/migrate-admin-user.ts <email> "<temp-password>"')
		process.exit(1)
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!supabaseUrl || !serviceRoleKey) {
		console.error("Missing NEXT_PUBLIC_SUPABASE_URL (in .env) or SUPABASE_SERVICE_ROLE_KEY in the environment.")
		process.exit(1)
	}

	const supabase = createClient(supabaseUrl, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false }
	})

	const { data, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true
	})

	if (error) {
		console.error("Failed to create admin user:", error.message)
		process.exit(1)
	}

	console.log(`Admin user created: ${data.user.id} (${data.user.email})`)
}

main()
