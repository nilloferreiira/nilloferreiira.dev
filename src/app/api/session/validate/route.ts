import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sessions } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
	try {
		const cookie = request.cookies.get("session")
		if (!cookie) return NextResponse.json({ ok: false }, { status: 401 })

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.id, cookie.value)
		})

		if (!session) return NextResponse.json({ ok: false }, { status: 401 })

		// Check validity and expiry
		if (!session.valid) return NextResponse.json({ ok: false }, { status: 401 })
		if (session.expiresAt && new Date(session.expiresAt) < new Date())
			return NextResponse.json({ ok: false }, { status: 401 })

		return NextResponse.json({ ok: true, userId: session.userId })
	} catch (err) {
		console.error("/api/session/validate error:", err)
		return NextResponse.json({ ok: false }, { status: 500 })
	}
}
