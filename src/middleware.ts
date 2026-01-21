import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
	const session = request.cookies.get("session")

	const isAdminPath = request.nextUrl.pathname.startsWith("/admin")
	const isLoginPath = request.nextUrl.pathname === "/admin/login"

	// if admin path and not the login page, require a valid session
	if (isAdminPath && !isLoginPath) {
		if (!session) {
			const redirectUrl = request.nextUrl.clone()
			redirectUrl.pathname = "/"
			return NextResponse.redirect(redirectUrl)
		}

		// validate session by calling internal API route (this allows DB checks
		// while keeping middleware running in the Edge runtime)
		try {
			const validateUrl = new URL("/api/session/validate", request.url)
			const resp = await fetch(validateUrl.toString(), {
				method: "GET",
				headers: {
					// forward cookie automatically; but ensure the cookie header exists
					cookie: request.headers.get("cookie") || ""
				}
			})

			if (!resp.ok) {
				// invalid session -> delete cookie and redirect
				const redirectUrl = request.nextUrl.clone()
				redirectUrl.pathname = "/"
				const res = NextResponse.redirect(redirectUrl)
				res.cookies.delete("session")
				return res
			}
		} catch (err) {
			// on errors, be conservative and redirect
			const redirectUrl = request.nextUrl.clone()
			redirectUrl.pathname = "/"
			return NextResponse.redirect(redirectUrl)
		}
	}
}

export const config = {
	// matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"]
	matcher: ["/admin/:path*"]
}
