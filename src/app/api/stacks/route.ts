export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { stacks as stacksSchema } from "@/db/schema"
import { db } from "@/lib/db"
import { asc } from "drizzle-orm"

export async function GET() {
	try {
		const rows = await db.select().from(stacksSchema).orderBy(asc(stacksSchema.name))
		return NextResponse.json({ ok: true, data: rows })
	} catch (err) {
		console.error("GET /api/stacks error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar stacks" }, { status: 500 })
	}
}
