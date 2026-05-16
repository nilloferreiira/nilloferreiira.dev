export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { experiences as experiencesSchema } from "@/db/schema"
import { db } from "@/lib/db"
import { asc, isNull, eq } from "drizzle-orm"

export async function GET() {
	try {
		const experiences = await db
			.select()
			.from(experiencesSchema)
			.where(isNull(experiencesSchema.deletedAt))
			.orderBy(asc(experiencesSchema.position))

		return NextResponse.json({ ok: true, data: experiences })
	} catch (err) {
		console.error("GET /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar experiências" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const created = await db
			.insert(experiencesSchema)
			.values({
				title_pt: body.title_pt,
				title_en: body.title_en,
				description_en: body.description_en,
				description_pt: body.description_pt,
				company: body.company ?? "",
				start_year: body.start_year ?? null,
				end_year: body.end_year ?? null,
				location: body.location ?? "",
				responsibilities_en: body.responsibilities_en ?? [],
				responsibilities_pt: body.responsibilities_pt ?? [],
				stack: body.stack ?? []
			})
			.returning()

		return NextResponse.json({ ok: true, data: created })
	} catch (err) {
		console.error("POST /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao criar experiência" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		if (!body?.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const updated = await db
			.update(experiencesSchema)
			.set({
				title_pt: body.title_pt,
				title_en: body.title_en,
				description_en: body.description_en,
				description_pt: body.description_pt,
				company: body.company ?? "",
				start_year: body.start_year ?? null,
				end_year: body.end_year ?? null,
				location: body.location ?? "",
				responsibilities_en: body.responsibilities_en ?? [],
				responsibilities_pt: body.responsibilities_pt ?? [],
				stack: body.stack ?? []
			})
			.where(eq(experiencesSchema.id, body.id))
			.returning()

		return NextResponse.json({ ok: true, data: updated })
	} catch (err) {
		console.error("PUT /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao atualizar experiência" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const id = body?.id
		if (!id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const deleted = await db
			.update(experiencesSchema)
			.set({ deletedAt: new Date() })
			.where(eq(experiencesSchema.id, id))

		return NextResponse.json({ ok: true, data: deleted })
	} catch (err) {
		console.error("DELETE /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao deletar experiência" }, { status: 500 })
	}
}
