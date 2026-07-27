import { NextRequest, NextResponse } from "next/server"
import { getSupabaseUser } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const isAdminPath = pathname.startsWith("/admin")
	const isLoginPath = pathname === "/admin/login"
	const isApiPath = pathname.startsWith("/api/projects") || pathname.startsWith("/api/experiences")

	// admin pages: every method needs a session (except the login page itself)
	// api routes: public GET reads stay open, everything else needs a session
	const requiresAuth = (isAdminPath && !isLoginPath) || (isApiPath && request.method !== "GET")

	if (!requiresAuth) {
		return NextResponse.next()
	}

	const response = NextResponse.next()
	const user = await getSupabaseUser(request, response)

	if (user) {
		return response
	}

	if (isApiPath) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const redirectUrl = request.nextUrl.clone()
	redirectUrl.pathname = "/"
	return NextResponse.redirect(redirectUrl)
}

export const config = {
	matcher: ["/admin/:path*", "/api/projects/:path*", "/api/experiences/:path*"]
}
