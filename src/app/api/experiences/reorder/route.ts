export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { experiences as experiencesSchema } from "@/db/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { EXPERIENCES_CACHE_TAG } from "@/lib/cache-tags"

export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json()
		const orderedIds: number[] = body?.orderedIds
		if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
			return NextResponse.json({ ok: false, error: "orderedIds ausente" }, { status: 400 })
		}

		await db.transaction(async (tx) => {
			for (let i = 0; i < orderedIds.length; i++) {
				await tx.update(experiencesSchema).set({ position: i + 1 }).where(eq(experiencesSchema.id, orderedIds[i]))
			}
		})

		revalidateTag(EXPERIENCES_CACHE_TAG)
		return NextResponse.json({ ok: true })
	} catch (err) {
		console.error("PATCH /api/experiences/reorder error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao reordenar experiências" }, { status: 500 })
	}
}
