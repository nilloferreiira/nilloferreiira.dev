import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { clientEnv } from "@/lib/env.client"

export async function getSupabaseUser(request: NextRequest, response: NextResponse) {
	const supabase = createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
				cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
			}
		}
	})

	const {
		data: { user }
	} = await supabase.auth.getUser()

	return user
}
