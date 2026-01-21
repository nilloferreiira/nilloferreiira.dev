import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sessions as sessionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
	const session = request.cookies.get("session")
	const res = NextResponse.json({ ok: true, message: "Signed out successfully" })
	if (session) {
		// mark session invalid in DB
		try {
			await db.update(sessionsTable).set({ valid: false }).where(eq(sessionsTable.id, session.value))
		} catch (e) {
			// ignore DB errors on sign-out
		}

		res.cookies.delete("session")
	}
	return res
}
