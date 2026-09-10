export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { unstable_cache, revalidateTag } from "next/cache"
import { projects as projectsSchema } from "@/db/schema"
import { db } from "@/lib/db"
import { isNull, eq, asc } from "drizzle-orm"
import { PROJECTS_CACHE_TAG } from "@/lib/cache-tags"

const getCachedProjects = unstable_cache(
	async () =>
		db
			.select()
			.from(projectsSchema)
			.where(isNull(projectsSchema.deletedAt))
			.orderBy(asc(projectsSchema.position)),
	["projects"],
	{ tags: [PROJECTS_CACHE_TAG], revalidate: false }
)

export async function GET() {
	try {
		const projects = await getCachedProjects()
		return NextResponse.json({ ok: true, data: projects })
	} catch (err) {
		console.error("GET /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar projetos" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const created = await db
			.insert(projectsSchema)
			.values({
				title: body.title,
				description_en: body.description_en,
				description_pt: body.description_pt,
				imgSrc: body.imgSrc,
				url: body.url,
				category: body.category ?? "personal",
				tags: body.tags ?? []
			})
			.returning()

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: created })
	} catch (err) {
		console.error("POST /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao criar projeto" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		if (!body?.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const updated = await db
			.update(projectsSchema)
			.set({
				title: body.title,
				description_en: body.description_en,
				description_pt: body.description_pt,
				imgSrc: body.imgSrc,
				url: body.url,
				category: body.category ?? "personal",
				tags: body.tags ?? []
			})
			.where(eq(projectsSchema.id, body.id))
			.returning()

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: updated })
	} catch (err) {
		console.error("PUT /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao atualizar projeto" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const id = body?.id
		if (!id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const deleted = await db.update(projectsSchema).set({ deletedAt: new Date() }).where(eq(projectsSchema.id, id))

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: deleted })
	} catch (err) {
		console.error("DELETE /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao deletar projeto" }, { status: 500 })
	}
}
