import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { clientEnv } from "@/lib/env.client"

export async function createClient() {
	const cookieStore = await cookies()

	return createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
			}
		}
	})
}
